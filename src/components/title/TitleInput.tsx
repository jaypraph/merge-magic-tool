import { Textarea } from "@/components/ui/textarea";

interface TitleInputProps {
  index: number;
  value: string;
  isLocked: boolean;
  onChange: (index: number, value: string) => void;
  className?: string;
}

export function TitleInput({ 
  index, 
  value, 
  isLocked, 
  onChange,
  className = "w-[200px] h-[50px] min-h-[50px] resize-none"
}: TitleInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
      <Textarea
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder=""
        className={className}
        disabled={isLocked}
      />
    </div>
  );
}