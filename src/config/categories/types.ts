export interface Subcategory {
  name: string;
  keywords: string[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}