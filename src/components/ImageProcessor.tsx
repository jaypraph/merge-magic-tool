import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { processImage } from "@/utils/imageProcessingPipeline";

interface ImageProcessorProps {
  uploadedImage: string;
  onUploadClick: () => void;
}

export const ImageProcessor = ({ uploadedImage, onUploadClick }: ImageProcessorProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<{ [key: string]: string }>({});

  const handleProcessImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      // Process images through the pipeline
      const result = await processImage(uploadedImage);
      
      // Store processed files for later use
      const processedFilesMap: { [key: string]: string } = {};
      
      // Add processed images to ZIP with specific names
      result.images.forEach((image, index) => {
        const fileName = index === 0 ? "mtrx-1.jpg" : 
                        index === 1 ? "wm-1.jpg" :
                        index === 2 ? "oreomock5.jpg" :
                        `mockup${index-2}.jpg`;
        zip.file(fileName, image.split('base64,')[1], {base64: true});
        processedFilesMap[fileName] = image;
      });

      setProcessedFiles(processedFilesMap);

      // Generate and download the ZIP file
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProcessingComplete(true);
      toast({
        title: "Success!",
        description: "All images have been processed and downloaded as ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the images",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadProcessedFiles = async () => {
    if (!processingComplete) {
      toast({
        title: "Processing not complete",
        description: "Please wait for the initial processing to complete",
        variant: "destructive",
      });
      return;
    }

    try {
      // Select specific files for upload
      const filesToUpload = [
        processedFiles["mtrx-1.jpg"],
        processedFiles["mockup1.jpg"],
        processedFiles["mockup2.jpg"],
        processedFiles["mockup3.jpg"],
        processedFiles["mockup5.jpg"]
      ];

      // Create a new ZIP with selected files
      const zip = new JSZip();
      const fileNames = ["mtrx-1.jpg", "mockup-1.jpg", "mockup-2.jpg", "mockup-3.jpg", "mockup-5.jpg"];
      
      filesToUpload.forEach((file, index) => {
        if (file) {
          zip.file(fileNames[index], file.split('base64,')[1], {base64: true});
        }
      });

      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "selected-images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Selected images have been uploaded and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while uploading the processed files",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center mt-4 gap-4">
        <Button
          onClick={onUploadClick}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        <Button
          onClick={handleProcessImage}
          className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          disabled={isProcessing}
        >
          <Play className="mr-2 h-5 w-5" />
          Go
        </Button>
        {processingComplete && (
          <Button
            onClick={handleUploadProcessedFiles}
            className="w-28 h-12 text-xl font-bold transition-all duration-200 bg-slate-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-none"
          >
            <Plus className="mr-2 h-5 w-5" />
            +
          </Button>
        )}
      </div>
      {isProcessing && (
        <div className="text-center">
          <p>Processing images...</p>
        </div>
      )}
    </div>
  );
};