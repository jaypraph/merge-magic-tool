import { Category } from './categories/types';
import { landscapesCategory } from './categories/landscapes';
import { christmasCategory } from './categories/christmas';
import { stillLifeCategory } from './categories/stilllife';
import { halloweenCategory } from './categories/halloween';
import { flowersCategory } from './categories/flowers';
import { rosesCategory } from './categories/roses';
import { treesCategory } from './categories/trees';
import { abstractCategory } from './categories/abstract';
import { poppiesDaisiesCategory } from './categories/poppies-daisies';
import { seascapesCategory } from './categories/seascapes';
import { valentinesCategory } from './categories/valentines';
import { cityscapeCategory } from './categories/cityscape';
import { greeceCategory } from './categories/greece';
import { greenFnCategory } from './categories/green-fn';

export type { Category, Subcategory } from './categories/types';

export const INITIAL_DATA: Category[] = [
  landscapesCategory,
  christmasCategory,
  stillLifeCategory,
  halloweenCategory,
  flowersCategory,
  rosesCategory,
  treesCategory,
  abstractCategory,
  poppiesDaisiesCategory,
  seascapesCategory,
  valentinesCategory,
  cityscapeCategory,
  greeceCategory,
  greenFnCategory
];