import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { createVideoFromImages } from "@/utils/videoCreator";

interface VideoExporterProps {
  images: string[];
}

export const VideoExporter = ({ images }: VideoExporterProps) => {
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const { toast } = useToast();

  const handleVideoDownload = async () => {
    if (images.length === 0) {
      toast({
        title: "No images to process",
        description: "Please process images first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingVideo(true);
    setVideoProgress(0);
    try {
      await createVideoFromImages(images, (progress) => {
        setVideoProgress(progress);
      });
      toast({
        title: "Success!",
        description: "Video created and downloaded successfully.",
      });
    } catch (error) {
      console.error('Video creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingVideo(false);
      setVideoProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleVideoDownload}
        disabled={isCreatingVideo}
        className="w-full flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isCreatingVideo ? "Creating Video..." : "Download Video"}
      </Button>

      {isCreatingVideo && (
        <div className="space-y-2">
          <Progress value={videoProgress} className="w-full" />
          <p className="text-sm text-center text-gray-500">
            Creating video: {videoProgress}%
          </p>
        </div>
      )}
    </div>
  );
};