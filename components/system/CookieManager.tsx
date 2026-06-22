"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAudio } from "@/components/AudioProvider";

// Storage uses document.cookie (not localStorage) so Next.js
// Middleware/SSR can read the acknowledgment before rendering HTML.
export interface CookieConsent {
  essential: true;
  savedAt: string;
}

const COOKIE_NAME = "gottwald_consent";

function getConsentCookie(): CookieConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[2]));
    } catch {
      return null;
    }
  }
  return null;
}

function setConsentCookie() {
  const consent: CookieConsent = {
    essential: true,
    savedAt: new Date().toISOString(),
  };
  const payload = encodeURIComponent(JSON.stringify(consent));
  // `secure` only on HTTPS; on localhost HTTP the flag silently drops
  // the cookie and the bar would reappear on every reload.
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; secure" : "";
  document.cookie = `${COOKIE_NAME}=${payload}; max-age=31536000; path=/; samesite=Lax${secureFlag}`;
}

export default function CookieManager() {
  const [showBar, setShowBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const { playSfx } = useAudio();

  // Delay is 4000ms so the bar appears after the PageLoader animation
  // (~2–3s) finishes, preventing z-index overlap.
  useEffect(() => {
    if (!getConsentCookie()) {
      const t = setTimeout(() => setShowBar(true), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const openPanel = useCallback(() => {
    setShowBar(false);
    setShowPanel(true);
    playSfx("thud");
  }, [playSfx]);

  const closePanel = useCallback(() => {
    setShowPanel(false);
    playSfx("whisper");
  }, [playSfx]);

  useEffect(() => {
    window.addEventListener("open-cookie-manager", openPanel);
    return () => window.removeEventListener("open-cookie-manager", openPanel);
  }, [openPanel]);

  useEffect(() => {
    if (!showPanel) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showPanel, closePanel]);

  useEffect(() => {
    if (showPanel) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showPanel]);

  const acknowledge = () => {
    setConsentCookie();
    setShowBar(false);
    setShowPanel(false);
    playSfx("chime");
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          LAYER 1: Compact Floating Bar
      ════════════════════════════════════════════════════════════════ */}
      {showBar && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 lg:bottom-12 lg:right-12 z-9999 animate-fade-up pointer-events-none">
          <div className="max-w-[480px] w-full ml-auto bg-[#030303]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-8 pointer-events-auto relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-white text-md tracking-[0.3em] uppercase mb-3 font-medium flex items-center gap-3">
                <span className="w-1 h-1 bg-gold rounded-full" />
                Cookie Notice
              </h3>
              <p className="text-white/50 text-md leading-relaxed mb-6 font-light">
                This site uses a single essential cookie to remember you&apos;ve seen this notice. We do not use analytics, advertising, or tracking cookies. See our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                {" "}for details.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={openPanel}
                  className="px-0 py-3 text-white/55 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 relative group"
                >
                  Details
                  <span className="absolute bottom-1 left-0 w-0 h-px bg-white/40 transition-all duration-300 group-hover:w-full" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={acknowledge}
                  className="px-6 py-3 bg-white text-black text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gold hover:text-black transition-all duration-300"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LAYER 2: Details Modal
      ════════════════════════════════════════════════════════════════ */}
      {showPanel && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8 pointer-events-none">
          <div
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md pointer-events-auto transition-opacity duration-500"
            onClick={closePanel}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-panel-title"
            className="relative w-full max-w-2xl bg-[#050505]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] pointer-events-auto animate-modal-scale overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-gold/40 to-transparent" />

            <div className="p-8 md:p-12 lg:p-14">

              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2
                    id="cookie-panel-title"
                    className="text-2xl md:text-3xl font-light text-white tracking-widest uppercase leading-tight"
                  >
                    Cookie Details
                  </h2>
                </div>
                <button
                  onClick={closePanel}
                  className="p-3 -mr-3 -mt-3 text-white/30 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/5"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square"/>
                  </svg>
                </button>
              </div>

              <p className="text-white/50 text-md leading-relaxed mb-10 font-light pr-4">
                We take a minimal approach. This platform does not run analytics, advertising, or behavioral tracking. The only cookie we set is strictly necessary for the site to remember your acknowledgment of this notice. Full context is available in our{" "}
                <Link href="/privacy-policy" className="text-white/80 underline underline-offset-2 hover:text-white transition-colors">
                  Privacy Policy
                </Link>.
              </p>

              <div className="space-y-3 mb-12">
                <div className="border border-white/5 bg-white/[0.02] p-6 md:p-7">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm tracking-[0.1em] uppercase">
                      Strictly Necessary
                    </h3>
                    <span className="text-[9px] text-gold/80 border border-gold/20 px-3 py-1.5 tracking-[0.25em] uppercase bg-gold/5">
                      Always On
                    </span>
                  </div>
                  <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                    Records that you have seen the cookie notice so it does not reappear on every page load. Stores no personal data and is never transmitted to third parties.
                  </p>
                  <p className="text-white/20 text-[10px] font-mono tracking-wider">
                    gottwald_consent · first-party · 1 year · samesite=Lax
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={acknowledge}
                  className="py-4 px-8 bg-white text-black hover:bg-gold hover:text-black transition-all duration-300 tracking-[0.15em] uppercase text-[10px] font-bold"
                >
                  Got It
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes modalScale {
          from { transform: scale(0.97) translateY(10px); opacity: 0; filter: blur(5px); }
          to   { transform: scale(1) translateY(0);       opacity: 1; filter: blur(0); }
        }
        .animate-fade-up    { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-modal-scale{ animation: modalScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </>
  );
}
