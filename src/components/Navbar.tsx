import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { getAbout } from "@/lib/store";

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

const Navbar = () => {
  const about = getAbout();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-3">
      <div
        className={`relative mx-auto max-w-7xl rounded-2xl ${
          scrolled ? "backdrop-blur-md shadow-lg" : "backdrop-blur-sm"
        }`}
      >
        <div
          className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full ${
            scrolled ? "bg-primary/60" : "bg-primary/25"
          }`}
        />

        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between md:h-16">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-40 blur-sm" />
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="relative h-10 w-10 rounded-xl object-cover ring-2 ring-primary/30"
                />
              </div>

              <span className="bg-gradient-primary bg-clip-text text-xl font-bold tracking-tight text-transparent md:text-2xl">
                {about.full_name}
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div className="relative overflow-hidden rounded-lg px-3 py-1.5">
                    {isActivePath(item.path) && (
                      <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-primary" />
                    )}

                    <span
                      className={`relative z-10 text-sm font-medium ${
                        isActivePath(item.path) ? "text-primary" : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-2 rounded-full border border-border/50 text-foreground/70 transition-none hover:border-primary/50 hover:bg-transparent hover:text-primary active:bg-transparent focus:bg-transparent"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border border-border/50 text-foreground/70 transition-none hover:border-primary/50 hover:bg-transparent hover:text-primary active:bg-transparent focus:bg-transparent"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-full border border-border/50 text-foreground/70 transition-none hover:border-primary/50 hover:bg-transparent hover:text-primary active:bg-transparent focus:bg-transparent"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {isOpen && (
            <div className="px-4 md:hidden">
              <div className="flex flex-col gap-1 pb-4 pt-2">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
                        isActivePath(item.path)
                          ? "rounded-b-none border-b-2 border-primary/50 text-primary"
                          : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActivePath(item.path) && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
