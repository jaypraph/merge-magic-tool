import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { processImageForVideo } from "@/utils/videoProcessing";
import { Slideshow } from "@/components/Slideshow";
import { useToast } from "@/components/ui/use-toast";
import { createVideoFromImages } from "@/utils/videoCreator";
import { Progress } from "@/components/ui/progress";

const VideoDesign = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
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

  const handleVideoDownload = async () => {
    if (processedImages.length === 0) {
      toast({
        title: "No images to process",
        description: "Please process images first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingVideo(true);
    setVideoProgress(0);
    try {
      await createVideoFromImages(processedImages, (progress) => {
        setVideoProgress(progress);
      });
      toast({
        title: "Success!",
        description: "Video created and downloaded successfully.",
      });
    } catch (error) {
      console.error('Video creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingVideo(false);
      setVideoProgress(0);
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
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleImageProcess}
              disabled={isProcessing}
              className="w-full max-w-xs"
            >
              {isProcessing ? "Processing..." : "Process Image"}
            </Button>

            {processedImages.length > 0 && (
              <Button
                onClick={handleVideoDownload}
                disabled={isCreatingVideo}
                className="w-full max-w-xs flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isCreatingVideo ? "Creating Video..." : "Download Video"}
              </Button>
            )}
          </div>

          {isCreatingVideo && (
            <div className="space-y-2">
              <Progress value={videoProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                Creating video: {videoProgress}%
              </p>
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