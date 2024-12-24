import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadGridProps {
  images: string[];
  onImageUpload: (index: number) => void;
  isProcessing: boolean;
}

export const ImageUploadGrid = ({ 
  images, 
  onImageUpload, 
  isProcessing 
}: ImageUploadGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center h-[120px]"
        >
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <Button
                onClick={() => onImageUpload(index)}
                className="absolute bottom-1 right-1 h-6 text-xs"
                variant="secondary"
                disabled={isProcessing}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onImageUpload(index)}
              className="w-full h-full flex flex-col gap-2"
              variant="outline"
              disabled={isProcessing}
            >
              <Upload className="h-4 w-4" />
              <span className="text-xs">Image {index + 1}</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};