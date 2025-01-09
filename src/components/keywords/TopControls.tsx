import React, { useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AllKeywordsDialog } from './AllKeywordsDialog';

interface TopControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  totalKeywords: number;
  autoFillEnabled: boolean;
  setAutoFillEnabled: (enabled: boolean) => void;
  onKeywordInputOpen: () => void;
  onAddKeywords?: (keywords: string[]) => void;
  keywordCount: number;
  setKeywordCount: (count: number) => void;
  onAllClick: () => void;
}

export function TopControls({
  searchTerm,
  onSearchTermChange,
  onSearch,
  totalKeywords,
  autoFillEnabled,
  setAutoFillEnabled,
  onKeywordInputOpen,
  onAddKeywords,
  keywordCount,
  setKeywordCount,
  onAllClick,
}: TopControlsProps) {
  const [isAddTagsOpen, setIsAddTagsOpen] = useState(false);
  const [newKeywords, setNewKeywords] = useState('');
  const [isAllKeywordsOpen, setIsAllKeywordsOpen] = useState(false);
  const { toast } = useToast();

  const handleAddKeywords = () => {
    const keywords = newKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k !== '' && k.length <= 20);

    if (keywords.length > 0 && onAddKeywords) {
      onAddKeywords(keywords);
      setNewKeywords('');
      setIsAddTagsOpen(false);
      toast({
        description: `${keywords.length} keywords added successfully!`,
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2">
          {/* 13 Button */}
          <Button
            onClick={onKeywordInputOpen}
            className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 
                     shadow-[0_2px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-none p-0"
          >
            <span className="text-xs text-white">13</span>
          </Button>
          
          {/* All Button */}
          <Button
            onClick={onAllClick}
            className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 
                     shadow-[0_2px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-none p-0"
          >
            <span className="text-xs text-white">All</span>
          </Button>
        </div>

        {/* Counter and Controls */}
        <div className="flex items-center gap-4">
          {!autoFillEnabled ? (
            <Button
              onClick={onKeywordInputOpen}
              className="inline-flex items-center justify-center bg-black rounded-full 
                       h-14 px-6 text-2xl font-bold transition-all duration-200
                       shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,150,0,0.1)]
                       hover:shadow-none active:transform active:translate-y-1"
              style={{
                fontFamily: "'Digital-7 Mono', monospace",
                color: 'hsl(144 100% 50%)',
                textShadow: `0 0 10px hsl(144 100% 50% / 0.5),
                            0 0 20px hsl(144 100% 50% / 0.3),
                            0 0 30px hsl(144 100% 50% / 0.2)`,
                border: '2px solid hsl(144 100% 50%)',
                boxShadow: `0 0 10px hsl(144 100% 50% / 0.2),
                           0 0 20px hsl(144 100% 50%)`
              }}
            >
              {totalKeywords}
            </Button>
          ) : (
            <Button
              onClick={onKeywordInputOpen}
              className="inline-flex items-center justify-center bg-black rounded-full 
                       h-14 px-6 text-2xl font-bold transition-all duration-200
                       hover:shadow-none active:transform active:translate-y-1"
              style={{
                fontFamily: "'Digital-7 Mono', monospace",
                color: 'hsl(144 100% 50%)',
                textShadow: `0 0 10px hsl(144 100% 50% / 0.5)`,
                border: '2px solid hsl(144 100% 50%)',
              }}
            >
              {keywordCount}
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Switch
              checked={autoFillEnabled}
              onCheckedChange={(checked) => {
                setAutoFillEnabled(checked);
                if (!checked) {
                  setKeywordCount(0);
                }
              }}
            />
            <span className="text-sm">AutoFill</span>
          </div>
          <Button
            onClick={() => setIsAddTagsOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm"
          >
            ADD TAGS
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-8 pr-4 py-2 w-full border rounded-md"
            />
          </div>
          <Button 
            onClick={onSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            GO
          </Button>
        </div>
      </div>

      {/* Add Tags Dialog */}
      <Dialog open={isAddTagsOpen} onOpenChange={setIsAddTagsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Keywords</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas (max 20 characters each)"
              className="min-h-[200px]"
            />
            <Button
              onClick={handleAddKeywords}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              ADD
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* All Keywords Dialog */}
      <AllKeywordsDialog
        open={isAllKeywordsOpen}
        onOpenChange={setIsAllKeywordsOpen}
      />
    </div>
  );
}