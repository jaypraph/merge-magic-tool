import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { CoordinatesPanel } from "./CoordinatesPanel";
import { MergedResult } from "./MergedResult";
import { MockupSelector } from "./MockupSelector";
import { MockupPreview } from "./MockupPreview";
import { MergeActions } from "./MergeActions";
import { useMergeImages } from "@/hooks/useMergeImages";
import { mockupImages } from "@/constants/mockupDefaults";

export const ImageEditor2 = () => {
  const [selectedMockup, setSelectedMockup] = useState(mockupImages[0].src);
  const [image2, setImage2] = useState<string>("");
  const [rectangleMode, setRectangleMode] = useState(false);
  const [coordinates, setCoordinates] = useState(mockupImages[0].defaultCoordinates);

  const { mergedImage, handleMergeImages, handleDownload } = useMergeImages({
    image2,
    selectedMockup
  });

  const setDefaultCoordinates = () => {
    const selectedMockupData = mockupImages.find(m => m.src === selectedMockup);
    if (selectedMockupData?.defaultCoordinates) {
      setCoordinates(selectedMockupData.defaultCoordinates);
    }
  };

  const handleSelectMockup = (src: string) => {
    setSelectedMockup(src);
    const selectedMockupData = mockupImages.find(m => m.src === src);
    if (selectedMockupData?.defaultCoordinates) {
      setCoordinates(selectedMockupData.defaultCoordinates);
    }
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
          <MockupPreview
            selectedMockup={selectedMockup}
            rectangleMode={rectangleMode}
            onCoordinatesChange={setCoordinates}
          />
        </div>
        <ImageUpload
          value={image2}
          onChange={setImage2}
          label="Upload Image"
        />
      </div>

      <MergeActions
        onMerge={handleMergeImages}
        onDownload={handleDownload}
        showDownload={!!mergedImage}
      />

      <MergedResult mergedImage={mergedImage} />
    </div>
  );
};