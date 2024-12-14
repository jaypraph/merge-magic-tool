import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const ImageUpload = ({ value, onChange, label }: ImageUploadProps) => {
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
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{label}</h2>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500/50"
        )}
      >
        <input {...getInputProps()} />
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