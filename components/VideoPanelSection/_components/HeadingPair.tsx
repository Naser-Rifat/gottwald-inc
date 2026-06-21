"use client";

import type { Ref } from "react";

interface HeadingPairProps {
  topline: string;
  tagline: string;
  /** Refs animated by useSplitTextReveal + useScrollParallax. */
  toplineRef?: Ref<HTMLHeadingElement>;
  taglineRef?: Ref<HTMLHeadingElement>;
}

// Petrol depth → silver neutral → gold positive. Brand "eye-catcher"
// turquoise intentionally absent so it stays rare elsewhere.
const ACCENT_GRADIENT =
  "linear-gradient(90deg, rgba(0,109,132,0.65) 0%, rgba(184,192,204,0.32) 50%, rgba(212,175,55,0.4) 100%)";

/**
 * The two stacked massive uppercase headings separated by a thin
 * gradient rule. Both <h2>s have `translate="no"` so Google Translate
 * doesn't shred the per-char/per-word reveal spans into <font> tags
 * (it produced strings like "PEACEDIE LOVEDIE HARMONY"). i18n owns the
 * source text — useSplitTextReveal re-runs on locale change.
 */
export default function HeadingPair({
  topline,
  tagline,
  toplineRef,
  taglineRef,
}: HeadingPairProps) {
  return (
    <div className="relative z-10 about-headers pb-[6vh] md:pb-[8vh]">
      <div className="overflow-hidden w-full">
        <h2
          ref={toplineRef}
          id="h1-topline"
          translate="no"
          className="notranslate text-[clamp(1.8rem,7vw,7rem)] mb-0 text-white uppercase tracking-tight leading-[0.95]"
        >
          {topline}
        </h2>
      </div>

      <div
        className="w-full max-w-[60vw] h-px mt-3 mb-3"
        style={{ background: ACCENT_GRADIENT }}
      />

      <div className="overflow-hidden w-full">
        <h2
          ref={taglineRef}
          id="h1-tagline"
          translate="no"
          className="notranslate text-[clamp(1.8rem,7vw,7rem)] mb-0 text-white tracking-tight uppercase leading-[0.95]"
        >
          {tagline}
        </h2>
      </div>
    </div>
  );
}
