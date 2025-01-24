import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Download, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Create a global event for description transfer
export const descriptionTransferEvent = new CustomEvent('transferDescriptions', {
  detail: { descriptions: [] as string[] }
}) as CustomEvent<{ descriptions: string[] }>;

export function DescriptionEditor() {
  const [textAreas, setTextAreas] = useState(["", "", "", ""]);
  const [output, setOutput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState("dsc");
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  const handleTextAreaChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      // Filter out empty descriptions and transfer them
      const nonEmptyDescriptions = textAreas.filter(description => description.trim() !== '');
      descriptionTransferEvent.detail.descriptions = nonEmptyDescriptions;
      document.dispatchEvent(descriptionTransferEvent);
      
      // Save to localStorage
      localStorage.setItem('textFeatures.descriptions', JSON.stringify(nonEmptyDescriptions));
    }
    toast({
      description: isLocked ? "Descriptions unlocked" : "Descriptions locked and transferred to Text Features",
    });
  };

  const handleClear = () => {
    if (isLocked) return;
    setTextAreas(["", "", "", ""]);
    setOutput("");
    toast({
      description: "All descriptions cleared",
    });
  };

  const handleDone = () => {
    const descriptions = textAreas.filter(text => text.trim() !== "");
    setOutput(descriptions.join('\n\n'));
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
        <div className="p-4 max-w-[90%] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Description Editor</h2>
            <div className="flex gap-2">
              <Button 
                onClick={handleLockToggle}
                variant={isLocked ? "destructive" : "default"}
                size="sm"
              >
                {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={handleClear} size="sm">
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {textAreas.map((text, index) => (
              <Textarea
                key={index}
                value={text}
                onChange={(e) => handleTextAreaChange(index, e.target.value)}
                placeholder=""
                className="w-[200px] h-[50px] min-h-[50px] resize-none"
                disabled={isLocked}
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleDone}>Done</Button>
            {output && (
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Description
              </Button>
            )}
          </div>

          {output && (
            <div className="mt-6">
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}