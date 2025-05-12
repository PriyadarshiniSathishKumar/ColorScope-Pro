
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ColorPickerPage from "./pages/ColorPickerPage";
import NoiseRemoverPage from "./pages/NoiseRemoverPage";
import CompressionPage from "./pages/CompressionPage";
import SegmentationPage from "./pages/SegmentationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/color-picker" element={<ColorPickerPage />} />
          <Route path="/noise-remover" element={<NoiseRemoverPage />} />
          <Route path="/compression" element={<CompressionPage />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
