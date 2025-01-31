import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeywordInputFieldProps {
  index: number;
  keyword: string;
  onChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  isLocked: boolean;
}

export function KeywordInputField({ 
  index, 
  keyword, 
  onChange, 
  onDelete, 
  isLocked 
}: KeywordInputFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
      <Input
        value={keyword}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Keyword ${index + 1}`}
        maxLength={20}
        className="text-sm"
        disabled={isLocked}
      />
      <Button
        onClick={() => onDelete(index)}
        className="rounded-full w-6 h-6 p-0 bg-black hover:bg-gray-800 text-xs"
        disabled={isLocked}
      >
        D
      </Button>
    </div>
  );
}