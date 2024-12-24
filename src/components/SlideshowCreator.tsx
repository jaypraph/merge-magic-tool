import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface SlideshowCreatorProps {
  onClose: () => void;
}

export const SlideshowCreator = ({ onClose }: SlideshowCreatorProps) => {
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
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
      setIsProcessing(true);
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();

      // Write each image to FFmpeg's virtual filesystem
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i].split(',')[1];
        const buffer = Buffer.from(imageData, 'base64');
        await ffmpeg.writeFile(`image${i}.jpg`, buffer);
      }

      // Create a concat file listing all images
      const concatContent = images.map((_, i) => 
        `file 'image${i}.jpg'\nduration 2.5`
      ).join('\n');
      await ffmpeg.writeFile('concat.txt', concatContent);

      // Create slideshow with specified parameters
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-vf', 'scale=2880:2160:force_original_aspect_ratio=decrease,pad=2880:2160:(ow-iw)/2:(oh-ih)/2',
        '-r', '30',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '0307.mp4'
      ]);

      // Read the output file
      const data = await ffmpeg.readFile('0307.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      // Download the video
      const a = document.createElement('a');
      a.href = url;
      a.download = '0307.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Your slideshow has been created and downloaded.",
      });
      onClose();
    } catch (error) {
      console.error('Error creating slideshow:', error);
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center h-[150px]"
            >
              {image ? (
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    onClick={() => handleImageUpload(index)}
                    className="absolute bottom-1 right-1 h-6 text-xs"
                    variant="secondary"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleImageUpload(index)}
                  className="w-full h-full flex flex-col gap-2"
                  variant="outline"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-xs">Image {index + 1}</span>
                </Button>
              )}
            </div>
          ))}
        </div>

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