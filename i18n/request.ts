import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

/**
 * Locale resolution for next-intl (no URL routing mode).
 *
 * We intentionally read from the `googtrans` cookie so next-intl stays in
 * lockstep with the Google Translate pill in the header — GT owns body copy,
 * next-intl owns hero text. One locale source of truth, no drift.
 *
 * Cookie format written by writeGtCookie():
 *   /en/de   → active locale is "de"
 *   (absent) → EN (source language)
 */

const SUPPORTED = ["en", "de"] as const;
type Locale = (typeof SUPPORTED)[number];
const DEFAULT_LOCALE: Locale = "en";

function parseGtCookie(value: string | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const match = value.match(/^\/[^/]+\/(.+)$/);
  const candidate = match?.[1] as Locale | undefined;
  return candidate && SUPPORTED.includes(candidate) ? candidate : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = parseGtCookie(cookieStore.get("googtrans")?.value);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
