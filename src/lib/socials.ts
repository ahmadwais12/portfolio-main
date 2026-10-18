// Maps social link records (see @/lib/store) to icons + helpers used
// both by the dashboard "Social Media" page and the public portfolio.

import type { ComponentType, CSSProperties } from "react";
import { Globe } from "lucide-react";
import {
  SiGithub,
  SiLinkedin,
  SiX,
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiWhatsapp,
  SiTelegram,
  SiDiscord,
  SiReddit,
  SiDribbble,
  SiBehance,
  SiStackoverflow,
  SiMedium,
  SiHashnode,
  SiSpotify,
  SiLeetcode,
} from "react-icons/si";
import { getSocialLinks, type SocialLinkItem } from "@/lib/store";

export type SocialIconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

export const socialIcons: Record<string, SocialIconComponent> = {
  github: SiGithub,
  linkedin: SiLinkedin,
  x: SiX,
  instagram: SiInstagram,
  facebook: SiFacebook,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  discord: SiDiscord,
  reddit: SiReddit,
  dribbble: SiDribbble,
  behance: SiBehance,
  stackoverflow: SiStackoverflow,
  medium: SiMedium,
  hashnode: SiHashnode,
  spotify: SiSpotify,
  leetcode: SiLeetcode,
};

export const getSocialIcon = (key: string): SocialIconComponent => socialIcons[key] || Globe;

/** hex color -> `rgba(...)` string */
export const rgba = (hex: string, alpha: number): string => {
  const value = (hex || "").replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return `rgba(148, 163, 184, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Platforms the admin enabled and filled with a URL -> shown on the website */
export const getActiveSocialLinks = (): SocialLinkItem[] =>
  getSocialLinks().filter((item) => item.enabled && item.url.trim().length > 0);
