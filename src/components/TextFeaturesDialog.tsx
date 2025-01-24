import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Unlock } from "lucide-react";
import { keywordTransferEvent } from "./keywords/KeywordInputDialog";
import { titleTransferEvent } from "./title/TitleInputDialog";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  // Keywords state with localStorage persistence
  const [keywords, setKeywords] = useState<string[]>(() => {
    const savedKeywords = localStorage.getItem('textFeatures.keywords');
    return savedKeywords ? JSON.parse(savedKeywords) : Array(13).fill('');
  });
  
  const [keywordsLocked, setKeywordsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.keywordsLocked') === 'true';
  });
  
  // Title state
  const [titleAreas, setTitleAreas] = useState<string[]>(Array(4).fill(''));
  const [titlesLocked, setTitlesLocked] = useState(false);
  
  // Description state
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(Array(4).fill(''));
  const [descriptionsLocked, setDescriptionsLocked] = useState(false);
  
  const { toast } = useToast();

  // Persist keywords and lock state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywordsLocked', keywordsLocked.toString());
  }, [keywordsLocked]);

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

  useEffect(() => {
    const handleKeywordTransfer = (event: Event) => {
      const customEvent = event as CustomEvent<{ keywords: string[] }>;
      const transferredKeywords = customEvent.detail.keywords;
      const newKeywords = Array(13).fill('');
      transferredKeywords.forEach((keyword, index) => {
        if (index < 13) {
          newKeywords[index] = keyword;
        }
      });
      setKeywords(newKeywords);
    };

    const handleTitleTransfer = (event: Event) => {
      const customEvent = event as CustomEvent<{ titles: string[] }>;
      const transferredTitles = customEvent.detail.titles;
      const newTitles = Array(4).fill('');
      transferredTitles.forEach((title, index) => {
        if (index < 4) {
          newTitles[index] = title;
        }
      });
      setTitleAreas(newTitles);
    };

    document.addEventListener('transferKeywords', handleKeywordTransfer);
    document.addEventListener('transferTitles', handleTitleTransfer);
    
    return () => {
      document.removeEventListener('transferKeywords', handleKeywordTransfer);
      document.removeEventListener('transferTitles', handleTitleTransfer);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Text Features</DialogTitle>
        <ScrollArea className="h-full pr-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="grid grid-cols-3 gap-4 p-4">
            {/* Keywords Block */}
            <div className="flex flex-col h-full border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Keywords</h2>
                <Button 
                  onClick={() => {
                    setKeywordsLocked(!keywordsLocked);
                    toast({
                      description: keywordsLocked ? "Keywords unlocked" : "Keywords locked",
                    });
                  }}
                  variant={keywordsLocked ? "destructive" : "default"}
                  size="sm"
                >
                  {keywordsLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
                      <Textarea
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        placeholder=""
                        className="w-[200px] h-[50px] min-h-[50px] resize-none"
                        disabled={keywordsLocked}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Title Block */}
            <div className="flex flex-col h-full border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Title</h2>
                <Button 
                  onClick={() => {
                    setTitlesLocked(!titlesLocked);
                    toast({
                      description: titlesLocked ? "Titles unlocked" : "Titles locked",
                    });
                  }}
                  variant={titlesLocked ? "destructive" : "default"}
                  size="sm"
                >
                  {titlesLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {titleAreas.map((text, index) => (
                    <Textarea
                      key={index}
                      value={text}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      placeholder=""
                      className="w-[200px] h-[50px] min-h-[50px] resize-none"
                      disabled={titlesLocked}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Description Block */}
            <div className="flex flex-col h-full border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Description</h2>
                <Button 
                  onClick={() => {
                    setDescriptionsLocked(!descriptionsLocked);
                    toast({
                      description: descriptionsLocked ? "Descriptions unlocked" : "Descriptions locked",
                    });
                  }}
                  variant={descriptionsLocked ? "destructive" : "default"}
                  size="sm"
                >
                  {descriptionsLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {descriptionAreas.map((text, index) => (
                    <Textarea
                      key={index}
                      value={text}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder=""
                      className="w-[200px] h-[50px] min-h-[50px] resize-none"
                      disabled={descriptionsLocked}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}