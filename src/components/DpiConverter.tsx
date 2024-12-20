import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { changeDpiDataUrl } from "changedpi";

export const DpiConverter = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { toast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConvertDpi = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert image DPI to 300
      const dpiAdjustedDataUrl = changeDpiDataUrl(uploadedImage, 300);

      // Create download link
      const a = document.createElement("a");
      a.href = dpiAdjustedDataUrl;
      a.download = "image-300dpi.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Image DPI has been converted to 300 and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while converting the image DPI",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">DPI Converter</h1>
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          onClick={handleUploadClick}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        {uploadedImage && (
          <>
            <div className="w-full aspect-video relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <img
                src={uploadedImage}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <Button
              onClick={handleConvertDpi}
              className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
            >
              Convert
            </Button>
          </>
        )}
      </div>
    </div>
  );
};