"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollParallaxArgs {
  /** Element being translated. */
  ref: RefObject<HTMLElement | null>;
  /** Trigger element — usually the parent section. */
  scopeRef: RefObject<HTMLElement | null>;
  /** Target yPercent at scope-bottom. Negative = drifts up. */
  yPercent: number;
}

/**
 * Scrub-driven Y-axis parallax: `ref` translates by `yPercent` as
 * `scopeRef` scrolls from top-of-viewport to bottom-of-viewport.
 */
export function useScrollParallax({
  ref,
  scopeRef,
  yPercent,
}: UseScrollParallaxArgs) {
  useEffect(() => {
    const el = ref.current;
    const scope = scopeRef.current;
    if (!el || !scope) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, scopeRef, yPercent]);
}
