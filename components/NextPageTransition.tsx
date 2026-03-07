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
          duration: 0.8,
          ease: "power3.out",
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
            // Brief delay for visual feedback then navigate
            setTimeout(() => {
              router.push("/about");
            }, 600);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [router]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a] border-t border-white/8 opacity-0"
      style={{ minHeight: "60vh" }}
    >
      {/* ── "KEEP SCROLLING" nudge ── */}
      <div className="px-[5vw] pt-[15vh] pb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-white/25 font-medium leading-relaxed">
          Keep scrolling
          <br />
          to learn more
        </p>
      </div>

      {/* ── Main panel ── */}
      <div className="px-[5vw] pb-20 flex flex-col sm:flex-row items-end justify-between gap-8">
        {/* Left: Big label */}
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-white/20 mb-4">
            Next Chapter
          </p>
          <Link href="/about">
            <h2
              className="font-bold tracking-[-0.04em] leading-[0.85] text-white hover:text-white/80 transition-colors cursor-pointer"
              style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
            >
              ABOUT
              <br />
              US
            </h2>
          </Link>
        </div>

        {/* Right: NEXT PAGE label + animated progress bar */}
        <div className="flex flex-col items-end gap-4 min-w-[180px]">
          <div className="flex items-center gap-3 text-white/40">
            <span className="text-[9px] tracking-[0.35em] uppercase font-medium">
              Next Page
            </span>
            <span className="text-sm">→</span>
          </div>

          {/* Progress track */}
          <div
            ref={progressTrackRef}
            className="w-full h-[1px] bg-white/10 relative overflow-hidden"
            style={{ minWidth: "160px" }}
          >
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full bg-white transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <span className="text-[10px] font-mono text-white/25">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* ── Full-screen flash overlay on navigation ── */}
      {navigating && (
        <div
          className="fixed inset-0 bg-white z-[9999] pointer-events-none"
          style={{ animation: "flash-out 0.6s ease-in forwards" }}
        />
      )}
    </div>
  );
}
