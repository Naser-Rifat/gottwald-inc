"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NextChapterProps {
  nextTitle: string;
  nextHref: string;
}

/**
 * NextChapterTransition
 *
 * Uses CSS `position: sticky` for pinning instead of GSAP `pin: true`.
 * This avoids the `.pin-spacer` DOM wrapper injection that causes
 * React's "Failed to execute removeChild on Node" crash during
 * client-side route transitions.
 *
 * Architecture:
 *   <div class="wrapper" style="height: 250vh">   ← scrollable runway
 *     <section class="sticky top-0 h-screen">     ← visually pinned
 *       ...content...
 *     </section>
 *   </div>
 *
 * ScrollTrigger reads scroll progress on the wrapper (no DOM mutation).
 */
export default function NextChapterTransition({
  nextTitle,
  nextHref,
}: NextChapterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const hasNavigatedRef = useRef(false);

  const navigate = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // Create a smooth fade to black before navigating
    // This hides any layout jumps and gives us time to reset scroll
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "9999";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.4s ease-out";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    // Trigger fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // Wait for fade to finish, then prepare for next route
    setTimeout(() => {
      // Force scroll to top BEFORE React renders the new page
      // This ensures GSAP ScrollTriggers on the new page initialize with y=0
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // Kill current triggers to prevent them from firing during unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Navigate
      router.push(nextHref);

      // Clean up overlay after navigation completes
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.style.opacity = "0";
          setTimeout(() => document.body.removeChild(overlay), 400);
        }
      }, 500);
    }, 400);
  }, [nextHref, router]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // ScrollTrigger with NO pin — just reads scroll position
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0,
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, self.progress));
        setProgress(p);

        if (p >= 0.98 && !hasNavigatedRef.current) {
          navigate();
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [navigate]);

  return (
    <div
      ref={wrapperRef}
      style={{ height: "250vh" }}
      className="relative w-full"
    >
      {/* Sticky inner — CSS handles the pinning, not GSAP */}
      <section className="sticky top-0 h-screen w-full bg-[#050505] text-white flex flex-col justify-center px-gutter overflow-hidden z-20 border-t border-white/5">
        {/* ── Top Meta ── */}
        <div className="absolute top-[10vh] left-gutter flex flex-col gap-2 opacity-50">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/50">
            Keep Scrolling
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/50">
            To Learn More
          </span>
        </div>

        <div className="absolute top-[25vh] left-gutter">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40">
            Next Chapter
          </span>
        </div>

        {/* ── Massive Interactive Title ── */}
        <h2
          className="text-[12vw] sm:text-[15vw] leading-[0.8] font-black tracking-tighter uppercase origin-left will-change-transform max-w-[80vw]"
          style={{
            transform: `scale(${1 + progress * 0.15})`,
            opacity: 0.3 + progress * 0.7,
          }}
        >
          {nextTitle}
        </h2>

        {/* ── Decorative Dot ── */}
        <div className="absolute top-1/2 left-2/3 -translate-y-1/2 hidden lg:flex items-center justify-center pointer-events-none">
          <div className="w-25 h-25 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
        </div>

        {/* ── Bottom Progress UI ── */}
        <div className="absolute bottom-[10vh] right-gutter flex flex-col items-end gap-3 w-48 sm:w-64">
          <div className="flex justify-between w-full items-center text-[9px] uppercase tracking-[0.3em] font-bold text-white/40 mb-1">
            <span>Next Page</span>
            <span>→</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-px bg-white/10 relative origin-left">
            <div
              className="absolute top-0 left-0 w-full h-full bg-gold origin-left will-change-transform"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          {/* Percentage */}
          <span className="text-[10px] font-mono text-white/30">
            {Math.floor(progress * 100)}%
          </span>
        </div>
      </section>
    </div>
  );
}
