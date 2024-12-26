import { Category } from './types';

export const alcoholCategory: Category = {
  id: 'alcohol',
  name: 'ALCOHOL',
  subcategories: [
    {
      name: 'Venues & Establishments',
      keywords: [
        'bar', 'sports bar', 'cocktail bar', 'rooftops', 'wine bar',
        'liquor store'
      ]
    },
    {
      name: 'Beverages',
      keywords: [
        'alcohol', 'beer', 'cocktail', 'tequila', 'shot',
        'casamigos tequila'
      ]
    },
    {
      name: 'Cocktail Varieties',
      keywords: [
        'mojito', 'margarita', 'moscow mule', 'pina colada',
        'negroni', 'paloma', 'tequila sunrise'
      ]
    },
    {
      name: 'Display Technology',
      keywords: [
        'samsung frame tv', 'frame tv', 'samsung the frame'
      ]
    }
  ]
};