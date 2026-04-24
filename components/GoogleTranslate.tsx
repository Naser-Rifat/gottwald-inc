"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  GT_COOKIE,
  readGtLocale,
  triggerGtCombo,
} from "./GoogleTranslateRoot";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
] as const;

function writeGtCookie(code: string) {
  const parts = window.location.hostname.split(".");
  const domains: (string | null)[] = [null];
  if (parts.length >= 2) domains.push("." + parts.slice(-2).join("."));
  for (const d of domains) {
    const domainAttr = d ? `domain=${d};` : "";
    if (code === "en") {
      document.cookie = `${GT_COOKIE}=;${domainAttr}path=/;max-age=0;samesite=Lax`;
    } else {
      document.cookie = `${GT_COOKIE}=/en/${code};${domainAttr}path=/;max-age=31536000;samesite=Lax`;
    }
  }
  // Keep <html lang> in sync so screen readers use correct phonetics and
  // Chrome doesn't offer to translate an "already-in-that-language" page.
  document.documentElement.lang = code;
}

// useSyncExternalStore drives the pill label from the googtrans cookie
// without triggering setState-in-effect warnings. Cookies have no native
// event, so we manually bump a version counter after writing.
let cookieVersion = 0;
const cookieListeners = new Set<() => void>();
function subscribeCookie(cb: () => void) {
  cookieListeners.add(cb);
  return () => cookieListeners.delete(cb);
}
function getCookieSnapshot() {
  return `${cookieVersion}:${readGtLocale()}`;
}
function getServerCookieSnapshot() {
  return "0:en";
}
function bumpCookieVersion() {
  cookieVersion++;
  cookieListeners.forEach((cb) => cb());
}

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const snapshot = useSyncExternalStore(
    subscribeCookie,
    getCookieSnapshot,
    getServerCookieSnapshot,
  );
  const current = snapshot.split(":")[1] ?? "en";
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectLocale(code: string) {
    writeGtCookie(code);
    bumpCookieVersion();
    setOpen(false);
    if (code === "en") {
      // GT occasionally leaves residue when reverting via combo alone; a
      // reload guarantees a fresh English DOM.
      window.location.reload();
    } else {
      triggerGtCombo(code);
    }
  }

  const currentLang =
    LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div className="relative notranslate" translate="no" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                   tracking-[0.02em] transition-colors
                   bg-white/10 text-white hover:bg-white/15"
        style={{ padding: "0 18px" }}
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span suppressHydrationWarning>{currentLang.label}</span>
        <span className="text-xs opacity-60">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[52px] z-50 min-w-[170px] rounded-2xl
                     bg-black/90 backdrop-blur-md border border-white/10 py-2 text-sm
                     shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => selectLocale(l.code)}
                  className={`w-full text-left px-4 py-2 transition-colors hover:bg-white/10
                    ${active ? "text-gold" : "text-white"}`}
                >
                  {l.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
