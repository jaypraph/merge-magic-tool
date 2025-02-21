import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import { VideoEditor } from "./pages/VideoEditor";
import { TitleEditor } from "./pages/TitleEditor";
import { DescriptionEditor } from "./pages/DescriptionEditor";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = '/lovable-uploads/880e1aad-df30-41d6-8cb2-6153713e2c9e.png';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="app-container">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/video" element={<VideoEditor />} />
              <Route path="/ttl" element={<TitleEditor />} />
              <Route path="/dsc" element={<DescriptionEditor />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;