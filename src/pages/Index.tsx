import { ImageEditor } from "@/components/ImageEditor";
import { RectangleTool } from "@/components/RectangleTool";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger</h1>
        <RectangleTool />
        <ImageEditor />
      </div>
    </div>
  );
};

export default Index;