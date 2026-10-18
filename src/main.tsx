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
import CreateUser from "./pages/dashboard/CreateUser";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsManager from "./pages/dashboard/ProjectsManager";
import SkillsManager from "./pages/dashboard/SkillsManager";
import TestimonialsManager from "./pages/dashboard/TestimonialsManager";
import ServicesManager from "./pages/dashboard/ServicesManager";
import ProfileManager from "./pages/dashboard/ProfileManager";
import AboutManager from "./pages/dashboard/AboutManager";
import ResumeManager from "./pages/dashboard/ResumeManager";
import SocialManager from "./pages/dashboard/SocialManager";
import AnalyticsTracker from "./analytics/AnalyticsTracker";
import SeoManager from "./analytics/SeoManager";
import SiteIntro from "./components/SiteIntro";
import AnalyticsDashboard from "./pages/dashboard/AnalyticsDashboard";
import SiteManagement from "./pages/dashboard/SiteManagement";
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
            <AnalyticsTracker />
            <SeoManager />
            <SiteIntro />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminLogin onLogin={() => { window.location.href = '/dashboard'; }} />} />
              <Route path="/admin/create-user" element={<CreateUser />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="site" element={<SiteManagement />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="resume" element={<ResumeManager />} />
                <Route path="social" element={<SocialManager />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
