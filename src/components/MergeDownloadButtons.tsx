import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface MergeDownloadButtonsProps {
  onMerge: () => void;
  onDownload: () => void;
  showDownload: boolean;
}

export const MergeDownloadButtons = ({ 
  onMerge, 
  onDownload, 
  showDownload 
}: MergeDownloadButtonsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onMerge}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Merge Images
      </Button>
      {showDownload && (
        <Button
          onClick={onDownload}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      )}
    </div>
  );
};