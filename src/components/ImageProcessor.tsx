import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { useState } from "react";
import confetti from 'canvas-confetti';

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Random position for each firework
      const position = {
        x: Math.random(),
        y: Math.random() * 0.5
      };

      // Launch firework
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 30,
        origin: position,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        ticks: 200,
        scalar: 1.2,
        gravity: 1.2,
        drift: 0,
        shapes: ['star']
      });
    }, 250);
  };

  const triggerConfetti = () => {
    const end = Date.now() + (3 * 1000); // 3 seconds duration

    // Create a confetti animation interval
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea384c', '#40a9ff', '#52c41a', '#faad14', '#722ed1']
      });
    }, 250);
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
      
      // Process images through the pipeline
      const result = await processImage(uploadedImage);
      
      // Add processed images to ZIP with specific names
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
      });

      // Generate and download the ZIP file
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Trigger both confetti and fireworks after successful download
      triggerConfetti();
      triggerFireworks();

      toast({
        title: "Success!",
        description: "All images have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-4">
        <Button
          onClick={onUploadClick}
          className="w-12 h-12 rounded-full bg-[#ea384c] hover:bg-[#ea384c]/90 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none text-black text-2xl font-light tracking-wider"
        >
          U
        </Button>
        <Button
          onClick={handleProcessImage}
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none text-white text-2xl font-light tracking-wider"
        >
          G
        </Button>
      </div>
      {isProcessing && (
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      )}
    </div>
  );
};