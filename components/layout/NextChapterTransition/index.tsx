"use client";

import { useCallback, useRef } from "react";

import { useLinkClickLock } from "./_hooks/useLinkClickLock";
import { useFadeNavigate } from "./_hooks/useFadeNavigate";
import { useChapterScrollCharge } from "./_hooks/useChapterScrollCharge";

import ChapterHeader from "./_components/ChapterHeader";
import ChapterTitle from "./_components/ChapterTitle";
import ChapterProgress from "./_components/ChapterProgress";

interface NextChapterProps {
  nextTitle: string;
  nextHref: string;
  prevHref?: string;
  narrativeLine?: string;
  accentColor?: string;
}

/**
 * NextChapterTransition — final scroll-driven section that bridges to
 * the next chapter. Uses CSS `position: sticky` for pinning instead of
 * GSAP `pin: true` to avoid the pin-spacer DOM mutation that crashes
 * React on client-side route transitions.
 */
export default function NextChapterTransition({
  nextTitle,
  nextHref,
  prevHref,
  narrativeLine,
  accentColor = "#b8c0cc",
}: NextChapterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const lockRef = useLinkClickLock();
  const navigate = useFadeNavigate(lockRef);

  const handleForwardProgress = useCallback((p: number) => {
    if (titleRef.current) {
      titleRef.current.style.transform = `scale(${1 + p * 0.15})`;
      titleRef.current.style.opacity = String(0.3 + p * 0.7);
    }
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${p})`;
    }
    if (pctRef.current) {
      pctRef.current.textContent = `${String(Math.floor(p * 100)).padStart(2, "0")}%`;
    }
  }, []);

  useChapterScrollCharge({
    wrapperRef,
    lockRef,
    nextHref,
    prevHref,
    navigate,
    onForwardProgress: handleForwardProgress,
  });

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-screen bg-[#050505] -mt-1 overflow-hidden"
    >
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-20">
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <ChapterHeader
            narrativeLine={narrativeLine}
            accentColor={accentColor}
          />
          <ChapterTitle title={nextTitle} ref={titleRef} />
          <ChapterProgress
            accentColor={accentColor}
            barRef={barRef}
            pctRef={pctRef}
          />
        </div>
      </section>
    </div>
  );
}
