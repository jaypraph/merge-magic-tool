import { useState, useCallback, useRef } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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

  const handleMergeImages = useCallback(async () => {
    if (!image1 || !image2) {
      toast({
        title: "Missing Images",
        description: "Please upload both images before merging.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img1 = await loadImage(canvasRef.current?.toDataURL() || image1);
      const img2 = await loadImage(image2);

      canvas.width = img1.width + img2.width;
      canvas.height = Math.max(img1.height, img2.height);

      ctx?.drawImage(img1, 0, 0);
      ctx?.drawImage(img2, img1.width, 0);

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
  }, [image1, image2, toast]);

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
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                value={coordinates.topLeft}
                readOnly
                placeholder="Top Left"
                className="h-16 text-lg font-mono resize-none"
              />
              <Textarea
                value={coordinates.topRight}
                readOnly
                placeholder="Top Right"
                className="h-16 text-lg font-mono resize-none"
              />
              <Textarea
                value={coordinates.bottomLeft}
                readOnly
                placeholder="Bottom Left"
                className="h-16 text-lg font-mono resize-none"
              />
              <Textarea
                value={coordinates.bottomRight}
                readOnly
                placeholder="Bottom Right"
                className="h-16 text-lg font-mono resize-none"
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