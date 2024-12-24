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
  const [processingStage, setProcessingStage] = useState<string>("");
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

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      // Process images through the pipeline with stage updates
      setProcessingStage("Converting to JPG...");
      const result = await processImage(uploadedImage, (stage: string) => {
        setProcessingStage(stage);
      });
      
      // Add processed images to ZIP with specific names
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
      });

      setProcessingStage("Creating ZIP file...");
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
      setIsProcessing(false);
      toast({
        title: "Success!",
        description: "All images have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      setProcessingStage("");
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-4">
      <div className="flex justify-center gap-4">
        <Button
          onClick={onUploadClick}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        <Button
          onClick={handleProcessImage}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Play className="mr-2 h-5 w-5" />
          Go
        </Button>
      </div>
      {processingStage && (
        <p className="text-green-500 font-medium mt-2">{processingStage}</p>
      )}
    </div>
  );
};