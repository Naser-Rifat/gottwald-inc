/**
 * Internationalisation configuration.
 *
 * Currently English-only. Every English page already calls
 * `hreflangAlternates(canonicalPath)` in its metadata, so flipping German
 * live is a two-step exercise:
 *
 * 1. Create the translated route (e.g. `app/de/imprint/page.tsx`) and call
 *    `hreflangAlternates("/imprint")` from its metadata too.
 * 2. Flip the `de` locale's `available: true` below.
 *
 * The helper returns `undefined` while only one locale is available (so no
 * hreflang tags render today — a self-referential hreflang on a single-
 * language site is redundant and Google would ignore it). The moment a
 * second locale is `available: true`, every page begins emitting an
 * `x-default` plus one `<link rel="alternate" hreflang="…">` per available
 * locale — with no further code changes required in individual pages.
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
