import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeywordDashboard } from "./KeywordDashboard";

export function TxFeature() {
  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="dashboard" className="h-full space-y-6">
        <div className="border-b">
          <div className="container flex h-16 items-center gap-4 px-4">
            <TabsList className="text-black">
              <TabsTrigger value="dashboard" className="text-black">Dashboard</TabsTrigger>
              <TabsTrigger value="categories" className="text-black">Categories</TabsTrigger>
              <TabsTrigger value="keywords" className="text-black">Keywords</TabsTrigger>
              <TabsTrigger value="visualization" className="text-black">Visualization</TabsTrigger>
              <TabsTrigger value="import" className="text-black">Import/Export</TabsTrigger>
              <TabsTrigger value="settings" className="text-black">Settings</TabsTrigger>
              <TabsTrigger value="help" className="text-black">Help</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="dashboard" className="h-full">
          <KeywordDashboard />
        </TabsContent>
        <TabsContent value="categories">
          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Categories</h2>
            <p className="text-black">Categories feature coming soon...</p>
          </div>
        </TabsContent>
        {/* Other tab contents will be implemented similarly */}
      </Tabs>
    </div>
  );
}
