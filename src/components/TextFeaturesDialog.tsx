import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KeywordInputDialog } from "./keywords/KeywordInputDialog";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <div className="flex justify-center p-4">
          <div className="w-full max-w-md">
            <KeywordInputDialog open={true} onOpenChange={() => {}} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}