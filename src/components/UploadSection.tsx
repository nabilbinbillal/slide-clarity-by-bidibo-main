import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
}

export const UploadSection = ({ onFileUpload }: UploadSectionProps) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        
        if (file.type === "application/pdf") {
          onFileUpload(file);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a PDF file",
            variant: "destructive",
          });
        }
      }
    },
    [onFileUpload, toast]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <label className="block cursor-pointer">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer group ${
            isDragActive
              ? "border-primary bg-primary/10 scale-105"
              : "border-border hover:border-primary hover:bg-primary/5"
          }`}
        >
          <div className="mb-6">
            <svg
              className={`w-16 h-16 mx-auto transition-colors ${
                isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
          <p className="text-muted-foreground mb-6">or click to browse</p>
          
          <span className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer inline-block font-semibold">
            Choose File
          </span>
        </div>
      </label>
    </div>
  );
};
