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
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <div className="flex gap-4 justify-between p-4">
          <div className="flex-1 max-w-[30%] h-full overflow-hidden">
            <KeywordInputDialog open={true} onOpenChange={() => {}} />
          </div>
          <div className="flex-1 max-w-[30%] h-full overflow-hidden">
            <TitleEditor />
          </div>
          <div className="flex-1 max-w-[30%] h-full overflow-hidden">
            <DescriptionEditor />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}