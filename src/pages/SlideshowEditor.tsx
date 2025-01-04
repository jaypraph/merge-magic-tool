import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { useMergeImages } from "@/hooks/useMergeImages";
import { mockupImages } from "@/constants/mockupDefaults";

export const SlideshowEditor = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const selectedMockup = mockupImages[0]?.src || "";
  const { mergedImage, handleMergeImages, handleDownload } = useMergeImages({
    image2: uploadedImages[0] || "",
    selectedMockup,
  });

  const handleImageUpload = (value: string) => {
    if (uploadedImages.length < 5) {
      setUploadedImages((prev) => [...prev, value]);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Slideshow Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUpload
            value=""
            onChange={handleImageUpload}
            label="Upload Images (Max 5)"
          />
          
          <div className="flex flex-wrap gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="w-24 h-24">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Preview</h2>
          {mergedImage && (
            <div className="relative">
              <img
                src={mergedImage}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
          
          <div className="flex gap-4">
            <Button onClick={handleMergeImages}>
              Generate Slideshow
            </Button>
            <Button onClick={handleDownload} disabled={!mergedImage}>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};