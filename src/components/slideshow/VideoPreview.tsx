import { useRef } from "react";

interface VideoPreviewProps {
  url: string;
}

export const VideoPreview = ({ url }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Preview</h3>
      <video 
        ref={videoRef}
        src={url}
        controls
        className="w-full rounded-lg shadow-md"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};