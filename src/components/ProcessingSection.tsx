import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { processPDF } from "@/utils/pdfProcessor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProcessingState } from "@/pages/Index";

interface ProcessingSectionProps {
  file: File | null;
  slidesPerPage: number;
  onSlidesPerPageChange: (value: number) => void;
  onProcess: () => void;
  onComplete: (pdfUrl: string, previews: string[], filename: string) => void;
  onError: (error: string) => void;
  state: ProcessingState;
}

export const ProcessingSection = ({
  file,
  slidesPerPage,
  onSlidesPerPageChange,
  onProcess,
  onComplete,
  onError,
  state,
}: ProcessingSectionProps) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparing...");
  const [pagesToRemove, setPageToRemove] = useState<string>("");
  const [parsedPages, setParsedPages] = useState<number[]>([]);

  // Parse comma or space separated page numbers
  const handlePageRemovalChange = (value: string) => {
    setPageToRemove(value);
    // Parse pages separated by comma or space
    const pages = value
      .split(/[,\s]+/)
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p));
    setParsedPages([...new Set(pages)]); // Remove duplicates
  };

  const startProcessing = async () => {
    if (!file) return;

    onProcess();
    setProgress(10);
    setStatusMessage("Reading PDF...");

    try {
      const result = await processPDF(
        file,
        slidesPerPage,
        (progress, message) => {
          setProgress(progress);
          setStatusMessage(message);
        },
        parsedPages
      );

      setProgress(100);
      setStatusMessage("Complete!");
      
      setTimeout(() => {
        onComplete(result.pdfUrl, result.previewImages, result.filename);
      }, 500);
    } catch (error) {
      console.error("Processing error:", error);
      onError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Processing Settings</h3>
          
          {/* File Display */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
            <svg
              className="w-8 h-8 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground font-medium">Selected File</p>
              <p className="text-sm font-semibold truncate text-foreground">{file?.name}</p>
            </div>
          </div>
          
          {state !== "processing" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Slides per page
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Button
                      key={num}
                      variant={slidesPerPage === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSlidesPerPageChange(num)}
                      className="min-w-10"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Pages to remove (optional)
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter page numbers separated by comma or space (e.g., 1,2,3 or 1 2 3)
                </p>
                <Input
                  placeholder="e.g., 1, 2, 3"
                  value={pagesToRemove}
                  onChange={(e) => handlePageRemovalChange(e.target.value)}
                  className="mb-2"
                />
                {parsedPages.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">Pages to remove:</span> {parsedPages.join(", ")}
                  </div>
                )}
              </div>

              <Button
                onClick={startProcessing}
                className="w-full bg-gradient-primary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Processing
              </Button>
            </>
          )}
        </div>

        {state === "processing" && (
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{statusMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
