import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const TxComponent = () => {
  const categories = [
    {
      title: "LANDSCAPES",
      subcategories: [
        {
          title: "Nature & Scenery",
          items: [
            {
              title: "Trees & Plants",
              keywords: ["tree drawing", "flower drawing", "apple tree", "birch trees", "peony", "poppy", "sunflowers", "orange leaves", "tree branch"]
            },
            {
              title: "Landscapes",
              keywords: ["mountain", "hills", "forest", "path", "village", "nature", "garden", "meadows", "english countryside", "fall autumn colors", "autumn nature", "golden leaves"]
            },
            // ... more items
          ]
        }
      ]
    },
    {
      title: "STILL LIFE",
      subcategories: [
        {
          title: "Art & Design",
          items: [
            {
              title: "General",
              keywords: ["famous painter", "famous paintings", "famous artists"]
            },
            {
              title: "Painting & Drawing",
              keywords: ["canvas", "painting", "drawing", "pencil sketch", "oil painting", "ai art"]
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">TX Categories</h1>
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-xl font-semibold">
              {category.title}
            </AccordionTrigger>
            <AccordionContent>
              {category.subcategories.map((subcategory, j) => (
                <Accordion key={j} type="single" collapsible className="ml-4 mt-2">
                  <AccordionItem value={`subitem-${j}`}>
                    <AccordionTrigger className="text-lg">
                      {subcategory.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      {subcategory.items.map((item, k) => (
                        <div key={k} className="ml-4 mt-2">
                          <h4 className="font-medium mb-2">{item.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.keywords.map((keyword, l) => (
                              <span
                                key={l}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};