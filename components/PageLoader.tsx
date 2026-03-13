"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Page labels for each route
const ROUTE_LABELS: Record<string, string> = {
  "/about": "ABOUT",
  "/our-work": "OUR WORK",
  "/partnership": "PARTNERSHIP",
  "/careers": "CAREERS",
  "/contact": "CONTACT",
};

// The home page keeps its existing experience — no loader
const HOME_PATH = "/";

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLHeadingElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const prevPathname = useRef<string | null>(null);

  // ── Initial page load reveal ──────────────────────────────────────────
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const curtain = curtainRef.current;
    const counter = counterRef.current;
    const labelEl = labelRef.current;
    const lineProgress = lineProgressRef.current;
    const labelText = labelTextRef.current;
    if (!overlay || !curtain || !counter || !labelEl || !lineProgress || !labelText) return;

    // Home page keeps its existing experience — hide loader immediately
    if (pathname === HOME_PATH) {
      gsap.set(overlay, { display: "none", pointerEvents: "none" });
      prevPathname.current = pathname;
      return;
    }

    // Set the label for this route
    const label = ROUTE_LABELS[pathname] ?? "LOADING";
    labelText.textContent = label;

    // Lock scroll
    document.body.style.overflow = "hidden";
    isAnimating.current = true;

    // Reset curtain to covering position
    gsap.set(curtain, { yPercent: 0 });
    gsap.set([counter, labelEl], { opacity: 1, y: 0 });
    gsap.set(lineProgress, { scaleX: 0, transformOrigin: "left center" });

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isAnimating.current = false;
        prevPathname.current = pathname;
      },
    });

    // Count 0 → 100 with progress bar
    tl.to(obj, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.round(obj.val)).padStart(3, "0");
        if (lineProgress) gsap.set(lineProgress, { scaleX: obj.val / 100 });
      },
    });

    // Fade out content
    tl.to([counter, labelEl], {
      opacity: 0,
      y: -24,
      duration: 0.45,
      ease: "power3.in",
      stagger: 0.04,
    }, "-=0.1");

    // Curtain sweeps up
    tl.to(curtain, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
    }, "-=0.15");

    tl.set(overlay, { pointerEvents: "none" });

    return () => { tl.kill(); document.body.style.overflow = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Route change reveal (subsequent navigations) ──────────────────────
  useEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;

    // Never show the loader when landing on OR navigating TO the home page
    if (pathname === HOME_PATH) {
      prevPathname.current = pathname;
      return;
    }

    const overlay = overlayRef.current;
    const curtain = curtainRef.current;
    const counter = counterRef.current;
    const labelEl = labelRef.current;
    const lineProgress = lineProgressRef.current;
    const labelText = labelTextRef.current;
    if (!overlay || !curtain || !counter || !labelEl || !lineProgress || !labelText) return;

    const label = ROUTE_LABELS[pathname] ?? "LOADING";
    labelText.textContent = label;

    // Reset overlay & re-enable its pointer events
    gsap.set(overlay, { pointerEvents: "auto" });
    document.body.style.overflow = "hidden";
    isAnimating.current = true;

    // Drop curtain in from top
    gsap.set(curtain, { yPercent: -100 });
    gsap.set([counter, labelEl], { opacity: 0, y: 20 });
    gsap.set(lineProgress, { scaleX: 0, transformOrigin: "left center" });

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isAnimating.current = false;
        prevPathname.current = pathname;
      },
    });

    // Curtain drops in
    tl.to(curtain, {
      yPercent: 0,
      duration: 0.7,
      ease: "power4.inOut",
    });

    // Fade in label & counter
    tl.to([labelEl, counter], {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.05,
    }, "-=0.3");

    // Count up
    tl.to(obj, {
      val: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.round(obj.val)).padStart(3, "0");
        if (lineProgress) gsap.set(lineProgress, { scaleX: obj.val / 100 });
      },
    }, "-=0.2");

    // Fade out content
    tl.to([counter, labelEl], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power3.in",
    }, "-=0.05");

    // Curtain exits upward
    tl.to(curtain, {
      yPercent: -100,
      duration: 1.1,
      ease: "power4.inOut",
    }, "-=0.1");

    tl.set(overlay, { pointerEvents: "none" });

    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 pointer-events-auto"
      aria-hidden="true"
    >
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[#040404] flex flex-col pointer-events-auto"
      >
        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Gold horizontal split line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2" />

        {/* Top brand mark */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-4 opacity-50">
          <span className="font-mono text-gold text-xs tracking-[0.5em] uppercase font-bold">GH</span>
          <span className="w-10 h-px bg-gold/40" />
        </div>

        {/* Center label */}
        <div
          ref={labelRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none"
        >
          <span className="font-mono text-white/20 text-[9px] lg:text-[10px] tracking-[0.6em] uppercase select-none">
            Loading
          </span>
          <h2
            ref={labelTextRef}
            className="text-white text-[clamp(2rem,6vw,5.5rem)] font-black tracking-[-0.04em] uppercase leading-none select-none"
          >
            HOME
          </h2>
          {/* Progress bar */}
          <div className="w-40 lg:w-72 h-px bg-white/10 relative overflow-hidden mt-2">
            <div
              ref={lineProgressRef}
              className="absolute top-0 left-0 h-full w-full bg-gold"
              style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            />
          </div>
        </div>

        {/* Counter — bottom left */}
        <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 flex items-end gap-1.5">
          <span
            ref={counterRef}
            className="font-mono text-white text-[clamp(4rem,10vw,10rem)] font-light leading-none tabular-nums select-none"
            style={{ letterSpacing: "-0.05em" }}
          >
            000
          </span>
          <span className="font-mono text-white/25 text-2xl pb-3 select-none">%</span>
        </div>

        {/* Bottom right — pathname */}
        <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 opacity-25 select-none">
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-white">
            Gottwald Holding
          </span>
        </div>
      </div>
    </div>
  );
}
