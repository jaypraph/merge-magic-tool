import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { Progress } from "@/components/ui/progress";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [processingStage, setProcessingStage] = useState<string>("");
  const [progress, setProgress] = useState(0);

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
      setProgress(0);
      
      // Process images through the pipeline
      const result = await processImage(uploadedImage, setProcessingStage, setProgress);
      
      // Add processed images to ZIP with specific names
      result.images.forEach((item, index) => {
        if (index === result.images.length - 1) {
          // Last item is the video
          zip.file("0307.mp4", item.split('base64,')[1], {base64: true});
        } else {
          const fileName = index === 0 ? "mtrx-1.jpg" : 
                          index === 1 ? "wm-1.jpg" :
                          index === 2 ? "oreomock5.jpg" :
                          `mockup${index-2}.jpg`;
          zip.file(fileName, item.split('base64,')[1], {base64: true});
        }
      });

      setProcessingStage("Creating ZIP file...");
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

      setProcessingStage("");
      setProgress(0);
      toast({
        title: "Success!",
        description: "All images and video have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      console.error("Processing error:", error);
      setProcessingStage("");
      setProgress(0);
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-4">
      <div className="flex justify-center gap-4">
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
      {processingStage && (
        <div className="w-full max-w-md space-y-2">
          <div className="text-green-600 font-medium text-center">
            {processingStage}
            {processingStage === "Creating video slideshow..." && progress > 0 && (
              <span> ({Math.round(progress)}%)</span>
            )}
          </div>
          {processingStage === "Creating video slideshow..." && (
            <Progress value={progress} className="w-full" />
          )}
        </div>
      )}
    </div>
  );
};