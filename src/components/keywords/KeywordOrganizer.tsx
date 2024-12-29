import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';
import { INITIAL_DATA } from '@/config/keywordData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { KeywordInputDialog } from './KeywordInputDialog';

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
    <div className="p-6 flex justify-center items-start">
      <div className="border-2 border-gray-300 rounded-lg p-4 w-full max-w-6xl">
        {/* Top Search and Counter Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1"></div>
          <div 
            className="inline-flex items-center justify-center bg-black rounded-md 
                     h-14 w-20 text-2xl font-bold mb-4"
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

        {/* Keyword Input Button and AutoFill Switch */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Button
            onClick={() => setIsKeywordInputOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-20 h-20 rounded-full"
          >
            13
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm">AutoFill</span>
            <Switch
              checked={autoFillEnabled}
              onCheckedChange={setAutoFillEnabled}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
          {/* Primary Categories Column */}
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <Button
              onClick={() => toggleCategoryGroup('primary')}
              className={`w-full mb-4 ${activeCategoryGroup === 'primary' 
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
                onDropdownToggle={toggleDropdown}
                searchTerm={searchQuery}
                autoFillEnabled={autoFillEnabled}
                onKeywordSelect={(keyword) => {
                  if (autoFillEnabled) {
                    // Handle autofill logic here
                    toast({
                      description: `Keyword "${keyword}" selected for autofill`,
                    });
                  }
                }}
              />
            )}
          </div>

          {/* Secondary Categories Column */}
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <Button
              onClick={() => toggleCategoryGroup('secondary')}
              className={`w-full mb-4 ${activeCategoryGroup === 'secondary' 
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