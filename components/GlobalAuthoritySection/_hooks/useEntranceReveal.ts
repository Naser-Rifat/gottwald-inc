"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseEntranceRevealArgs {
  containerRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  hudRef: RefObject<HTMLElement | null>;
  metricsRef: RefObject<HTMLElement | null>;
}

/**
 * Scroll-triggered entrance for the section: container fade, then
 * stagger-in for the text column, HUD overlay, and metrics grid —
 * each anchored to `textRef` so they reveal together as a unit.
 */
export function useEntranceReveal({
  containerRef,
  textRef,
  hudRef,
  metricsRef,
}: UseEntranceRevealArgs) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: container, start: "top 70%" },
        },
      );

      const text = textRef.current;
      if (text) {
        gsap.fromTo(
          text.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 80%" },
          },
        );
      }

      const hud = hudRef.current;
      if (hud && text) {
        gsap.fromTo(
          hud.children,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 80%" },
          },
        );
      }

      const metrics = metricsRef.current;
      if (metrics && text) {
        gsap.fromTo(
          metrics.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 80%" },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [containerRef, textRef, hudRef, metricsRef]);
}
