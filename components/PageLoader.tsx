"use client";

import React, { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

// Page labels for each route
const ROUTE_LABELS: Record<string, string> = {
  "/about": "ABOUT",
  "/our-work": "OUR WORK",
  "/partnerships": "PARTNERSHIPS",
  "/careers": "CAREERS",
  "/contact": "CONTACT",
};

/**
 * Resolve a human-readable label for the transition overlay.
 * Static routes get a direct lookup; dynamic /pillars/[slug] routes
 * are auto-capitalised from the slug itself.
 */
function resolveLabel(href: string): string {
  // Check static map first
  const [basePath] = href.split("#");
  if (ROUTE_LABELS[basePath]) return ROUTE_LABELS[basePath];

  // Dynamic pillar routes: "/pillars/my-slug" → "MY SLUG"
  const pillarMatch = basePath.match(/^\/pillars\/(.+)$/);
  if (pillarMatch) {
    return pillarMatch[1].replace(/-/g, " ").toUpperCase();
  }

  return "LOADING";
}

// The home page keeps its existing experience — no loader
const HOME_PATH = "/";

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const router = useRouter();

  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLHeadingElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  // Rigid State Tracking
  const isTransitioning = useRef(false);
  const progressObj = useRef({ val: 0 });
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);
  const hasInitiallyLoaded = useRef(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHashRef = useRef<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const creepTweenRef = useRef<gsap.core.Tween | null>(null);

  // ── Initial page load reveal ──────────────────────────────────────────
  useLayoutEffect(() => {
    // Only run this exact entrance sequence once per hard-reload
    if (hasInitiallyLoaded.current) return;
    hasInitiallyLoaded.current = true;

    // Home page keeps its custom intro overlay — skip entirely without unmounting
    if (pathname === HOME_PATH) {
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    const label = resolveLabel(pathname);
    if (labelTextRef.current) labelTextRef.current.textContent = label;

    document.body.style.overflow = "hidden";
    isTransitioning.current = true;

    // Force starting positions explicitly so there's NO guess work CSS
    gsap.set(overlayRef.current, { autoAlpha: 1, pointerEvents: "auto" });
    gsap.set(curtainRef.current, { yPercent: 0 });
    gsap.set([counterRef.current, labelRef.current], { opacity: 1, y: 0 });
    gsap.set(lineProgressRef.current, { scaleX: 0, transformOrigin: "left center" });

    if (activeTimeline.current) activeTimeline.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isTransitioning.current = false;
        gsap.set(overlayRef.current, { pointerEvents: "none" });
      },
    });
    activeTimeline.current = tl;

    // Zero explicitly
    progressObj.current.val = 0;

    tl.to(progressObj.current, {
      val: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(progressObj.current.val)).padStart(3, "0");
        if (lineProgressRef.current) gsap.set(lineProgressRef.current, { scaleX: progressObj.current.val / 100 });
      },
    });

    tl.to([counterRef.current, labelRef.current], { opacity: 0, y: -24, duration: 0.45, ease: "power3.in", stagger: 0.04 }, "-=0.1");
    tl.to(curtainRef.current, { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, "-=0.15");

    return () => { tl.kill(); document.body.style.overflow = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Eagerly Intercept Link Clicks ────────────────────────────────────
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      
      // Edge-Case Handling: Ignore external, tabs, hash, mailto, etc.
      // Eager Loader MUST NOT intercept CMD+Click / CTRL+Click
      // ALSO: Do NOT intercept navigations TO the Home page, let Next.js do it cleanly.
      if (
        !href ||
        href === HOME_PATH ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        link.target === "_blank" ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      // ── Hash-aware routing ──
      // If href is like "/partnerships#apply" and we are already on "/partnerships",
      // skip the loader and manually scroll to the target.
      // Next.js <Link> swallows native hash behavior, so we must handle it ourselves.
      const [basePath, hash] = href.split("#");
      if (hash && basePath === pathname) {
        e.preventDefault();
        e.stopPropagation();
        // Update the URL hash without triggering a Next.js navigation
        window.history.pushState(null, "", `${basePath}#${hash}`);
        const target = document.getElementById(hash);
        if (target) {
          const yOffset = -100; // Account for fixed header
          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        return;
      }

      // Ignore if clicking the exact same base path we are already on (no hash)
      if (basePath === pathname && !hash) return;
      
      // If we are currently mid-animation, bypass to avoid glitching
      if (isTransitioning.current) return;

      // ── BEGIN EAGER MASK ──
      // Completely shut off Next.js's immediate <Link> chunk-loading reaction
      e.preventDefault();
      e.stopPropagation(); 
      isTransitioning.current = true;

      // Track pending hash and href for post-navigation scroll & fallback
      pendingHashRef.current = hash || null;
      pendingHrefRef.current = href;

      const label = resolveLabel(href);
      if (labelTextRef.current) labelTextRef.current.textContent = label;

      // Guarantee any previous timeline is eradicated to prevent object overwrites 
      if (activeTimeline.current) activeTimeline.current.kill();
      if (creepTweenRef.current) creepTweenRef.current.kill();

      document.body.style.overflow = "hidden";
      gsap.set(overlayRef.current, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(curtainRef.current, { yPercent: -100 });
      gsap.set([counterRef.current, labelRef.current], { opacity: 0, y: 20 });
      gsap.set(lineProgressRef.current, { scaleX: 0, transformOrigin: "left center" });

      progressObj.current.val = 0;
      
      const tl = gsap.timeline();
      activeTimeline.current = tl;

      // 1. Slide curtain in to cover screen
      tl.to(curtainRef.current, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => {
          // ── KEY FIX: Fire router.push IMMEDIATELY when curtain covers screen ──
          // Don't wait for the counter animation — start data fetch ASAP.
          React.startTransition(() => {
            router.push(href);
          });

          // ── Nuclear safety: hard redirect if pathname never changes after 8s ──
          // Unlike the old 4s timer, this does NOT lift the curtain prematurely.
          // It falls back to a full page load instead.
          if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = setTimeout(() => {
            if (isTransitioning.current) {
              window.location.href = href;
            }
          }, 8000);
        },
      });

      // 2. Fade in labels while curtain is settling
      tl.to([labelRef.current, counterRef.current], { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, "-=0.3");
      
      // 3. Animate counter 0→90 as a visual placeholder while data loads
      tl.to(progressObj.current, {
        val: 90,
        duration: 1.0,
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = String(Math.round(progressObj.current.val)).padStart(3, "0");
          if (lineProgressRef.current) gsap.set(lineProgressRef.current, { scaleX: progressObj.current.val / 100 });
        },
        onComplete: () => {
          // 4. Slow creep 90→98 so the counter doesn't look frozen while waiting
          creepTweenRef.current = gsap.to(progressObj.current, {
            val: 98,
            duration: 6,
            ease: "power1.out",
            onUpdate: () => {
              if (counterRef.current) counterRef.current.textContent = String(Math.round(progressObj.current.val)).padStart(3, "0");
              if (lineProgressRef.current) gsap.set(lineProgressRef.current, { scaleX: progressObj.current.val / 100 });
            },
          });
        },
      }, "-=0.2");
    };

    // Capture phase intercepts before React SyntheticEvents
    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [pathname, router]);

  // ── Shared completion logic — reused by both pathname effect and safety timeout ──
  const forceComplete = () => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    if (activeTimeline.current) activeTimeline.current.kill();
    
    const hash = pendingHashRef.current;
    pendingHashRef.current = null;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isTransitioning.current = false;
        gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });

        // ── Post-navigation hash scroll ──
        // After the loader curtain lifts, scroll to the hash target if one was pending.
        if (hash) {
          requestAnimationFrame(() => {
            const target = document.getElementById(hash);
            if (target) {
              const yOffset = -100; // Account for fixed header
              const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          });
        }
      },
    });
    activeTimeline.current = tl;

    // Extract the current value explicitly so no object references are shared incorrectly
    const startVal = Number(counterRef.current?.textContent) || 90;
    progressObj.current.val = startVal;
    
    tl.to(progressObj.current, {
      val: 100,
      duration: 0.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(progressObj.current.val)).padStart(3, "0");
        if (lineProgressRef.current) gsap.set(lineProgressRef.current, { scaleX: progressObj.current.val / 100 });
      },
    });

    tl.to([counterRef.current, labelRef.current], { opacity: 0, y: -20, duration: 0.4, ease: "power3.in" }, "-=0.05");
    tl.to(curtainRef.current, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=0.1");
  };

  // ── 3. Completion handler (Fires when Next.js finishes routing) ─────────────
  useEffect(() => {
    // If the page legitimately navigates back to Home (e.g. via back button)
    // we ensure the global mask goes away gracefully.
    if (pathname === HOME_PATH) {
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
      isTransitioning.current = false;
      return;
    }

    // If a route change happened and we WERE tracking an Eager transition
    if (isTransitioning.current) {
      // Kill the slow creep tween so forceComplete starts from current value
      if (creepTweenRef.current) {
        creepTweenRef.current.kill();
        creepTweenRef.current = null;
      }
      forceComplete();
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      // Start in a hidden state via invisible/opacity-0 to prevent unstyled flashes!
      className="fixed inset-0 z-9999 pointer-events-none invisible"
      aria-hidden="true"
    >
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[#040404] flex flex-col pointer-events-auto will-change-transform"
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
          <span className="font-mono text-gold text-xs tracking-[0.5em] uppercase font-bold">
            GH
          </span>
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
          <span className="font-mono text-white/25 text-2xl pb-3 select-none">
            %
          </span>
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
