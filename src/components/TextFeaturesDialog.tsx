import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KeywordsSection } from "./text-features/KeywordsSection";
import { TitleSection } from "./text-features/TitleSection";
import { DescriptionSection } from "./text-features/DescriptionSection";
import { TextFeaturesHeader } from "./text-features/TextFeaturesHeader";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  const [syncEnabled, setSyncEnabled] = useState(() => {
    return localStorage.getItem('textFeatures.syncEnabled') === 'true';
  });

  // Keywords state with localStorage persistence
  const [keywords, setKeywords] = useState<string[]>(() => {
    const savedKeywords = localStorage.getItem('textFeatures.keywords');
    return savedKeywords ? JSON.parse(savedKeywords) : Array(13).fill('');
  });
  
  const [keywordsLocked, setKeywordsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.keywordsLocked') === 'true';
  });
  
  // Title state with localStorage persistence
  const [titleAreas, setTitleAreas] = useState<string[]>(() => {
    const savedTitles = localStorage.getItem('textFeatures.titles');
    return savedTitles ? JSON.parse(savedTitles) : Array(4).fill('');
  });
  const [titlesLocked, setTitlesLocked] = useState(false);
  
  // Description state with localStorage persistence
  const [descriptionAreas, setDescriptionAreas] = useState<string[]>(() => {
    const savedDescriptions = localStorage.getItem('textFeatures.descriptions');
    return savedDescriptions ? JSON.parse(savedDescriptions) : Array(4).fill('');
  });
  
  const [descriptionsLocked, setDescriptionsLocked] = useState(() => {
    return localStorage.getItem('textFeatures.descriptionsLocked') === 'true';
  });
  
  const { toast } = useToast();

  // Persist sync state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.syncEnabled', syncEnabled.toString());
  }, [syncEnabled]);

  // Sync titles to descriptions when sync is enabled
  useEffect(() => {
    if (syncEnabled && !descriptionsLocked) {
      setDescriptionAreas(titleAreas);
    }
  }, [syncEnabled, titleAreas, descriptionsLocked]);

  // Persist keywords and lock state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.keywords', JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem('textFeatures.keywordsLocked', keywordsLocked.toString());
  }, [keywordsLocked]);

  // Persist titles and lock state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.titles', JSON.stringify(titleAreas));
  }, [titleAreas]);

  useEffect(() => {
    localStorage.setItem('textFeatures.titlesLocked', titlesLocked.toString());
  }, [titlesLocked]);

  // Persist descriptions and lock state to localStorage
  useEffect(() => {
    localStorage.setItem('textFeatures.descriptions', JSON.stringify(descriptionAreas));
  }, [descriptionAreas]);

  useEffect(() => {
    localStorage.setItem('textFeatures.descriptionsLocked', descriptionsLocked.toString());
  }, [descriptionsLocked]);

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
      setTitlesLocked(true);
      toast({
        description: "Titles transferred and locked",
      });
    };

    const handleDescriptionTransfer = (event: Event) => {
      const customEvent = event as CustomEvent<{ descriptions: string[] }>;
      const transferredDescriptions = customEvent.detail.descriptions;
      const newDescriptions = Array(4).fill('');
      transferredDescriptions.forEach((description, index) => {
        if (index < 4) {
          newDescriptions[index] = description;
        }
      });
      setDescriptionAreas(newDescriptions);
      setDescriptionsLocked(true);
      toast({
        description: "Descriptions transferred and locked",
      });
    };

    document.addEventListener('transferKeywords', handleKeywordTransfer);
    document.addEventListener('transferTitles', handleTitleTransfer);
    document.addEventListener('transferDescriptions', handleDescriptionTransfer);
    
    return () => {
      document.removeEventListener('transferKeywords', handleKeywordTransfer);
      document.removeEventListener('transferTitles', handleTitleTransfer);
      document.removeEventListener('transferDescriptions', handleDescriptionTransfer);
    };
  }, [toast]);

  const handleToggle = (enabled: boolean) => {
    setSyncEnabled(enabled);
    toast({
      description: enabled ? "Title-Description sync enabled" : "Title-Description sync disabled",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Text Features</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your keywords, titles, and descriptions
        </DialogDescription>
        <TextFeaturesHeader isEnabled={syncEnabled} onToggle={handleToggle} />
        <ScrollArea className="h-full pr-4" style={{ scrollbarGutter: 'stable' }}>
          <div className="grid grid-cols-3 gap-4 p-4">
            <KeywordsSection
              keywords={keywords}
              isLocked={keywordsLocked}
              onKeywordChange={handleKeywordChange}
              onLockToggle={() => {
                setKeywordsLocked(!keywordsLocked);
                toast({
                  description: keywordsLocked ? "Keywords unlocked" : "Keywords locked",
                });
              }}
            />
            <TitleSection
              titles={titleAreas}
              isLocked={titlesLocked}
              onTitleChange={handleTitleChange}
              onLockToggle={() => {
                setTitlesLocked(!titlesLocked);
                toast({
                  description: titlesLocked ? "Titles unlocked" : "Titles locked",
                });
              }}
            />
            <DescriptionSection
              descriptions={descriptionAreas}
              isLocked={descriptionsLocked}
              onDescriptionChange={handleDescriptionChange}
              onLockToggle={() => {
                setDescriptionsLocked(!descriptionsLocked);
                toast({
                  description: descriptionsLocked ? "Descriptions unlocked" : "Descriptions locked",
                });
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}