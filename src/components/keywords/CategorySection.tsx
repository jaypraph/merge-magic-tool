import React from 'react';
import { SubcategoryButton } from './SubcategoryButton';
import { KeywordList } from './KeywordList';

interface Subcategory {
  name: string;
  keywords: string[];
}

interface CategorySectionProps {
  subcategories: Subcategory[];
  activeDropdown: string | null;
  onDropdownToggle: (name: string) => void;
  searchTerm: string;
}

export function CategorySection({ subcategories, activeDropdown, onDropdownToggle, searchTerm }: CategorySectionProps) {
  const totalKeywords = subcategories.reduce((total, sub) => total + sub.keywords.length, 0);

  const findKeywordInSubcategory = (subcategory: Subcategory) => {
    return subcategory.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-black">Total Keywords: {totalKeywords}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subcategories.map((subcategory) => (
          <div key={subcategory.name} className="relative">
            <SubcategoryButton
              name={subcategory.name}
              keywordCount={subcategory.keywords.length}
              onClick={() => onDropdownToggle(subcategory.name)}
              isHighlighted={searchTerm && findKeywordInSubcategory(subcategory)}
            />
            
            {activeDropdown === subcategory.name && (
              <KeywordList
                keywords={subcategory.keywords}
                subcategoryName={subcategory.name}
                searchTerm={searchTerm}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}