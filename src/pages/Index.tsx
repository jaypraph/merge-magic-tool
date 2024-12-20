import { ImageEditor } from "@/components/ImageEditor";
import { TopMenuBar } from "@/components/TopMenuBar";
import { useState } from "react";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState("mockup");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopMenuBar 
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
      />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {activeFeature === "mockup" && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger</h1>
            <ImageEditor />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;