import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { processImageForVideo } from "@/utils/videoProcessing";
import { Slideshow } from "@/components/Slideshow";
import { useToast } from "@/hooks/use-toast";

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

  const handleDownload = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set canvas size to match the first image
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
      };
      img.src = processedImages[0];

      // Create video element
      const videoBlob = await new Promise((resolve) => {
        const mediaRecorder = new MediaRecorder(canvas.captureStream(30));
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/mp4' }));

        // Start recording
        mediaRecorder.start();

        // Draw each image
        let currentFrame = 0;
        const drawNextFrame = () => {
          if (currentFrame < processedImages.length) {
            const currentImg = new Image();
            currentImg.onload = () => {
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              ctx?.drawImage(currentImg, 0, 0);
              currentFrame++;
              setTimeout(drawNextFrame, 2500); // Match the slideshow duration
            };
            currentImg.src = processedImages[currentFrame];
          } else {
            mediaRecorder.stop();
          }
        };

        drawNextFrame();
      });

      // Create download link
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slideshow.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Video downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download video. Please try again.",
        variant: "destructive",
      });
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
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Preview Slideshow</h2>
              <Slideshow images={processedImages} />
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleDownload}
                  className="w-full max-w-xs"
                  variant="default"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDesign;