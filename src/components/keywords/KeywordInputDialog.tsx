import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Unlock } from "lucide-react";

interface KeywordInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeyword?: string;
}

export function KeywordInputDialog({ open, onOpenChange, selectedKeyword }: KeywordInputDialogProps) {
  const [keywords, setKeywords] = useState<string[]>(Array(13).fill(''));
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedKeyword && !isLocked) {
      const emptyIndex = keywords.findIndex(k => k === '');
      if (emptyIndex !== -1) {
        const newKeywords = [...keywords];
        newKeywords[emptyIndex] = selectedKeyword;
        setKeywords(newKeywords);
        showKeywordCounter(emptyIndex + 1);
      }
    }
  }, [selectedKeyword, isLocked]);

  const showKeywordCounter = (number: number) => {
    const cursor = document.createElement('div');
    cursor.textContent = number.toString();
    cursor.style.position = 'fixed';
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    cursor.style.backgroundColor = 'hsl(144 100% 50%)';
    cursor.style.color = 'black';
    cursor.style.padding = '4px 8px';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    document.body.appendChild(cursor);

    const updatePosition = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX + 15}px`;
      cursor.style.top = `${e.clientY + 15}px`;
    };

    document.addEventListener('mousemove', updatePosition);

    setTimeout(() => {
      document.removeEventListener('mousemove', updatePosition);
      cursor.remove();
    }, 2000);
  };

  const handleKeywordChange = (index: number, value: string) => {
    if (isLocked) return;
    if (value.length <= 20) {
      const newKeywords = [...keywords];
      newKeywords[index] = value;
      setKeywords(newKeywords);
    }
  };

  const handleDelete = (index: number) => {
    if (isLocked) return;
    const newKeywords = [...keywords];
    newKeywords[index] = '';
    setKeywords(newKeywords);
    
    // Update counter for remaining keywords
    const filledCount = newKeywords.filter(k => k !== '').length;
    if (filledCount > 0) {
      showKeywordCounter(filledCount);
    }
  };

  const handleClearAll = () => {
    if (isLocked) return;
    setKeywords(Array(13).fill(''));
    setBulkKeywords('');
    toast({
      description: "All keywords cleared!",
    });
  };

  const handleCopy = () => {
    const nonEmptyKeywords = keywords.filter(k => k.trim() !== '');
    if (nonEmptyKeywords.length > 0) {
      const formattedKeywords = nonEmptyKeywords.map(k => `${k},`).join('\n');
      navigator.clipboard.writeText(formattedKeywords)
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

    const newKeywords = Array(13).fill('');
    keywordArray.forEach((keyword, index) => {
      newKeywords[index] = keyword;
    });

    setKeywords(newKeywords);
    showKeywordCounter(keywordArray.length);
    toast({
      description: `${keywordArray.length} keywords filled!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Keyword Input</DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                setIsLocked(!isLocked);
                toast({
                  description: isLocked ? "Keywords unlocked" : "Keywords locked",
                });
              }}
              variant={isLocked ? "destructive" : "default"}
              size="sm"
            >
              {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleClearAll}
              disabled={isLocked}
            >
              Clear All
            </Button>
          </div>
        </DialogHeader>
        <DialogDescription>
          Enter up to 13 keywords below
        </DialogDescription>
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
                disabled={isLocked}
              />
              <Button
                onClick={() => handleDelete(index)}
                className="rounded-full w-6 h-6 p-0 bg-black hover:bg-gray-800 text-xs"
                disabled={isLocked}
              >
                D
              </Button>
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
            <div className="flex justify-between gap-2">
              <Button
                onClick={handleFill13}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={isLocked}
              >
                FILL13
              </Button>
            </div>
          </div>

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