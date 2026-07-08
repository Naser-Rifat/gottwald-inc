"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap-bootstrap";

interface UseScrollFadeInArgs {
  ref: RefObject<HTMLElement | null>;
  from: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** Default "top 88%". */
  start?: string;
}

/**
 * Scroll-triggered fromTo on a single element. Thin wrapper around
 * `gsap.fromTo(..., { scrollTrigger: {...} })` so each entrance reads
 * as one line in the orchestrator.
 *
 * `from`/`to` are stored in a ref so callers can pass inline object
 * literals without re-binding the ScrollTrigger every render.
 */
export function useScrollFadeIn({
  ref,
  from,
  to,
  start = "top 88%",
}: UseScrollFadeInArgs) {
  const fromRef = useRef(from);
  const toRef = useRef(to);
  useEffect(() => {
    fromRef.current = from;
    toRef.current = to;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromRef.current,
        {
          ...toRef.current,
          scrollTrigger: { trigger: el, start },
        },
      );
    });

    return () => ctx.revert();
  }, [ref, start]);
}
