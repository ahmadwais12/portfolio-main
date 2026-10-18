import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { usePortfolio } from "@/lib/store";
import { useUiText } from "@/lib/localization";

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Resume", path: "/resume" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

const iconButton =
  "relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/80 transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

const Navbar = () => {
  const { about } = usePortfolio();
  const t = useUiText();
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const isActivePath = (path: string) => location.pathname === path;
  const brandName = about.full_name.trim() || "Portfolio";

  const themeToggle = (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={iconButton}
      aria-label={isDark ? t("nav.switchToLightTheme", "Switch to light theme") : t("nav.switchToDarkTheme", "Switch to dark theme")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4" aria-label={t("nav.mainNavigation", "Main navigation")}>
      <div
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl border transition-all duration-500 ${
          scrolled || isOpen
            ? "border-border/60 bg-background/75 shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.35)] backdrop-blur-xl"
            : "border-white/10 bg-background/30 backdrop-blur-md"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-5">
          <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label={`${brandName} – home`}>
            <div className="min-w-0 leading-tight">
              <span className="block truncate bg-gradient-primary bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
                {brandName}
              </span>
            </div>
          </Link>

          <div className="hidden items-center rounded-full border border-border/50 bg-background/40 p-1 lg:flex">
            {navItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors xl:px-4 ${
                    active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{t(`nav.${item.name.toLowerCase()}`, item.name)}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {themeToggle}

            <Link
              to="/contact"
              className="group hidden items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] sm:flex"
            >
              {t("nav.hireMe", "Hire Me")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`${iconButton} lg:hidden`}
              aria-label={isOpen ? t("nav.closeMenu", "Close menu") : t("nav.openMenu", "Open menu")}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="grid grid-cols-2 gap-2 border-t border-border/50 px-3 pb-4 pt-3 sm:grid-cols-4 sm:px-5">
                {navItems.map((item, i) => {
                  const active = isActivePath(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                    >
                      <Link
                        to={item.path}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border/50 bg-background/40 text-foreground/80 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {t(`nav.${item.name.toLowerCase()}`, item.name)}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <Link
                  to="/contact"
                  className="col-span-2 mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow sm:hidden"
                >
                  {t("nav.hireMe", "Hire Me")} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
};

export default Navbar;
