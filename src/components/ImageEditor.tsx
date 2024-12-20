import { useState, useCallback, useRef } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CoordinatesPanel } from "./CoordinatesPanel";
import { MergedResult } from "./MergedResult";
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
      topLeft: "(228,214)",
      topRight: "(1362,214)",
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
      
      const img1 = await loadImage(canvasRef.current?.toDataURL() || image1);
      const img2 = await loadImage(image2);

      canvas.width = img1.width;
      canvas.height = img1.height;

      ctx?.drawImage(img1, 0, 0);

      const topLeft = parseCoordinates(coordinates.topLeft);
      const topRight = parseCoordinates(coordinates.topRight);
      const bottomLeft = parseCoordinates(coordinates.bottomLeft);
      const bottomRight = parseCoordinates(coordinates.bottomRight);

      if (topLeft && topRight && bottomLeft && bottomRight) {
        const width = topRight.x - topLeft.x;
        const height = bottomLeft.y - topLeft.y;

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
          <CoordinatesPanel
            coordinates={coordinates}
            rectangleMode={rectangleMode}
            onSetDefaultCoordinates={setDefaultCoordinates}
            onRectangleModeToggle={() => setRectangleMode(!rectangleMode)}
          />
          <h2 className="text-xl font-semibold">First Image</h2>
          <div className="relative border-2 border-dashed rounded-lg p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
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

      <MergedResult mergedImage={mergedImage} />
    </div>
  );
};