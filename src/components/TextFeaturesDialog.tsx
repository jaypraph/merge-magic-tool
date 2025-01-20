import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  // Keywords state
  const [keywords, setKeywords] = useState<string[]>(Array(13).fill(''));
  const [keywordsLocked, setKeywordsLocked] = useState(false);
  
  // Title state
  const [titleAreas, setTitleAreas] = useState<string[]>(Array(4).fill(''));
  const [titlesLocked, setTitlesLocked] = useState(false);
  
  // Description state
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(Array(4).fill(''));
  const [descriptionsLocked, setDescriptionsLocked] = useState(false);
  
  const { toast } = useToast();

  const handleKeywordChange = (index: number, value: string) => {
    if (keywordsLocked) return;
    if (value.length <= 20) {
      const newKeywords = [...keywords];
      newKeywords[index] = value;
      setKeywords(newKeywords);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    if (titlesLocked) return;
    const newTitles = [...titleAreas];
    newTitles[index] = value;
    setTitleAreas(newTitles);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    if (descriptionsLocked) return;
    const newDescriptions = [...descriptionAreas];
    newDescriptions[index] = value;
    setDescriptionAreas(newDescriptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0">
        <div className="grid grid-cols-3 h-full divide-x divide-gray-200 border-2 border-gray-200">
          {/* Block 1 - Keywords */}
          <div className="flex flex-col h-full">
            <h2 className="p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">Keywords</h2>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
                    <Textarea
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder=""
                      className="text-sm w-[200px] h-[50px] min-h-[50px] resize-none py-2 px-3"
                      disabled={keywordsLocked}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button 
                onClick={() => {
                  setKeywordsLocked(!keywordsLocked);
                  toast({
                    description: keywordsLocked ? "Keywords unlocked" : "Keywords locked",
                  });
                }}
                variant={keywordsLocked ? "destructive" : "default"}
                className="w-full"
              >
                {keywordsLocked ? "Unlock" : "Lock"}
              </Button>
            </div>
          </div>

          {/* Block 2 - Title */}
          <div className="flex flex-col h-full">
            <h2 className="p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">Title</h2>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {titleAreas.map((text, index) => (
                  <Textarea
                    key={index}
                    value={text}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder=""
                    className="text-sm w-[200px] h-[50px] min-h-[50px] resize-none py-2 px-3"
                    disabled={titlesLocked}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button 
                onClick={() => {
                  setTitlesLocked(!titlesLocked);
                  toast({
                    description: titlesLocked ? "Titles unlocked" : "Titles locked",
                  });
                }}
                variant={titlesLocked ? "destructive" : "default"}
                className="w-full"
              >
                {titlesLocked ? "Unlock" : "Lock"}
              </Button>
            </div>
          </div>

          {/* Block 3 - Description */}
          <div className="flex flex-col h-full">
            <h2 className="p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">Description</h2>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {descriptionAreas.map((text, index) => (
                  <Textarea
                    key={index}
                    value={text}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder=""
                    className="text-sm w-[200px] h-[50px] min-h-[50px] resize-none py-2 px-3"
                    disabled={descriptionsLocked}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button 
                onClick={() => {
                  setDescriptionsLocked(!descriptionsLocked);
                  toast({
                    description: descriptionsLocked ? "Descriptions unlocked" : "Descriptions locked",
                  });
                }}
                variant={descriptionsLocked ? "destructive" : "default"}
                className="w-full"
              >
                {descriptionsLocked ? "Unlock" : "Lock"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}