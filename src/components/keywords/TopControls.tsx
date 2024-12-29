import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface TopControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  totalKeywords: number;
  autoFillEnabled: boolean;
  setAutoFillEnabled: (enabled: boolean) => void;
  onKeywordInputOpen: () => void;
}

export function TopControls({
  searchTerm,
  onSearchTermChange,
  onSearch,
  totalKeywords,
  autoFillEnabled,
  setAutoFillEnabled,
  onKeywordInputOpen,
}: TopControlsProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center gap-4">
        {/* 13 Button */}
        <Button
          onClick={onKeywordInputOpen}
          className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold"
        >
          13
        </Button>

        {/* Counter */}
        <div className="flex flex-col items-center">
          <div 
            className="inline-flex items-center justify-center bg-black rounded-md 
                     h-14 w-20 text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Digital-7 Mono', monospace",
              color: '#0FA0CE',
            }}
          >
            {totalKeywords}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">AutoFill</span>
            <Switch
              checked={autoFillEnabled}
              onCheckedChange={setAutoFillEnabled}
            />
          </div>
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
    </div>
  );
}