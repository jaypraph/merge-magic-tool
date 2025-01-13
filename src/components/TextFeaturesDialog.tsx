import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KeywordOrganizer } from "./keywords/KeywordOrganizer";
import { TitleEditor } from "@/pages/TitleEditor";
import { DescriptionEditor } from "@/pages/DescriptionEditor";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex gap-4 justify-between p-4">
          <div className="flex-1 max-w-[30%]">
            <KeywordOrganizer />
          </div>
          <div className="flex-1 max-w-[30%]">
            <TitleEditor />
          </div>
          <div className="flex-1 max-w-[30%]">
            <DescriptionEditor />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}