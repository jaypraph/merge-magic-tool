import React from 'react';

export const VideoSettings = () => {
  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <h2 className="font-semibold mb-2">Video Settings</h2>
      <ul className="space-y-2 text-sm">
        <li>• Resolution: 4K (3840x2160)</li>
        <li>• Duration per image: 2.5 seconds</li>
        <li>• Format: MP4</li>
        <li>• Transition: Smooth fade</li>
      </ul>
    </div>
  );
};