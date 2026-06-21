"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollTimelineArgs {
  sectionRef: RefObject<HTMLElement | null>;
  /** Number of `.slide-N` slides (N ∈ 1..count). */
  slideCount: number;
  /** Fired when the visible slide changes (1-indexed). */
  onActiveSlideChange: (index: number) => void;
}

/**
 * Pins the section and scrubs through `slideCount` transitions:
 *   - slide 1 is visible immediately
 *   - each subsequent slide fades the previous out, swaps the active
 *     background, fades the new one in, then holds for a beat
 *
 * Pin distance scales with `slideCount` so each transition gets a full
 * viewport of scroll.
 */
export function useScrollTimeline({
  sectionRef,
  slideCount,
  onActiveSlideChange,
}: UseScrollTimelineArgs) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${slideCount * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // First slide is visible immediately.
      gsap.set(".slide-1", { autoAlpha: 1, y: 0, scale: 1 });
      onActiveSlideChange(1);

      for (let i = 2; i <= slideCount; i++) {
        const prev = `.slide-${i - 1}`;
        const current = `.slide-${i}`;
        const label = `transition-${i}`;

        tl.addLabel(label);

        // 1. Exit previous (fast).
        tl.to(
          prev,
          { autoAlpha: 0, y: -60, duration: 0.5, ease: "power2.in" },
          label,
        );

        // 2. Swap active slide index halfway through.
        tl.to(
          {},
          {
            duration: 0.1,
            onStart: () => onActiveSlideChange(i),
            onReverseComplete: () => onActiveSlideChange(i - 1),
          },
          `${label}+=0.4`,
        );

        // 3. Enter current.
        tl.fromTo(
          current,
          { autoAlpha: 0, y: 60, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          `${label}+=0.5`,
        );

        // 4. Hold so the user has time to read.
        tl.to({}, { duration: 0.5 });
      }
    }, section);

    return () => ctx.revert();
  }, [sectionRef, slideCount, onActiveSlideChange]);
}
