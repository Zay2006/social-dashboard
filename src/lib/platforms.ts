import { Instagram, Linkedin, Music2, Pin, Twitter, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PLATFORM_IDS = [
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "pinterest",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export interface Platform {
  id: PlatformId;
  /** Brand capitalisation, which `capitalize` cannot produce. */
  label: string;
  icon: LucideIcon;
  /**
   * Brand-ish text colour that still clears 4.5:1 against the page background
   * in both themes. The literal brand hexes (#1DA1F2, #E4405F, …) do not.
   */
  textClass: string;
  /**
   * Chart series colour per theme. Recharts writes these as SVG presentation
   * attributes, which cannot resolve `var()`, so they have to be literals.
   */
  chartColor: { light: string; dark: string };
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  twitter: {
    id: "twitter",
    label: "Twitter",
    icon: Twitter,
    textClass: "text-sky-700 dark:text-sky-400",
    chartColor: { light: "#0369a1", dark: "#38bdf8" },
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    textClass: "text-pink-700 dark:text-pink-400",
    chartColor: { light: "#be185d", dark: "#f472b6" },
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    textClass: "text-blue-700 dark:text-blue-400",
    chartColor: { light: "#1d4ed8", dark: "#60a5fa" },
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    textClass: "text-red-700 dark:text-red-400",
    chartColor: { light: "#b91c1c", dark: "#f87171" },
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    icon: Music2,
    // Pure black (the brand colour) is invisible on a dark card.
    textClass: "text-zinc-800 dark:text-zinc-200",
    chartColor: { light: "#27272a", dark: "#d4d4d8" },
  },
  pinterest: {
    id: "pinterest",
    label: "Pinterest",
    icon: Pin,
    textClass: "text-rose-700 dark:text-rose-400",
    chartColor: { light: "#be123c", dark: "#fb7185" },
  },
};

export const PLATFORM_LIST: Platform[] = PLATFORM_IDS.map((id) => PLATFORMS[id]);

export function isPlatformId(value: unknown): value is PlatformId {
  return typeof value === "string" && (PLATFORM_IDS as readonly string[]).includes(value);
}

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS[id];
}
