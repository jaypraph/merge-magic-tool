import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { 
  triggerClassicFireworks, 
  triggerColorfulStars, 
  triggerModernFireworks 
} from "@/utils/celebrationEffects";

export const useImageProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [textFiles, setTextFiles] = useState<{
    keywords?: string;
    title?: string;
    description?: string;
  }>({});

  const handleTextFiles = (keywords: string[], title: string, description: string) => {
    // Ensure each keyword ends with a comma
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
      
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
      });

      // Add the instruction image to the ZIP
      const response = await fetch('/lovable-uploads/51c87eea-1486-4f80-a6b4-78a5ce50a0a1.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          zip.file("instructions.png", base64data.split('base64,')[1], {base64: true});
          resolve(null);
        };
      });

      if (textFiles.keywords) {
        zip.file("keywords.txt", textFiles.keywords);
      }
      if (textFiles.title) {
        zip.file("title.txt", textFiles.title);
      }
      if (textFiles.description) {
        zip.file("description.txt", textFiles.description);
      }

      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerColorfulStars();
      triggerModernFireworks();
      triggerClassicFireworks();

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