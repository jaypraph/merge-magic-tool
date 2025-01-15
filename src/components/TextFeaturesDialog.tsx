import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KeywordInputDialog } from "@/components/keywords/KeywordInputDialog";
import { useState } from "react";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  const [selectedKeyword, setSelectedKeyword] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0">
        <div className="grid grid-cols-3 h-full divide-x divide-gray-200 border-2 border-gray-200">
          <div className="h-full flex items-center justify-center text-4xl font-bold text-gray-400 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <KeywordInputDialog
                open={true}
                onOpenChange={() => {}}
                selectedKeyword={selectedKeyword}
              />
            </div>
          </div>
          <div className="h-full flex items-center justify-center text-4xl font-bold text-gray-400">
            2
          </div>
          <div className="h-full flex items-center justify-center text-4xl font-bold text-gray-400">
            3
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}