import { ImageEditor } from "@/components/ImageEditor";
import { ImageEditor2 } from "@/components/ImageEditor2";
import { TopMenuBar } from "@/components/TopMenuBar";
import { PngToJpgConverter } from "@/components/PngToJpgConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { DpiConverter } from "@/components/DpiConverter";
import { WatermarkComponent } from "@/components/WatermarkComponent";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { changeDpiDataUrl } from "changedpi";
import { 
  createImage, 
  createWatermarkedImage, 
  createMockupImage, 
  createZipFile 
} from "@/utils/imageProcessing";
import { mockupImages } from "@/constants/mockupDefaults";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('png')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG image",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    try {
      // Step 1: Convert to JPG, resize, and set DPI to 300
      const jpgCanvas = document.createElement("canvas");
      const jpgCtx = jpgCanvas.getContext("2d");
      const img1 = await createImage(uploadedImage);
      jpgCanvas.width = 3840;
      jpgCanvas.height = 2160;
      jpgCtx?.drawImage(img1, 0, 0, 3840, 2160);
      const jpgImage = jpgCanvas.toDataURL("image/jpeg", 0.9);
      
      // Convert DPI to 300 and create watermarked version
      const dpiAdjustedImage = changeDpiDataUrl(jpgImage, 300);
      const watermarkedImage = await createWatermarkedImage(dpiAdjustedImage);

      // Create mockup images with correct dimensions
      const mockupPromises = mockupImages.map(async (mockup) => {
        const canvas = document.createElement("canvas");
        // Set dimensions based on mockup ID
        if (mockup.id === 1) {
          canvas.width = 1588;
          canvas.height = 1191;
        } else {
          canvas.width = 2000;
          canvas.height = 2000;
        }
        
        const ctx = canvas.getContext("2d");
        const mockupImg = await createImage(mockup.src);
        const uploadedImg = await createImage(uploadedImage);
        
        ctx?.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);
        
        const topLeft = parseCoordinates(mockup.defaultCoordinates.topLeft);
        const topRight = parseCoordinates(mockup.defaultCoordinates.topRight);
        const bottomLeft = parseCoordinates(mockup.defaultCoordinates.bottomLeft);
        
        if (topLeft && topRight && bottomLeft) {
          const scaleX = canvas.width / mockupImg.width;
          const scaleY = canvas.height / mockupImg.height;
          
          const scaledX = Math.round(topLeft.x * scaleX);
          const scaledY = Math.round(topLeft.y * scaleY);
          const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
          const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);
          
          ctx?.drawImage(
            uploadedImg,
            scaledX,
            scaledY,
            scaledWidth,
            scaledHeight
          );
        }
        
        return {
          id: mockup.id,
          dataUrl: canvas.toDataURL("image/png")
        };
      });

      const mockupResults = await Promise.all(mockupPromises);
      
      // Create and download ZIP file with all variations
      const content = await createZipFile(
        dpiAdjustedImage,
        mockupResults,
        watermarkedImage,
        uploadedImage
      );
      
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Images have been processed and downloaded as ZIP file.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the image",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const parseCoordinates = (coord: string) => {
    const match = coord.match(/\((\d+),(\d+)\)/);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2])
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopMenuBar 
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
      />
      <div className="flex justify-center mt-4 gap-4">
        <Button
          onClick={handleUploadClick}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        <Button
          onClick={processImage}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
        >
          <Play className="mr-2 h-5 w-5" />
          Go
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png"
        />
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {activeFeature === "mockup" && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger</h1>
            <ImageEditor />
          </>
        )}
        {activeFeature === "mockup2" && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger 2</h1>
            <ImageEditor2 />
          </>
        )}
        {activeFeature === "jpg" && <PngToJpgConverter />}
        {activeFeature === "resize" && <ImageResizer />}
        {activeFeature === "dpi" && <DpiConverter />}
        {activeFeature === "wm" && <WatermarkComponent />}
      </div>
    </div>
  );
};

export default Index;