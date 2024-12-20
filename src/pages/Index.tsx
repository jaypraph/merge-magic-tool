import { ImageEditor } from "@/components/ImageEditor";
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
      const mockupImage = await createMockupImage("/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png", dpiAdjustedImage);

      // Create and download ZIP file
      const content = await createZipFile(dpiAdjustedImage, mockupImage, watermarkedImage);
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
        {activeFeature === "jpg" && <PngToJpgConverter />}
        {activeFeature === "resize" && <ImageResizer />}
        {activeFeature === "dpi" && <DpiConverter />}
        {activeFeature === "wm" && <WatermarkComponent />}
      </div>
    </div>
  );
};

export default Index;