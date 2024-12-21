import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { mockupImages } from "@/constants/mockupDefaults";
import { changeDpiDataUrl } from "changedpi";
import { Progress } from "@/components/ui/progress";

const VideoDesign = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const convertToJpg = async (imageDataUrl: string): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = await createImage(imageDataUrl);
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const resizeTo4K = async (imageDataUrl: string): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = await createImage(imageDataUrl);
    
    canvas.width = 3840;
    canvas.height = 2160;
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const createMockupImage = async (mockupSrc: string, processedImage: string): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 2000;
    canvas.height = 2000;

    const [mockupImg, uploadedImg] = await Promise.all([
      createImage(mockupSrc),
      createImage(processedImage)
    ]);

    ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

    const mockupData = mockupImages.find(m => m.src === mockupSrc);
    if (mockupData) {
      const { topLeft, topRight, bottomLeft } = mockupData.defaultCoordinates;
      const coords = {
        x: parseInt(topLeft.match(/\((\d+)/)?.[1] || "0"),
        y: parseInt(topLeft.match(/,(\d+)/)?.[1] || "0"),
        width: parseInt(topRight.match(/\((\d+)/)?.[1] || "0") - parseInt(topLeft.match(/\((\d+)/)?.[1] || "0"),
        height: parseInt(bottomLeft.match(/,(\d+)/)?.[1] || "0") - parseInt(topLeft.match(/,(\d+)/)?.[1] || "0")
      };

      const scaleX = canvas.width / mockupImg.width;
      const scaleY = canvas.height / mockupImg.height;
      
      ctx?.drawImage(
        uploadedImg,
        coords.x * scaleX,
        coords.y * scaleY,
        coords.width * scaleX,
        coords.height * scaleY
      );
    }

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const createImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const createSlideshow = async (images: string[]) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=h264",
      videoBitsPerSecond: 8000000 // 8 Mbps for high quality
    });

    canvas.width = 2880;
    canvas.height = 2160;

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "slideshow.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();

    for (const image of images) {
      const img = await createImage(image);
      
      // Fade in
      for (let alpha = 0; alpha <= 1; alpha += 0.1) {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.globalAlpha = alpha;
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
        await new Promise(r => setTimeout(r, 50));
      }

      // Hold for 2.5 seconds
      await new Promise(r => setTimeout(r, 2500));

      // Fade out
      for (let alpha = 1; alpha >= 0; alpha -= 0.1) {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.globalAlpha = alpha;
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
        await new Promise(r => setTimeout(r, 50));
      }
    }

    mediaRecorder.stop();
  };

  const processImage = async () => {
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
    const processedImages: string[] = [];

    try {
      // Convert to JPG
      const jpgImage = await convertToJpg(uploadedImage);
      setProgress(20);

      // Resize to 4K
      const resizedImage = await resizeTo4K(jpgImage);
      setProgress(40);

      // Convert DPI to 300
      const dpiImage = changeDpiDataUrl(resizedImage, 300);
      setProgress(60);

      // Store processed original
      processedImages.push(dpiImage);

      // Create mockups (1, 2, 3, 5)
      const mockupIndices = [0, 1, 2, 4]; // Indices for mockups 1, 2, 3, 5
      for (const index of mockupIndices) {
        const mockupImage = await createMockupImage(mockupImages[index].src, dpiImage);
        processedImages.push(mockupImage);
        setProgress(60 + ((40 / mockupIndices.length) * (mockupIndices.indexOf(index) + 1)));
      }

      setProcessedImages(processedImages);
      await createSlideshow(processedImages);

      toast({
        title: "Success!",
        description: "Video created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
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
            label="Upload Image"
          />
          
          {uploadedImage && (
            <div className="space-y-4">
              <Button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Create Video"}
              </Button>
              
              {isProcessing && (
                <Progress value={progress} className="w-full" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDesign;