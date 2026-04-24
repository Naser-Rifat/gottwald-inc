"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: {
          new (config: object, elementId: string): unknown;
        };
      };
    };
  }
}

// Locales offered in the header dropdown. EN is the source language; the
// rest are the translation targets. Extend freely — GT supports 100+.
export const GT_LANGUAGES = ["en", "de"] as const;

export const GT_COOKIE = "googtrans";
export const GT_MOUNT_ID = "google_translate_element";

export function readGtLocale(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return match ? match[1] : "en";
}

/**
 * Drive GT's hidden <select> directly — the reliable way to translate without
 * a page reload. Retries briefly because the combo appears asynchronously
 * after script load (up to ~5s on slow connections).
 */
export function triggerGtCombo(code: string, attempt = 0): void {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    const target = code === "en" ? "" : code;
    if (combo.value === target) return;
    combo.value = target;
    combo.dispatchEvent(new Event("change"));
    return;
  }
  if (attempt < 50) {
    window.setTimeout(() => triggerGtCombo(code, attempt + 1), 100);
  }
}

/**
 * Root-layout boot for Google Translate. Must be rendered exactly once at
 * the root layout so:
 *  - The script loads once per tab session.
 *  - `#google_translate_element` persists across client-side navigations
 *    (destroying/recreating it breaks GT's internal pointer).
 *  - GT's MutationObserver continues translating new page content without
 *    losing attachment to the DOM.
 *
 * The header's <GoogleTranslate /> dropdown only writes the cookie and fires
 * the combo — it does NOT mount GT. This separation is what prevents
 * translations from vanishing after route changes.
 */
export default function GoogleTranslateRoot() {
  const loaded = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: GT_LANGUAGES.join(","),
          autoDisplay: false,
        },
        GT_MOUNT_ID,
      );

      // Re-apply the persisted language after the combo mounts.
      const cookieLocale = readGtLocale();
      if (cookieLocale !== "en") triggerGtCombo(cookieLocale);
    };

    if (!document.querySelector<HTMLScriptElement>("script[data-gt-boot]")) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.gtBoot = "true";
      document.body.appendChild(script);
    }
  }, []);

  // On client-side navigation, {children} swaps under this persistent layout.
  // GT's observer usually catches it, but explicitly nudging the combo
  // guarantees fresh page content gets translated.
  useEffect(() => {
    const cookieLocale = readGtLocale();
    if (cookieLocale !== "en") triggerGtCombo(cookieLocale);
  }, [pathname]);

  return (
    <div
      id={GT_MOUNT_ID}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "-9999px",
        top: "-9999px",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
