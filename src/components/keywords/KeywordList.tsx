import React from 'react';

interface KeywordListProps {
  keywords: string[];
  subcategoryName: string;
}

export function KeywordList({ keywords, subcategoryName }: KeywordListProps) {
  return (
    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold mb-2 text-black">{subcategoryName} Keywords:</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {keywords.map((keyword) => (
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
  );
}