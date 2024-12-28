import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface KeywordListProps {
  keywords: string[];
  subcategoryName: string;
  searchTerm: string;
}

export function KeywordList({ keywords, subcategoryName, searchTerm }: KeywordListProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const { toast } = useToast();

  const handleKeywordClick = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setSelectedKeyword(keyword);
      toast({
        description: "Keyword copied to clipboard!",
        duration: 2000,
      });

      setTimeout(() => {
        setSelectedKeyword(null);
      }, 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy keyword",
        duration: 2000,
      });
    }
  };

  const highlightSearchTerm = (keyword: string) => {
    if (!searchTerm) return keyword;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = keyword.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
    );
  };

  return (
    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold mb-2 text-black">{subcategoryName} Keywords:</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {keywords.map((keyword) => (
          <li
            key={keyword}
            onClick={() => handleKeywordClick(keyword)}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all duration-200
                      ${selectedKeyword === keyword 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
          >
            {highlightSearchTerm(keyword)}
          </li>
        ))}
      </ul>
    </div>
  );
}