import { Category } from './categories/types';
import { landscapesCategory } from './categories/landscapes';
import { christmasCategory } from './categories/christmas';
import { stillLifeCategory } from './categories/stilllife';
import { halloweenCategory } from './categories/halloween';
import { flowersCategory } from './categories/flowers';

export type { Category, Subcategory } from './categories/types';

export const INITIAL_DATA: Category[] = [
  landscapesCategory,
  christmasCategory,
  stillLifeCategory,
  halloweenCategory,
  flowersCategory
];