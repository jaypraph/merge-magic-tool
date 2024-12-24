import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { useState } from "react";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      const zip = new JSZip();
      
      // Process images through the pipeline
      const result = await processImage(uploadedImage);
      
      // Add processed images to ZIP with specific names
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
      });

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
        description: "All images have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-4">
        <Button
          onClick={onUploadClick}
          className="w-12 h-12 rounded-full bg-[#ea384c] hover:bg-[#ea384c]/90 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
        />
        <Button
          onClick={handleProcessImage}
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
        />
      </div>
      {isProcessing && (
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      )}
    </div>
  );
};