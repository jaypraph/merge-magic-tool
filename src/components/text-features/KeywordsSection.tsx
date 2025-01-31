import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LockButton } from "./LockButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface KeywordsSectionProps {
  keywords: string[];
  isLocked: boolean;
  onKeywordChange: (index: number, value: string) => void;
  onLockToggle: () => void;
}

export function KeywordsSection({ 
  keywords, 
  isLocked, 
  onKeywordChange, 
  onLockToggle 
}: KeywordsSectionProps) {
  const [bulkKeywords, setBulkKeywords] = useState('');
  const { toast } = useToast();

  const handleFill13 = () => {
    if (isLocked) return;
    
    const keywordArray = bulkKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k !== '')
      .slice(0, 13);

    if (keywordArray.length > 13) {
      toast({
        variant: "destructive",
        description: "Maximum 13 keywords allowed",
      });
      return;
    }

    keywordArray.forEach((keyword, index) => {
      if (keyword.length <= 20) {
        onKeywordChange(index, keyword);
      }
    });

    toast({
      description: `${keywordArray.length} keywords filled!`,
    });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Keywords</h2>
        <LockButton isLocked={isLocked} onToggle={onLockToggle} />
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
              <Textarea
                value={keyword}
                onChange={(e) => onKeywordChange(index, e.target.value)}
                placeholder=""
                className="w-[200px] h-[50px] min-h-[50px] resize-none"
                disabled={isLocked}
              />
            </div>
          ))}
          
          <div className="mt-4 space-y-2">
            <Textarea
              value={bulkKeywords}
              onChange={(e) => setBulkKeywords(e.target.value)}
              placeholder="Paste up to 13 keywords, separated by commas"
              className="min-h-[80px]"
              disabled={isLocked}
            />
            <Button
              onClick={handleFill13}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLocked}
            >
              FILL13
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}