import { useState, useCallback, useRef } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";

export const ImageEditor = () => {
  const [image1, setImage1] = useState<string>(defaultImage);
  const [image2, setImage2] = useState<string>("");
  const [mergedImage, setMergedImage] = useState<string>("");
  const [rectangleMode, setRectangleMode] = useState(false);
  const [coordinates, setCoordinates] = useState({
    topLeft: "",
    topRight: "",
    bottomLeft: "",
    bottomRight: ""
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const setDefaultCoordinates = () => {
    setCoordinates({
      topLeft: "(233,214)",
      topRight: "(1362,214)",
      bottomLeft: "(233,846)",
      bottomRight: "(1362,846)"
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
    if (!image1 || !image2) {
      toast({
        title: "Missing Images",
        description: "Please upload both images before merging.",
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
      
      // Load both images
      const img1 = await loadImage(canvasRef.current?.toDataURL() || image1);
      const img2 = await loadImage(image2);

      // Set canvas size to match the first image
      canvas.width = img1.width;
      canvas.height = img1.height;

      // Draw the first image
      ctx?.drawImage(img1, 0, 0);

      // Parse coordinates
      const topLeft = parseCoordinates(coordinates.topLeft);
      const topRight = parseCoordinates(coordinates.topRight);
      const bottomLeft = parseCoordinates(coordinates.bottomLeft);
      const bottomRight = parseCoordinates(coordinates.bottomRight);

      if (topLeft && topRight && bottomLeft && bottomRight) {
        // Calculate dimensions of the target area
        const width = topRight.x - topLeft.x;
        const height = bottomLeft.y - topLeft.y;

        // Draw the second image into the specified coordinates
        ctx?.drawImage(
          img2,
          topLeft.x,
          topLeft.y,
          width,
          height
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
  }, [image1, image2, coordinates, toast]);

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
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setRectangleMode(!rectangleMode)}
                className={cn(
                  "w-12 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white",
                  rectangleMode 
                    ? "transform translate-y-[2px]" 
                    : "shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
                )}
              >
                R
              </Button>
              <Button
                onClick={setDefaultCoordinates}
                className={cn(
                  "w-12 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white",
                  "shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:transform hover:translate-y-[2px] hover:shadow-none"
                )}
              >
                <Database className="h-6 w-6" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                value={coordinates.topLeft}
                readOnly
                placeholder="Top Left"
                className="h-12 text-base font-mono resize-none"
              />
              <Textarea
                value={coordinates.topRight}
                readOnly
                placeholder="Top Right"
                className="h-12 text-base font-mono resize-none"
              />
              <Textarea
                value={coordinates.bottomLeft}
                readOnly
                placeholder="Bottom Left"
                className="h-12 text-base font-mono resize-none"
              />
              <Textarea
                value={coordinates.bottomRight}
                readOnly
                placeholder="Bottom Right"
                className="h-12 text-base font-mono resize-none"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold">First Image</h2>
          <div className="relative border-2 border-dashed rounded-lg p-4">
            <DrawingCanvas 
              image={image1} 
              rectangleMode={rectangleMode}
              onCoordinatesChange={setCoordinates}
            />
          </div>
        </div>
        <ImageUpload
          value={image2}
          onChange={setImage2}
          label="Second Image"
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

      {mergedImage && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Merged Result</h2>
          <div className="rounded-lg overflow-hidden border border-slate-700">
            <img
              src={mergedImage}
              alt="Merged result"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};