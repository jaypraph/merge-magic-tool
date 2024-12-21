import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { processImageForVideo } from "@/utils/videoProcessing";
import { Slideshow } from "@/components/Slideshow";
import { useToast } from "@/components/ui/use-toast";

const VideoDesign = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageProcess = async () => {
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
      const images = await processImageForVideo(uploadedImage);
      setProcessedImages(images);
      toast({
        title: "Success!",
        description: "Images processed successfully. Slideshow started.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Video Design
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-8">
          <ImageUpload
            value={uploadedImage}
            onChange={setUploadedImage}
            label="Upload Video Thumbnail"
          />
          
          {uploadedImage && (
            <div className="flex justify-center">
              <Button
                onClick={handleImageProcess}
                disabled={isProcessing}
                className="w-full max-w-xs"
              >
                {isProcessing ? "Processing..." : "Process Image"}
              </Button>
            </div>
          )}

          {processedImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Preview Slideshow</h2>
              <Slideshow images={processedImages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDesign;