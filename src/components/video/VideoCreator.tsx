import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

interface VideoCreatorProps {
  isExporting: boolean;
  onExport: () => void;
  imagesCount: number;
  videoUrl?: string;
}

export const VideoCreator = ({ isExporting, onExport, imagesCount, videoUrl }: VideoCreatorProps) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onExport}
        className="w-full"
        disabled={imagesCount !== 5 || isExporting}
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Video...
          </>
        ) : (
          'Export Video'
        )}
      </Button>

      {videoUrl && (
        <Button 
          variant="secondary"
          className="w-full"
          onClick={() => {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = 'slideshow.mp4';
            a.click();
          }}
        >
          <Download className="mr-2" />
          Download Video
        </Button>
      )}
    </div>
  );
};