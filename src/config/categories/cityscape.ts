import { Category } from './types';

export const cityscapeCategory: Category = {
  id: 'cityscape',
  name: 'CITYSCAPE',
  subcategories: [
    {
      name: 'Urban Elements',
      keywords: [
        'city', 'house', 'building', 'urban', 'city skyline', 'architecture',
        'skyline', 'old town'
      ]
    },
    {
      name: 'European Cities',
      keywords: [
        'italy', 'venice canals', 'venice', 'canal', 'amsterdam',
        'netherlands', 'holland', 'london', 'tower bridge'
      ]
    },
    {
      name: 'Waterfront',
      keywords: [
        'harbor city', 'sea port', 'waterfront city', 'river'
      ]
    },
    {
      name: 'Seasonal & Celebrations',
      keywords: [
        'christmas', 'snow', 'snowflake', 'happy new year', 'new years eve',
        'golden city'
      ]
    },
    {
      name: 'Display & Art',
      keywords: [
        'canvas', '3d', 'samsung frame tv', 'frame tv', 'samsung the frame'
      ]
    }
  ]
};