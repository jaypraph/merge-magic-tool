import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Download } from "lucide-react";

export function TitleEditor() {
  const [textAreas, setTextAreas] = useState(["", "", "", ""]);
  const [output, setOutput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState("ttl");

  const handleTextAreaChange = (index: number, value: string) => {
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);
  };

  const handleDone = () => {
    const newParts = textAreas.filter(text => text.trim() !== "");
    const remainingParts = ", Tv Frame Art, Television Picture Frame, Canvas, Samsung Frame Tv";
    const newSentence = `${newParts.join(', ')}${newParts.length > 0 ? ',' : ''}${remainingParts}`;
    setOutput(newSentence);
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
    a.download = "TITLE.txt";
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
          <div className="space-y-4">
            {textAreas.map((text, index) => (
              <Textarea
                key={index}
                value={text}
                onChange={(e) => handleTextAreaChange(index, e.target.value)}
                placeholder=""
                className="w-full"
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
                Download Title
              </Button>
            </div>
          )}

          <div className="mt-6 text-sm">
            <p>
              "Blue Fantasy Island, Oil Painting, Medieval City, Japanese Art, Tv Frame Art, Television Picture Frame, Canvas, Samsung Frame Tv"
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}