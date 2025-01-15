import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh]">
        <div className="flex justify-center items-center h-full">
          <div className="bg-background p-6 rounded-lg">
            {/* Content will be added in next step */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}