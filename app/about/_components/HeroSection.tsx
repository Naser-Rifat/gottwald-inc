"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import TuningChars from "./TuningChars";

// Heavy WebGL canvas (~250KB of Three.js + R3F + 22,500-particle shader).
// Deferring it off the critical path lets the hero text paint first, which
// fixes the about-page LCP regression Lighthouse flagged. The wrapper div
// already sets bg-[#020509], so there's no visual flash while it loads.
const AboutWaveCanvas = dynamic(() => import("./AboutWaveCanvas"), {
  ssr: false,
});

/**
 * Opening hero: three-line editorial cascade ("tension–release") over
 * the ambient AboutWaveCanvas.
 *
 * Animations are driven from `AboutClient.tsx` via class selectors:
 *   .tuning-headline, .tuning-line  → letter-by-letter "tuning sequence"
 *   .frequency-wave, .frequency-wave-echo → SVG draw-on
 *   .hero-frame                     → top + bottom frame fades
 *   .hero-bg-image                  → ken-burns parallax (sister hooks)
 * Those classes are queried from a GSAP context scoped to `pageRef`, so
 * keeping them intact on this subtree is sufficient — no prop wiring
 * needed.
 */
export default function HeroSection() {
  const t = useTranslations("about");

  return (
    <section
      data-journey="perception"
      className="hero-section about-hero-material relative w-full h-[100svh] bg-[#070c14] overflow-hidden flex items-end justify-center"
    >
      {/* Ambient frequency-field anchor */}
      <div className="about-visual about-visual--hero pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <AboutWaveCanvas />
      </div>

      {/* Center — three-line editorial cascade with tension–release rhythm. */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-gutter pb-[15vh]">
        {/* Top: minimal brand mark */}
        <div className="hero-frame flex items-center gap-4 opacity-0 mb-6 lg:mb-8">
          <div className="w-8 h-[1px] bg-silver" />
          <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
            THE FIRM THAT SETS THE STANDARD
          </span>
        </div>

        <h1
          translate="no"
          className="tuning-headline notranslate w-full max-w-[1600px]"
          aria-label="We Turn Complexity into Inevitability"
        >
          <div className="overflow-hidden mb-1 lg:mb-2">
            <span
              className="tuning-line block font-light uppercase text-white/60 leading-[1.05] tracking-[-0.015em] whitespace-nowrap"
              style={{
                fontSize:
                  "calc(clamp(2.2rem, 6.5vw, 92px) * var(--heading-scale))",
              }}
              data-line="1"
            >
              <TuningChars text={t("hero.line1")} />
            </span>
          </div>
          <div className="overflow-hidden">
            <span
              className="tuning-line hero-complexity block font-black uppercase leading-[0.86] tracking-[-0.045em] whitespace-nowrap"
              style={{
                fontSize:
                  "calc(clamp(3.5rem, 11.5vw, 168px) * var(--heading-scale))",
              }}
              data-line="2"
            >
              <TuningChars text={t("hero.line2")} />
            </span>
          </div>

          {/* Single quiet resonance line — the only decorative element,
              earned because it visualizes the brand's literal frequency word. */}
          <div className="my-3 lg:my-4 max-w-[22rem] lg:max-w-md pointer-events-none">
            <svg
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
              className="w-full h-3 overflow-visible"
              aria-hidden="true"
            >
              <path
                className="frequency-wave"
                d="M0,6 Q50,2 100,6 T200,6 T300,6 T400,6"
                fill="none"
                stroke="rgba(18,168,172,0.6)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="overflow-hidden">
            <span
              className="tuning-line block font-light italic text-white/85 leading-[1.0] tracking-[-0.005em] whitespace-nowrap"
              style={{
                fontSize:
                  "calc(clamp(1.8rem, 4.8vw, 70px) * var(--heading-scale))",
              }}
              data-line="3"
            >
              <TuningChars text={t("hero.line3")} />
            </span>
          </div>
        </h1>

        {/* Bottom-right: single positioning sentence */}
        <div className="hero-frame opacity-0 mt-10 lg:mt-14 flex justify-end">
          <div className="border-t border-white/[0.08] pt-5 max-w-sm lg:max-w-md text-right">
            <p className="text-[15px] lg:text-[16px] font-light text-white/80 leading-[1.7]">
              If you&apos;re a CEO, founder, or executive — or you run an SME
              that must grow,{" "}
              <span className="text-white">you know this moment.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
