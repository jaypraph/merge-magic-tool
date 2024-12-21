import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { DrawingCanvas } from "./DrawingCanvas";
import { useToast } from "@/hooks/use-toast";
import { CoordinatesPanel } from "./CoordinatesPanel";
import { MergedResult } from "./MergedResult";
import { MockupSelector } from "./MockupSelector";
import { mockupImages } from "@/constants/mockupDefaults";
import { MergeDownloadButtons } from "./MergeDownloadButtons";
import { ImageMerger } from "./ImageMerger";

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

  const { handleMergeImages } = ImageMerger({ 
    image2, 
    selectedMockup, 
    setMergedImage 
  });

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