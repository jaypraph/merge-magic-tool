import { ImageEditor } from "@/components/ImageEditor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative">
          <Button
            onClick={() => setIsPressed(!isPressed)}
            className={cn(
              "absolute top-0 left-0 w-12 h-12 text-xl font-bold transition-all duration-200",
              isPressed 
                ? "bg-slate-800 text-white transform translate-y-[2px]" 
                : "bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)]"
            )}
          >
            R
          </Button>
          
          <div className="relative w-full h-[200px] mt-16">
            <div className="absolute inset-0 border border-black">
              {/* Top-left coordinates */}
              <span className="absolute -top-6 -left-6 text-sm text-black">0,0</span>
              
              {/* Top-right coordinates */}
              <span className="absolute -top-6 -right-6 text-sm text-black">100,0</span>
              
              {/* Bottom-left coordinates */}
              <span className="absolute -bottom-6 -left-6 text-sm text-black">0,100</span>
              
              {/* Bottom-right coordinates */}
              <span className="absolute -bottom-6 -right-6 text-sm text-black">100,100</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger</h1>
        <ImageEditor />
      </div>
    </div>
  );
};

export default Index;