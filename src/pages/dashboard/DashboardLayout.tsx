import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  MessageSquare,
  Briefcase,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  FileText,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getAbout } from "@/lib/store";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Info, label: "About", path: "/dashboard/about" },
  { icon: FolderGit2, label: "Projects", path: "/dashboard/projects" },
  { icon: Wrench, label: "Skills", path: "/dashboard/skills" },
  { icon: FileText, label: "Resume", path: "/dashboard/resume" },
  { icon: MessageSquare, label: "Testimonials", path: "/dashboard/testimonials" },
  { icon: Briefcase, label: "Services", path: "/dashboard/services" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

type NotificationItem = {
  text: string;
  time: string;
};

type MainContentProps = {
  isScrolled: boolean;
  showNotifs: boolean;
  setShowNotifs: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: NotificationItem[];
  location: ReturnType<typeof useLocation>;
};

const DASHBOARD_SCROLL_KEY = "dashboard-scroll-y";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const about = getAbout();
  const location = useLocation();
  const navigate = useNavigate();

  const notifications: NotificationItem[] = [
    { text: "Project updated successfully", time: "2m ago" },
    { text: "New skill added", time: "1h ago" },
    { text: "Profile saved", time: "Yesterday" },
  ];

  useEffect(() => {
    if (!localStorage.getItem("admin_auth")) {
      navigate("/admin");
    }
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

  const handleLogout = async () => {
    localStorage.removeItem("admin_auth");
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div
        className={`flex-shrink-0 border-b border-border/50 p-4 ${
          collapsed && !mobile ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-xl p-1 ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <img
            src="/logo.png"
            alt="AWS Logo"
            className={`rounded-xl object-cover shadow-glow flex-shrink-0 ${
              collapsed && !mobile ? "h-10 w-10" : "h-12 w-12"
            }`}
          />
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <span className="block truncate bg-gradient-primary bg-clip-text text-base font-bold text-transparent">
                {about.full_name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {!mobile && (
        <div className="flex flex-shrink-0 justify-center border-b border-border/50 px-3 py-2">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-transparent hover:text-primary transition-none"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const linkContent = (
            <Link
              to={item.path}
              preventScrollReset
              onClick={() => {
                sessionStorage.setItem(DASHBOARD_SCROLL_KEY, String(window.scrollY));
                setIsMobileMenuOpen(false);
              }}
              className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 ${
                collapsed && !mobile ? "justify-center" : ""
              } ${
                isActive
                  ? "font-medium text-white"
                  : "text-muted-foreground hover:bg-transparent hover:text-primary"
              }`}
            >
              {isActive && <div className="absolute inset-0 bg-gradient-primary" />}
              <div className={`relative z-10 rounded-lg p-2 flex-shrink-0 ${isActive ? "bg-white/20" : ""}`}>
                <Icon className="h-4 w-4" />
              </div>
              {(!collapsed || mobile) && (
                <>
                  <span className="relative z-10 text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="relative z-10 ml-auto h-4 w-4" />}
                </>
              )}
            </Link>
          );

          if (collapsed && !mobile) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{linkContent}</div>;
        })}
      </nav>

      <div
        className={`flex-shrink-0 border-t border-border/50 p-3 ${
          collapsed && !mobile ? "flex flex-col items-center gap-2" : ""
        }`}
      >
        {(!collapsed || mobile) ? (
          <div className="mb-2 flex cursor-default items-center gap-3 rounded-xl px-3 py-2">
            <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-primary/20">
              <AvatarImage src="/profile.jpg" />
              <AvatarFallback className="bg-gradient-primary text-xs text-white">AW</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.email || "Admin"}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        ) : (
          <Avatar className="mb-1 h-9 w-9 border-2 border-primary/20">
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback className="bg-gradient-primary text-xs text-white">AW</AvatarFallback>
          </Avatar>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={`text-muted-foreground transition-none hover:bg-transparent hover:text-red-500 ${
                collapsed && !mobile ? "h-10 w-10 justify-center p-0" : "w-full justify-start gap-3"
              }`}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {(!collapsed || mobile) && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && !mobile && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed z-40 hidden h-full overflow-hidden border-r border-border/50 bg-card/50 backdrop-blur-xl lg:block ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <SidebarContent />
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 glass-card">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-r border-border/50 bg-card/95 p-0 backdrop-blur-xl">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>

      <main className={`hidden min-h-screen flex-1 lg:block ${collapsed ? "ml-20" : "ml-72"}`}>
        <MainContent
          isScrolled={isScrolled}
          showNotifs={showNotifs}
          setShowNotifs={setShowNotifs}
          notifications={notifications}
          location={location}
        />
      </main>

      <main className="min-h-screen flex-1 lg:hidden">
        <MainContent
          isScrolled={isScrolled}
          showNotifs={showNotifs}
          setShowNotifs={setShowNotifs}
          notifications={notifications}
          location={location}
        />
      </main>
    </div>
  );
};

const MainContent = ({
  isScrolled,
  showNotifs,
  setShowNotifs,
  notifications,
  location,
}: MainContentProps) => {
  return (
    <>
      <motion.header
        className={`sticky top-0 z-30 px-6 py-4 transition-all duration-300 ${
          isScrolled ? "glass-card border-b border-border/50" : ""
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
              {sidebarItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifs((prev) => !prev)}
                className="relative rounded-lg p-2 transition-none hover:bg-transparent"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 z-50 w-72 rounded-xl glass-card p-2 shadow-2xl"
                  >
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Notifications
                    </p>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-lg px-3 py-2.5 transition-none hover:bg-muted/40"
                      >
                        <p className="text-sm">{notification.text}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="h-2 w-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">System Online</span>
          </div>
        </div>
      </motion.header>

      <div className="p-6 lg:p-8">
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
