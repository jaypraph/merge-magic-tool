import { ScrollArea } from "@/components/ui/scroll-area";
import { LockButton } from "./LockButton";
import { TitleInput } from "./TitleInput";

interface TitleSectionProps {
  titles: string[];
  isLocked: boolean;
  onTitleChange: (index: number, value: string) => void;
  onLockToggle: () => void;
}

export function TitleSection({ 
  titles, 
  isLocked, 
  onTitleChange, 
  onLockToggle 
}: TitleSectionProps) {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Title</h2>
        <LockButton isLocked={isLocked} onToggle={onLockToggle} />
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {titles.map((title, index) => (
            <TitleInput
              key={index}
              value={title}
              isLocked={isLocked}
              onChange={(value) => onTitleChange(index, value)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}