import { useState, useCallback, useRef, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Download, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import defaultImage from "/lovable-uploads/e0990050-1d0a-4a84-957f-2ea4deb3af1f.png";

export const ImageEditor = () => {
  const [image1, setImage1] = useState<string>(defaultImage);
  const [image2, setImage2] = useState<string>("");
  const [mergedImage, setMergedImage] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangleMode, setRectangleMode] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (image1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = image1;
      }
    }
  }, [image1]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rectangleMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPos({ x, y });
  }, [rectangleMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !rectangleMode) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Redraw the original image
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Draw the new rectangle
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      ctx.stroke();
    };
    img.src = image1;
  }, [isDrawing, rectangleMode, startPos, image1]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">First Image</h2>
            <Button
              onClick={() => setRectangleMode(!rectangleMode)}
              variant={rectangleMode ? "secondary" : "outline"}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              {rectangleMode ? "Cancel Rectangle" : "Draw Rectangle"}
            </Button>
          </div>
          <div className="relative border-2 border-dashed rounded-lg p-4">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="max-w-full h-auto cursor-crosshair"
            />
            <ImageUpload
              value={image1}
              onChange={setImage1}
              label="First Image"
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