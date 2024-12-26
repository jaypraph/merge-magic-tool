import { Category } from './types';

export const abstractCategory: Category = {
  id: 'abstract',
  name: 'ABSTRACT',
  subcategories: [
    {
      name: 'Art Styles',
      keywords: [
        'painting', 'pop art', 'abstract artwork', 'futurist', 'expressionist',
        'abstract landscape', 'geometric shapes', 'ai drawing'
      ]
    },
    {
      name: 'Drawing & Sketching',
      keywords: [
        'drawing', 'easy drawing', 'pencil drawing', 'cute drawings',
        'artistic drawings', 'pencil sketch', 'calligraphy', 'pen'
      ]
    },
    {
      name: 'Nature & Landscapes',
      keywords: [
        'english landscape', 'mountain', 'forest', 'autumn leaves',
        'fall leaves', 'fall autumn colors', 'water', 'background',
        'olive branches', 'olive branch drawing', 'olive branch picture'
      ]
    },
    {
      name: 'Seasonal & Weather',
      keywords: [
        'snow', 'skiing', 'ski mask', 'snowbird', 'winter'
      ]
    },
    {
      name: 'Coastal & Marine',
      keywords: [
        'beach house', 'waves', 'sea scape', 'sunset', 'stormy seascape'
      ]
    },
    {
      name: 'Display Technology',
      keywords: [
        'samsung the frame', 'frame tv', 'samsung frame tv', 'canvas'
      ]
    },
    {
      name: 'Concepts',
      keywords: [
        'futures', 'science fiction', 'love'
      ]
    }
  ]
};