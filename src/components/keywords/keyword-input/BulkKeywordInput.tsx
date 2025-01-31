import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BulkKeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onFill: () => void;
  isLocked: boolean;
}

export function BulkKeywordInput({ 
  value, 
  onChange, 
  onFill, 
  isLocked 
}: BulkKeywordInputProps) {
  return (
    <div className="mt-4 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste up to 13 keywords, separated by commas"
        className="min-h-[80px]"
        disabled={isLocked}
      />
      <div className="flex justify-between gap-2">
        <Button
          onClick={onFill}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          disabled={isLocked}
        >
          FILL13
        </Button>
      </div>
    </div>
  );
}