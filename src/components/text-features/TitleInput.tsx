import { Textarea } from "@/components/ui/textarea";
import { CharacterCounter } from "./CharacterCounter";

const FIXED_SUFFIX = " Tv Frame Art, Television picture frame, Canvas, samsung frame tv,";

interface TitleInputProps {
  value: string;
  isLocked: boolean;
  onChange: (value: string) => void;
}

export function TitleInput({ value, isLocked, onChange }: TitleInputProps) {
  const fullText = value ? `${value},${FIXED_SUFFIX}` : FIXED_SUFFIX;
  
  return (
    <div className="space-y-1">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
        className="w-[200px] h-[50px] min-h-[50px] resize-none"
        disabled={isLocked}
      />
      <div className="flex justify-end">
        <CharacterCounter currentLength={fullText.length} />
      </div>
    </div>
  );
}