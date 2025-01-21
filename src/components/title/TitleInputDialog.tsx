import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TitleInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Create a global event for title transfer
export const titleTransferEvent = new CustomEvent('transferTitles', {
  detail: { titles: [] as string[] }
}) as CustomEvent<{ titles: string[] }>;

export function TitleInputDialog({ open, onOpenChange }: TitleInputDialogProps) {
  const [titles, setTitles] = useState<string[]>(Array(4).fill(''));
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  const handleTitleChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const transferTitles = () => {
    const nonEmptyTitles = titles.filter(t => t.trim() !== '');
    titleTransferEvent.detail.titles = nonEmptyTitles;
    document.dispatchEvent(titleTransferEvent);
    toast({
      description: "Titles transferred to Text Features!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle>Title Editor</DialogTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setIsLocked(!isLocked);
                if (!isLocked) {
                  transferTitles();
                }
                toast({
                  description: isLocked ? "Titles unlocked" : "Titles locked",
                });
              }}
              variant={isLocked ? "destructive" : "default"}
              size="sm"
            >
              {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setTitles(Array(4).fill(''))}
              variant="outline"
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {titles.map((title, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
                <Textarea
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder=""
                  className="w-[200px] h-[50px] min-h-[50px] resize-none"
                  disabled={isLocked}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}