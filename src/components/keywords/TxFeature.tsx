import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeywordDashboard } from "./KeywordDashboard";

export function TxFeature() {
  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="dashboard" className="h-full space-y-6">
        <div className="border-b">
          <div className="container flex h-16 items-center gap-4 px-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="import">Import/Export</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="dashboard" className="h-full">
          <KeywordDashboard />
        </TabsContent>
        <TabsContent value="categories">
          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <p className="text-muted-foreground">Categories feature coming soon...</p>
          </div>
        </TabsContent>
        {/* Other tab contents will be implemented similarly */}
      </Tabs>
    </div>
  );
}
