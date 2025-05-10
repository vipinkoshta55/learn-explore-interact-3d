
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import SubjectPage from "./pages/SubjectPage";
import ExperimentPage from "./pages/ExperimentPage";
import QuizPage from "./pages/QuizPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPages from "./pages/AuthPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/:authType" element={<AuthPages />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/subjects/:subjectId" element={<SubjectPage />} />
              <Route path="/experiments/:experimentId" element={<ExperimentPage />} />
              <Route path="/experiments/:experimentId/quiz" element={<QuizPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
