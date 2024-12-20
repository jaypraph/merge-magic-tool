import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { RectangleTool } from "./RectangleTool";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  showRectangleTool?: boolean;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  label,
  showRectangleTool = false 
}: ImageUploadProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    noClick: showRectangleTool,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showRectangleTool) {
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showRectangleTool) {
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (showRectangleTool) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{label}</h2>
      <div
        {...getRootProps()}
        ref={containerRef}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500/50",
          showRectangleTool ? "cursor-crosshair" : "cursor-pointer"
        )}
        onMouseDown={showRectangleTool ? handleMouseDown : undefined}
        onMouseMove={showRectangleTool ? handleMouseMove : undefined}
        onMouseUp={showRectangleTool ? handleMouseUp : undefined}
      >
        <input {...getInputProps()} />
        {showRectangleTool && <RectangleTool containerRef={containerRef} />}
        {value ? (
          <img
            src={value}
            alt="Uploaded"
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400">
            <Upload className="h-10 w-10 mb-4" />
            <p className="text-center">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};