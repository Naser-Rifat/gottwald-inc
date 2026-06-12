"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Resonance Cursor — bespoke site-wide cursor signature.
 * Outer ring lags subtly behind the mouse (orchestrated drift), inner dot
 * follows exactly. Ring expands and dims over interactive elements; both
 * use mix-blend difference so contrast survives every background.
 *
 * Disabled on touch / no-hover devices and when prefers-reduced-motion is set.
 */
export default function ResonanceCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canHover) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Activate custom cursor — hide system cursor globally.
    document.documentElement.classList.add("resonance-cursor-active");
    outer.style.display = "block";
    inner.style.display = "block";

    const quickInnerX = gsap.quickTo(inner, "x", { duration: 0, ease: "none" });
    const quickInnerY = gsap.quickTo(inner, "y", { duration: 0, ease: "none" });
    const quickOuterX = gsap.quickTo(outer, "x", {
      duration: reducedMotion ? 0 : 0.45,
      ease: "power3.out",
    });
    const quickOuterY = gsap.quickTo(outer, "y", {
      duration: reducedMotion ? 0 : 0.45,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      quickInnerX(e.clientX);
      quickInnerY(e.clientY);
      quickOuterX(e.clientX);
      quickOuterY(e.clientY);
    };

    const handleMouseDown = () => {
      gsap.to(outer, {
        scale: 0.7,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseUp = () => {
      gsap.to(outer, {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.55)",
        overwrite: "auto",
      });
    };

    const INTERACTIVE_SELECTOR =
      'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

    const expandCursor = () => {
      gsap.to(outer, {
        scale: 1.9,
        opacity: 0.5,
        duration: 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(inner, {
        scale: 0.4,
        duration: 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const restCursor = () => {
      gsap.to(outer, {
        scale: 1,
        opacity: 1,
        duration: 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(inner, {
        scale: 1,
        duration: 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        expandCursor();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        target?.closest?.(INTERACTIVE_SELECTOR) &&
        !related?.closest?.(INTERACTIVE_SELECTOR)
      ) {
        restCursor();
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.documentElement.classList.remove("resonance-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags subtly behind the mouse, expands on hover */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full border border-turquoise/65"
        style={{
          display: "none",
          width: "32px",
          height: "32px",
          marginLeft: "-16px",
          marginTop: "-16px",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      {/* Inner dot — exact mouse position */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full bg-turquoise"
        style={{
          display: "none",
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
    </>
  );
}
