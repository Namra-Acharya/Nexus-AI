import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calculators from "./pages/Calculators";
import Converters from "./pages/Converters";
import StudyTools from "./pages/StudyTools";
import AITools from "./pages/AITools";
import Productivity from "./pages/Productivity";
import Extras from "./pages/Extras";
import ChatBot from "./pages/ChatBot";
import GroupHubPage from "./pages/GroupHub";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/converters" element={<Converters />} />
            <Route path="/study-tools" element={<StudyTools />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/extras" element={<Extras />} />
            <Route path="/group" element={<GroupHubPage />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
