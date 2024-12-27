import React from 'react';
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  name: string;
  keywordCount: number;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryButton({ name, keywordCount, isActive, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform flex items-center gap-2",
        isActive 
          ? "bg-green-700 shadow-none scale-95"
          : "bg-green-500 shadow-lg hover:shadow-xl hover:bg-green-600"
      )}
    >
      <span className="text-white">{name}</span>
      <span className="bg-white inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-sm text-black">
        {keywordCount}
      </span>
    </button>
  );
}