import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KeywordInputDialog } from "./keywords/KeywordInputDialog";
import { TitleEditor } from "@/pages/TitleEditor";
import { DescriptionEditor } from "@/pages/DescriptionEditor";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0">
        <div className="grid grid-cols-3 h-full divide-x divide-gray-200">
          {/* Keywords Panel */}
          <div className="p-4 overflow-y-auto">
            <KeywordInputDialog open={true} onOpenChange={() => {}} />
          </div>

          {/* Title Panel */}
          <div className="p-4 overflow-y-auto">
            <TitleEditor />
          </div>

          {/* Description Panel */}
          <div className="p-4 overflow-y-auto">
            <DescriptionEditor />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}