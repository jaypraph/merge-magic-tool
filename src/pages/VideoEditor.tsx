import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Loader2 } from "lucide-react";

export const VideoEditor = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeFeature, setActiveFeature] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleImageUpload = (value: string) => {
    if (uploadedImages.length < 5) {
      setUploadedImages((prev) => [...prev, value]);
    } else {
      toast({
        title: "Maximum images reached",
        description: "You can only upload up to 5 images",
        variant: "destructive",
      });
    }
  };

  const createVideoFromImages = async (images: string[]) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const mediaRecorder = await createMediaRecorder(canvas);
    const chunks: Blob[] = [];
    
    // Set 4K resolution
    canvas.width = 3840;
    canvas.height = 2160;
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slideshow.mp4';
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      toast({
        title: "Export complete",
        description: "Your video has been created successfully!",
      });
    };

    mediaRecorder.start();

    // Load all images first
    const loadedImages = await Promise.all(
      images.map(src => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    // Duration for each image (2.5 seconds = 2500ms)
    const imageDuration = 2500;
    // Transition duration (0.5 seconds = 500ms)
    const transitionDuration = 500;
    
    let startTime = performance.now();
    let currentImageIndex = 0;

    const animate = async () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentImageIndex >= loadedImages.length) {
        mediaRecorder.stop();
        return;
      }

      const currentImage = loadedImages[currentImageIndex];
      const nextImage = loadedImages[currentImageIndex + 1];

      // Calculate progress through current image duration
      const progress = (elapsed % imageDuration) / imageDuration;

      // Draw current image
      drawImageCentered(ctx, currentImage, canvas.width, canvas.height);

      // Handle transition to next image
      if (progress > 0.8 && nextImage) { // Start transition in last 20% of duration
        const transitionProgress = (progress - 0.8) / 0.2;
        ctx.globalAlpha = 1 - transitionProgress;
        drawImageCentered(ctx, currentImage, canvas.width, canvas.height);
        ctx.globalAlpha = transitionProgress;
        drawImageCentered(ctx, nextImage, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }

      // Move to next image if current duration is complete
      if (elapsed >= imageDuration) {
        startTime = currentTime;
        currentImageIndex++;
      }

      if (currentImageIndex < loadedImages.length) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const createMediaRecorder = async (canvas: HTMLCanvasElement) => {
    const stream = canvas.captureStream(30); // 30 FPS
    return new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=h264',
      videoBitsPerSecond: 8000000 // 8 Mbps for high quality
    });
  };

  const drawImageCentered = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const scale = Math.min(
      canvasWidth / img.width,
      canvasHeight / img.height
    );
    const x = (canvasWidth - img.width * scale) / 2;
    const y = (canvasHeight - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  const handleExport = async () => {
    if (uploadedImages.length !== 5) {
      toast({
        title: "Not enough images",
        description: "Please upload exactly 5 images before exporting",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Export started",
      description: "Your video is being created. This may take a few seconds.",
    });

    try {
      await createVideoFromImages(uploadedImages);
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Export failed",
        description: "There was an error creating your video. Please try again.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-transparent text-slate-900">
        <AppSidebar 
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />
        <div className="container mx-auto p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center mb-8">Video Creator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ImageUpload
                value=""
                onChange={handleImageUpload}
                label="Upload Images (5 required)"
              />
              
              <div className="flex flex-wrap gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="w-32 h-32 relative">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Video Settings</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Resolution: 4K (3840x2160)</li>
                  <li>• Duration per image: 2.5 seconds</li>
                  <li>• Format: MP4</li>
                  <li>• Transition: Smooth fade</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleExport}
                className="w-full"
                disabled={uploadedImages.length !== 5 || isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Video...
                  </>
                ) : (
                  'Export Video'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};