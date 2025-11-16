import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

// Configure PDF.js worker using the imported URL
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface ProcessingResult {
  pdfUrl: string;
  previewImages: string[];
  filename: string;
}

type ProgressCallback = (progress: number, message: string) => void;

/**
 * Convert slides to white background with black text (print-optimized)
 * Inverts dark backgrounds to white and preserves dark text as black
 */
const enhanceImageContrast = (
  imageData: ImageData,
  canvas: HTMLCanvasElement
): string => {
  const data = imageData.data;
  const threshold = 140;
  const contrastFactor = 2.8;

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale using luminance formula
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

    // Apply strong contrast enhancement
    let enhanced = ((gray - 128) * contrastFactor + 128);
    enhanced = Math.max(0, Math.min(255, enhanced));
    
    // Invert: dark becomes light, light becomes dark
    // This converts dark slide backgrounds to white
    enhanced = 255 - enhanced;
    
    // Apply threshold for crisp black and white
    if (enhanced < threshold) {
      enhanced = 0; // Pure black text
    } else {
      enhanced = 255; // Pure white background
    }

    // Apply to all channels
    data[i] = enhanced;     // R
    data[i + 1] = enhanced; // G
    data[i + 2] = enhanced; // B
    // Keep alpha channel as is (data[i + 3])
  }

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL("image/jpeg", 0.98);
};

/**
 * Process a single PDF page to enhanced B&W
 */
const processPage = async (
  page: pdfjsLib.PDFPageProxy,
  scale: number = 1.5
): Promise<string> => {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return enhanceImageContrast(imageData, canvas);
};

/**
 * Create N-up layout PDF - optimized for A4 printing with ZERO margins
 */
const createNUpPDF = async (
  slideImages: string[],
  slidesPerPage: number
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  
  // A4 dimensions in points (portrait) - 210mm x 297mm
  const pageWidth = 595.28;  // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const marginTop = 0;       // ZERO top/bottom margins
  const marginBottom = 0;
  const marginLeft = 3;      // 3px left margin
  const marginRight = 3;     // 3px right margin
  const spacingBetweenSlides = 0; // No spacing between slides

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let slidesOnCurrentPage = 0;

  const availableWidth = pageWidth - marginLeft - marginRight;
  const availableHeight = pageHeight - marginTop - marginBottom;
  
  // Calculate slide dimensions to fill entire page
  const slideHeight = availableHeight / slidesPerPage;
  
  let yOffset = pageHeight;

  for (let i = 0; i < slideImages.length; i++) {
    if (slidesOnCurrentPage >= slidesPerPage) {
      // Start new page
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      slidesOnCurrentPage = 0;
      yOffset = pageHeight;
    }

    try {
      const imageBytes = await fetch(slideImages[i]).then((res) => res.arrayBuffer());
      const image = await pdfDoc.embedJpg(imageBytes);
      
      const aspectRatio = image.width / image.height;
      
      // Use full available width and height
      const slideWidth = availableWidth;
      const actualHeight = slideWidth / aspectRatio;
      
      // Position with left margin
      const xOffset = marginLeft;
      const yPosition = yOffset - slideHeight;

      currentPage.drawImage(image, {
        x: xOffset,
        y: yPosition,
        width: slideWidth,
        height: slideHeight,
      });

      // Move down for next slide
      yOffset -= slideHeight;
      slidesOnCurrentPage++;
    } catch (error) {
      console.error(`Error embedding image ${i}:`, error);
    }
  }

  return await pdfDoc.save();
};

/**
 * Main PDF processing function
 */
export const processPDF = async (
  file: File,
  slidesPerPage: number,
  onProgress: ProgressCallback,
  pagesToRemove: number[] = []
): Promise<ProcessingResult> => {
  try {
    // Extract filename without extension
    const originalFilename = file.name.replace(/\.[^/.]+$/, "");
    
    onProgress(10, "Loading PDF...");

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    onProgress(20, `Processing ${numPages} slides...`);

    const processedSlides: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      // Skip pages marked for removal
      if (pagesToRemove.includes(i)) {
        continue;
      }

      const page = await pdf.getPage(i);
      const processedImage = await processPage(page);
      processedSlides.push(processedImage);

      const progress = 20 + ((i / numPages) * 50);
      onProgress(progress, `Processing slide ${i} of ${numPages}...`);
    }

    onProgress(75, "Creating N-up layout...");

    const pdfBytes = await createNUpPDF(processedSlides, slidesPerPage);

    onProgress(85, "Generating preview...");

    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);

    // Generate preview images (first 3 pages max for faster processing)
    const previewDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const previewCount = Math.min(3, previewDoc.numPages);
    const previewImages: string[] = [];

    for (let i = 1; i <= previewCount; i++) {
      const page = await previewDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1 }); // Lower scale for faster preview
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      previewImages.push(canvas.toDataURL("image/jpeg", 0.8));
    }

    onProgress(100, "Complete!");

    return {
      pdfUrl,
      previewImages,
      filename: `${originalFilename}_bidibo.pdf`,
    };
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to process PDF"
    );
  }
};
