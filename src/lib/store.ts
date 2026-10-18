// Shared portfolio content store backed by Supabase.
// The dashboard writes through the save* functions; the website reads through usePortfolio()/get*().

import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { localizedText, useContentLanguage } from "@/lib/localization";

export type SocialLinks = {
  github: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
};

type TextTranslations<K extends string> = {
  [P in K as `${P}_en`]?: string;
};
type ListTranslations<K extends string> = {
  [P in K as `${P}_en`]?: string[];
};

export type AboutData = {
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  years_experience: string;
  projects_completed: string;
  technologies: string;
  resume_url: string;
  avatar_url: string;
  social_links: SocialLinks;
} & TextTranslations<'full_name' | 'title' | 'bio' | 'email' | 'phone' | 'location' | 'years_experience' | 'projects_completed' | 'technologies'>;

export type ResumeItem = {
  id: string;
  type: 'work' | 'education' | 'certification';
  type_label?: string;
  title: string;
  organization: string;
  period: string;
  description: string;
} & TextTranslations<'title' | 'organization' | 'period' | 'description' | 'type_label'>;

export type SkillItem = {
  id: string;
  name: string;
  category: string;
  level: number;
} & TextTranslations<'name' | 'category'>;

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
} & TextTranslations<'title' | 'description'> & ListTranslations<'features'>;

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
} & TextTranslations<'name' | 'role' | 'company' | 'content'>;

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image: string;
  tags: string[];
  category: string;
  favorite: boolean;
  github_url: string;
  demo_url: string;
} & TextTranslations<'title' | 'description' | 'long_description' | 'category'> & ListTranslations<'tags'>;

export type SocialLinkItem = {
  id: string;
  label: string;
  icon: string;   // key resolved in @/lib/socials
  sub: string;    // small caption shown under the label on the site
  url: string;
  color: string;  // brand color (hex)
  enabled: boolean; // shown on the website when true + url filled
} & TextTranslations<'label' | 'sub'>;

type AboutTranslationFields = TextTranslations<'full_name' | 'title' | 'bio' | 'email' | 'phone' | 'location' | 'years_experience' | 'projects_completed' | 'technologies'>;
const emptyAbout: AboutData = {
  full_name: "", title: "", bio: "", email: "", phone: "", location: "", years_experience: "", projects_completed: "", technologies: "", resume_url: "", avatar_url: "", social_links: { github: "", linkedin: "", twitter: "", whatsapp: "" },
  ...Object.fromEntries((['full_name', 'title', 'bio', 'email', 'phone', 'location', 'years_experience', 'projects_completed', 'technologies'] as const).map(field => [`${field}_en`, ''])) as AboutTranslationFields,
};

const defaultSocialLinksBase: Omit<SocialLinkItem, keyof TextTranslations<'label' | 'sub'>>[] = [
  { id: 'github',     label: 'GitHub',       icon: 'github',     sub: 'View my repos',      url: '', color: '#6e7681', enabled: true },
  { id: 'linkedin',   label: 'LinkedIn',     icon: 'linkedin',   sub: "Let's connect",      url: '', color: '#0a66c2', enabled: true },
  { id: 'x',          label: 'X',            icon: 'x',          sub: 'Follow updates',     url: '', color: '#1d9bf0', enabled: true },
  { id: 'instagram',  label: 'Instagram',    icon: 'instagram',  sub: 'Behind the scenes',  url: '', color: '#e1306c', enabled: true },
  { id: 'facebook',   label: 'Facebook',     icon: 'facebook',   sub: 'Stay in touch',      url: '', color: '#1877f2', enabled: true },
  { id: 'youtube',    label: 'YouTube',      icon: 'youtube',    sub: 'Watch my videos',    url: '', color: '#ff0033', enabled: true },
  { id: 'tiktok',     label: 'TikTok',       icon: 'tiktok',     sub: 'Short clips',        url: '', color: '#fe2c55', enabled: true },
  { id: 'whatsapp',   label: 'WhatsApp',     icon: 'whatsapp',   sub: 'Chat with me',       url: '', color: '#25d366', enabled: true },
  { id: 'telegram',   label: 'Telegram',     icon: 'telegram',   sub: 'Message me',         url: '', color: '#2aabee', enabled: true },
  { id: 'discord',    label: 'Discord',      icon: 'discord',    sub: 'Join my server',     url: '', color: '#5865f2', enabled: true },
  { id: 'reddit',     label: 'Reddit',       icon: 'reddit',     sub: 'My discussions',     url: '', color: '#ff4500', enabled: true },
  { id: 'dribbble',   label: 'Dribbble',     icon: 'dribbble',   sub: 'Design shots',       url: '', color: '#ea4c89', enabled: true },
  { id: 'behance',    label: 'Behance',      icon: 'behance',    sub: 'Creative work',      url: '', color: '#1769ff', enabled: true },
  { id: 'stackoverflow', label: 'Stack Overflow', icon: 'stackoverflow', sub: 'Answers I wrote', url: '', color: '#f48024', enabled: true },
  { id: 'medium',     label: 'Medium',       icon: 'medium',     sub: 'Articles & posts',   url: '', color: '#00ab6c', enabled: true },
  { id: 'hashnode',   label: 'Hashnode',     icon: 'hashnode',   sub: 'Dev blog',           url: '', color: '#2962ff', enabled: true },
  { id: 'spotify',    label: 'Spotify',      icon: 'spotify',    sub: 'Playlists I love',   url: '', color: '#1db954', enabled: true },
  { id: 'leetcode',   label: 'LeetCode',     icon: 'leetcode',   sub: 'Coding challenges',  url: '', color: '#ffa116', enabled: true },
];
const defaultSocialLinks: SocialLinkItem[] = defaultSocialLinksBase.map(item => ({
  ...item, label_en: item.label, sub_en: item.sub,
}));

// ─── In-memory snapshot + subscription ───

export type PortfolioStatus = "idle" | "loading" | "ready" | "error";

export type PortfolioSnapshot = {
  status: PortfolioStatus;
  error: string | null;
  about: AboutData;
  resume: ResumeItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  projects: ProjectItem[];
  socialLinks: SocialLinkItem[];
};

let snapshot: PortfolioSnapshot = {
  status: "idle",
  error: null,
  about: emptyAbout,
  resume: [],
  skills: [],
  services: [],
  testimonials: [],
  projects: [],
  socialLinks: defaultSocialLinks.map(item => ({ ...item })),
};
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;
let portfolioSyncStarted = false;
let portfolioRefreshTimer: ReturnType<typeof setTimeout> | null = null;

const setSnapshot = (patch: Partial<PortfolioSnapshot>) => {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach(listener => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

const str = (value: unknown) => (typeof value === "string" ? value : value == null ? "" : String(value));
const strList = (value: unknown) => (Array.isArray(value) ? value.map(str).filter(Boolean) : []);
type Row = Record<string, unknown>;
const localized = (row: Row, field: string) => ({
  [`${field}_en`]: str(row[`${field}_en`]) || str(row[field]),
});
const localizedList = (row: Row, field: string) => ({
  [`${field}_en`]: strList(row[`${field}_en`]).length ? strList(row[`${field}_en`]) : strList(row[field]),
});
const textTranslationValues = (source: object, fields: string[]) => {
  const item = source as Row;
  return Object.fromEntries(fields.flatMap(field => [
    [`${field}_en`, str(item[`${field}_en`]) || str(item[field])],
  ]));
};
const listTranslationValues = (source: object, fields: string[]) => {
  const item = source as Row;
  return Object.fromEntries(fields.flatMap(field => [
    [`${field}_en`, strList(item[`${field}_en`]).length ? strList(item[`${field}_en`]) : strList(item[field])],
  ]));
};

const toAbout = (row: Row | null): AboutData => {
  if (!row) return emptyAbout;
  const social = (row.social_links && typeof row.social_links === "object" ? row.social_links : {}) as Partial<SocialLinks>;
  return {
    ...localized(row, 'full_name'), ...localized(row, 'title'), ...localized(row, 'bio'), ...localized(row, 'email'), ...localized(row, 'phone'),
    ...localized(row, 'location'), ...localized(row, 'years_experience'), ...localized(row, 'projects_completed'), ...localized(row, 'technologies'),
    full_name: str(row.full_name_en) || str(row.full_name), title: str(row.title_en) || str(row.title), bio: str(row.bio_en) || str(row.bio), email: str(row.email_en) || str(row.email), phone: str(row.phone_en) || str(row.phone),
    location: str(row.location_en) || str(row.location), years_experience: str(row.years_experience_en) || str(row.years_experience), projects_completed: str(row.projects_completed_en) || str(row.projects_completed),
    technologies: str(row.technologies_en) || str(row.technologies), resume_url: str(row.resume_url), avatar_url: str(row.avatar_url),
    social_links: { ...emptyAbout.social_links, ...social },
  } as AboutData;
};
const toResume = (r: Row): ResumeItem => ({ id: str(r.id), type: (r.type as ResumeItem["type"]) || "work", ...localized(r, 'title'), ...localized(r, 'organization'), ...localized(r, 'period'), ...localized(r, 'description'), ...localized(r, 'type_label'), title: str(r.title_en) || str(r.title), organization: str(r.organization_en) || str(r.organization), period: str(r.period_en) || str(r.period), description: str(r.description_en) || str(r.description), type_label_en: str(r.type_label_en) || str(r.type) || 'work' } as ResumeItem);
const toSkill = (r: Row): SkillItem => ({ id: str(r.id), ...localized(r, 'name'), ...localized(r, 'category'), name: str(r.name_en) || str(r.name), category: str(r.category), level: Number(r.level) || 0 } as SkillItem);
const toService = (r: Row): ServiceItem => ({ id: str(r.id), icon: str(r.icon), ...localized(r, 'title'), ...localized(r, 'description'), ...localizedList(r, 'features'), title: str(r.title_en) || str(r.title), description: str(r.description_en) || str(r.description), features: strList(r.features_en).length ? strList(r.features_en) : strList(r.features) } as ServiceItem);
const toTestimonial = (r: Row): TestimonialItem => ({ id: str(r.id), ...localized(r, 'name'), ...localized(r, 'role'), ...localized(r, 'company'), ...localized(r, 'content'), name: str(r.name_en) || str(r.name), role: str(r.role_en) || str(r.role), company: str(r.company_en) || str(r.company), content: str(r.content_en) || str(r.content), image: str(r.image), rating: r.rating == null ? 5 : Number(r.rating) } as TestimonialItem);
const toProject = (r: Row): ProjectItem => ({ id: str(r.id), ...localized(r, 'title'), ...localized(r, 'description'), ...localized(r, 'long_description'), ...localized(r, 'category'), ...localizedList(r, 'tags'), title: str(r.title_en) || str(r.title), description: str(r.description_en) || str(r.description), long_description: str(r.long_description_en) || str(r.long_description), category: str(r.category) || "web", tags: strList(r.tags_en).length ? strList(r.tags_en) : strList(r.tags), image: str(r.image), favorite: Boolean(r.favorite), github_url: str(r.github_url), demo_url: str(r.demo_url) } as ProjectItem);
const toSocial = (r: Row): SocialLinkItem => ({ id: str(r.id), ...localized(r, 'label'), ...localized(r, 'sub'), label: str(r.label_en) || str(r.label), sub: str(r.sub_en) || str(r.sub), icon: str(r.icon), url: str(r.url), color: str(r.color), enabled: Boolean(r.enabled) } as SocialLinkItem);

// Default platforms always appear in the dashboard; saved rows override them and custom rows are kept.
const mergeSocial = (saved: SocialLinkItem[]) => {
  const merged = defaultSocialLinks.map(item => ({ ...item, ...saved.find(s => s.id === item.id) }));
  saved.forEach(s => { if (!merged.some(m => m.id === s.id)) merged.push(s); });
  return merged;
};

const selectAll = async (table: string) => {
  const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as Row[];
};

export function loadPortfolio(options: { force?: boolean } = {}): Promise<void> {
  if (inflight && !options.force) return inflight;
  if (snapshot.status === "ready" && !options.force) return Promise.resolve();
  // Keep mounted page components visible during background refreshes. They
  // subscribe to this store and render again when the new records arrive.
  setSnapshot({ status: snapshot.status === "ready" ? "ready" : "loading", error: null });
  const request = (async () => {
    try {
      const [profile, resume, skills, services, testimonials, projects, social] = await Promise.all([
        supabase.from("portfolio_profile").select("*").eq("id", "main").maybeSingle().then(({ data, error }) => {
          if (error) throw new Error(`portfolio_profile: ${error.message}`);
          return data as Row | null;
        }),
        selectAll("portfolio_resume_items"),
        selectAll("portfolio_skills"),
        selectAll("portfolio_services"),
        selectAll("portfolio_testimonials"),
        selectAll("portfolio_projects"),
        selectAll("portfolio_social_links"),
      ]);
      if (inflight !== request) return;
      setSnapshot({
        status: "ready",
        error: null,
        about: toAbout(profile),
        resume: resume.map(toResume),
        skills: skills.map(toSkill),
        services: services.map(toService),
        testimonials: testimonials.map(toTestimonial),
        projects: projects.map(toProject),
        socialLinks: mergeSocial(social.map(toSocial)),
      });
    } catch (e) {
      if (inflight !== request) return;
      setSnapshot({ status: "error", error: e instanceof Error ? e.message : "Unable to load portfolio content" });
    } finally {
      if (inflight === request) inflight = null;
    }
  })();
  inflight = request;
  return request;
}

/** Keep an already-open public site in sync with dashboard edits from any session. */
function startPortfolioSync() {
  if (portfolioSyncStarted || typeof window === "undefined") return;
  portfolioSyncStarted = true;

  const refresh = () => {
    if (document.visibilityState === "hidden") return;
    void loadPortfolio({ force: true });
  };
  const scheduleRefresh = () => {
    if (portfolioRefreshTimer) clearTimeout(portfolioRefreshTimer);
    portfolioRefreshTimer = setTimeout(refresh, 250);
  };

  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", refresh);

  const contentTables = [
    "portfolio_profile",
    "portfolio_resume_items",
    "portfolio_skills",
    "portfolio_services",
    "portfolio_testimonials",
    "portfolio_projects",
    "portfolio_social_links",
  ];
  let channel = supabase.channel("portfolio-content-sync");
  for (const table of contentTables) {
    channel = channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      scheduleRefresh,
    );
  }
  channel.subscribe();
}

/** Subscribes the component to portfolio content and starts the first load. */
export function usePortfolio(): PortfolioSnapshot {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
  const language = useContentLanguage();
  useEffect(() => {
    startPortfolioSync();
    if (snapshot.status === "idle") void loadPortfolio();
  }, []);
  const localizedList = (row: object, field: string, base: string[]) => {
    const value = (row as Row)[`${field}_${language}`];
    if (Array.isArray(value) && value.length) return value.map(str).filter(Boolean);
    const english = (row as Row)[`${field}_en`];
    if (Array.isArray(english) && english.length) return english.map(str).filter(Boolean);
    return base;
  };
  return {
    ...state,
    about: {
      ...state.about,
      ...Object.fromEntries(['full_name', 'title', 'bio', 'email', 'phone', 'location', 'years_experience', 'projects_completed', 'technologies'].map(field => [field, localizedText(state.about, field, language)])),
    },
    resume: state.resume.map(item => ({ ...item, ...Object.fromEntries(['title', 'organization', 'period', 'description', 'type_label'].map(field => [field, localizedText(item, field, language)])) })),
    skills: state.skills.map(item => ({ ...item, ...Object.fromEntries(['name', 'category'].map(field => [field, localizedText(item, field, language)])) })),
    services: state.services.map(item => ({ ...item, ...Object.fromEntries(['title', 'description'].map(field => [field, localizedText(item, field, language)])), features: localizedList(item, 'features', item.features) })),
    testimonials: state.testimonials.map(item => ({ ...item, ...Object.fromEntries(['name', 'role', 'company', 'content'].map(field => [field, localizedText(item, field, language)])) })),
    projects: state.projects.map(item => ({ ...item, ...Object.fromEntries(['title', 'description', 'long_description', 'category'].map(field => [field, localizedText(item, field, language)])), tags: localizedList(item, 'tags', item.tags) })),
    socialLinks: state.socialLinks.map(item => ({ ...item, ...Object.fromEntries(['label', 'sub'].map(field => [field, localizedText(item, field, language)])) })),
  };
}

export const getAbout = () => snapshot.about;
export const getResume = () => snapshot.resume;
export const getSkills = () => snapshot.skills;
export const getServices = () => snapshot.services;
export const getTestimonials = () => snapshot.testimonials;
export const getProjects = () => snapshot.projects;
export const getSocialLinks = () => snapshot.socialLinks;

// ─── Writes (Super Admin only, enforced by row level security) ───

const assertLoaded = () => {
  // Saving a list replaces the table, so never save on top of content that failed to load.
  if (snapshot.status !== "ready") throw new Error("Portfolio content has not loaded yet. Refresh the page and try again.");
};

async function replaceTable<T extends { id: string }>(table: string, items: T[], toRow: (item: T) => Row) {
  assertLoaded();
  const rows = items.map((item, index) => ({ ...toRow(item), id: item.id, sort_order: index }));
  if (rows.length) {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }
  const keep = items.map(item => `"${item.id.replace(/"/g, '\\"')}"`).join(",");
  const remove = supabase.from(table).delete();
  const { error } = await (items.length ? remove.not("id", "in", `(${keep})`) : remove.neq("id", ""));
  if (error) throw new Error(error.message);
}

export async function saveAbout(data: AboutData) {
  assertLoaded();
  const fields = ['full_name', 'title', 'bio', 'email', 'phone', 'location', 'years_experience', 'projects_completed', 'technologies'];
  const englishData = Object.fromEntries(fields.map(field => [field, str((data as Row)[`${field}_en`]) || str((data as Row)[field])])) as Partial<AboutData>;
  const englishColumns = textTranslationValues(data, fields);
  const savedData = { ...englishData, ...englishColumns, resume_url: data.resume_url, avatar_url: data.avatar_url, social_links: data.social_links } as AboutData;
  const { error } = await supabase.from("portfolio_profile").upsert({ id: "main", ...englishData, ...englishColumns, avatar_url: data.avatar_url, resume_url: data.resume_url, social_links: data.social_links }, { onConflict: "id" });
  if (error) throw new Error(error.message);
  setSnapshot({ about: { ...savedData, social_links: { ...savedData.social_links } } });
}

export async function saveResume(items: ResumeItem[]) {
  await replaceTable("portfolio_resume_items", items, i => ({ type: i.type, title: i.title_en || i.title, organization: i.organization_en || i.organization, period: i.period_en || i.period, description: i.description_en || i.description, ...textTranslationValues(i, ['title', 'organization', 'period', 'description', 'type_label']), type_label_en: i.type_label_en || i.type }));
  setSnapshot({ resume: items });
}

export async function saveSkills(items: SkillItem[]) {
  await replaceTable("portfolio_skills", items, i => ({ name: i.name_en || i.name, category: i.category, ...textTranslationValues(i, ['name', 'category']), level: Math.max(0, Math.min(100, Math.round(i.level))) }));
  setSnapshot({ skills: items });
}

export async function saveServices(items: ServiceItem[]) {
  await replaceTable("portfolio_services", items, i => ({ title: i.title_en || i.title, description: i.description_en || i.description, features: i.features_en?.length ? i.features_en : i.features ?? [], ...textTranslationValues(i, ['title', 'description']), ...listTranslationValues(i, ['features']), icon: i.icon }));
  setSnapshot({ services: items });
}

export async function saveTestimonials(items: TestimonialItem[]) {
  await replaceTable("portfolio_testimonials", items, i => ({ name: i.name_en || i.name, role: i.role_en || i.role, company: i.company_en || i.company || "", content: i.content_en || i.content, ...textTranslationValues(i, ['name', 'role', 'company', 'content']), image: i.image ?? "", rating: Math.max(0, Math.min(5, Math.round(i.rating ?? 5))) }));
  setSnapshot({ testimonials: items });
}

export async function saveProjects(items: ProjectItem[]) {
  await replaceTable("portfolio_projects", items, i => ({ title: i.title_en || i.title, description: i.description_en || i.description, long_description: i.long_description_en || i.long_description, category: i.category || "web", tags: i.tags_en?.length ? i.tags_en : i.tags ?? [], ...textTranslationValues(i, ['title', 'description', 'long_description', 'category']), ...listTranslationValues(i, ['tags']), image: i.image, favorite: Boolean(i.favorite), github_url: i.github_url, demo_url: i.demo_url }));
  setSnapshot({ projects: items });
}

export async function saveSocialLinks(items: SocialLinkItem[]) {
  await replaceTable("portfolio_social_links", items, i => ({ label: i.label_en || i.label, sub: i.sub_en || i.sub, ...textTranslationValues(i, ['label', 'sub']), icon: i.icon, url: i.url.trim(), color: i.color, enabled: i.enabled }));
  setSnapshot({ socialLinks: items });
}

// ─── One-time import of content saved by the old browser-only version ───

const LEGACY_KEYS = {
  about: "portfolio_about",
  resume: "portfolio_resume",
  skills: "portfolio_skills",
  services: "portfolio_services",
  testimonials: "portfolio_testimonials",
  projects: "portfolio_projects",
  social: "portfolio_social_links",
} as const;
const LEGACY_BACKUP_KEY = "portfolio_local_backup";

const readLegacy = (key: string): unknown => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const legacyList = (key: string) => {
  const value = readLegacy(key);
  return Array.isArray(value) ? (value as Row[]) : [];
};

export function hasLegacyLocalData() {
  return Object.values(LEGACY_KEYS).some(key => localStorage.getItem(key) !== null);
}

/** Copies browser-only content into Supabase, then moves it into a single backup key. */
export async function importLegacyLocalData() {
  assertLoaded();
  const legacyAbout = readLegacy(LEGACY_KEYS.about) as Row | null;
  const resume = legacyList(LEGACY_KEYS.resume).map(toResume);
  const skills = legacyList(LEGACY_KEYS.skills).map(toSkill);
  const services = legacyList(LEGACY_KEYS.services).map(toService);
  const testimonials = legacyList(LEGACY_KEYS.testimonials).map(r => toTestimonial({ ...r, image: r.image || r.avatar }));
  const projects = legacyList(LEGACY_KEYS.projects).map(r => toProject({
    ...r,
    github_url: r.github_url || r.github,
    demo_url: r.demo_url || r.demo,
    long_description: r.long_description || r.longDescription,
  }));
  const social = legacyList(LEGACY_KEYS.social).map(toSocial);

  const withIds = <T extends { id: string }>(items: T[]) => items.map((item, i) => ({ ...item, id: item.id || `${Date.now()}-${i}` }));
  const unique = <T extends { id: string }>(current: T[], incoming: T[]) => [...current, ...incoming.filter(item => !current.some(c => c.id === item.id))];

  if (legacyAbout) await saveAbout(toAbout(legacyAbout));
  if (resume.length) await saveResume(unique(snapshot.resume, withIds(resume)));
  if (skills.length) await saveSkills(unique(snapshot.skills, withIds(skills)));
  if (services.length) await saveServices(unique(snapshot.services, withIds(services)));
  if (testimonials.length) await saveTestimonials(unique(snapshot.testimonials, withIds(testimonials)));
  if (projects.length) await saveProjects(unique(snapshot.projects, withIds(projects)));
  if (social.length) await saveSocialLinks(mergeSocial(withIds(social)));

  const backup: Record<string, unknown> = {};
  Object.values(LEGACY_KEYS).forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw !== null) { backup[key] = raw; localStorage.removeItem(key); }
  });
  localStorage.setItem(LEGACY_BACKUP_KEY, JSON.stringify({ importedAt: new Date().toISOString(), data: backup }));
}
