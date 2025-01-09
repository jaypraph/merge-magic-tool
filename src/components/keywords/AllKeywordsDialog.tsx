import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INITIAL_DATA } from '@/config/keywordData';
import { SubcategoryButton } from './SubcategoryButton';
import { KeywordList } from './KeywordList';

interface AllKeywordsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllKeywordsDialog({ open, onOpenChange }: AllKeywordsDialogProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten all subcategories and keywords for easier access
  const allSubcategories = INITIAL_DATA.flatMap(category => 
    category.subcategories.map(sub => ({
      ...sub,
      categoryName: category.name
    }))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>All Keywords</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSubcategories.map((subcategory) => (
              <div key={`${subcategory.categoryName}-${subcategory.name}`}>
                <SubcategoryButton
                  name={`${subcategory.categoryName} - ${subcategory.name}`}
                  keywordCount={subcategory.keywords.length}
                  onClick={() => setActiveSubcategory(subcategory.name)}
                />
                
                <KeywordList
                  keywords={subcategory.keywords}
                  subcategoryName={subcategory.name}
                  searchTerm={searchTerm}
                  autoFillEnabled={true}
                  isOpen={activeSubcategory === subcategory.name}
                  onClose={() => setActiveSubcategory(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}