import { cn } from "@/lib/utils";

interface MergedResultProps {
  mergedImage: string;
}

export const MergedResult = ({ mergedImage }: MergedResultProps) => {
  if (!mergedImage) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Merged Result</h2>
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <img
          src={mergedImage}
          alt="Merged result"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};