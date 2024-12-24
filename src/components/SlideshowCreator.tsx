import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ImageUploadGrid } from "./ImageUploadGrid";
import JSZip from "jszip";
import { supabase } from "@/integrations/supabase/client";

interface SlideshowCreatorProps {
  onClose: () => void;
}

export const SlideshowCreator = ({ onClose }: SlideshowCreatorProps) => {
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [slideshowId, setSlideshowId] = useState<string>("");

  const pollSlideshowStatus = async (id: string) => {
    const { data, error } = await supabase
      .from('slideshows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error polling slideshow status:', error);
      return;
    }

    if (data.status === 'completed') {
      setVideoUrl(data.video_path);
      setProgress(100);
      setIsProcessing(false);
      toast({
        title: "Success!",
        description: "Your slideshow has been created. You can now preview and download it.",
      });
    } else if (data.status === 'error') {
      setIsProcessing(false);
      setProgress(0);
      toast({
        title: "Error",
        description: data.error_message || "Failed to create slideshow. Please try again.",
        variant: "destructive",
      });
    } else {
      // Continue polling
      setTimeout(() => pollSlideshowStatus(id), 2000);
    }
  };

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
      setProgress(10);

      // Create slideshow record
      const { data: slideshow, error: insertError } = await supabase
        .from('slideshows')
        .insert({})
        .select()
        .single();

      if (insertError) throw insertError;

      setSlideshowId(slideshow.id);
      setProgress(20);

      // Start processing with Edge Function
      const { error: processError } = await supabase.functions.invoke('create-slideshow', {
        body: { slideshow_id: slideshow.id, images }
      });

      if (processError) throw processError;

      setProgress(40);
      // Start polling for status
      pollSlideshowStatus(slideshow.id);

    } catch (error) {
      console.error('Error in handleCreateSlideshow:', error);
      setProgress(0);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to create slideshow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const videoBlob = await response.blob();
      
      const zip = new JSZip();
      zip.file("0307.mp4", videoBlob);
      
      const content = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(content);
      
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = '0307.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(zipUrl);
      
      toast({
        title: "Success!",
        description: "Your slideshow has been downloaded.",
      });
    } catch (error) {
      console.error('Error downloading slideshow:', error);
      toast({
        title: "Error",
        description: "Failed to download slideshow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const allImagesUploaded = !images.some(img => !img);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create Slideshow</h2>
        
        <ImageUploadGrid 
          images={images}
          onImageUpload={handleImageUpload}
          isProcessing={isProcessing}
        />

        {isProcessing && (
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-600">Creating slideshow...</div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {videoUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <video 
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg shadow-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {allImagesUploaded && !videoUrl && (
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
          {videoUrl && (
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download ZIP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};