import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';
import { INITIAL_DATA } from '@/config/keywordData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function KeywordOrganizer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsDialogOpen(true);
    setActiveDropdown(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setActiveCategory(null);
    }
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

  const activeCategoryData = INITIAL_DATA.find(cat => cat.id === activeCategory);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center mb-8">
        <div 
          className="inline-flex items-center justify-center bg-white rounded-full 
                     h-12 w-12 text-lg font-bold text-black border-2 border-black
                     shadow-lg transform transition-all duration-300
                     hover:scale-105"
          style={{
            boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.1),
              0 8px 12px rgba(0, 0, 0, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.5)
            `,
            textShadow: `
              0px 1px 1px rgba(255, 255, 255, 0.5),
              0px -1px 1px rgba(0, 0, 0, 0.3)
            `,
            transform: 'translateY(-2px)',
          }}
        >
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

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              {activeCategoryData?.name}
            </DialogTitle>
          </DialogHeader>
          
          {activeCategoryData && (
            <CategorySection
              subcategories={activeCategoryData.subcategories}
              activeDropdown={activeDropdown}
              onDropdownToggle={toggleDropdown}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}