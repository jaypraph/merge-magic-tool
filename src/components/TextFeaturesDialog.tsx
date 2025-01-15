import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0">
        <div className="grid grid-cols-3 h-full divide-x divide-gray-200">
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}