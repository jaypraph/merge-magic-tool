import React from 'react';
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  name: string;
  keywordCount: number;
  isActive: boolean;
  isHighlighted?: boolean;
  isAdded?: boolean;
  onClick: () => void;
}

export function CategoryButton({ 
  name, 
  keywordCount, 
  isActive, 
  isHighlighted,
  isAdded,
  onClick 
}: CategoryButtonProps) {
  const displayName = name === "RED POPPIES WHITE DAISIES" ? "RED P. WHITE D." : name;

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 font-semibold rounded-lg transition-all duration-300 transform text-sm",
        "hover:-translate-y-1 hover:scale-105",
        isActive 
          ? "shadow-none scale-95 translate-y-0.5"
          : "hover:bg-opacity-90",
        isHighlighted && "ring-4 ring-yellow-400",
        isAdded 
          ? "bg-orange-500 hover:bg-orange-600" 
          : "bg-green-500 hover:bg-green-600"
      )}
      style={{
        boxShadow: isActive 
          ? 'none'
          : '0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 15px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(255, 255, 255, 0.1), 0 12px 20px rgba(0, 150, 0, 0.2)',
        transform: `perspective(1000px) ${isActive ? 'translateZ(0px)' : 'translateZ(10px)'}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-white relative z-10">{displayName}</span>
        <span 
          className="bg-white inline-flex items-center justify-center h-4 min-w-4 px-1 
                     rounded-full text-xs text-black relative z-10"
        >
          {keywordCount}
        </span>
      </div>
    </button>
  );
}