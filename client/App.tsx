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
            <Route
              path="/lost-found"
              element={
                <PlaceholderPage
                  title="Lost & Found Portal"
                  description="Community-powered platform to help find lost items and reunite them with their owners."
                />
              }
            />
            <Route
              path="/events"
              element={
                <PlaceholderPage
                  title="Local Events Calendar"
                  description="Discover community events, festivals, and activities happening in your neighborhood."
                />
              }
            />
            <Route
              path="/emergency"
              element={
                <PlaceholderPage
                  title="Emergency Services"
                  description="Quick access to emergency contacts, SOS features, and safety resources."
                />
              }
            />
            <Route
              path="/community"
              element={
                <PlaceholderPage
                  title="Community Chat"
                  description="Connect with your neighbors, share information, and stay updated on local news."
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
