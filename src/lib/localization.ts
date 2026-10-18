import { useEffect, useSyncExternalStore } from "react";
import { useSiteSettings } from "@/lib/siteSettings";

export type ContentLanguage = "en";
export type LocalizedValues = { en: string };

const languageListeners = new Set<() => void>();
const subscribeLanguage = (listener: () => void) => {
  languageListeners.add(listener);
  return () => languageListeners.delete(listener);
};
const getStoredLanguage = (): ContentLanguage => {
  return "en";
};

export function setContentLanguage(language: ContentLanguage) {
  void language;
  languageListeners.forEach(listener => listener());
}

export function useContentLanguage(): ContentLanguage {
  const language = useSyncExternalStore(subscribeLanguage, getStoredLanguage, () => "en" as ContentLanguage);
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, [language]);
  return language;
}

export function useUiText() {
  const language = useContentLanguage();
  const { uiTranslations } = useSiteSettings();
  return (key: string, fallback: string) => {
    const values = uiTranslations[key];
    return values?.[language]?.trim() || values?.en?.trim() || fallback;
  };
}

export function localizedText(source: object, field: string, language: ContentLanguage): string {
  const row = source as Record<string, unknown>;
  void language;
  const english = row[`${field}_en`];
  if (typeof english === "string" && english.trim()) return english;
  const base = row[field];
  return typeof base === "string" ? base : "";
}

export function localizedValues(source: object, field: string): LocalizedValues {
  const row = source as Record<string, unknown>;
  const value = (key: string): string => Array.isArray(row[key]) ? (row[key] as unknown[]).map(String).join(", ") : typeof row[key] === "string" ? row[key] as string : "";
  return { en: value(`${field}_en`) || value(field) };
}

export function splitLocalizedList(value: string): string[] {
  return value.split(/[\n,]/).map(item => item.trim()).filter(Boolean);
}
