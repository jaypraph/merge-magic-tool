import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { LockButton } from "./LockButton";

interface DescriptionSectionProps {
  descriptions: string[];
  isLocked: boolean;
  onLockToggle: () => void;
  onChange: (index: number, value: string) => void;
}

export function DescriptionSection({ descriptions, isLocked, onLockToggle, onChange }: DescriptionSectionProps) {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Description</h2>
        <LockButton 
          isLocked={isLocked}
          onToggle={onLockToggle}
          label="Descriptions"
        />
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {descriptions.map((description, index) => (
            <Textarea
              key={index}
              value={description}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder=""
              className="w-[200px] h-[50px] min-h-[50px] resize-none"
              disabled={isLocked}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}