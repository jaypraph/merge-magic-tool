import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TxFeature } from "./keywords/TxFeature";
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
          <div className="h-full overflow-auto">
            <TxFeature />
          </div>
          <div className="h-full overflow-auto">
            <TitleEditor />
          </div>
          <div className="h-full overflow-auto">
            <DescriptionEditor />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}