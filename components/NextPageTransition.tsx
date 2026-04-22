"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function NextPageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const navigatedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Fade in the panel when it enters viewport
      gsap.fromTo(
        container,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Track scroll progress through this section
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, self.progress));
          setProgress(p);

          // When progress reaches 100%, navigate to About
          if (p >= 1 && !navigatedRef.current) {
            navigatedRef.current = true;
            setNavigating(true);
            // Brief delay for visual feedback then navigate.
            setTimeout(() => {
              router.push("/about");
            }, 520);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [router]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a] border-t border-white/8 opacity-0 overflow-hidden"
      style={{ minHeight: "60vh" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_35%,rgba(201,168,76,0.08),transparent_52%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_28%,rgba(0,0,0,0.55))]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.018] [background-image:radial-gradient(rgba(255,255,255,0.5)_0.5px,transparent_0.5px)] [background-size:3px_3px]" />

      {/* ── "KEEP SCROLLING" nudge ── */}
      <div className="relative px-[5vw] pt-[14vh] pb-8">
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-10 bg-[#C9A84C]/80" />
          <p className="text-[9px] tracking-[0.5em] uppercase text-white/35 font-medium">
            Next Chapter
          </p>
        </div>
      </div>

      {/* ── Main panel ── */}
      <div className="relative px-[5vw] pb-20 flex flex-col sm:flex-row items-end justify-between gap-10">
        {/* Left: Big label */}
        <div className="max-w-[900px]">
          <Link href="/about">
            <h2
              className="font-black tracking-[-0.05em] leading-[0.82] text-white/92 hover:text-white transition-colors duration-300 cursor-pointer"
              style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
            >
              ABOUT
              <br />
              US
            </h2>
          </Link>
          <p className="mt-6 text-[10px] tracking-[0.32em] uppercase text-white/32">
            Strategic Profile · Leadership Vision
          </p>
        </div>

        {/* Right: NEXT PAGE label + animated progress bar */}
        <div className="flex flex-col items-end gap-3 min-w-[240px] border-t border-white/15 pt-3">
          <div className="flex items-center gap-3 text-white/60">
            <span className="text-[9px] tracking-[0.35em] uppercase font-medium">
              Next Page
            </span>
            <span className="text-[15px] text-[#C9A84C] animate-[arrow-nudge_1.1s_ease-in-out_infinite]">
              →
            </span>
          </div>

          {/* Progress track */}
          <div
            ref={progressTrackRef}
            className="w-full h-px bg-white/12 relative overflow-hidden"
            style={{ minWidth: "220px" }}
          >
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full bg-linear-to-r from-[#C9A84C] via-[#d6bf7a] to-white/80 transition-none"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-1.5 w-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.8)]"
              style={{
                left: `calc(${Math.round(progress * 100)}% - 3px)`,
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <span className="text-[10px] font-mono text-white/45 tabular-nums tracking-[0.18em]">
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
      </div>

      {/* ── Full-screen flash overlay on navigation ── */}
      {navigating && (
        <div
          className="fixed inset-0 bg-white z-9999 pointer-events-none"
          style={{ animation: "flash-out 0.7s cubic-bezier(0.22,1,0.36,1) forwards" }}
        />
      )}

      <style>{`
        @keyframes arrow-nudge {
          0%, 100% { transform: translateX(0); opacity: 0.72; }
          50% { transform: translateX(3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
