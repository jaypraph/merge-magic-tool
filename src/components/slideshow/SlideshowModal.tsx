import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Download } from "lucide-react";
import { VideoPreview } from "./VideoPreview";

interface SlideshowModalProps {
  onClose: () => void;
  isProcessing: boolean;
  progress: number;
  videoUrl: string;
  allImagesUploaded: boolean;
  onCreateSlideshow: () => void;
  onDownload: () => void;
}

export const SlideshowModal = ({
  onClose,
  isProcessing,
  progress,
  videoUrl,
  allImagesUploaded,
  onCreateSlideshow,
  onDownload,
}: SlideshowModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create Slideshow</h2>
        
        {isProcessing && (
          <div className="mb-6">
            <div className="mb-2 text-sm text-gray-600">Creating slideshow...</div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {videoUrl && <VideoPreview url={videoUrl} />}

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
              onClick={onCreateSlideshow}
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
              onClick={onDownload}
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