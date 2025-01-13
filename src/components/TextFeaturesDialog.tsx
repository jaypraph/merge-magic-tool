import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TitleEditor } from "@/pages/TitleEditor";
import { DescriptionEditor } from "@/pages/DescriptionEditor";
import { KeywordInputDialog } from "./keywords/KeywordInputDialog";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[1200px] h-[600px] p-0">
        <div className="grid grid-cols-3 gap-4 h-full p-4">
          <div className="overflow-auto">
            <KeywordInputDialog open={true} onOpenChange={() => {}} />
          </div>
          <div className="overflow-auto">
            <TitleEditor />
          </div>
          <div className="overflow-auto">
            <DescriptionEditor />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}