import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/dashboard/AdminLogin";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsManager from "./pages/dashboard/ProjectsManager";
import SkillsManager from "./pages/dashboard/SkillsManager";
import TestimonialsManager from "./pages/dashboard/TestimonialsManager";
import ServicesManager from "./pages/dashboard/ServicesManager";
import ProfileManager from "./pages/dashboard/ProfileManager";
import SettingsManager from "./pages/dashboard/SettingsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLogin onLogin={() => { localStorage.setItem('admin_auth', 'true'); window.location.href = '/dashboard'; }} />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
