import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlideshowCreatorProps {
  onClose: () => void;
}

export const SlideshowCreator = ({ onClose }: SlideshowCreatorProps) => {
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const { toast } = useToast();

  const handleImageUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...images];
          newImages[index] = e.target?.result as string;
          setImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCreateSlideshow = async () => {
    if (images.some(img => !img)) {
      toast({
        title: "Missing Images",
        description: "Please upload all 5 images before creating the slideshow",
        variant: "destructive",
      });
      return;
    }

    // Here we'll implement the slideshow creation logic in a future update
    toast({
      title: "Creating Slideshow",
      description: "Your slideshow is being created...",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Create Slideshow</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]"
            >
              {image ? (
                <div className="relative w-full h-[200px]">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    onClick={() => handleImageUpload(index)}
                    className="absolute bottom-2 right-2"
                    variant="secondary"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleImageUpload(index)}
                  className="w-full h-full flex flex-col gap-2"
                  variant="outline"
                >
                  <Upload className="h-6 w-6" />
                  Upload Image {index + 1}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSlideshow}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="mr-2 h-4 w-4" />
            Create Slideshow
          </Button>
        </div>
      </div>
    </div>
  );
};