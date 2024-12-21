import { useState, useCallback, useRef } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CoordinatesPanel } from "./CoordinatesPanel";
import { MergedResult } from "./MergedResult";
import { cn } from "@/lib/utils"; // Added this import

// Import all mockup images
import mockup1 from "/lovable-uploads/f11800fe-956b-491f-be37-84dcdb5d49a6.png";
import mockup2 from "/lovable-uploads/d431648e-7ad2-4f54-b0b5-2e8bc6584253.png";
import mockup3 from "/lovable-uploads/73501f70-efa7-4db7-8023-3350c6c6bdc3.png";
import mockup4 from "/lovable-uploads/5f1a7892-29a7-4bd5-af8b-6e461f99f6ae.png";
import mockup5 from "/lovable-uploads/a0e68f3a-cf81-46d9-9c33-ca2623df6c0e.png";
import mockup6 from "/lovable-uploads/cc7da80f-4c68-45bb-b29b-50ef30d1477b.png";
import mockup7 from "/lovable-uploads/d4eeac06-22f4-4135-a4ac-0b3931c8fac9.png";

const mockupImages = [
  { id: 1, src: mockup1 },
  { id: 2, src: mockup2 },
  { id: 3, src: mockup3 },
  { id: 4, src: mockup4 },
  { id: 5, src: mockup5 },
  { id: 6, src: mockup6 },
  { id: 7, src: mockup7 },
];

export const ImageEditor2 = () => {
  const [selectedMockup, setSelectedMockup] = useState(mockupImages[0].src);
  const [image2, setImage2] = useState<string>("");
  const [mergedImage, setMergedImage] = useState<string>("");
  const [rectangleMode, setRectangleMode] = useState(false);
  const [coordinates, setCoordinates] = useState({
    topLeft: "(228,224)",
    topRight: "(1362,224)",
    bottomLeft: "(228,841)",
    bottomRight: "(1362,841)"
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const setDefaultCoordinates = () => {
    setCoordinates({
      topLeft: "(228,224)",
      topRight: "(1362,224)",
      bottomLeft: "(228,841)",
      bottomRight: "(1362,841)"
    });
  };

  const parseCoordinates = (coord: string) => {
    const match = coord.match(/\((\d+),(\d+)\)/);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2])
      };
    }
    return null;
  };

  const handleMergeImages = useCallback(async () => {
    if (!selectedMockup || !image2) {
      toast({
        title: "Missing Images",
        description: "Please select a mockup and upload an image before merging.",
        variant: "destructive",
      });
      return;
    }

    if (!coordinates.topLeft || !coordinates.topRight || !coordinates.bottomLeft || !coordinates.bottomRight) {
      toast({
        title: "Missing Coordinates",
        description: "Please draw a rectangle or set default coordinates first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = 1588;
      canvas.height = 1191;

      const img1 = await loadImage(canvasRef.current?.toDataURL() || selectedMockup);
      const img2 = await loadImage(image2);

      ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

      const topLeft = parseCoordinates(coordinates.topLeft);
      const topRight = parseCoordinates(coordinates.topRight);
      const bottomLeft = parseCoordinates(coordinates.bottomLeft);
      const bottomRight = parseCoordinates(coordinates.bottomRight);

      if (topLeft && topRight && bottomLeft && bottomRight) {
        const scaleX = canvas.width / img1.width;
        const scaleY = canvas.height / img1.height;
        
        const scaledX = Math.round(topLeft.x * scaleX);
        const scaledY = Math.round(topLeft.y * scaleY);
        const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
        const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);

        ctx?.drawImage(
          img2,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight
        );
      }

      const merged = canvas.toDataURL("image/png");
      setMergedImage(merged);
      
      toast({
        title: "Success!",
        description: "Images merged successfully. Click download to save.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge images. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedMockup, image2, coordinates, toast]);

  const handleDownload = useCallback(() => {
    if (!mergedImage) return;
    
    const link = document.createElement("a");
    link.href = mergedImage;
    link.download = "merged-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [mergedImage]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {mockupImages.map((mockup) => (
              <button
                key={mockup.id}
                onClick={() => setSelectedMockup(mockup.src)}
                className={cn(
                  "p-1 border-2 rounded transition-all",
                  selectedMockup === mockup.src
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                )}
              >
                <img
                  src={mockup.src}
                  alt={`Mockup ${mockup.id}`}
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
          <CoordinatesPanel
            coordinates={coordinates}
            rectangleMode={rectangleMode}
            onSetDefaultCoordinates={setDefaultCoordinates}
            onRectangleModeToggle={() => setRectangleMode(!rectangleMode)}
          />
          <h2 className="text-xl font-semibold">Selected Mockup</h2>
          <div className="relative border-2 border-dashed rounded-lg p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
            <DrawingCanvas 
              image={selectedMockup} 
              rectangleMode={rectangleMode}
              onCoordinatesChange={setCoordinates}
            />
          </div>
        </div>
        <ImageUpload
          value={image2}
          onChange={setImage2}
          label="Upload Image"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleMergeImages}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Merge Images
        </Button>
        {mergedImage && (
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>

      <MergedResult mergedImage={mergedImage} />
    </div>
  );
};