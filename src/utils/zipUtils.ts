import JSZip from "jszip";

export const addTextFilesToZip = (
  zip: JSZip,
  textFiles: {
    keywords?: string;
    title?: string;
    description?: string;
  }
) => {
  if (textFiles.keywords) {
    zip.file("keywords.txt", textFiles.keywords);
  }
  if (textFiles.title) {
    zip.file("title.txt", textFiles.title);
  }
  if (textFiles.description) {
    zip.file("description.txt", textFiles.description);
  }
};

export const addInstructionsImageToZip = async (zip: JSZip) => {
  const response = await fetch('/lovable-uploads/51c87eea-1486-4f80-a6b4-78a5ce50a0a1.png');
  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  
  return new Promise<void>((resolve) => {
    reader.onloadend = () => {
      const base64data = reader.result as string;
      zip.file("instructions.png", base64data.split('base64,')[1], {base64: true});
      resolve();
    };
  });
};

export const addProcessedImagesToZip = (zip: JSZip, images: string[]) => {
  images.forEach((image, index) => {
    const fileName = index === 0 ? "mtrx-1.jpg" : 
                    index === 1 ? "wm-1.jpg" :
                    index === 2 ? "oreomock5.jpg" :
                    `mockup${index-2}.jpg`;
    zip.file(fileName, image.split('base64,')[1], {base64: true});
  });
};