import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeywordDashboard } from "./KeywordDashboard";
import { CategoriesPage } from "./CategoriesPage";
import { KeywordsPage } from "./KeywordsPage";
import { KeywordVisualization } from "./KeywordVisualization";
import { ImportExportPage } from "./ImportExportPage";
import { SettingsPage } from "./SettingsPage";
import { HelpPage } from "./HelpPage";

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
        <TabsContent value="categories" className="h-full">
          <CategoriesPage />
        </TabsContent>
        <TabsContent value="keywords" className="h-full">
          <KeywordsPage />
        </TabsContent>
        <TabsContent value="visualization" className="h-full">
          <KeywordVisualization />
        </TabsContent>
        <TabsContent value="import" className="h-full">
          <ImportExportPage />
        </TabsContent>
        <TabsContent value="settings" className="h-full">
          <SettingsPage />
        </TabsContent>
        <TabsContent value="help" className="h-full">
          <HelpPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}