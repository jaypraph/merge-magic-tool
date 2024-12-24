import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const PngToJpgConverter = () => {
  const [pngImage, setPngImage] = useState("");
  const { toast } = useToast();

  const handleConvertAndDownload = () => {
    if (!pngImage) {
      toast({
        title: "No image selected",
        description: "Please upload a PNG image first",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "converted-image.jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Success!",
            description: "Image converted and downloaded successfully",
          });
        }
      }, "image/jpeg", 0.9);
    };

    img.src = pngImage;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">PNG to JPG Converter</h1>
      <ImageUpload
        value={pngImage}
        onChange={setPngImage}
        label="Upload PNG Image"
      />
      {pngImage && (
        <div className="flex justify-center">
          <Button
            onClick={handleConvertAndDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Convert & Download JPG
          </Button>
        </div>
      )}
    </div>
  );
};