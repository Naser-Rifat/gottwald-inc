"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseEntranceRevealArgs {
  sectionRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  alignmentRef: RefObject<HTMLElement | null>;
}

/**
 * Choreographs the section's entrance:
 *   1. .strategic-reveal nodes stagger-fade up on scroll into view.
 *   2. The italic "Alignment." word rises from under an overflow-hidden
 *      mask with a focus-pull settle (skipped under reduced-motion).
 */
export function useEntranceReveal({
  sectionRef,
  contentRef,
  alignmentRef,
}: UseEntranceRevealArgs) {
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll(".strategic-reveal"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        },
      );

      const alignment = alignmentRef.current;
      if (!alignment) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(alignment, { y: "0%", opacity: 1, scale: 1 });
        return;
      }

      gsap.set(alignment, { transformOrigin: "left bottom" });
      gsap.fromTo(
        alignment,
        { y: "100%", scale: 0.92, opacity: 0.4 },
        {
          y: "0%",
          scale: 1,
          opacity: 1,
          duration: 1.7,
          delay: 0.3,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, contentRef, alignmentRef]);
}
