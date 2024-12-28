import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';
import { INITIAL_DATA } from '@/config/keywordData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KeywordOrganizer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategoryGroup, setActiveCategoryGroup] = useState<'primary' | 'secondary' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const primaryCategories = INITIAL_DATA.slice(0, 12); // Landscapes to Cityscape
  const secondaryCategories = INITIAL_DATA.slice(12); // Greece to Other

  const findKeywordInCategory = (category: any) => {
    return category.subcategories.some(sub => 
      sub.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const findKeywordInSubcategory = (subcategory: any) => {
    return subcategory.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

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

  const toggleCategoryGroup = (group: 'primary' | 'secondary') => {
    setActiveCategoryGroup(activeCategoryGroup === group ? null : group);
  };

  const shouldHighlightPrimary = searchQuery && primaryCategories.some(findKeywordInCategory);
  const shouldHighlightSecondary = searchQuery && secondaryCategories.some(findKeywordInCategory);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1"></div>
        <div 
          className="inline-flex items-center justify-center bg-black rounded-md 
                     h-14 w-20 text-2xl font-bold"
          style={{
            fontFamily: "'Digital-7 Mono', monospace",
            color: '#0FA0CE',
          }}
        >
          {totalKeywords}
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-full border rounded-md"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            GO
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => toggleCategoryGroup('primary')}
          className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform
                     ${activeCategoryGroup === 'primary' 
                       ? 'bg-blue-700 shadow-none scale-95 translate-y-0.5'
                       : 'bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 hover:scale-105'}
                     ${shouldHighlightPrimary ? 'ring-4 ring-yellow-400' : ''}`}
          style={{
            boxShadow: activeCategoryGroup === 'primary'
              ? 'none'
              : '0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 15px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-white">PRIMARY</span>
        </button>
        <button
          onClick={() => toggleCategoryGroup('secondary')}
          className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform
                     ${activeCategoryGroup === 'secondary'
                       ? 'bg-blue-700 shadow-none scale-95 translate-y-0.5'
                       : 'bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 hover:scale-105'}
                     ${shouldHighlightSecondary ? 'ring-4 ring-yellow-400' : ''}`}
          style={{
            boxShadow: activeCategoryGroup === 'secondary'
              ? 'none'
              : '0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 15px rgba(0, 0, 0, 0.1), 0 -2px 4px rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-white">SECONDARY</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {activeCategoryGroup === 'primary' && primaryCategories.map((category) => (
          <CategoryButton
            key={category.id}
            name={category.name}
            keywordCount={calculateCategoryKeywordCount(category.id)}
            isActive={activeCategory === category.id}
            onClick={() => toggleCategory(category.id)}
            isHighlighted={searchQuery && findKeywordInCategory(category)}
          />
        ))}
        {activeCategoryGroup === 'secondary' && secondaryCategories.map((category) => (
          <CategoryButton
            key={category.id}
            name={category.name}
            keywordCount={calculateCategoryKeywordCount(category.id)}
            isActive={activeCategory === category.id}
            onClick={() => toggleCategory(category.id)}
            isHighlighted={searchQuery && findKeywordInCategory(category)}
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
              searchTerm={searchQuery}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}