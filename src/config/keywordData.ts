import { Category } from './categories/types';
import { landscapesCategory } from './categories/landscapes';
import { christmasCategory } from './categories/christmas';
import { stillLifeCategory } from './categories/stilllife';

export type { Category, Subcategory } from './categories/types';

export const INITIAL_DATA: Category[] = [
  landscapesCategory,
  christmasCategory,
  stillLifeCategory
];