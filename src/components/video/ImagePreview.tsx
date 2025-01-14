import React from 'react';

interface ImagePreviewProps {
  images: string[];
}

export const ImagePreview = ({ images }: ImagePreviewProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image, index) => (
        <div key={index} className="w-32 h-32 relative">
          <img
            src={image}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};