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
      // Create a video element to play the frames
      const video = document.createElement('video');
      video.width = 3840;  // 4K width
      video.height = 2160; // 4K height

      // Create a canvas to draw the frames
      const canvas = document.createElement('canvas');
      canvas.width = video.width;
      canvas.height = video.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set up MediaRecorder with specific codec
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=h264',
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      const videoBlob = await new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        // Start recording
        mediaRecorder.start();

        // Process each image
        let currentFrame = 0;
        const drawNextFrame = async () => {
          if (currentFrame < processedImages.length) {
            const img = new Image();
            img.onload = () => {
              // Clear canvas and draw new frame
              ctx.fillStyle = 'black';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Calculate dimensions to maintain aspect ratio
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;
              
              ctx.drawImage(
                img,
                x, y,
                img.width * scale,
                img.height * scale
              );
              
              currentFrame++;
              if (currentFrame < processedImages.length) {
                setTimeout(drawNextFrame, 2500); // Match slideshow duration
              } else {
                mediaRecorder.stop();
              }
            };
            img.src = processedImages[currentFrame];
          }
        };

        drawNextFrame();
      });

      // Create download link with proper extension
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slideshow.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Video downloaded successfully.",
      });
    } catch (error) {
      console.error('Video creation error:', error);
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