import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface KeywordInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeyword?: string;
}

export function KeywordInputDialog({ open, onOpenChange, selectedKeyword }: KeywordInputDialogProps) {
  const [keywords, setKeywords] = useState<string[]>(Array(13).fill(''));
  const { toast } = useToast();

  useEffect(() => {
    if (selectedKeyword) {
      const emptyIndex = keywords.findIndex(k => k === '');
      if (emptyIndex !== -1) {
        const newKeywords = [...keywords];
        newKeywords[emptyIndex] = selectedKeyword;
        setKeywords(newKeywords);
      }
    }
  }, [selectedKeyword]);

  const handleKeywordChange = (index: number, value: string) => {
    if (value.length <= 20) {
      const newKeywords = [...keywords];
      newKeywords[index] = value;
      setKeywords(newKeywords);
    }
  };

  const handleDelete = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords[index] = '';
    setKeywords(newKeywords);
  };

  const handleClearAll = () => {
    setKeywords(Array(13).fill(''));
    toast({
      description: "All keywords cleared!",
    });
  };

  const handleCopy = () => {
    const nonEmptyKeywords = keywords.filter(k => k.trim() !== '');
    if (nonEmptyKeywords.length > 0) {
      navigator.clipboard.writeText(nonEmptyKeywords.join('\n'))
        .then(() => {
          toast({
            description: "Keywords copied to clipboard!",
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            description: "Failed to copy keywords",
          });
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Keyword Input</DialogTitle>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
              <Input
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder={`Keyword ${index + 1}`}
                maxLength={20}
                className="text-sm"
              />
              <Button
                onClick={() => handleDelete(index)}
                className="rounded-full w-6 h-6 p-0 bg-black hover:bg-gray-800 text-xs"
              >
                D
              </Button>
            </div>
          ))}
          <Button
            onClick={handleCopy}
            className="w-full mt-4"
          >
            Copy All Keywords
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}