import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadGrid } from "./ImageUploadGrid";
import { SlideshowModal } from "./slideshow/SlideshowModal";
import { createSlideshow, pollSlideshowStatus, downloadSlideshow } from "@/utils/slideshowUtils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SlideshowCreatorProps {
  onClose: () => void;
}

export const SlideshowCreator = ({ onClose }: SlideshowCreatorProps) => {
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create slideshows.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

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
      
      const slideshowId = await createSlideshow(images, setProgress);
      
      // Start polling for status
      pollSlideshowStatus(
        slideshowId,
        (url) => {
          setVideoUrl(url);
          setIsProcessing(false);
          toast({
            title: "Success!",
            description: "Your slideshow has been created. You can now preview and download it.",
          });
        },
        (error) => {
          setIsProcessing(false);
          setProgress(0);
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        },
        setProgress
      );
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
      await downloadSlideshow(videoUrl);
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
    <SlideshowModal
      onClose={onClose}
      isProcessing={isProcessing}
      progress={progress}
      videoUrl={videoUrl}
      allImagesUploaded={allImagesUploaded}
      onCreateSlideshow={handleCreateSlideshow}
      onDownload={handleDownload}
    >
      <ImageUploadGrid 
        images={images}
        onImageUpload={handleImageUpload}
        isProcessing={isProcessing}
      />
    </SlideshowModal>
  );
};