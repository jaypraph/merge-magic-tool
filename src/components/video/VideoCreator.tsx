import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VideoCreatorProps {
  isExporting: boolean;
  onExport: () => void;
  imagesCount: number;
}

export const VideoCreator = ({ isExporting, onExport, imagesCount }: VideoCreatorProps) => {
  return (
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
  );
};