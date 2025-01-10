import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INITIAL_DATA } from '@/config/keywordData';

interface AllKeywordsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllKeywordsDialog({ open, onOpenChange }: AllKeywordsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>All Keywords</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_DATA.map((category) => (
              <div key={category.id} className="space-y-2">
                <h3 className="font-bold text-lg text-black">{category.name}</h3>
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.name} className="space-y-1">
                    <h4 className="font-semibold text-sm text-black">{subcategory.name}</h4>
                    <ul className="space-y-1">
                      {subcategory.keywords.map((keyword) => (
                        <li
                          key={keyword}
                          className="px-2 py-1 bg-gray-50 rounded-md text-sm text-black"
                        >
                          {keyword}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}