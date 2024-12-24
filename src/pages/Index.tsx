import { ImageEditor } from "@/components/ImageEditor";
import { ImageEditor2 } from "@/components/ImageEditor2";
import { PngToJpgConverter } from "@/components/PngToJpgConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { DpiConverter } from "@/components/DpiConverter";
import { WatermarkComponent } from "@/components/WatermarkComponent";
import { ImageProcessor } from "@/components/ImageProcessor";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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

  return (
    <SidebarProvider defaultOpen={false} open={false}>
      <div className="min-h-screen flex w-full bg-white text-slate-900">
        <AppSidebar 
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />
        <main className="flex-1">
          <ImageProcessor 
            uploadedImage={uploadedImage}
            onUploadClick={handleUploadClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png"
          />
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;