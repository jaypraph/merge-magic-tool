import { ImageEditor } from "@/components/ImageEditor";
import { ImageEditor2 } from "@/components/ImageEditor2";
import { PngToJpgConverter } from "@/components/PngToJpgConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { DpiConverter } from "@/components/DpiConverter";
import { WatermarkComponent } from "@/components/WatermarkComponent";
import { ImageProcessor } from "@/components/ImageProcessor";
import { TxComponent } from "@/components/TxComponent";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <SidebarProvider defaultOpen={false} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen w-full bg-transparent text-slate-900">
        <div className="light light-green-1"></div>
        <div className="light light-red-1"></div>
        <div className="light light-yellow-1"></div>
        <div className="light light-blue-1"></div>
        <div className="light light-orange-1"></div>
        <div className="light light-green-2"></div>
        <div className="light light-red-2"></div>
        <div className="light light-yellow-2"></div>
        <div className="light light-blue-2"></div>
        <div className="light light-orange-2"></div>
        <AppSidebar 
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />
        <main className="w-full bg-transparent">
          {!activeFeature && (
            <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-center pt-20 bg-transparent">
              <ImageProcessor 
                uploadedImage={uploadedImage}
                onUploadClick={handleUploadClick}
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png"
          />
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 bg-transparent">
            {activeFeature === "mockup" && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Image Merger</h1>
                <ImageEditor />
              </>
            )}
            {activeFeature === "mockup2" && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Image Merger 2</h1>
                <ImageEditor2 />
              </>
            )}
            {activeFeature === "jpg" && <PngToJpgConverter />}
            {activeFeature === "resize" && <ImageResizer />}
            {activeFeature === "dpi" && <DpiConverter />}
            {activeFeature === "wm" && <WatermarkComponent />}
            {activeFeature === "tx" && <TxComponent />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;