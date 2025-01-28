import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { useState } from "react";
import { 
  triggerClassicFireworks, 
  triggerColorfulStars, 
  triggerModernFireworks 
} from "@/utils/celebrationEffects";
import { ProcessingButtons } from "./image-processor/ProcessingButtons";
import { ProcessingIndicator } from "./image-processor/ProcessingIndicator";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [textFiles, setTextFiles] = useState<{
    keywords?: string;
    title?: string;
    description?: string;
  }>({});

  const handleTextFiles = (keywords: string[], title: string, description: string) => {
    setTextFiles({
      keywords: keywords.join('\n'),
      title,
      description
    });
    toast({
      description: "Text files added to GO pipeline!",
    });
  };

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
      
      const result = await processImage(uploadedImage);
      
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
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

  // Add event listener for text files
  document.addEventListener('addTextFiles', ((event: CustomEvent<{ 
    keywords: string[];
    title: string;
    description: string;
  }>) => {
    handleTextFiles(event.detail.keywords, event.detail.title, event.detail.description);
  }) as EventListener);

  return (
    <div className="flex flex-col items-center gap-4">
      <ProcessingButtons 
        onUploadClick={onUploadClick}
        onProcessClick={handleProcessImage}
      />
      <ProcessingIndicator isProcessing={isProcessing} />
    </div>
  );
};