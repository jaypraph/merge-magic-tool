import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Download } from "lucide-react";

export function DescriptionEditor() {
  const [textAreas, setTextAreas] = useState(["", "", "", ""]);
  const [output, setOutput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState("dsc");

  const editableParts = ["Blue Fantasy Island", "Oil Painting", "Medieval City", "Japanese Art"];
  const sentenceTemplate = `JPG file for | Tv Frame Art | Blue Fantasy Island, Oil Painting, Medieval City, Japanese Art. Designed specifically for the Samsung TV Frame with dimensions of 3840x2160 pixels; not intended for printing purposes.

Download this painting specifically designed for TV Frame. This digital file, optimized for screen display, comes in a high-resolution JPG format with dimensions of 3840x2160 pixels, suitable for any 16:9 ratio displays. Please note that this file is intended for digital use only and is not suitable for physical printing. Keep in mind that colors may vary based on your screen display settings.

Upon purchase, you'll receive an instant download link. No physical items will be shipped. To receive assistance in adding this file to your TV, please visit: https://www.samsung.com/us/support/answer/ANS00076727/`;

  const handleTextAreaChange = (index: number, value: string) => {
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);
  };

  const handleDone = () => {
    let updatedSentence = sentenceTemplate;

    editableParts.forEach((part, index) => {
      const userInput = textAreas[index].trim();
      if (userInput !== "") {
        updatedSentence = updatedSentence.replace(part, userInput);
      }
    });

    setOutput(updatedSentence);
  };

  const handleClear = () => {
    setTextAreas(["", "", "", ""]);
    setOutput("");
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DESCRIPTION.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider defaultOpen={false} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen w-full bg-transparent text-slate-900">
        <AppSidebar 
          activeFeature={activeFeature}
          onFeatureSelect={setActiveFeature}
        />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="space-y-2">
            {textAreas.map((text, index) => (
              <Textarea
                key={index}
                value={text}
                onChange={(e) => handleTextAreaChange(index, e.target.value)}
                placeholder=""
                className="min-h-[80px] text-sm"
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleDone}>Done</Button>
            <Button variant="destructive" onClick={handleClear}>Clear All</Button>
          </div>

          {output && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                {output}
              </div>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Description
              </Button>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}