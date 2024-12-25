import React from 'react';

interface SubcategoryButtonProps {
  name: string;
  onClick: () => void;
}

export function SubcategoryButton({ name, onClick }: SubcategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-colors duration-200 font-medium"
    >
      {name}
    </button>
  );
}