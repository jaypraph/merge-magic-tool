import { Category } from './types';

export const booksCategory: Category = {
  id: 'books',
  name: 'BOOKS',
  subcategories: [
    {
      name: 'Book Types',
      keywords: [
        'book', 'audio book', 'novel'
      ]
    },
    {
      name: 'Reading Accessories',
      keywords: [
        'bookmark', 'bookshelf', 'shelf', 'floating shelf', 'corner shelf'
      ]
    },
    {
      name: 'Libraries & Access',
      keywords: [
        'z library', 'library', 'public library'
      ]
    },
    {
      name: 'Display Technology',
      keywords: [
        'frame tv', 'samsung the frame'
      ]
    },
    {
      name: 'Book Recommendations',
      keywords: [
        'the secret', 'book club', 'books to read', 'it ends with us'
      ]
    }
  ]
};