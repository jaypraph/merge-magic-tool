import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ImageUploadGrid } from "./ImageUploadGrid";
import { 
  initializeFFmpeg, 
  processImages, 
  createConcatFile, 
  createSlideshow 
} from "@/utils/ffmpeg";

interface SlideshowCreatorProps {
  onClose: () => void;
}

export const SlideshowCreator = ({ onClose }: SlideshowCreatorProps) => {
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleImageUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...images];
          newImages[index] = e.target?.result as string;
          setImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCreateSlideshow = async () => {
    try {
      console.log('Starting slideshow creation process...');
      setIsProcessing(true);
      setProgress(10);
      
      console.log('Initializing FFmpeg...');
      const ffmpeg = await initializeFFmpeg();
      setProgress(30);

      console.log('Processing images...');
      await processImages(ffmpeg, images);
      setProgress(60);

      console.log('Creating concat file...');
      await createConcatFile(ffmpeg, images.length);
      setProgress(80);

      console.log('Creating final slideshow...');
      await createSlideshow(ffmpeg);
      setProgress(90);

      console.log('Reading output file...');
      const data = await ffmpeg.readFile('0307.mp4');
      const outputBlob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(outputBlob);
      setProgress(95);

      console.log('Initiating download...');
      const a = document.createElement('a');
      a.href = url;
      a.download = '0307.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setProgress(100);

      toast({
        title: "Success!",
        description: "Your slideshow has been created and downloaded.",
      });
      onClose();
    } catch (error) {
      console.error('Error in handleCreateSlideshow:', error);
      setProgress(0);
      toast({
        title: "Error",
        description: "Failed to create slideshow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const allImagesUploaded = !images.some(img => !img);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Create Slideshow</h2>
        
        <ImageUploadGrid 
          images={images}
          onImageUpload={handleImageUpload}
          isProcessing={isProcessing}
        />

        {isProcessing && (
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-600">Creating slideshow...</div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {allImagesUploaded && (
            <Button
              onClick={handleCreateSlideshow}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Creating..."
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Create Slideshow
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};