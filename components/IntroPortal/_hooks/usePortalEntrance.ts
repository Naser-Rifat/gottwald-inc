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
 *   - Phase 1 (isReady): canvas background fades in.
 *   - Phase 2 (isLoaded): `.portal-reveal` text/buttons stagger up.
 *
 * Each phase owns its own gsap.context so they unmount cleanly.
 */
export function usePortalEntrance({
  portalRef,
  orbRef,
  isReady,
  isLoaded,
}: UsePortalEntranceArgs) {
  // Phase 1 — canvas background fade-in.
  useEffect(() => {
    if (!isReady || !portalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(orbRef.current, { opacity: 0 });
      gsap.set(".portal-reveal", { y: 20, opacity: 0 });

      gsap.to(orbRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
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
