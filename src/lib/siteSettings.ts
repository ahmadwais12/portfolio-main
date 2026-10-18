import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

export type UiTranslations = Record<string, Partial<Record<"en", string>>>;
export type SiteSettings = { websiteLogo: string; launcherLogo: string; launcherText: string; launcherText_en: string; uiTranslations: UiTranslations };
const defaults: SiteSettings = { websiteLogo: "", launcherLogo: "", launcherText: "Portfolio", launcherText_en: "Portfolio", uiTranslations: {} };
let value = defaults;
let loaded = false;
let request: Promise<void> | null = null;
const listeners = new Set<() => void>();
const publish = (next: SiteSettings) => { value = next; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

export function loadSiteSettings() {
  if (loaded) return Promise.resolve();
  if (request) return request;
  request = (async () => {
    const { data, error } = await supabase.from("portfolio_settings").select("extra,launcher_text_en").eq("id", "main").maybeSingle();
    if (!error && data?.extra && typeof data.extra === "object") {
      const extra = data.extra as Record<string, unknown>;
      const launcherText = typeof data.launcher_text_en === "string" && data.launcher_text_en ? data.launcher_text_en : typeof extra.launcherText === "string" && extra.launcherText ? extra.launcherText : defaults.launcherText;
      publish({ websiteLogo: typeof extra.websiteLogo === "string" && extra.websiteLogo !== "/logo.png" ? extra.websiteLogo : defaults.websiteLogo,
        launcherLogo: typeof extra.launcherLogo === "string" && extra.launcherLogo !== "/logo.png" ? extra.launcherLogo : defaults.launcherLogo,
        launcherText, launcherText_en: launcherText,
        uiTranslations: extra.uiTranslations && typeof extra.uiTranslations === "object" ? extra.uiTranslations as UiTranslations : {} });
    }
    loaded = true;
  })().finally(() => { request = null; });
  return request;
}

export async function saveSiteSettings(settings: SiteSettings) {
  const { data, error: readError } = await supabase.from("portfolio_settings").select("extra").eq("id", "main").maybeSingle();
  if (readError) throw new Error(readError.message);
  const extra = data?.extra && typeof data.extra === "object" ? data.extra as Record<string, unknown> : {};
  const launcherText = settings.launcherText_en || settings.launcherText;
  const { uiTranslations: _uiTranslations, ...persistedSettings } = settings;
  const { error } = await supabase.from("portfolio_settings").upsert({
    id: "main",
    launcher_text_en: launcherText,
    extra: { ...extra, ...persistedSettings, launcherText },
  }, { onConflict: "id" });
  if (error) throw new Error(error.message);
  loaded = true;
  publish({ ...settings, launcherText });
}

export function useSiteSettings() {
  const settings = useSyncExternalStore(subscribe, () => value, () => defaults);
  useEffect(() => { void loadSiteSettings(); }, []);
  return settings;
}
