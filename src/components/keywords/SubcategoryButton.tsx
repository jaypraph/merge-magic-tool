import React from 'react';

interface SubcategoryButtonProps {
  name: string;
  keywordCount: number;
  onClick: () => void;
}

export function SubcategoryButton({ name, keywordCount, onClick }: SubcategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-colors duration-200 font-medium flex justify-between items-center"
    >
      <span className="text-black">{name}</span>
      <span className="text-sm bg-gray-200 px-2 py-1 rounded-full text-black">{keywordCount}</span>
    </button>
  );
}