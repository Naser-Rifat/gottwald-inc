"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

const JOURNEY_STEPS = [
  { href: "/",              label: "Home",         chapter: "01", color: "#cda434" }, // Muted Gold
  { href: "/about",        label: "About",        chapter: "02", color: "#8b97a2" }, // Steel/Silver
  { href: "/partnerships", label: "Partnerships", chapter: "03", color: "#0a4c5a" }, // Deep Petrol
  { href: "/careers",      label: "Careers",      chapter: "04", color: "#e69b65" }, // Luminous Copper
  { href: "/contact",      label: "Contact",      chapter: "05", color: "#12a8ac" }, // Trust Turquoise
];

export default function JourneyIndicator() {
  const pathname = usePathname();
  // Hydration-safe "did mount" — false on SSR, true after first client render.
  const mounted = useSyncExternalStore(noopSubscribe, getTrue, getFalse);
  // Initial value is derived from the route, not set in an effect — the
  // home page starts with the portal showing, every other route starts ready.
  const [introActive, setIntroActive] = useState(
    pathname === "/" || pathname === "",
  );

  useEffect(() => {
    // Only the home page emits portal-start / loading-complete. On other
    // routes the listener never fires, but introActive is already false.
    if (window.location.pathname !== "/") return;
    const handleStart = () => setIntroActive(false);
    window.addEventListener("portal-start", handleStart);
    window.addEventListener("loading-complete", handleStart);
    return () => {
      window.removeEventListener("portal-start", handleStart);
      window.removeEventListener("loading-complete", handleStart);
    };
  }, []);

  // Simple, robust path matching
  let currentIndex = -1;
  if (pathname === "/" || pathname === "") {
    currentIndex = 0;
  } else {
    currentIndex = JOURNEY_STEPS.findIndex((s, i) => i > 0 && pathname.startsWith(s.href));
  }

  // Don't render on pages outside the journey, before hydration, or during intro portal
  if (!mounted || currentIndex === -1 || introActive) return null;

  const current = JOURNEY_STEPS[currentIndex];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[200] flex-col items-center gap-2 pointer-events-none select-none hidden lg:flex">
      
      {/* Chapter number */}
      <span
        className="text-[9px] font-mono tracking-[0.3em] uppercase mb-2 transition-all duration-700"
        style={{ color: current.color }}
      >
        {current.chapter}
      </span>

      {/* Dots Container */}
      <div className="relative flex flex-col items-center gap-4 pointer-events-auto py-2">
        
        {/* Background Track Line */}
        <div className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-px bg-white/10 z-0" />
        
        {/* Animated Progress Line */}
        <div 
          className="absolute left-1/2 top-3 -translate-x-1/2 w-[2px] z-0 transition-all duration-700 ease-out"
          style={{
            height: `calc(${(currentIndex / (JOURNEY_STEPS.length - 1)) * 100}% - 24px)`,
            minHeight: currentIndex === 0 ? "0px" : undefined,
            backgroundColor: current.color,
            boxShadow: `0 0 10px ${current.color}`
          }}
        />

        {JOURNEY_STEPS.map((step, i) => {
          const isActive = i === currentIndex;
          const isPast = i <= currentIndex;

          return (
            <Link
              key={step.href}
              href={step.href}
              title={`Go to ${step.label}`}
              className="relative flex items-center justify-center group z-10 w-4 h-4"
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: isActive ? "8px" : "5px",
                  height: isActive ? "8px" : "5px",
                  backgroundColor: isActive
                    ? current.color
                    : isPast
                      ? current.color
                      : "#1a1a1a",
                  border: isPast && !isActive ? `1px solid ${current.color}80` : "none",
                  boxShadow: isActive
                    ? `0 0 12px ${current.color}, 0 0 6px ${current.color}`
                    : "none",
                  flexShrink: 0,
                }}
              />
              {/* Hover label */}
              <span
                className="absolute left-6 text-[9px] font-mono tracking-[0.2em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ color: isActive ? current.color : "rgba(255,255,255,0.6)" }}
              >
                {step.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Gradient tail */}
      <div
        className="w-px mt-2 transition-all duration-700"
        style={{
          height: "28px",
          background: `linear-gradient(to bottom, ${current.color}60, transparent)`,
        }}
      />
    </div>
  );
}
