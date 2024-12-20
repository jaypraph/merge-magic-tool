import { ImageEditor } from "@/components/ImageEditor";
import { TopMenuBar } from "@/components/TopMenuBar";
import { PngToJpgConverter } from "@/components/PngToJpgConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      // Step 1: Convert to JPG
      const jpgCanvas = document.createElement("canvas");
      const jpgCtx = jpgCanvas.getContext("2d");
      const img1 = await createImage(uploadedImage);
      jpgCanvas.width = img1.width;
      jpgCanvas.height = img1.height;
      jpgCtx?.drawImage(img1, 0, 0);
      const jpgImage = await new Promise<string>((resolve) => {
        jpgCanvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }
        }, "image/jpeg", 0.9);
      });

      toast({
        title: "Step 1 complete",
        description: "Image converted to JPG",
      });

      // Step 2: Resize to 3840x2160
      const resizeCanvas = document.createElement("canvas");
      const resizeCtx = resizeCanvas.getContext("2d");
      resizeCanvas.width = 3840;
      resizeCanvas.height = 2160;
      const img2 = await createImage(jpgImage);
      resizeCtx?.drawImage(img2, 0, 0, 3840, 2160);
      const resizedImage = await new Promise<string>((resolve) => {
        resizeCanvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }
        }, "image/jpeg", 0.9);
      });

      toast({
        title: "Step 2 complete",
        description: "Image resized to 3840x2160",
      });

      // Step 3: Merge with default mockup
      setActiveFeature("mockup");
      const mockupCanvas = document.createElement("canvas");
      const mockupCtx = mockupCanvas.getContext("2d");
      mockupCanvas.width = 1588;
      mockupCanvas.height = 1191;

      const defaultImage = await createImage("/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png");
      const processedImage = await createImage(resizedImage);

      mockupCtx?.drawImage(defaultImage, 0, 0, mockupCanvas.width, mockupCanvas.height);
      mockupCtx?.drawImage(
        processedImage,
        228, 224,  // top-left coordinates
        1362 - 228, 841 - 224  // width and height based on coordinates
      );

      mockupCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "processed-image.jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Success!",
            description: "Image processing complete. Your file has been downloaded.",
          });
        }
      }, "image/jpeg", 0.9);

    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the image",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const createImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
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
      </div>
    </div>
  );
};

export default Index;