import { ImageEditor } from "@/components/ImageEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative w-full h-[200px] mt-16">
          <div className="absolute inset-0 border border-black">
            <span className="absolute -top-6 -left-6 text-sm text-black">0,0</span>
            <span className="absolute -top-6 -right-6 text-sm text-black">100,0</span>
            <span className="absolute -bottom-6 -left-6 text-sm text-black">0,100</span>
            <span className="absolute -bottom-6 -right-6 text-sm text-black">100,100</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Image Merger</h1>
        <ImageEditor />
      </div>
    </div>
  );
};

export default Index;