"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

interface UsePortalEntranceArgs {
  portalRef: RefObject<HTMLElement | null>;
  orbRef: RefObject<HTMLElement | null>;
  /** Render-ready: client hydrated AND portal is still visible. */
  isReady: boolean;
  /** Loading group has completed (text content can reveal). */
  isLoaded: boolean;
}

/**
 * Two-phase portal entrance:
 *   - Phase 1 (isReady): canvas background fades in, AND the H1
 *     (`.portal-hero-reveal`) slides into place — transform-only, never
 *     opacity: 0, so it's always a valid LCP candidate from first paint.
 *   - Phase 2 (isLoaded): the rest of `.portal-reveal` (eyebrow,
 *     subtitle, CTA, skip link) stagger up once the WebGL scene
 *     finishes loading.
 *
 * The H1 was deliberately split out of `.portal-reveal` — deployed PSI
 * (2026-07-29) showed the desktop portal returning NO_LCP because the
 * ONLY large text on the page sat at opacity: 0 for as long as the
 * WebGL scene took to boot (main-thread work as high as 27s under
 * Lighthouse's CPU profile), leaving no visible LCP candidate within
 * the measurement window.
 *
 * Each phase owns its own gsap.context so they unmount cleanly.
 */
export function usePortalEntrance({
  portalRef,
  orbRef,
  isReady,
  isLoaded,
}: UsePortalEntranceArgs) {
  // Phase 1 — canvas background fade-in + H1 slide-in (LCP-safe).
  useEffect(() => {
    if (!isReady || !portalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(orbRef.current, { opacity: 0 });
      gsap.set(".portal-reveal", { y: 20, opacity: 0 });
      // Transform-only — no opacity set, so the H1 stays visible
      // (default opacity: 1) through this entire phase.
      gsap.set(".portal-hero-reveal", { y: 20 });

      gsap.to(orbRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      });
      gsap.to(".portal-hero-reveal", {
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.15,
      });
    }, portalRef);

    return () => ctx.revert();
  }, [isReady, portalRef, orbRef]);

  // Phase 2 — text/button stagger after loading completes.
  useEffect(() => {
    if (!isLoaded || !portalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline().to(
        ".portal-reveal",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.2",
      );
    }, portalRef);

    return () => ctx.revert();
  }, [isLoaded, portalRef]);
}
