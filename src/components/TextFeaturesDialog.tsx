import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KeywordsSection } from "./text-features/KeywordsSection";
import { TitleSection } from "./text-features/TitleSection";
import { DescriptionSection } from "./text-features/DescriptionSection";
import { TextFeaturesHeader } from "./text-features/TextFeaturesHeader";
import { DownloadSection } from "./text-features/DownloadSection";
import { useTextFeatures } from "./text-features/useTextFeatures";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DESCRIPTION_PREFIX, DESCRIPTION_MIDDLE, DESCRIPTION_SUFFIX } from "@/constants/textDefaults";

interface TextFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TextFeaturesDialog({ open, onOpenChange }: TextFeaturesDialogProps) {
  const {
    syncEnabled,
    setSyncEnabled,
    keywords,
    setKeywords,
    keywordsLocked,
    setKeywordsLocked,
    titleAreas,
    setTitleAreas,
    titlesLocked,
    setTitlesLocked,
    descriptionAreas,
    setDescriptionAreas,
    descriptionsLocked,
    setDescriptionsLocked,
    clearAll,
    isAnyUnlocked,
    handleLockAll,
    toast
  } = useTextFeatures();

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

  const handleToggle = (enabled: boolean) => {
    setSyncEnabled(enabled);
    toast({
      description: enabled ? "Title-Description sync enabled" : "Title-Description sync disabled",
    });
  };

  const handleAdd2Go = () => {
    if (!keywordsLocked || !titlesLocked || !descriptionsLocked) {
      toast({
        description: "All sections must be locked before adding to GO",
        variant: "destructive"
      });
      return;
    }

    // Get non-empty keywords
    const nonEmptyKeywords = keywords.filter(k => k.trim() !== '');
    
    // Get combined title
    const combinedTitle = titleAreas
      .filter(t => t.trim() !== '')
      .join(', ') + " Tv Frame Art, Television picture frame, Canvas, samsung frame tv,";

    // Get combined description with complete text
    const combinedDescription = `${DESCRIPTION_PREFIX}${descriptionAreas
      .filter(d => d.trim() !== '')
      .join(', ')}${DESCRIPTION_MIDDLE}${DESCRIPTION_SUFFIX}`;

    // Dispatch event to add files to GO pipeline
    const event = new CustomEvent('addTextFiles', {
      detail: {
        keywords: nonEmptyKeywords,
        title: combinedTitle,
        description: combinedDescription
      }
    });
    document.dispatchEvent(event);

    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Text Features</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your keywords, titles, and descriptions
        </DialogDescription>
        <TextFeaturesHeader 
          isEnabled={syncEnabled} 
          onToggle={handleToggle}
          onClearAll={clearAll}
          isAnyUnlocked={isAnyUnlocked}
          onLockAll={handleLockAll}
          onAdd2Go={handleAdd2Go}
        />
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
        <div className="absolute bottom-4 right-4">
          <DownloadSection
            keywords={keywords}
            titles={titleAreas}
            descriptions={descriptionAreas}
            keywordsLocked={keywordsLocked}
            titlesLocked={titlesLocked}
            descriptionsLocked={descriptionsLocked}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
