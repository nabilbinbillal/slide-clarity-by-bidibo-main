import { Button } from "@/components/ui/button";

interface PreviewSectionProps {
  pdfUrl: string;
  previewImages: string[];
  filename: string;
  onReset: () => void;
}

export const PreviewSection = ({ pdfUrl, previewImages, filename, onReset }: PreviewSectionProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold">Preview</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
              Process Another
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-primary w-full sm:w-auto">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">Preview Note</p>
              <p>This preview shows 3 pages. All pages will be included in your downloaded PDF.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-2">
          {previewImages.map((imgUrl, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden hover:shadow-medium transition-shadow"
            >
              <img
                src={imgUrl}
                alt={`Preview page ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
