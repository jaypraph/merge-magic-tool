import { Button } from "@/components/ui/button";

interface ProcessingButtonsProps {
  onUploadClick: () => void;
  onProcessClick: () => void;
}

export const ProcessingButtons = ({ onUploadClick, onProcessClick }: ProcessingButtonsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onUploadClick}
        className="w-12 h-12 rounded-full bg-[#ea384c] hover:bg-[#ea384c]/90 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none text-black text-2xl font-light tracking-wider"
      >
        U
      </Button>
      <Button
        onClick={onProcessClick}
        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none text-white text-2xl font-light tracking-wider"
      >
        G
      </Button>
    </div>
  );
};