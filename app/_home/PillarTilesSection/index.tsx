"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

import type { Pillar } from "@/lib/types/pillars";

import { useScrollTimeline } from "./_hooks/useScrollTimeline";
import { useFollowCursor } from "./_hooks/useFollowCursor";

import ProgressIndicator from "./_components/ProgressIndicator";
import PillarSlide from "./_components/PillarSlide";
import GhostCursor from "./_components/GhostCursor";

interface PillarTilesSectionProps {
  pillars: Pillar[];
}

const MAX_PILLARS = 8;
const FALLBACK_ACCENT = "#d4af37";
const INTRO_AURORA: readonly [string, string, string] = [
  "#0a0b1a",
  "#1a0b2e",
  "#051a3a",
];

const FLOAT_KEYFRAMES = `
  @keyframes slowRotateFloat {
    0% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(-20px) rotate(3deg) scale(1.03); }
    100% { transform: translateY(0px) rotate(0deg) scale(1); }
  }
`;

/**
 * PillarTilesSection — scroll-pinned hero showcasing up to 8 pillars
 * as cinematic slides. Each slide swaps the aurora canvas tint, with
 * a custom "Learn More ↗" cursor that activates on the image hover
 * region.
 */
export default function PillarTilesSection({
  pillars,
}: PillarTilesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useFollowCursor<HTMLDivElement>();
  // Start at 1 so the initial aurora reflects the first pillar accent.
  // Not using handleActiveSlideChange for this because that would bump
  // maxLoadedSlide, loading pillar images before the section is visible.
  const [activeSlide, setActiveSlide] = useState(1);
  const [isActive, setIsActive] = useState(false);
  // Slides are z-stacked at absolute inset-0 so native lazy-loading can't
  // defer them (browser considers them all in viewport). We gate <Image>
  // rendering manually via a monotonically-growing high-water mark.
  //
  // Start at 0 — no images in SSR HTML. An IntersectionObserver below
  // bumps this to 1 when the section first enters the viewport, so
  // slide-1's image loads only when the user is actually near this section,
  // not on initial page load. This keeps pillar images out of the LCP
  // critical path (home page H1 text wins LCP at ~1.5 s instead of a
  // full-viewport pillar image at ~4.5 s).
  // Grows monotonically — scrolling back reuses the cached image.
  const [maxLoadedSlide, setMaxLoadedSlide] = useState(0);

  const displayPillars = pillars.slice(0, MAX_PILLARS);

  // Index 0 = intro background; index 1..N = per-pillar accent triple.
  const auroraColors = useMemo<ReadonlyArray<readonly [string, string, string]>>(
    () => [
      INTRO_AURORA,
      ...displayPillars.map((pillar) => {
        const accent = pillar.theme?.accent || FALLBACK_ACCENT;
        return [accent, accent, accent] as const;
      }),
    ],
    [displayPillars],
  );

  const handleActiveSlideChange = useCallback((idx: number) => {
    setActiveSlide(idx);
    // Grow the loaded high-water mark so slide N+1's image is in flight by
    // the time the reveal animation starts. Never shrinks — scrolling back
    // uses the already-fetched image without re-mounting.
    if (idx > 0) {
      setMaxLoadedSlide((prev) => (idx + 1 > prev ? idx + 1 : prev));
    }
  }, []);

  // Bootstrap slide-1 image loading only when the section enters the viewport.
  // Using IntersectionObserver (not eager load) keeps pillar images out of
  // the initial page LCP critical path — the home page H1 text wins LCP at
  // FCP time instead of a full-viewport pillar image loaded at startup.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMaxLoadedSlide((prev) => (prev < 1 ? 1 : prev));
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useScrollTimeline({
    sectionRef,
    slideCount: displayPillars.length,
    onActiveSlideChange: handleActiveSlideChange,
    onToggleActive: setIsActive,
  });

  const showCursor = useCallback(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  }, [cursorRef]);

  const hideCursor = useCallback(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      opacity: 0,
      scale: 0.2,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [cursorRef]);

  const currentAurora = auroraColors[activeSlide];

  useEffect(() => {
    if (isActive) {
      window.dispatchEvent(
        new CustomEvent("page-color-shift", {
          detail: { color: currentAurora[0] },
        })
      );
    } else {
      // Revert to Home Hero color when scrolled back up
      window.dispatchEvent(
        new CustomEvent("page-color-shift", {
          detail: { color: "#27c6cd" },
        })
      );
    }
  }, [isActive, currentAurora]);

  return (
    <section
      ref={sectionRef}
      id="project-tiles-section"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white bg-transparent"
    >
      {/* Aurora color is driven by usePageColorShift via the layout singleton */}

      <ProgressIndicator
        activeIndex={activeSlide}
        total={displayPillars.length}
      />

      {displayPillars.map((pillar, idx) => (
        <PillarSlide
          key={pillar.slug}
          pillar={pillar}
          slideIndex={idx + 1}
          shouldRenderImage={idx + 1 <= maxLoadedSlide}
          onHover={showCursor}
          onUnhover={hideCursor}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: FLOAT_KEYFRAMES }} />

      <GhostCursor ref={cursorRef} />
    </section>
  );
}
