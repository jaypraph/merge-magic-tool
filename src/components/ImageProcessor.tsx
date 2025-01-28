import { ProcessingButtons } from "./image-processor/ProcessingButtons";
import { ProcessingIndicator } from "./image-processor/ProcessingIndicator";
import { useImageProcessing } from "@/hooks/useImageProcessing";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { isProcessing, handleTextFiles, processFiles } = useImageProcessing();

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
        onProcessClick={() => processFiles(uploadedImage)}
      />
      <ProcessingIndicator isProcessing={isProcessing} />
    </div>
  );
};