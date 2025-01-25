import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Download, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Create global events for title and description transfer
export const titleTransferEvent = new CustomEvent('transferTitles', {
  detail: { titles: [] as string[] }
}) as CustomEvent<{ titles: string[] }>;

export const descriptionTransferEvent = new CustomEvent('transferDescriptions', {
  detail: { descriptions: [] as string[] }
}) as CustomEvent<{ descriptions: string[] }>;

export function TitleEditor() {
  const [textAreas, setTextAreas] = useState<string[]>(Array(4).fill(''));
  const [output, setOutput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState("ttl");
  const [isLocked, setIsLocked] = useState(false);
  const [syncWithDescription, setSyncWithDescription] = useState(() => {
    return localStorage.getItem('titleDescriptionSync') === 'true';
  });
  const { toast } = useToast();

  // Save sync state to localStorage
  useEffect(() => {
    localStorage.setItem('titleDescriptionSync', syncWithDescription.toString());
  }, [syncWithDescription]);

  const handleTextAreaChange = (index: number, value: string) => {
    if (isLocked) return;
    const newTextAreas = [...textAreas];
    newTextAreas[index] = value;
    setTextAreas(newTextAreas);

    // If sync is enabled, also update descriptions
    if (syncWithDescription) {
      descriptionTransferEvent.detail.descriptions = newTextAreas;
      document.dispatchEvent(descriptionTransferEvent);
    }
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      // Filter out empty titles and transfer them
      const nonEmptyTitles = textAreas.filter(t => t.trim() !== '');
      titleTransferEvent.detail.titles = nonEmptyTitles;
      document.dispatchEvent(titleTransferEvent);
      
      // Save to localStorage
      localStorage.setItem('textFeatures.titles', JSON.stringify(nonEmptyTitles));

      // If sync is enabled, also transfer to descriptions
      if (syncWithDescription) {
        descriptionTransferEvent.detail.descriptions = nonEmptyTitles;
        document.dispatchEvent(descriptionTransferEvent);
      }
    }
    toast({
      description: isLocked ? "Titles unlocked" : "Titles locked",
    });
  };

  const handleClear = () => {
    if (isLocked) return;
    setTextAreas(Array(4).fill(''));
    setOutput("");
    toast({
      description: "All titles cleared!",
    });
  };

  const handleSyncToggle = (enabled: boolean) => {
    setSyncWithDescription(enabled);
    if (enabled) {
      // Transfer current titles to descriptions immediately when enabling sync
      descriptionTransferEvent.detail.descriptions = textAreas;
      document.dispatchEvent(descriptionTransferEvent);
      toast({
        description: "Title-Description sync enabled",
      });
    } else {
      toast({
        description: "Title-Description sync disabled",
      });
    }
  };

  const handleDone = () => {
    const nonEmptyTitles = textAreas.filter(t => t.trim() !== '');
    if (nonEmptyTitles.length > 0) {
      setOutput(nonEmptyTitles.join('\n'));
      toast({
        description: "Titles processed successfully!",
      });
    } else {
      toast({
        description: "Please enter at least one title",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'titles.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      description: "Titles downloaded successfully!",
    });
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
            <h2 className="text-lg font-semibold">Title Editor</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={syncWithDescription}
                  onCheckedChange={handleSyncToggle}
                  id="sync-switch"
                />
                <label htmlFor="sync-switch" className="text-sm">
                  Sync with Description
                </label>
              </div>
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
          </div>

          <div className="space-y-2">
            {textAreas.map((text, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-4 text-xs text-gray-500">{index + 1}.</span>
                <Textarea
                  value={text}
                  onChange={(e) => handleTextAreaChange(index, e.target.value)}
                  placeholder=""
                  className="w-[200px] h-[50px] min-h-[50px] resize-none"
                  disabled={isLocked}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleDone}>Done</Button>
            {output && (
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Title
              </Button>
            )}
          </div>

          {output && (
            <div className="mt-6">
              <div className="p-4 bg-muted rounded-lg">
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}