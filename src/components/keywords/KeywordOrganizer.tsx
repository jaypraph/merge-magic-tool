import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';
import { INITIAL_DATA } from '@/config/keywordData';
import { KeywordInputDialog } from './KeywordInputDialog';
import { TopControls } from './TopControls';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export function KeywordOrganizer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isKeywordInputOpen, setIsKeywordInputOpen] = useState(false);
  const [activeCategoryGroup, setActiveCategoryGroup] = useState<'primary' | 'secondary' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoFillEnabled, setAutoFillEnabled] = useState(false);
  const { toast } = useToast();

  const primaryCategories = INITIAL_DATA.slice(0, 12);
  const secondaryCategories = INITIAL_DATA.slice(12);

  const findKeywordInCategory = (category: any) => {
    return category.subcategories.some(sub => 
      sub.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
    <div className="p-6 flex justify-center items-start">
      <div className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-6xl">
        <TopControls
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          totalKeywords={totalKeywords}
          autoFillEnabled={autoFillEnabled}
          setAutoFillEnabled={setAutoFillEnabled}
          onKeywordInputOpen={() => setIsKeywordInputOpen(true)}
        />

        {/* Main Layout */}
        <div className="grid grid-cols-[1fr_3fr_1fr] gap-4">
          {/* Primary Categories Column */}
          <div className="border-2 border-gray-300 rounded-lg p-2">
            <Button
              onClick={() => toggleCategoryGroup('primary')}
              className={`w-full mb-2 ${activeCategoryGroup === 'primary' 
                ? 'bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'}
                ${shouldHighlightPrimary ? 'ring-4 ring-yellow-400' : ''}`}
            >
              PRIMARY
            </Button>
            {activeCategoryGroup === 'primary' && (
              <div className="space-y-2">
                {primaryCategories.map((category) => (
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
            )}
          </div>

          {/* Central Content Area */}
          <div className="border-2 border-gray-300 rounded-lg p-4">
            {activeCategoryData && (
              <CategorySection
                subcategories={activeCategoryData.subcategories}
                activeDropdown={activeDropdown}
                onDropdownToggle={setActiveDropdown}
                searchTerm={searchQuery}
                autoFillEnabled={autoFillEnabled}
                onKeywordSelect={(keyword) => {
                  if (autoFillEnabled) {
                    toast({
                      description: `Keyword "${keyword}" selected for autofill`,
                    });
                  }
                }}
              />
            )}
          </div>

          {/* Secondary Categories Column */}
          <div className="border-2 border-gray-300 rounded-lg p-2">
            <Button
              onClick={() => toggleCategoryGroup('secondary')}
              className={`w-full mb-2 ${activeCategoryGroup === 'secondary' 
                ? 'bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'}
                ${shouldHighlightSecondary ? 'ring-4 ring-yellow-400' : ''}`}
            >
              SECONDARY
            </Button>
            {activeCategoryGroup === 'secondary' && (
              <div className="space-y-2">
                {secondaryCategories.map((category) => (
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
            )}
          </div>
        </div>

        {/* Keyword Input Dialog */}
        <KeywordInputDialog
          open={isKeywordInputOpen}
          onOpenChange={setIsKeywordInputOpen}
        />
      </div>
    </div>
  );
}