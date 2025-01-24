import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { LockButton } from "./LockButton";

interface KeywordsSectionProps {
  keywords: string[];
  isLocked: boolean;
  onKeywordChange: (index: number, value: string) => void;
  onLockToggle: () => void;
}

export function KeywordsSection({ 
  keywords, 
  isLocked, 
  onKeywordChange, 
  onLockToggle 
}: KeywordsSectionProps) {
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Keywords</h2>
        <LockButton isLocked={isLocked} onToggle={onLockToggle} />
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
              <Textarea
                value={keyword}
                onChange={(e) => onKeywordChange(index, e.target.value)}
                placeholder=""
                className="w-[200px] h-[50px] min-h-[50px] resize-none"
                disabled={isLocked}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}