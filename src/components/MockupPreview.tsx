import { DrawingCanvas } from "./DrawingCanvas";

interface MockupPreviewProps {
  selectedMockup: string;
  rectangleMode: boolean;
  onCoordinatesChange: (coords: any) => void;
}

export const MockupPreview = ({ selectedMockup, rectangleMode, onCoordinatesChange }: MockupPreviewProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selected Mockup</h2>
      <div className="relative border-2 border-dashed rounded-lg p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <DrawingCanvas 
          image={selectedMockup} 
          rectangleMode={rectangleMode}
          onCoordinatesChange={onCoordinatesChange}
        />
      </div>
    </div>
  );
};