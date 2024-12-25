import React from 'react';
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryButton({ name, isActive, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform",
        isActive 
          ? "bg-green-700 shadow-none scale-95"
          : "bg-green-500 shadow-lg hover:shadow-xl hover:bg-green-600"
      )}
    >
      {name}
    </button>
  );
}