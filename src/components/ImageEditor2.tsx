import { useState, useCallback } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { useToast } from "@/hooks/use-toast";
import { CoordinatesPanel } from "./CoordinatesPanel";
import { MergedResult } from "./MergedResult";
import { MockupSelector } from "./MockupSelector";
import { mockupImages } from "@/constants/mockupDefaults";
import { MergeDownloadButtons } from "./MergeDownloadButtons";
import { createMockupImage } from "@/utils/mockupImageProcessing";
import JSZip from "jszip";

export const ImageEditor2 = () => {
  const [selectedMockup, setSelectedMockup] = useState(mockupImages[0].src);
  const [image2, setImage2] = useState<string>("");
  const [mergedImage, setMergedImage] = useState<string>("");
  const [rectangleMode, setRectangleMode] = useState(false);
  const [coordinates, setCoordinates] = useState(mockupImages[0].defaultCoordinates);
  const { toast } = useToast();

  const setDefaultCoordinates = () => {
    const selectedMockupData = mockupImages.find(m => m.src === selectedMockup);
    if (selectedMockupData?.defaultCoordinates) {
      setCoordinates(selectedMockupData.defaultCoordinates);
    }
  };

  const handleMergeImages = useCallback(async () => {
    if (!image2) {
      toast({
        title: "Missing Image",
        description: "Please upload an image before merging.",
        variant: "destructive",
      });
      return;
    }

    try {
      const zip = new JSZip();
      
      // Create a merged image for each mockup
      for (const mockup of mockupImages) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Set canvas size to 2000x2000
        canvas.width = 2000;
        canvas.height = 2000;

        const img1 = await createImage(mockup.src);
        const img2 = await createImage(image2);

        // Draw first image scaled to canvas size
        ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

        const topLeft = parseCoordinates(mockup.defaultCoordinates.topLeft);
        const topRight = parseCoordinates(mockup.defaultCoordinates.topRight);
        const bottomLeft = parseCoordinates(mockup.defaultCoordinates.bottomLeft);
        const bottomRight = parseCoordinates(mockup.defaultCoordinates.bottomRight);

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

        const mergedImageData = canvas.toDataURL("image/png");
        const imageData = mergedImageData.split('base64,')[1];
        zip.file(`mockup-${mockup.id}.png`, imageData, {base64: true});
      }
      
      // Generate and download the zip file
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-mockups.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show the preview of the currently selected mockup
      const selectedMockupData = mockupImages.find(m => m.src === selectedMockup);
      if (selectedMockupData) {
        const previewImage = await createMockupImage(selectedMockup, image2, selectedMockupData.defaultCoordinates);
        setMergedImage(previewImage);
      }
      
      toast({
        title: "Success!",
        description: "All mockups have been merged and downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge images. Please try again.",
        variant: "destructive",
      });
    }
  }, [image2, selectedMockup, toast]);

  const handleSelectMockup = (src: string) => {
    setSelectedMockup(src);
    const selectedMockupData = mockupImages.find(m => m.src === src);
    if (selectedMockupData?.defaultCoordinates) {
      setCoordinates(selectedMockupData.defaultCoordinates);
    }
  };

  const handleDownload = () => {
    if (!mergedImage) {
      toast({
        title: "No merged image",
        description: "Please merge images first before downloading",
        variant: "destructive",
      });
      return;
    }

    const a = document.createElement("a");
    a.href = mergedImage;
    a.download = "merged-mockup.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Success!",
      description: "Image downloaded successfully",
    });
  };

  const createImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <MockupSelector
            selectedMockup={selectedMockup}
            onSelectMockup={handleSelectMockup}
          />
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

      <MergeDownloadButtons
        onMerge={handleMergeImages}
        onDownload={handleDownload}
        showDownload={!!mergedImage}
      />

      <MergedResult mergedImage={mergedImage} />
    </div>
  );
};