import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { processImage } from "@/utils/imageProcessingPipeline";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { createSlideshow } from "@/utils/videoProcessing";

const VideoDesign = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
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
    setProgress(0);

    try {
      const result = await processImage(uploadedImage);
      setProcessedImages(result.images);
      
      // Create and set video URL
      const url = URL.createObjectURL(result.video);
      setVideoUrl(url);
      
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Images processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process images",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateVideo = async () => {
    if (processedImages.length === 0) {
      toast({
        title: "No images available",
        description: "Please process images first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingVideo(true);
    try {
      const videoBlob = await createSlideshow(processedImages);
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      
      toast({
        title: "Success!",
        description: "Video created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsCreatingVideo(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "slideshow.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            label="Upload Image"
          />

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-center text-sm text-gray-500">
                Processing image...
              </p>
            </div>
          )}

          {uploadedImage && !isProcessing && (
            <div className="flex justify-center">
              <Button
                onClick={handleImageProcess}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isProcessing}
              >
                Process Image
              </Button>
            </div>
          )}

          {processedImages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Processed Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedImages.map((img, index) => (
                  <div key={index} className="border rounded-lg p-2">
                    <img
                      src={img}
                      alt={`Processed ${index}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleCreateVideo}
                  disabled={isCreatingVideo}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Make Video
                </Button>

                {videoUrl && (
                  <Button
                    onClick={handleDownloadVideo}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                )}
              </div>

              {isCreatingVideo && (
                <p className="text-center text-sm text-gray-500">
                  Creating video...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDesign;
