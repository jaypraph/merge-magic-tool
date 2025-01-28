import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TITLE_SUFFIX = " Tv Frame Art, Television picture frame, Canvas, samsung frame tv,";
const DESCRIPTION_PREFIX = "JPG file for | Tv Frame Art | ";
const DESCRIPTION_MIDDLE = " Designed specifically for the Samsung TV Frame with dimensions of 3840x2160 pixels; not intended for printing purposes.";
const DESCRIPTION_SUFFIX = `

Download this painting specifically designed for TV Frame. This digital file, optimized for screen display, comes in a high-resolution JPG format with dimensions of 3840x2160 pixels, suitable for any 16:9 ratio displays. Please note that this file is intended for digital use only and is not suitable for physical printing. Keep in mind that colors may vary based on your screen display settings.

Upon purchase, you'll receive an instant download link. No physical items will be shipped. To receive assistance in adding this file to your TV, please visit: https://www.samsung.com/us/support/answer/ANS00076727/`;

interface DownloadSectionProps {
  keywords: string[];
  titles: string[];
  descriptions: string[];
  keywordsLocked: boolean;
  titlesLocked: boolean;
  descriptionsLocked: boolean;
}

export function DownloadSection({
  keywords,
  titles,
  descriptions,
  keywordsLocked,
  titlesLocked,
  descriptionsLocked
}: DownloadSectionProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    let content = '';
    
    if (keywordsLocked && keywords.some(k => k.trim() !== '')) {
      content += '=== KEYWORDS ===\n';
      keywords.filter(k => k.trim() !== '').forEach(keyword => {
        // Ensure each keyword ends with a comma
        const formattedKeyword = keyword.trim();
        content += formattedKeyword + (formattedKeyword.endsWith(',') ? '\n' : ',\n');
      });
      content += '\n';
    }

    if (titlesLocked && titles.some(t => t.trim() !== '')) {
      content += '=== TITLES ===\n';
      // Combine all non-empty titles into a single line with commas
      const combinedTitle = titles
        .filter(t => t.trim() !== '')
        .join(', ');
      if (combinedTitle) {
        content += `${combinedTitle}${TITLE_SUFFIX}\n`;
      }
      content += '\n';
    }

    if (descriptionsLocked && descriptions.some(d => d.trim() !== '')) {
      content += '=== DESCRIPTIONS ===\n';
      // Combine all non-empty descriptions into the required format
      const combinedDescriptions = descriptions
        .filter(d => d.trim() !== '')
        .join(', ');
      if (combinedDescriptions) {
        content += `${DESCRIPTION_PREFIX}${combinedDescriptions}${DESCRIPTION_MIDDLE}${DESCRIPTION_SUFFIX}\n`;
      }
    }

    if (content.trim() === '') {
      toast({
        description: "No locked content to download",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-features.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Text features downloaded successfully!",
    });
  };

  return (
    <div className="absolute bottom-4 right-4">
      <Button
        onClick={handleDownload}
        variant="outline"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Download Locked Text
      </Button>
    </div>
  );
}