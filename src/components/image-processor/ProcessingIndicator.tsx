interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

export const ProcessingIndicator = ({ isProcessing }: ProcessingIndicatorProps) => {
  if (!isProcessing) return null;

  return (
    <div className="flex gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
};