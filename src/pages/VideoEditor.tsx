import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const VideoEditor = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeFeature, setActiveFeature] = useState("");

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

  const handleExport = () => {
    if (uploadedImages.length !== 5) {
      toast({
        title: "Not enough images",
        description: "Please upload exactly 5 images before exporting",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement video export functionality
    toast({
      title: "Export started",
      description: "Your video is being created. This may take a few minutes.",
    });
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
                  <li>• Duration per image: 2:30</li>
                  <li>• Format: MP4</li>
                  <li>• Transition: Smooth fade</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleExport}
                className="w-full"
                disabled={uploadedImages.length !== 5}
              >
                Export Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};