import { cn } from "@/lib/utils";
import { mockupImages } from "@/constants/mockupDefaults";

interface MockupSelectorProps {
  selectedMockup: string;
  onSelectMockup: (src: string) => void;
}

export const MockupSelector = ({ selectedMockup, onSelectMockup }: MockupSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {mockupImages.map((mockup) => (
        <button
          key={mockup.id}
          onClick={() => onSelectMockup(mockup.src)}
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
  );
};