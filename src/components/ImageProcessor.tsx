import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [processingStage, setProcessingStage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const createSlideshow = async (images: string[], zip: JSZip) => {
    setProcessingStage("Creating slideshow video...");
    
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    
    // Write each image to FFmpeg's virtual filesystem
    for (let i = 0; i < images.length; i++) {
      const imageData = images[i].split('base64,')[1];
      await ffmpeg.writeFile(`image${i}.jpg`, await fetchFile(
        `data:image/jpeg;base64,${imageData}`
      ));
    }

    // Create a file list for FFmpeg
    const fileList = images.map((_, i) => 
      `file 'image${i}.jpg'`
    ).join('\n');
    await ffmpeg.writeFile('files.txt', fileList);

    // Create slideshow with 2.5s duration per image
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'files.txt',
      '-framerate', '30',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-s', '2880x2160',
      '-vf', 'fps=30,format=yuv420p',
      '-frame_pts', '1',
      '-vf', `setpts=2.5*N/(30*TB)`,
      'output.mp4'
    ]);

    // Read the output video
    const data = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([data], { type: 'video/mp4' });
    const videoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(videoBlob);
    });

    // Add video to ZIP
    zip.file("0307.mp4", videoBase64.split('base64,')[1], { base64: true });
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

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      // Process images through the pipeline with stage updates
      setProcessingStage("Converting to JPG...");
      const result = await processImage(uploadedImage, (stage: string) => {
        setProcessingStage(stage);
      });
      
      // Add processed images to ZIP with specific names
      const slideshowImages: string[] = [];
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
        
        // Collect images for slideshow
        if (fileName === "mtrx-1.jpg" || 
            fileName === "mockup1.jpg" || 
            fileName === "mockup2.jpg" || 
            fileName === "mockup3.jpg" || 
            fileName === "mockup5.jpg") {
          slideshowImages.push(image);
        }
      });

      // Create slideshow after all images are processed
      await createSlideshow(slideshowImages, zip);

      setProcessingStage("Creating ZIP file...");
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProcessingStage("");
      setIsProcessing(false);
      toast({
        title: "Success!",
        description: "All images have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      setProcessingStage("");
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-4">
      <div className="flex justify-center gap-4">
        <Button
          onClick={onUploadClick}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        <Button
          onClick={handleProcessImage}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Play className="mr-2 h-5 w-5" />
          Go
        </Button>
      </div>
      {processingStage && (
        <p className="text-green-500 font-medium mt-2">{processingStage}</p>
      )}
    </div>
  );
};