import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { triggerAllCelebrations } from "@/utils/celebrationManager";
import { 
  addTextFilesToZip, 
  addInstructionsImageToZip, 
  addProcessedImagesToZip 
} from "@/utils/zipUtils";

export const useImageProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [textFiles, setTextFiles] = useState<{
    keywords?: string;
    title?: string;
    description?: string;
  }>({});

  const handleTextFiles = (keywords: string[], title: string, description: string) => {
    const formattedKeywords = keywords.map(k => {
      const trimmed = k.trim();
      return trimmed.endsWith(',') ? trimmed : `${trimmed},`;
    }).join('\n');

    setTextFiles({
      keywords: formattedKeywords,
      title,
      description
    });
    toast({
      description: "Text files added to GO pipeline!",
    });
  };

  const processFiles = async (uploadedImage: string) => {
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
      
      const result = await processImage(uploadedImage);
      
      addProcessedImagesToZip(zip, result.images);
      await addInstructionsImageToZip(zip);
      addTextFilesToZip(zip, textFiles);

      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerAllCelebrations();

      toast({
        title: "Success!",
        description: "All files have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the files",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleTextFiles,
    processFiles
  };
};