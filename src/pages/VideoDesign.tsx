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

  const createVideoFromImages = async () => {
    if (processedImages.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to 4K resolution
    canvas.width = 3840;
    canvas.height = 2160;

    // Create a MediaRecorder with MP4 settings
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: 8000000 // 8 Mbps for high quality
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slideshow.mp4';
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();

    // Draw each image for 2.5 seconds
    for (let i = 0; i < processedImages.length; i++) {
      const img = new Image();
      img.src = processedImages[i];
      await new Promise<void>((resolve) => {
        img.onload = () => {
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
            x,
            y,
            img.width * scale,
            img.height * scale
          );
          resolve();
        };
      });
      await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 seconds per image
    }

    mediaRecorder.stop();
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
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={createVideoFromImages}
                  className="w-full max-w-xs"
                >
                  Download MP4
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