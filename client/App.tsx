import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Transport from "./pages/Transport";
import Waste from "./pages/Waste";
import PlaceholderPage from "./pages/PlaceholderPage";
import Report from "./pages/Report";
import LostFound from "./pages/LostFound";
import Events from "./pages/Events";
import Emergency from "./pages/Emergency";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/report" element={<Report />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/events" element={<Events />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/community" element={<Community />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
