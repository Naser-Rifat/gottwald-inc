"use client";

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Switched from localStorage to document.cookie
// Why document.cookie? It allows Next.js Middleware/SSR to read the consent
// before sending HTML, preventing UI flashes.
// ─────────────────────────────────────────────────────────────────────────────
export interface CookieConsent {
  essential: true;
  functional: boolean;
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

function setConsentCookie(functional: boolean) {
  const consent: CookieConsent = {
    essential: true,
    functional,
    savedAt: new Date().toISOString(),
  };
  const payload = encodeURIComponent(JSON.stringify(consent));
  // Only set `secure` on HTTPS (production). On localhost HTTP, `secure` silently
  // prevents the cookie from being saved, causing the consent bar to reappear.
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; secure" : "";
  document.cookie = `${COOKIE_NAME}=${payload}; max-age=31536000; path=/; samesite=Lax${secureFlag}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle Component (Ultra-Refined)
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 w-[42px] h-[22px] rounded-full border transition-all duration-500 focus-visible:outline focus-visible:outline-gold ${
        checked ? "bg-gold/20 border-gold/40" : "bg-white/5 border-white/10"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full transition-transform duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
          checked ? "translate-x-[20px] bg-gold" : "translate-x-0 bg-white/40"
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function CookieManager() {
  const [showBar, setShowBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [functional, setFunctional] = useState(true);

  // ── On mount: show bar if no consent cookie exists ──
  // Delay is set to 4000ms so the cookie bar appears AFTER the PageLoader
  // animation has fully completed (~2-3s), preventing z-index overlap.
  useEffect(() => {
    if (!getConsentCookie()) {
      const t = setTimeout(() => setShowBar(true), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Footer trigger: opens full panel ──
  const openPanel = useCallback(() => {
    const saved = getConsentCookie();
    setFunctional(saved ? saved.functional : true);
    setShowBar(false);
    setShowPanel(true);
  }, []);

  useEffect(() => {
    window.addEventListener("open-cookie-manager", openPanel);
    return () => window.removeEventListener("open-cookie-manager", openPanel);
  }, [openPanel]);

  // ── ESC closes panel ──
  useEffect(() => {
    if (!showPanel) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setShowPanel(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showPanel]);

  // ── Body lock ──
  useEffect(() => {
    if (showPanel) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showPanel]);

  // ── Actions ──
  const acceptAll = () => { setConsentCookie(true); setShowBar(false); setShowPanel(false); };
  const essentialOnly = () => { setConsentCookie(false); setShowBar(false); setShowPanel(false); };
  const saveChoices = () => { setConsentCookie(functional); setShowPanel(false); };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          LAYER 1: Compact Floating Bar (Bottom Right Desktop, Bottom Mobile)
      ════════════════════════════════════════════════════════════════ */}
      {showBar && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 lg:bottom-12 lg:right-12 z-9999 animate-fade-up pointer-events-none">
          <div className="max-w-[480px] w-full ml-auto bg-[#030303]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-8 pointer-events-auto relative overflow-hidden">
            {/* Subtle gold glow behind */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-white text-md tracking-[0.3em] uppercase mb-3 font-medium flex items-center gap-3">
                <span className="w-1 h-1 bg-gold rounded-full" />
                Cookie Settings
              </h3>
              <p className="text-white/50 text-md leading-relaxed mb-6 font-light">
                Manage your cookie preferences at any time. You can review, adjust, or withdraw your consent for non-essential cookies through our cookie preference manager.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => openPanel()}
                  className="px-0 py-3 text-white/55 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 relative group"
                >
                  Configure
                  <span className="absolute bottom-1 left-0 w-0 h-px bg-white/40 transition-all duration-300 group-hover:w-full" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={essentialOnly}
                  className="px-5 py-3 border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                >
                  Essential
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-white text-black text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gold hover:text-black transition-all duration-300"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LAYER 2: Ultra-Premium Glass Modal
      ════════════════════════════════════════════════════════════════ */}
      {showPanel && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8 pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md pointer-events-auto transition-opacity duration-500"
            onClick={() => setShowPanel(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-panel-title"
            className="relative w-full max-w-2xl bg-[#050505]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] pointer-events-auto animate-modal-scale overflow-hidden"
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-gold/40 to-transparent" />
            
            <div className="p-8 md:p-12 lg:p-14">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2
                    id="cookie-panel-title"
                    className="text-2xl md:text-3xl font-light text-white tracking-widest uppercase leading-tight"
                  >
                    Cookie Settings
                  </h2>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-3 -mr-3 -mt-3 text-white/30 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/5"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square"/>
                  </svg>
                </button>
              </div>

              {/* Exact user-requested text */}
              <p className="text-white/50 text-md leading-relaxed mb-10 font-light pr-4">
                Manage your cookie preferences at any time. You can review, adjust, or withdraw your consent for non-essential cookies through our cookie preference manager.
              </p>

              {/* Categories */}
              <div className="space-y-3 mb-12">
                
                {/* Essential */}
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
                    Session authentication and CSRF security tokens. Required for the platform to function. Cannot be disabled.
                  </p>
                  <p className="text-white/20 text-[10px] font-mono tracking-wider">
                    sessionid · csrftoken
                  </p>
                </div>

                {/* Functional */}
                <div className={`border transition-all duration-500 p-6 md:p-7 ${functional ? "border-gold/15 bg-gold/[0.01]" : "border-white/5 bg-white/[0.02]"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm tracking-[0.1em] uppercase flex items-center gap-3">
                      Functional
                    </h3>
                    <Toggle checked={functional} onChange={setFunctional} />
                  </div>
                  <p className="text-white/40 text-[13px] leading-relaxed mb-3">
                    Remembers your interface preferences and consent state. Without this, the system will prompt you repeatedly.
                  </p>
                  <p className="text-white/20 text-[10px] font-mono tracking-wider">
                    gottwald_consent (.cookie)
                  </p>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={essentialOnly}
                  className="w-full py-4 px-4 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 tracking-[0.15em] uppercase text-[10px]"
                >
                  Essential Only
                </button>
                <button
                  onClick={saveChoices}
                  className="w-full py-4 px-4 border border-white/20 text-white hover:bg-white/5 transition-all duration-300 tracking-[0.15em] uppercase text-[10px]"
                >
                  Save Choices
                </button>
                <button
                  onClick={acceptAll}
                  className="w-full py-4 px-4 bg-white text-black hover:bg-gold hover:text-black transition-all duration-300 tracking-[0.15em] uppercase text-[10px] font-bold"
                >
                  Accept All
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
