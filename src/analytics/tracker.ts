import { supabase } from "@/lib/supabase";
import { getAbout } from "@/lib/store";

const VISITOR_KEY = "portfolio_analytics_visitor";
const SESSION_KEY = "portfolio_analytics_session";
const SESSION_IDLE_MS = 30 * 60 * 1000;

export type TrafficClass = "human" | "bot" | "unknown";
export type SeoPage = { path: string; name: string; type: string };
export const PUBLIC_PAGES: SeoPage[] = [
  { path: "/", name: "Home", type: "home" },
  { path: "/about", name: "About", type: "about" },
  { path: "/projects", name: "Projects", type: "projects" },
  { path: "/skills", name: "Skills", type: "skills" },
  { path: "/resume", name: "Resume", type: "resume" },
  { path: "/services", name: "Services", type: "services" },
  { path: "/testimonials", name: "Testimonials", type: "testimonials" },
  { path: "/contact", name: "Contact", type: "contact" },
];

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) { id = uuid(); localStorage.setItem(VISITOR_KEY, id); }
    return id;
  } catch { return uuid(); }
}

function getSessionId(): string {
  try {
    const now = Date.now();
    const previous = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null") as { id: string; last: number } | null;
    if (previous && now - previous.last < SESSION_IDLE_MS) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...previous, last: now }));
      return previous.id;
    }
    const id = uuid();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
    return id;
  } catch { return uuid(); }
}

function classifySource(referrer: string, params: URLSearchParams): string {
  const utmSource = params.get("utm_source");
  if (utmSource) return utmSource.slice(0, 100);
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (/google\./.test(host)) return "Google";
    if (/bing\.com$/.test(host)) return "Bing";
    if (/facebook\.com$|fb\.com$/.test(host)) return "Facebook";
    if (/instagram\.com$/.test(host)) return "Instagram";
    if (/linkedin\.com$/.test(host)) return "LinkedIn";
    if (/youtube\.com$|youtu\.be$/.test(host)) return "YouTube";
    if (/github\.com$/.test(host)) return "GitHub";
    if (/search|duckduckgo|yandex|baidu/.test(host)) return "Other Search";
    return "Other Referral";
  } catch { return "Unknown"; }
}

function clientDetails() {
  const ua = navigator.userAgent;
  const device = /iPad|Tablet|PlayBook|Silk/i.test(ua) ? "Tablet" : /Mobi|Android|iPhone|iPod/i.test(ua) ? "Mobile" : "Desktop";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Unknown";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown";
  return { device, browser, os };
}

function safeReferrer(): string {
  try {
    if (!document.referrer) return "";
    const url = new URL(document.referrer);
    return `${url.origin}${url.pathname}`.slice(0, 1000);
  } catch { return ""; }
}

function currentAttribution() {
  const params = new URLSearchParams(window.location.search);
  const referrer = safeReferrer();
  const source = classifySource(referrer, params);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 100);
  }
  return { referrer, source, utm };
}

export async function trackPageView(path: string): Promise<void> {
  if (!path.startsWith("/") || path.startsWith("/dashboard") || path === "/admin") return;
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const details = clientDetails();
    const attribution = currentAttribution();
    const route = path.split("?")[0].slice(0, 500) || "/";
    const page = PUBLIC_PAGES.find(item => item.path === route) ?? { path: route, name: route.split("/").filter(Boolean).at(-1) || "Home", type: "page" };
    const { error } = await supabase.rpc("track_analytics_page_view", {
      p_visitor_id: visitorId,
      p_session_id: sessionId,
      p_route: route,
      p_page_title: page.path === "/" ? (getAbout().full_name || "Portfolio") : `${page.name} | ${getAbout().full_name || "Portfolio"}`,
      p_page_type: page.type,
      p_referrer: attribution.referrer || null,
      p_source: attribution.source,
      p_utm: attribution.utm,
      p_device_type: details.device,
      p_browser: details.browser,
      p_operating_system: details.os,
      p_user_agent: navigator.userAgent.slice(0, 500),
    });
    if (error) console.debug("Portfolio analytics unavailable", error.message);
    trackPerformance(route);
  } catch (error) {
    console.debug("Portfolio analytics unavailable", error);
  }
}

export async function trackAnalyticsEvent(eventName: string, metadata: Record<string, unknown> = {}): Promise<void> {
  try {
    const { error } = await supabase.rpc("track_analytics_event", {
      p_visitor_id: getVisitorId(),
      p_session_id: getSessionId(),
      p_event_name: eventName,
      p_route: `${location.pathname}${location.hash}`.split("?")[0].slice(0, 500),
      p_metadata: metadata,
    });
    if (error) console.debug("Portfolio analytics event unavailable", error.message);
  } catch (error) { console.debug("Portfolio analytics event unavailable", error); }
}

let performanceSent = false;
function trackPerformance(route: string): void {
  if (performanceSent || typeof PerformanceObserver === "undefined") return;
  performanceSent = true;
  const values: Record<string, number> = {};
  let sent = false;
  const send = () => {
    if (sent) return;
    sent = true;
    if (Object.keys(values).length) void trackAnalyticsEvent("performance_metrics", { route, ...values });
  };
  try {
    for (const [entry, key] of [["paint", "paint_ms"], ["largest-contentful-paint", "lcp_ms"], ["layout-shift", "cls"]] as const) {
      const observer = new PerformanceObserver(list => {
        for (const item of list.getEntries() as (PerformanceEntry & { value?: number; hadRecentInput?: boolean })[]) {
          if (entry === "paint" && item.name === "first-contentful-paint") values[key] = Math.round(item.startTime);
          if (entry === "largest-contentful-paint") values[key] = Math.round(item.startTime);
          if (entry === "layout-shift" && !item.hadRecentInput) values[key] = Number(((values[key] || 0) + (item.value || 0)).toFixed(4));
        }
      });
      observer.observe({ type: entry, buffered: true });
    }
    window.addEventListener("pagehide", send, { once: true });
    setTimeout(send, 10_000);
  } catch { /* Unsupported browser timing entries are simply unavailable. */ }
}

