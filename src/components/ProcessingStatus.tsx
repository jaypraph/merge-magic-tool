interface ProcessingStatusProps {
  stage: string;
}

export const ProcessingStatus = ({ stage }: ProcessingStatusProps) => {
  if (!stage) return null;
  
  return (
    <p className="text-green-500 font-medium mt-2">{stage}</p>
  );
};