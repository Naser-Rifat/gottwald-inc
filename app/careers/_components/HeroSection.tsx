"use client";

import { type Ref } from "react";
import { useTranslations } from "next-intl";

import CareersCanvas from "./CareersCanvas";

interface HeroSectionProps {
  /** Owned by the parent for the breathing-pulse animation target. */
  heroRef?: Ref<HTMLHeadingElement>;
}

/**
 * Opening editorial hero of /careers.
 *
 * Full-viewport WebGL CareersCanvas background, ghost "careers." echo,
 * Playfair headline + body copy, primary CTAs ("Apply now" + "Specialist
 * pool"), and a small metadata block. `.reveal-text` is the parent's
 * GSAP batch reveal hook.
 */
export default function HeroSection({ heroRef }: HeroSectionProps) {
  const t = useTranslations("careers.hero");
  const tCtas = useTranslations("careers.ctas");

  return (
    <section className="relative h-[100svh] w-full overflow-hidden flex items-end justify-center bg-[#070c14]">
      {/* Interactive WebGL background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <CareersCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070c14]/90" />
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#070c14] to-transparent" />
      </div>

      {/* Ghost echo — italic "careers." floats behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] right-[-5vw] z-20 select-none opacity-50"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(12rem, 24vw, 30rem)",
          }}
        >
          careers.
        </span>
      </div>

      <div className="relative z-30 w-full max-w-7xl mx-auto px-gutter pb-[15vh]">
        {/* Signature phrase — The Standard motif */}
        <div className="flex items-center gap-3 mb-8 opacity-80 reveal-text">
          <div className="inline-flex items-center gap-4 opacity-80">
            <div className="w-8 h-[1px] bg-[#0f8b8d]" />
            <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
              JOIN THE PEOPLE WHO HOLD THE STANDARD
            </span>
          </div>
        </div>

        {/* Hero headline */}
        <h1
          ref={heroRef}
          translate="no"
          className="notranslate reveal-text leading-[0.85] font-light tracking-[-0.015em] mb-16 uppercase text-white/90"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize:
              "calc(clamp(3.5rem, 7vw, 9rem) * var(--heading-scale))",
          }}
        >
          {t("line1")} <br />
          {t("line2")}
        </h1>

        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="flex-1 flex flex-col gap-8 text-white font-light leading-relaxed tracking-wide reveal-text">
            <p className="text-2xl md:text-3xl font-medium tracking-tight">
              We recruit intentionally worldwide —{" "}
              <br className="hidden md:block" />
              and we mean it.
            </p>
            <div className="text-white/70 max-w-md text-lg space-y-6">
              <p>
                GOTT WALD is a human family: different cultures, traditions,
                languages, life paths — wanted. Because diversity increases our
                intelligence.
              </p>
              <p className="text-white/50 text-base">
                Our axis of impact: NATURE — ANIMALS — HUMANS.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start gap-10 justify-center reveal-text">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#apply"
                translate="no"
                className="notranslate h-14 rounded-full bg-white text-black flex items-center justify-center px-10 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(192,120,64,0.15)] transition-all duration-300 uppercase text-xs tracking-[0.2em] font-bold"
              >
                {tCtas("applyNow")}
              </a>
              <a
                href="#apply"
                translate="no"
                className="notranslate h-14 rounded-full border border-white/20 text-white flex items-center justify-center px-10 hover:bg-white/10 hover:border-silver/40 hover:shadow-[0_0_20px_rgba(184,192,204,0.1)] transition-all duration-300 uppercase text-xs tracking-[0.2em] font-bold"
              >
                {tCtas("specialistPool")}
              </a>
            </div>

            <div className="flex gap-5 items-center pl-2">
              <div className="w-px h-14 bg-white/20" />
              <div className="flex flex-col gap-2">
                <span className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-bold">
                  Global-first. Remote-friendly. Confidential.
                </span>
                <span className="text-copper text-[10px] tracking-[0.25em] uppercase font-bold">
                  HQ: Georgia.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
