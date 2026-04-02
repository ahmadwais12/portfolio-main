import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ResumePage from "./pages/ResumePage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
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
import AboutManager from "./pages/dashboard/AboutManager";
import ResumeManager from "./pages/dashboard/ResumeManager";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminLogin onLogin={() => { localStorage.setItem('admin_auth', 'true'); window.location.href = '/dashboard'; }} />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="resume" element={<ResumeManager />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);