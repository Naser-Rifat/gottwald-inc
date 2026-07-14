import { getRequestConfig } from "next-intl/server";

/**
 * Locale resolution for next-intl (no URL routing mode).
 *
 * Server-side ALWAYS resolves to English. This is deliberate — reading the
 * `googtrans` cookie here would force every page render into dynamic mode
 * (Next.js flags any route in the render tree that touches `cookies()` as
 * non-cacheable), which cost mobile ~1.5–2 s of extra LCP because Vercel's
 * edge could never serve pre-rendered HTML.
 *
 * The client-side story:
 *   1. SSR renders English messages regardless of the cookie.
 *   2. Google Translate (mounted client-only via GoogleTranslateRoot) picks
 *      up the `googtrans` cookie during hydration and re-translates body copy
 *      to German if that's the user's active locale. The inline script in
 *      layout.tsx also flips <html lang> before first paint so screen readers
 *      and Chrome's translate-banner see the correct locale.
 *
 * Net effect for a returning German visitor: hero copy briefly flashes in
 * English (the tiny handful of strings owned by next-intl) then GT catches
 * up. Body copy — which is >95% of the page — comes through GT directly
 * without a flash. The trade-off is acceptable for the perf win.
 *
 * When URL-based DE routing ships (/de/imprint etc.), replace the hard-
 * coded "en" with the segment parsed from the URL — still no cookies(),
 * still static-render-friendly.
 */
const DEFAULT_LOCALE = "en";

export default getRequestConfig(async () => {
  return {
    locale: DEFAULT_LOCALE,
    messages: (await import(`../messages/${DEFAULT_LOCALE}.json`)).default,
  };
});
