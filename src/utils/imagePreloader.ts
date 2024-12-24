import mockup1 from "/lovable-uploads/f11800fe-956b-491f-be37-84dcdb5d49a6.png";
import mockup2 from "/lovable-uploads/d431648e-7ad2-4f54-b0b5-2e8bc6584253.png";
import mockup3 from "/lovable-uploads/73501f70-efa7-4db7-8023-3350c6c6bdc3.png";
import mockup4 from "/lovable-uploads/5f1a7892-29a7-4bd5-af8b-6e461f99f6ae.png";
import mockup5 from "/lovable-uploads/a0e68f3a-cf81-46d9-9c33-ca2623df6c0e.png";
import mockup6 from "/lovable-uploads/cc7da80f-4c68-45bb-b29b-50ef30d1477b.png";
import mockup7 from "/lovable-uploads/d4eeac06-22f4-4135-a4ac-0b3931c8fac9.png";
import bgImage from "/lovable-uploads/efd3466c-23e5-4efc-a366-b5ea2ea70393.png";

const defaultImages = [
  mockup1,
  mockup2,
  mockup3,
  mockup4,
  mockup5,
  mockup6,
  mockup7,
];

export const preloadImages = () => {
  const promises = defaultImages.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(`Failed to load image: ${src}`);
    });
  });

  return Promise.all(promises);
};

export const backgroundImage = bgImage;