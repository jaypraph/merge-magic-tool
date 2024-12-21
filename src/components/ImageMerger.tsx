import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockupImages } from "@/constants/mockupDefaults";
import { createImage, parseCoordinates } from "@/utils/imageUtils";
import JSZip from "jszip";
import { createMockupImage } from "@/utils/mockupImageProcessing";

interface ImageMergerProps {
  image2: string;
  selectedMockup: string;
  setMergedImage: (image: string) => void;
}

export const ImageMerger = ({ image2, selectedMockup, setMergedImage }: ImageMergerProps) => {
  const { toast } = useToast();

  const handleMergeImages = useCallback(async () => {
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
      
      // Create a merged image for each mockup
      for (const mockup of mockupImages) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Set canvas size based on mockup ID
        // mockup-1 has ID 1, all others use 2000x2000
        if (mockup.id === 1) {
          canvas.width = 1588;
          canvas.height = 1191;
        } else {
          canvas.width = 2000;
          canvas.height = 2000;
        }

        const img1 = await createImage(mockup.src);
        const img2 = await createImage(image2);

        // Draw first image scaled to canvas size
        ctx?.drawImage(img1, 0, 0, canvas.width, canvas.height);

        const topLeft = parseCoordinates(mockup.defaultCoordinates.topLeft);
        const topRight = parseCoordinates(mockup.defaultCoordinates.topRight);
        const bottomLeft = parseCoordinates(mockup.defaultCoordinates.bottomLeft);
        const bottomRight = parseCoordinates(mockup.defaultCoordinates.bottomRight);

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

        const mergedImageData = canvas.toDataURL("image/png");
        const imageData = mergedImageData.split('base64,')[1];
        
        // Use "oreomock5" name for mockup-1, otherwise use regular naming
        const fileName = mockup.id === 1 ? "oreomock5.png" : `mockup-${mockup.id}.png`;
        zip.file(fileName, imageData, {base64: true});
      }
      
      // Generate and download the zip file
      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-mockups.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show the preview of the currently selected mockup
      const selectedMockupData = mockupImages.find(m => m.src === selectedMockup);
      if (selectedMockupData) {
        const previewImage = await createMockupImage(selectedMockup, image2, selectedMockupData.defaultCoordinates);
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
  }, [image2, selectedMockup, setMergedImage, toast]);

  return { handleMergeImages };
};