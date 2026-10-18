export type CheckStatus = "PASS" | "WARNING" | "ERROR" | "NOT CHECKED";
export type SeoCheck = { name: string; status: CheckStatus; value: string; explanation: string };
export type SeoSnapshot = { path: string; title: string; checkedAt: string; checks: SeoCheck[]; h1: string[]; h2Count: number; imageCount: number; missingAltCount: number; internalLinks: number; jsonLdTypes: string[]; sitemapAvailable: boolean | null };
const PREFIX = "portfolio_seo_audit:";

export function readSeoSnapshot(path: string): SeoSnapshot | null {
  try { const value = localStorage.getItem(PREFIX + path); return value ? JSON.parse(value) as SeoSnapshot : null; } catch { return null; }
}

export async function auditCurrentPage(path: string): Promise<SeoSnapshot> {
  const title = document.title;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || "";
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || "";
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content || "";
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content || "";
  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content || "";
  const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content || "";
  const twitterCard = document.querySelector<HTMLMetaElement>('meta[name="twitter:card"]')?.content || "";
  const h1 = [...document.querySelectorAll("h1")].map(node => node.textContent?.trim() || "");
  const h2Count = document.querySelectorAll("h2").length;
  const images = [...document.querySelectorAll("img")];
  const missingAltCount = images.filter(img => !img.hasAttribute("alt") || !img.getAttribute("alt")?.trim()).length;
  const internalLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].filter(link => {
    try { return new URL(link.href).origin === location.origin; } catch { return false; }
  }).length;
  const jsonLdTypes = [...document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')].flatMap(script => {
    try { const data = JSON.parse(script.textContent || "null"); return (Array.isArray(data) ? data : [data]).map((item: { [key: string]: unknown }) => String(item?.["@type"] || "")).filter(Boolean); } catch { return []; }
  });
  let sitemapAvailable: boolean | null = null;
  try { const response = await fetch("/sitemap.xml", { method: "HEAD", cache: "no-store" }); sitemapAvailable = response.ok; } catch { /* not checked offline */ }
  const check = (name: string, value: string, present: boolean, missingStatus: CheckStatus = "WARNING"): SeoCheck => ({ name, value: value || "Missing", status: present ? "PASS" : missingStatus, explanation: present ? "Found in the rendered page." : `${name} is missing from the rendered page.` });
  const checks: SeoCheck[] = [
    check("Page title", title, Boolean(title)),
    { ...check("Meta description", description, Boolean(description)), explanation: description.length > 0 && description.length <= 160 ? "Description is present and within a typical snippet length." : description ? `Description is ${description.length} characters; review its length and wording.` : "Add a unique page summary." , status: description ? (description.length <= 160 ? "PASS" : "WARNING") : "ERROR" },
    { ...check("Canonical URL", canonical, Boolean(canonical)), status: canonical.startsWith("https://") ? "PASS" : canonical ? "WARNING" : "ERROR", explanation: canonical.startsWith("https://") ? "HTTPS canonical is present." : "Set VITE_SITE_URL to your public HTTPS domain and rebuild." },
    { ...check("Robots directive", robots, Boolean(robots)), explanation: robots || "Set an explicit robots directive." },
    check("Open Graph title", ogTitle, Boolean(ogTitle)),
    check("Open Graph description", ogDescription, Boolean(ogDescription)),
    check("Open Graph image", ogImage, Boolean(ogImage)),
    check("Twitter card", twitterCard, Boolean(twitterCard)),
    { name: "H1 heading", value: h1.length ? h1.join(" / ") : "None", status: h1.length === 1 ? "PASS" : h1.length === 0 ? "ERROR" : "WARNING", explanation: h1.length === 1 ? "One H1 is present." : h1.length === 0 ? "Add a descriptive H1 to the page." : `Found ${h1.length} H1 headings; use one primary heading where practical.` },
    { name: "Image alt text", value: `${images.length} images; ${missingAltCount} missing alt`, status: missingAltCount === 0 ? "PASS" : "WARNING", explanation: missingAltCount === 0 ? "All rendered images have alt attributes." : "Add useful alt text to informative images; use alt=\"\" for decorative images." },
    { name: "Internal links", value: String(internalLinks), status: internalLinks ? "PASS" : "WARNING", explanation: "Counted links in the current rendered page; destinations were not crawled." },
    { name: "Broken links", value: "Not checked", status: "NOT CHECKED", explanation: "This browser-side audit does not request every linked destination." },
    { name: "URL structure", value: path, status: /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/i.test(path) ? "PASS" : "WARNING", explanation: "Checked for simple lowercase, hyphen-separated path segments." },
    { name: "Sitemap", value: sitemapAvailable === null ? "Not checked" : sitemapAvailable ? "/sitemap.xml" : "Unavailable", status: sitemapAvailable === null ? "NOT CHECKED" : sitemapAvailable ? "PASS" : "ERROR", explanation: sitemapAvailable ? "Sitemap responds successfully." : sitemapAvailable === null ? "Could not verify the sitemap while offline." : "Generate sitemap.xml by setting VITE_SITE_URL and building." },
    { name: "Structured data", value: jsonLdTypes.join(", ") || "None", status: jsonLdTypes.length ? "PASS" : "WARNING", explanation: jsonLdTypes.length ? "Found JSON-LD types: " + jsonLdTypes.join(", ") : "No JSON-LD block was found on the rendered page." },
    { name: "Indexability", value: robots.toLowerCase().includes("noindex") ? "Noindex" : robots || "Not checked", status: robots.toLowerCase().includes("noindex") ? "ERROR" : robots ? "PASS" : "NOT CHECKED", explanation: robots.toLowerCase().includes("noindex") ? "This page is marked noindex." : "Only checked the page robots meta; server headers and crawler access were not checked." },
  ];
  const snapshot: SeoSnapshot = { path, title, checkedAt: new Date().toISOString(), checks, h1, h2Count, imageCount: images.length, missingAltCount, internalLinks, jsonLdTypes, sitemapAvailable };
  try { localStorage.setItem(PREFIX + path, JSON.stringify(snapshot)); } catch { /* local storage may be unavailable */ }
  return snapshot;
}

export function scoreSeo(checks: SeoCheck[]) {
  const checked = checks.filter(item => item.status !== "NOT CHECKED");
  if (!checked.length) return null;
  return Math.round(checked.filter(item => item.status === "PASS").length * 100 / checked.length);
}
