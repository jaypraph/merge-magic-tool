import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import { preloadImages, backgroundImage } from "./utils/imagePreloader";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    preloadImages()
      .then(() => {
        setImagesLoaded(true);
        console.log("All default images preloaded successfully");
      })
      .catch((error) => {
        console.error("Error preloading images:", error);
        toast({
          variant: "destructive",
          title: "Error preloading images",
          description: "Some images failed to load. The app may not work as expected.",
        });
        setImagesLoaded(true); // Continue anyway
      });
  }, [toast]);

  if (!imagesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="text-2xl font-semibold">Loading...</div>
          <div className="text-muted-foreground">Preparing your experience</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div 
          className="min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:feature" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;