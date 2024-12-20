import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ImageResizer = () => {
  const [image, setImage] = useState("");
  const { toast } = useToast();

  const handleResizeAndDownload = () => {
    if (!image) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas size to 4K UHD (3840x2160)
      canvas.width = 3840;
      canvas.height = 2160;
      
      // Draw and resize the image
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "resized-image-4k.jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Success!",
            description: "Image resized to 4K (3840x2160) and downloaded successfully",
          });
        }
      }, "image/jpeg", 0.9);
    };

    img.src = image;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">4K Image Resizer</h1>
      <ImageUpload
        value={image}
        onChange={setImage}
        label="Upload Image"
      />
      {image && (
        <div className="flex justify-center">
          <Button
            onClick={handleResizeAndDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Resize & Download 4K
          </Button>
        </div>
      )}
    </div>
  );
};