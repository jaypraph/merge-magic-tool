import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { VideoSettings } from "@/components/video/VideoSettings";
import { ImagePreview } from "@/components/video/ImagePreview";
import { VideoCreator } from "@/components/video/VideoCreator";
import { useVideoCreation } from "@/hooks/useVideoCreation";

export const VideoEditor = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeFeature, setActiveFeature] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { createVideoFromImages } = useVideoCreation();

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
      toast({
        title: "Export complete",
        description: "Your video has been created successfully!",
      });
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Export failed",
        description: "There was an error creating your video. Please try again.",
        variant: "destructive",
      });
    } finally {
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
              
              <ImagePreview images={uploadedImages} />
            </div>

            <div className="space-y-4">
              <VideoSettings />
              <VideoCreator 
                isExporting={isExporting}
                onExport={handleExport}
                imagesCount={uploadedImages.length}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};