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

  const calculateCategoryKeywordCount = (categoryId: string) => {
    const category = INITIAL_DATA.find(cat => cat.id === categoryId);
    if (!category) return 0;
    return category.subcategories.reduce((total, sub) => total + sub.keywords.length, 0);
  };

  const totalKeywords = INITIAL_DATA.reduce((total, category) => {
    return total + calculateCategoryKeywordCount(category.id);
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center justify-center bg-white rounded-full h-8 w-8 text-sm font-medium text-black">
          {totalKeywords}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {INITIAL_DATA.map((category) => (
          <CategoryButton
            key={category.id}
            name={category.name}
            keywordCount={calculateCategoryKeywordCount(category.id)}
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