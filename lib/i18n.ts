/**
 * Internationalisation configuration.
 *
 * Currently English-only. The scaffolding below exists so that adding a
 * German (`de`) version becomes a drop-in exercise:
 *
 * 1. Create the translated route (e.g. `app/de/imprint/page.tsx`).
 * 2. Flip the locale's `available: true` below.
 * 3. Call `hreflangAlternates(path)` from that page's metadata and the
 *    English counterpart to emit reciprocal `<link rel="alternate">` tags.
 *
 * Until `available: true`, we only emit a self-referential `x-default` +
 * `en` hreflang — the honest signal that the site is currently English-only.
 */

import { SITE_URL } from "./seo";

export type Locale = "en" | "de";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Record<Locale, { label: string; path: string; available: boolean }> = {
  en: { label: "English", path: "", available: true },
  de: { label: "Deutsch", path: "/de", available: false },
};

export function isLocaleAvailable(locale: Locale): boolean {
  return LOCALES[locale].available;
}

/**
 * Build `alternates.languages` metadata for a canonical English path.
 *
 * Returns an empty object when only a single locale is available — a
 * self-referential hreflang on a single-language site is redundant and
 * Next.js strips it anyway. When a second locale is marked `available: true`
 * (e.g. `de` once translations ship), this begins emitting `x-default` plus
 * one `<link rel="alternate" hreflang="…">` per available locale.
 */
export function hreflangAlternates(
  canonicalPath: string,
): Record<string, string> | undefined {
  const availableLocales = (
    Object.entries(LOCALES) as [Locale, (typeof LOCALES)[Locale]][]
  ).filter(([, config]) => config.available);

  if (availableLocales.length < 2) return undefined;

  const normalised = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;

  const alternates: Record<string, string> = {
    "x-default": `${SITE_URL}${normalised}`,
  };

  availableLocales.forEach(([locale, config]) => {
    alternates[locale] = `${SITE_URL}${config.path}${normalised}`;
  });

  return alternates;
}
