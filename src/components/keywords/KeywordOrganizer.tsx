import React, { useState } from 'react';
import { CategoryButton } from './CategoryButton';
import { CategorySection } from './CategorySection';

interface Subcategory {
  name: string;
  keywords: string[];
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

const INITIAL_DATA: Category[] = [
  {
    id: 'landscapes',
    name: 'LANDSCAPES',
    subcategories: [
      {
        name: 'Nature',
        keywords: [
          'Forest', 'Clouds', 'Sky', 'Bird', 'Flowers',
          'Poppy', 'Poppy flowers', 'Lake', 'Lake view',
          'Trees', 'Path', 'Golden hour', 'Nature', 'Hills',
          'Rolling hills'
        ]
      },
      {
        name: 'Places',
        keywords: [
          'Grand Canyon', 'Capetown South Africa', 'Colorado River',
          'English countryside', 'Yosemite', 'Paris', 'Switzerland',
          'Dolomites', 'Alps', 'Castle', 'National park', 'Amsterdam'
        ]
      },
      {
        name: 'Seasonal & Weather',
        keywords: [
          'Snow', 'Snowflake', 'Snowbird', 'Ice', 'Winter',
          'Dark night', 'Northern lights', 'Autumn leaves',
          'Sunrise', 'Morning', 'Morning sun', 'Starry sky'
        ]
      },
      {
        name: 'Structures',
        keywords: [
          'Bridge', 'Wooden bridge', 'Church', 'Christ church',
          'Castle', 'Village', 'Holiday village', 'Road',
          'House', 'Wooden house'
        ]
      }
    ]
  },
  {
    id: 'christmas',
    name: 'CHRISTMAS',
    subcategories: [
      {
        name: 'Santa Claus',
        keywords: [
          'Santa Claus', 'Mrs Claus', 'Santa Claus Tracker',
          'Santa Claus Sleigh', 'Reindeer', 'Rudolph', 'Snow',
          'Snowflake', 'Christmas Eve'
        ]
      },
      {
        name: 'Decorations',
        keywords: [
          'Christmas Tree', 'Christmas Ornaments', 'Christmas Wreath',
          'Mistletoe', 'Pine Tree', 'Holly Leaves', 'Poinsettias',
          'Christmas Garland', 'Red Ribbon'
        ]
      },
      {
        name: 'Trains',
        keywords: [
          'Polar Express', 'Steam Train', 'Thomas Train',
          'Choo Choo Train', 'Orient Express', 'Toy Train'
        ]
      },
      {
        name: 'Food & Sweets',
        keywords: [
          'Gingerbread', 'Gingerbread House', 'Chocolate Strawberry',
          'Strawberries', 'Mulberries', 'Holly Berries',
          'Wild Berries', 'Christmas Dinner'
        ]
      }
    ]
  }
];

export function KeywordOrganizer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    setActiveDropdown(null);
  };

  const toggleDropdown = (subcategoryName: string) => {
    setActiveDropdown(activeDropdown === subcategoryName ? null : subcategoryName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        {INITIAL_DATA.map((category) => (
          <CategoryButton
            key={category.id}
            name={category.name}
            isActive={activeCategory === category.id}
            onClick={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {INITIAL_DATA.map((category) => (
        <div
          key={category.id}
          className={`space-y-4 transition-all duration-300 ${
            activeCategory === category.id ? 'block' : 'hidden'
          }`}
        >
          <CategorySection
            subcategories={category.subcategories}
            activeDropdown={activeDropdown}
            onDropdownToggle={toggleDropdown}
          />
        </div>
      ))}
    </div>
  );
}