import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, FileUp, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ImportExportPage() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleImport = () => {
    setImporting(true);
    // Simulated import process
    setTimeout(() => {
      setImporting(false);
      toast({
        title: "Import successful",
        description: "Your keywords and categories have been imported.",
      });
    }, 1500);
  };

  const handleExport = () => {
    setExporting(true);
    // Simulated export process
    setTimeout(() => {
      setExporting(false);
      toast({
        title: "Export successful",
        description: "Your keywords and categories have been exported.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-black">Import/Export</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-black">Import your keywords and categories from a JSON file.</p>
            <div className="flex gap-4">
              <Button 
                onClick={handleImport} 
                disabled={importing}
                className="text-black"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {importing ? "Importing..." : "Import JSON"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-black">Export your keywords and categories to a JSON file.</p>
            <div className="flex gap-4">
              <Button 
                onClick={handleExport} 
                disabled={exporting}
                className="text-black"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {exporting ? "Exporting..." : "Export JSON"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}