import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "@/lib/store";
import { PUBLIC_PAGES } from "@/analytics/tracker";
import { auditCurrentPage } from "@/analytics/seoAudit";
import { useSiteSettings } from "@/lib/siteSettings";
import { splitLocalizedList } from "@/lib/localization";

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "");
const pageDescriptions: Record<string, (name: string, bio: string) => string> = {
  "/": (name, bio) => bio || `${name || "Portfolio"} — portfolio and selected work.`,
  "/about": (_name, bio) => bio,
  "/projects": () => "Browse selected projects, portfolio work, and details about each project.",
  "/skills": () => "Technical skills and technologies used across portfolio projects.",
  "/resume": () => "Professional experience, education, certifications, and resume.",
  "/services": () => "Services and capabilities listed in the portfolio.",
  "/testimonials": () => "Client testimonials and feedback.",
  "/contact": () => "Contact details and ways to get in touch.",
};

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attribute, name); document.head.append(tag); }
  tag.content = content;
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const { about } = usePortfolio();
  const { launcherLogo, launcherText } = useSiteSettings();
  useEffect(() => {
    const page = PUBLIC_PAGES.find(item => item.path === pathname);
    const pageName = page?.name ?? (pathname.split("/").filter(Boolean).at(-1) || "Page");
    const title = `${pageName === "Home" ? "" : `${pageName} | `}${launcherText || about.full_name || "Portfolio"}`;
    document.title = title;
    let icon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (launcherLogo) {
      if (!icon) { icon = document.createElement("link"); icon.rel = "icon"; document.head.append(icon); }
      icon.href = launcherLogo;
    } else {
      icon?.remove();
    }
    const description = (pageDescriptions[pathname]?.(about.full_name, about.bio.split("\n")[0]) || `${pageName} — ${about.full_name || "portfolio"}`).replace(/\s+/g, " ").slice(0, 300);
    const privateRoute = pathname === "/admin" || pathname.startsWith("/dashboard");
    document.title = title;
    setMeta("description", description);
    setMeta("robots", privateRoute ? "noindex, nofollow" : "index, follow");
    setMeta("og:type", "website", "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${SITE_URL || window.location.origin}${pathname}`, "property");
    if (about.avatar_url) setMeta("og:image", about.avatar_url, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (about.avatar_url) setMeta("twitter:image", about.avatar_url);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = `${SITE_URL || window.location.origin}${pathname}`;

    document.head.querySelector("script[data-portfolio-jsonld]")?.remove();
    if (!privateRoute && about.full_name) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.portfolioJsonld = "true";
      script.textContent = JSON.stringify([
        { "@context": "https://schema.org", "@type": "Person", name: about.full_name, jobTitle: splitLocalizedList(about.title.replace(/\|/g, ",")).join(" / ") || undefined, description: about.bio || undefined, url: SITE_URL || window.location.origin, image: about.avatar_url || undefined, email: about.email || undefined, sameAs: Object.values(about.social_links).filter(Boolean) },
        { "@context": "https://schema.org", "@type": "WebSite", name: about.full_name, url: SITE_URL || window.location.origin },
        { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${SITE_URL || window.location.origin}${pathname}`, isPartOf: { "@type": "WebSite", name: about.full_name, url: SITE_URL || window.location.origin } },
      ]);
      document.head.append(script);
    }
    if (!privateRoute) void auditCurrentPage(pathname);
  }, [pathname, about, launcherLogo, launcherText]);
  return null;
}
