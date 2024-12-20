import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export const WatermarkComponent = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { toast } = useToast();

  const applyWatermark = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Load the main image
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the main image
      ctx?.drawImage(img, 0, 0);
      
      // Add the text watermark
      if (ctx) {
        ctx.font = "180px Arial"; // Keep text size as is
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // White with 40% opacity
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Add shadow effect
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Draw the text in the center
        ctx.fillText(
          "Ultra High Resolution",
          canvas.width / 2,
          canvas.height / 2
        );
        
        // Reset shadow for logo watermark
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Load and draw the logo watermark
        const logoImg = new Image();
        logoImg.onload = () => {
          // Calculate logo size (reduced to 10% of the image width)
          const logoWidth = canvas.width * 0.1;
          const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
          
          // Draw logo in top-left corner with minimal padding
          ctx.globalAlpha = 0.4; // 40% opacity
          ctx.drawImage(logoImg, 10, 10, logoWidth, logoHeight);
          ctx.globalAlpha = 1.0; // Reset opacity
          
          // Convert to data URL and trigger download
          const watermarkedImage = canvas.toDataURL("image/jpeg", 0.9);
          const link = document.createElement("a");
          link.download = "watermarked-image.jpg";
          link.href = watermarkedImage;
          link.click();
          
          toast({
            title: "Success!",
            description: "Image has been watermarked and downloaded.",
          });
        };
        logoImg.src = "/lovable-uploads/6a3b93f0-d58c-4c78-8496-4639c21555d2.png";
      }
    };
    img.src = uploadedImage;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Watermark Your Image</h1>
        <p className="text-gray-600 mb-8">
          Upload an image to add both text and logo watermarks
        </p>
      </div>
      
      <ImageUpload
        value={uploadedImage}
        onChange={setUploadedImage}
        label="Upload Image to Watermark"
      />
      
      {uploadedImage && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={applyWatermark}
            className="w-40 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          >
            <Upload className="mr-2 h-5 w-5" />
            Process
          </Button>
        </div>
      )}
    </div>
  );
};