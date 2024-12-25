import React, { useState } from 'react';

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
    setActiveDropdown(null); // Close any open dropdown when switching categories
  };

  const toggleDropdown = (subcategoryName: string) => {
    setActiveDropdown(activeDropdown === subcategoryName ? null : subcategoryName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Main Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {INITIAL_DATA.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`
              px-6 py-3 text-white font-semibold rounded-lg
              transition-all duration-300 transform
              ${activeCategory === category.id
                ? 'bg-green-700 shadow-none scale-95'
                : 'bg-green-500 shadow-lg hover:shadow-xl hover:bg-green-600'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Subcategories and Keywords */}
      {INITIAL_DATA.map((category) => (
        <div
          key={category.id}
          className={`
            space-y-4 transition-all duration-300
            ${activeCategory === category.id ? 'block' : 'hidden'}
          `}
        >
          {category.subcategories.map((subcategory) => (
            <div key={subcategory.name} className="relative">
              <button
                onClick={() => toggleDropdown(subcategory.name)}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 
                         rounded-lg transition-colors duration-200 font-medium"
              >
                {subcategory.name}
              </button>
              
              {/* Keywords Dropdown */}
              <div
                className={`
                  mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg
                  transition-all duration-300 
                  ${activeDropdown === subcategory.name ? 'block' : 'hidden'}
                `}
              >
                <p className="font-semibold mb-2">{subcategory.name} Keywords:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subcategory.keywords.map((keyword) => (
                    <li
                      key={keyword}
                      className="px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100
                               transition-colors duration-200"
                    >
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}