import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  BarChart3,
  FolderGit2,
  Wrench,
  MessageSquare,
  Briefcase,
  User,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  FileText,
  Info,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Building2,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { cn, initialsOf } from "@/lib/utils";
import { toast } from "sonner";
import { loadPortfolio, usePortfolio } from "@/lib/store";
import { useSiteSettings } from "@/lib/siteSettings";

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", description: "Your portfolio at a glance" },
      { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics", description: "Website traffic and SEO health" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Info, label: "About", path: "/dashboard/about", description: "Tell visitors who you are" },
      { icon: FolderGit2, label: "Projects", path: "/dashboard/projects", description: "Showcase your best work" },
      { icon: Wrench, label: "Skills", path: "/dashboard/skills", description: "Technologies and proficiency" },
      { icon: FileText, label: "Resume", path: "/dashboard/resume", description: "Experience and education" },
      { icon: MessageSquare, label: "Testimonials", path: "/dashboard/testimonials", description: "What clients say about you" },
      { icon: Briefcase, label: "Services", path: "/dashboard/services", description: "What you offer" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", path: "/dashboard/profile", description: "Your personal details" },
      { icon: Share2, label: "Social Media", path: "/dashboard/social", description: "Links to your profiles" },
      { icon: Building2, label: "Site Management", path: "/dashboard/site", description: "Website logo and launcher branding" },
    ],
  },
];
const sidebarItems = sidebarGroups.flatMap(group => group.items);

type NotificationItem = {
  text: string;
  time: string;
};

const DASHBOARD_SCROLL_KEY = "dashboard-scroll-y";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative h-10 w-10 overflow-hidden rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? "moon" : "sun"}
              initial={{ y: -18, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 18, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Light mode" : "Dark mode"}</TooltipContent>
    </Tooltip>
  );
};

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { about, status: contentStatus, error: contentError } = usePortfolio();
  const { websiteLogo } = useSiteSettings();
  const displayName = about.full_name?.trim() || "Admin";
  const initials = initialsOf(displayName) || "AD";
  const location = useLocation();
  const navigate = useNavigate();

  const notifications: NotificationItem[] = [];
  const currentItem = sidebarItems.find((item) => item.path === location.pathname);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (active) navigate("/admin", { replace: true }); return; }
      const { data: authorized, error } = await supabase.rpc("is_analytics_admin");
      if ((!authorized || error) && active) {
        await supabase.auth.signOut();
        navigate("/admin", { replace: true });
        return;
      }
      // Reload as the signed-in admin so unpublished rows are included.
      if (active) void loadPortfolio({ force: true });
    };
    void verify();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin", { replace: true });
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(DASHBOARD_SCROLL_KEY);
    if (savedScroll) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, Number(savedScroll));
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!showNotifs) return;
    const close = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showNotifs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const renderSidebar = (mobile = false) => {
    const compact = collapsed && !mobile;
    return (
      <div className="flex h-full flex-col">
        <div className={cn("flex flex-shrink-0 items-center gap-3 border-b border-sidebar-border p-4", compact && "justify-center")}>
          {websiteLogo && <img
            src={websiteLogo}
            alt="Logo"
            className={cn("flex-shrink-0 rounded-xl object-cover shadow-glow", compact ? "h-10 w-10" : "h-11 w-11")}
          />}
          {!compact && (
            <div className="min-w-0 flex-1">
              <span className="block truncate text-base font-bold text-gradient">
                {displayName.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-xs font-medium text-sidebar-foreground/70">Admin Panel</span>
            </div>
          )}
          {!mobile && !compact && (
            <button
              onClick={() => setCollapsed(true)}
              className="rounded-lg p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {compact && (
          <div className="flex flex-shrink-0 justify-center border-b border-sidebar-border py-2">
            <button
              onClick={() => setCollapsed(false)}
              className="rounded-lg p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              {!compact
                ? <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">{group.label}</p>
                : <div className="mx-auto mb-2 h-px w-8 bg-sidebar-border" />}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const link = (
                    <Link
                      to={item.path}
                      preventScrollReset
                      onClick={() => {
                        sessionStorage.setItem(DASHBOARD_SCROLL_KEY, String(window.scrollY));
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "group relative flex items-center gap-3 overflow-hidden rounded-xl px-2.5 py-2 text-sm transition-colors",
                        compact && "justify-center px-0",
                        isActive
                          ? "font-semibold text-white shadow-glow"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={mobile ? "sidebar-active-mobile" : "sidebar-active"}
                          className="absolute inset-0 bg-gradient-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className={cn(
                        "relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive ? "bg-white/20" : "bg-sidebar-accent/60 text-sidebar-foreground/80 group-hover:bg-primary/15 group-hover:text-primary",
                      )}>
                        <Icon className="h-4 w-4" />
                      </span>
                      {!compact && (
                        <>
                          <span className="relative z-10">{item.label}</span>
                          {isActive && <ChevronRight className="relative z-10 ml-auto h-4 w-4" />}
                        </>
                      )}
                    </Link>
                  );

                  return compact ? (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : <div key={item.path}>{link}</div>;
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn("flex-shrink-0 border-t border-sidebar-border p-3", compact && "flex flex-col items-center gap-2")}>
          {!compact ? (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
              <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-primary/30">
                <AvatarImage src={about.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user?.email || "Admin"}</p>
                <p className="text-xs text-primary">Super Admin</p>
              </div>
            </div>
          ) : (
            <Avatar className="mb-1 h-9 w-9 border-2 border-primary/30">
              <AvatarImage src={about.avatar_url} />
              <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-white">{initials}</AvatarFallback>
            </Avatar>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive",
                  compact ? "h-10 w-10 justify-center p-0" : "w-full justify-start gap-3",
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!compact && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {compact && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-bg min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-sidebar-border bg-sidebar/85 backdrop-blur-xl transition-[width] duration-300 lg:block",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {renderSidebar()}
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 border-r border-sidebar-border bg-sidebar p-0">
          {renderSidebar(true)}
        </SheetContent>
      </Sheet>

      <main className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "lg:ml-20" : "lg:ml-72")}>
        <header
          className={cn(
            "sticky top-0 z-30 border-b px-4 py-3 transition-all duration-300 sm:px-6",
            isScrolled ? "border-border/60 bg-background/80 shadow-sm backdrop-blur-xl" : "border-transparent",
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="h-10 w-10 flex-shrink-0 rounded-xl border border-border/60 bg-card/60 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <span>Dashboard</span>
                {currentItem && currentItem.path !== "/dashboard" && <><ChevronRight className="h-3 w-3" /><span className="text-foreground/80">{currentItem.label}</span></>}
              </div>
              <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">{currentItem?.label || "Dashboard"}</h1>
              <p className="hidden truncate text-sm text-muted-foreground md:block">{currentItem?.description || "Manage your portfolio content"}</p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <div className="mr-1 hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 xl:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Online</span>
              </div>

              <Button asChild className="h-10 gap-2 rounded-xl bg-gradient-primary px-3 text-white shadow-glow hover:opacity-90 sm:px-4">
                <a href="/" target="_blank" rel="noopener noreferrer" aria-label="View website">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">View Website</span>
                  <ExternalLink className="hidden h-3.5 w-3.5 opacity-80 sm:inline" />
                </a>
              </Button>

              <ThemeToggle />

              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  onClick={() => setShowNotifs((prev) => !prev)}
                  className="relative h-10 w-10 rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
                </Button>

                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl"
                    >
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notifications</p>
                      {notifications.map((notification, index) => (
                        <div key={index} className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-muted">
                          <p className="text-sm">{notification.text}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      ))}
                      {!notifications.length && <p className="px-3 py-3 text-sm text-muted-foreground">You're all caught up.</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {contentStatus === "error" && location.pathname !== "/dashboard/analytics" ? (
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <h2 className="text-lg font-semibold text-foreground">Portfolio content could not be loaded</h2>
              <p className="mt-2 break-words text-sm text-muted-foreground">{contentError}</p>
              <p className="mt-2 text-xs text-muted-foreground">Editing is paused so nothing is overwritten. Check that the Supabase migration has been applied.</p>
              <Button className="mt-5" variant="outline" onClick={() => void loadPortfolio({ force: true })}>Try again</Button>
            </div>
          ) : (
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
