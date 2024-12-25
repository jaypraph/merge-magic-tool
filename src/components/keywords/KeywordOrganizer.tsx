import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';
import { INITIAL_DATA } from '@/config/keywordData';

export function KeywordOrganizer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    setActiveDropdown(null);
  };

  const toggleDropdown = (subcategoryName: string) => {
    setActiveDropdown(activeDropdown === subcategoryName ? null : subcategoryName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        {INITIAL_DATA.map((category) => (
          <CategoryButton
            key={category.id}
            name={category.name}
            isActive={activeCategory === category.id}
            onClick={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {INITIAL_DATA.map((category) => (
        <div
          key={category.id}
          className={`space-y-4 transition-all duration-300 ${
            activeCategory === category.id ? 'block' : 'hidden'
          }`}
        >
          <CategorySection
            subcategories={category.subcategories}
            activeDropdown={activeDropdown}
            onDropdownToggle={toggleDropdown}
          />
        </div>
      ))}
    </div>
  );
}