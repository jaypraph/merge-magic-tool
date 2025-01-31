import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeywordInputField } from './keyword-input/KeywordInputField';
import { BulkKeywordInput } from './keyword-input/BulkKeywordInput';
import { DialogHeader } from './keyword-input/DialogHeader';

interface KeywordInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeyword?: string;
}

export const keywordTransferEvent = new CustomEvent('transferKeywords', {
  detail: { keywords: [] as string[] }
}) as CustomEvent<{ keywords: string[] }>;

export function KeywordInputDialog({ open, onOpenChange, selectedKeyword }: KeywordInputDialogProps) {
  const [keywords, setKeywords] = useState<string[]>(Array(13).fill(''));
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

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
    const formattedValue = value.trim() && !value.endsWith(',') ? `${value},` : value;
    if (formattedValue.length <= 20) {
      const newKeywords = [...keywords];
      newKeywords[index] = formattedValue;
      setKeywords(newKeywords);
    }
  };

  const handleDelete = (index: number) => {
    if (isLocked) return;
    const newKeywords = [...keywords];
    newKeywords[index] = '';
    setKeywords(newKeywords);
    
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

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      transferKeywords();
    }
    toast({
      description: isLocked ? "Keywords unlocked" : "Keywords locked",
    });
  };

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

  const transferKeywords = () => {
    const nonEmptyKeywords = keywords.filter(k => k.trim() !== '');
    const transferEvent = new CustomEvent('transferKeywords', {
      detail: { keywords: nonEmptyKeywords }
    });
    document.dispatchEvent(transferEvent);
    toast({
      description: "Keywords transferred to Text Features!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader 
          isLocked={isLocked}
          onLockToggle={handleLockToggle}
          onClearAll={handleClearAll}
        />
        <DialogDescription>
          Enter up to 13 keywords below
        </DialogDescription>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {keywords.map((keyword, index) => (
            <KeywordInputField
              key={index}
              index={index}
              keyword={keyword}
              onChange={handleKeywordChange}
              onDelete={handleDelete}
              isLocked={isLocked}
            />
          ))}
          
          <BulkKeywordInput
            value={bulkKeywords}
            onChange={setBulkKeywords}
            onFill={handleFill13}
            isLocked={isLocked}
          />

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