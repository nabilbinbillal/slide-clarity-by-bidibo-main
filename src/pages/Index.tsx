import { useState } from "react";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { ProcessingSection } from "@/components/ProcessingSection";
import { PreviewSection } from "@/components/PreviewSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export type ProcessingState = "idle" | "uploading" | "processing" | "preview" | "error";

interface IndexProps {
  onThemeToggle?: () => void;
  currentTheme?: "light" | "dark";
}

const Index = ({ onThemeToggle, currentTheme = "light" }: IndexProps) => {
  const [state, setState] = useState<ProcessingState>("idle");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [slidesPerPage, setSlidesPerPage] = useState(5);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>("output.pdf");

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    setState("uploading");
    setError(null);
  };

  const handleProcess = async () => {
    if (!pdfFile) return;
    
    setState("processing");
    setError(null);
    
    // Processing will be implemented in the ProcessingSection component
  };

  const handleReset = () => {
    setState("idle");
    setPdfFile(null);
    setProcessedPdfUrl(null);
    setPreviewImages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          {onThemeToggle && (
            <Button
              variant="outline"
              size="icon"
              onClick={onThemeToggle}
              className="rounded-full"
              title={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
            >
              {currentTheme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </Button>
          )}
        </div>
        
        <Hero />
        
        {state === "idle" && (
          <UploadSection onFileUpload={handleFileUpload} />
        )}

        {(state === "uploading" || state === "processing") && (
          <ProcessingSection
            file={pdfFile}
            slidesPerPage={slidesPerPage}
            onSlidesPerPageChange={setSlidesPerPage}
            onProcess={handleProcess}
            onComplete={(pdfUrl, previews, filename) => {
              setProcessedPdfUrl(pdfUrl);
              setPreviewImages(previews);
              setDownloadFilename(filename);
              setState("preview");
            }}
            onError={(err) => {
              setError(err);
              setState("error");
            }}
            state={state}
          />
        )}

        {state === "preview" && processedPdfUrl && (
          <PreviewSection
            pdfUrl={processedPdfUrl}
            previewImages={previewImages}
            filename={downloadFilename}
            onReset={handleReset}
          />
        )}

        {state === "error" && error && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-destructive/10 border border-destructive rounded-lg animate-fade-in">
            <h3 className="text-lg font-semibold text-destructive mb-2">Processing Error</h3>
            <p className="text-destructive/80">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Index;
