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
}

export function CategorySection({ subcategories, activeDropdown, onDropdownToggle }: CategorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {subcategories.map((subcategory) => (
          <div key={subcategory.name} className="relative">
            <SubcategoryButton
              name={subcategory.name}
              onClick={() => onDropdownToggle(subcategory.name)}
            />
            
            {activeDropdown === subcategory.name && (
              <KeywordList
                keywords={subcategory.keywords}
                subcategoryName={subcategory.name}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}