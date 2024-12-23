import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();

  const handleProcessImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      const zip = new JSZip();
      
      // Process images and create video
      const result = await processImage(uploadedImage);
      
      // Add processed images to ZIP with new names
      if (result.images.length > 0) {
        zip.file("mtrx-1.jpg", result.images[0].split('base64,')[1], {base64: true});
      }
      
      // Add video if available
      if (result.video) {
        zip.file("slideshow.mp4", result.video);
      }

      // Generate and download the ZIP file
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "All images and video have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center mt-4 gap-4">
      <Button
        onClick={onUploadClick}
        className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
      >
        <Upload className="mr-2 h-5 w-5" />
        Upload
      </Button>
      <Button
        onClick={handleProcessImage}
        className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
      >
        <Play className="mr-2 h-5 w-5" />
        Go
      </Button>
    </div>
  );
};