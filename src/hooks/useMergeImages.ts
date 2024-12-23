import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { mockupImages } from "@/constants/mockupDefaults";

interface UseMergeImagesProps {
  image2: string;
  selectedMockup: string;
}

export const useMergeImages = ({ image2, selectedMockup }: UseMergeImagesProps) => {
  const [mergedImage, setMergedImage] = useState<string>("");
  const { toast } = useToast();

  const parseCoordinates = (coord: string) => {
    const match = coord.match(/\((\d+),(\d+)\)/);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2])
      };
    }
    return null;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const createMergedImage = async (mockupSrc: string, mockupCoordinates: any) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 2000;
    canvas.height = 2000;

    const img1 = await loadImage(mockupSrc);
    const img2 = await loadImage(image2);

    ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

    const topLeft = parseCoordinates(mockupCoordinates.topLeft);
    const topRight = parseCoordinates(mockupCoordinates.topRight);
    const bottomLeft = parseCoordinates(mockupCoordinates.bottomLeft);
    const bottomRight = parseCoordinates(mockupCoordinates.bottomRight);

    if (topLeft && topRight && bottomLeft && bottomRight) {
      const scaleX = canvas.width / img1.width;
      const scaleY = canvas.height / img1.height;
      
      const scaledX = Math.round(topLeft.x * scaleX);
      const scaledY = Math.round(topLeft.y * scaleY);
      const scaledWidth = Math.round((topRight.x - topLeft.x) * scaleX);
      const scaledHeight = Math.round((bottomLeft.y - topLeft.y) * scaleY);

      ctx?.drawImage(
        img2,
        scaledX,
        scaledY,
        scaledWidth,
        scaledHeight
      );
    }

    return canvas.toDataURL("image/png");
  };

  const handleMergeImages = async () => {
    if (!image2) {
      toast({
        title: "Missing Image",
        description: "Please upload an image before merging.",
        variant: "destructive",
      });
      return;
    }

    try {
      const zip = new JSZip();
      
      for (const mockup of mockupImages) {
        const mergedImageData = await createMergedImage(mockup.src, mockup.defaultCoordinates);
        const imageData = mergedImageData.split('base64,')[1];
        zip.file(`mockup-${mockup.id}.png`, imageData, {base64: true});
      }
      
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-mockups.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const selectedMockupData = mockupImages.find(m => m.src === selectedMockup);
      if (selectedMockupData) {
        const previewImage = await createMergedImage(selectedMockup, selectedMockupData.defaultCoordinates);
        setMergedImage(previewImage);
      }
      
      toast({
        title: "Success!",
        description: "All mockups have been merged and downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge images. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!mergedImage) {
      toast({
        title: "No merged image",
        description: "Please merge images first before downloading",
        variant: "destructive",
      });
      return;
    }

    const a = document.createElement("a");
    a.href = mergedImage;
    a.download = "merged-mockup.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Success!",
      description: "Image downloaded successfully",
    });
  };

  return {
    mergedImage,
    handleMergeImages,
    handleDownload
  };
};