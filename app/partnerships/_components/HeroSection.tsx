"use client";

import {
  useCallback,
  useRef,
  type Ref,
  type RefObject,
} from "react";
import { useTranslations } from "next-intl";

import { usePauseAnimationsOffscreen } from "@/lib/usePauseAnimationsOffscreen";

interface HeroSectionProps {
  /** Section root ref — parent attaches the cursor-follow glow handler
   *  to this exact element so the glow stays scoped to the hero. */
  sectionRef?: Ref<HTMLElement>;
  /** Glow element ref — driven by `gsap.quickTo` from the parent. */
  glowRef?: Ref<HTMLDivElement>;
  /** Inner content ref — parent runs the kinetic-character intro and
   *  the scroll-fade timeline against this element. */
  textRef?: Ref<HTMLDivElement>;
}

const HERO_STATS = [
  { label: "Countries", value: "26" },
  { label: "Partner Origins", value: "71" },
  { label: "Network Size", value: "888+" },
  { label: "Languages", value: "17" },
] as const;

/**
 * /partnerships hero — editorial cascade ("PARTNERSHIPS" + "at Gott Wald")
 * with a cursor-following turquoise glow, a parallax italic "partners."
 * ghost echo, animated signal waves, and a right-side glassmorphic stats
 * column with primary + secondary CTAs.
 *
 * Animation hooks the parent's GSAP context relies on:
 *   `.kinetic-char`   — per-character scatter→snap entrance
 *   `.parallax-fast`  — hero line 1 scroll parallax
 *   `.parallax-slow`  — hero line 2 scroll parallax
 *   `.hero-reveal`    — staggered fade-up on entry
 *   `.scroll-indicator-line` — repeating scroll ticker
 */
export default function HeroSection({
  sectionRef,
  glowRef,
  textRef,
}: HeroSectionProps) {
  const t = useTranslations("partnerships.hero");
  const tCtas = useTranslations("partnerships.ctas");

  // Local ref for the IntersectionObserver pause hook. The parent's
  // forwarded `sectionRef` is also used (for the cursor-glow handler);
  // a callback ref merges both so they point at the same <section>.
  const innerSectionRef = useRef<HTMLElement>(null);
  usePauseAnimationsOffscreen(innerSectionRef);

  const setSectionRef = useCallback(
    (el: HTMLElement | null) => {
      innerSectionRef.current = el;
      if (typeof sectionRef === "function") {
        sectionRef(el);
      } else if (sectionRef) {
        // Forwarded RefObject — writing `.current` is the documented
        // ref-forwarding pattern. react-hooks/immutability flags it as
        // a false positive (the rule models normal values, not refs),
        // so silence it for this one assignment.
        // eslint-disable-next-line react-hooks/immutability
        (sectionRef as RefObject<HTMLElement | null>).current = el;
      }
    },
    [sectionRef],
  );

  return (
    <section
      ref={setSectionRef}
      className="min-h-screen w-full flex flex-col justify-end relative bg-transparent overflow-hidden pt-32 lg:pt-40"
    >
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-2" />

      {/* Cursor-following atmospheric glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="hero-cursor-glow pointer-events-none absolute z-2 will-change-transform opacity-0"
        style={{
          left: 0,
          top: 0,
          width: "min(70vw, 900px)",
          height: "min(70vw, 900px)",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at center, rgba(18,168,172,0.18) 0%, rgba(18,168,172,0.08) 35%, transparent 65%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Premium liquid aurora background */}
      <div className="about-liquid-aurora absolute top-[0%] left-[0%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] rounded-full mix-blend-screen opacity-[0.06] blur-[120px] z-0 will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_15s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gold to-petrol rounded-full animate-[spin_20s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      {/* Ghost echo — "partners." */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[14%] -left-[5vw] z-2 select-none"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(12rem, 24vw, 30rem)",
          }}
        >
          partners.
        </span>
      </div>

      {/* Brand signal-language anchor — subtle frequency wave at the bottom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] lg:h-[24vh] z-2 overflow-hidden"
      >
        <div
          className="strategic-signal-drift absolute bottom-0 left-0 w-[200%] h-full will-change-transform"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        >
          <svg
            viewBox="0 0 1600 200"
            preserveAspectRatio="none"
            className="block w-full h-full"
            aria-hidden="true"
          >
            <path
              d="M0,100 Q100,40 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100 T1400,100 T1600,100"
              fill="none"
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,130 Q100,90 200,130 T400,130 T600,130 T800,130 T1000,130 T1200,130 T1400,130 T1600,130"
              fill="none"
              stroke="rgba(212, 175, 55, 0.08)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div
        ref={textRef}
        className="relative w-full px-gutter pb-32 md:pb-40 lg:pb-48 xl:pb-56 will-change-transform z-5 mt-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 lg:gap-16 xl:gap-24 items-end">
          {/* LEFT — power statement */}
          <div className="hero-reveal w-full max-w-[850px]">
            <div className="inline-flex items-center gap-4 opacity-80 mb-8 lg:mb-10">
              <div className="w-8 h-[1px] bg-petrol" />
              <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
                PARTNER WITH THOSE WHO DEFINE IT
              </span>
            </div>

            <h1 translate="no" className="notranslate flex flex-col max-w-full">
              <span className="parallax-fast block whitespace-nowrap text-[clamp(2.2rem,7.4vw,7rem)] leading-[0.88] font-black tracking-[-0.045em] uppercase text-white">
                {Array.from(t("line1")).map((ch, idx) => (
                  <span
                    key={`l1-${idx}`}
                    className="kinetic-char inline-block will-change-transform"
                    aria-hidden={ch === " " ? "true" : undefined}
                  >
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
              <span
                className="parallax-slow block whitespace-nowrap text-[clamp(1.8rem,5.6vw,5.4rem)] leading-[0.92] tracking-[-0.035em] text-gold pt-1 lg:pt-2 normal-case"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {Array.from(t("line2")).map((ch, idx) => (
                  <span
                    key={`l2-${idx}`}
                    className="kinetic-char inline-block will-change-transform"
                    aria-hidden={ch === " " ? "true" : undefined}
                  >
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            </h1>

            <p
              className="hero-reveal mt-10 lg:mt-12 text-[clamp(1.2rem,1.8vw,1.8rem)] font-light leading-[1.35] text-white max-w-[42ch]"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              We don&apos;t buy vendors. We select{" "}
              <span className="text-turquoise">partners.</span>
            </p>

            <p
              className="hero-reveal mt-10 lg:mt-12 text-[clamp(0.9rem,1.05vw,1.1rem)] text-white italic font-light"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Confidential by default. NDA-ready on request.
            </p>
          </div>

          {/* RIGHT — stats column + CTAs */}
          <div className="hero-reveal hidden lg:flex flex-col self-end gap-8 lg:gap-10 p-8 lg:p-10 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden drop-shadow-2xl">
            <div
              className="absolute top-0 left-0 w-full h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
              }}
            />

            <p
              className="text-[clamp(0.95rem,1.1vw,1.15rem)] text-gold italic font-light tracking-[-0.012em]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our reach.
            </p>

            <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-4 lg:gap-y-5 items-baseline">
              {HERO_STATS.flatMap(({ label, value }) => [
                <span
                  key={`label-${label}`}
                  className="text-[10px] lg:text-[11px] tracking-[0.3em] uppercase text-white font-medium"
                >
                  {label}
                </span>,
                <span
                  key={`value-${label}`}
                  className="text-[clamp(1.8rem,2.4vw,2.4rem)] font-light text-white tabular-nums leading-[1] tracking-[-0.025em] text-right"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {value}
                </span>,
              ])}
            </div>

            <div className="flex flex-col gap-5 mt-2">
              <a
                href="#apply"
                data-magnetic
                translate="no"
                className="notranslate group inline-flex items-baseline gap-4 text-white hover:text-gold transition-colors duration-500 self-start"
              >
                <span className="font-light tracking-[-0.018em] leading-[1] text-[clamp(1.1rem,1.4vw,1.45rem)]">
                  {tCtas("applyForPartnership")}
                </span>
                <span className="inline-block w-10 h-px bg-current opacity-60 translate-y-[-0.3em] group-hover:w-20 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="text-current translate-y-[-0.05em] text-[clamp(1rem,1.2vw,1.25rem)] leading-[1] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </a>
              <a
                href="#apply"
                translate="no"
                className="notranslate group inline-flex items-baseline gap-3 text-white hover:text-white transition-colors duration-500 self-start"
              >
                <span
                  className="font-light italic tracking-[-0.012em] text-[clamp(0.95rem,1.1vw,1.15rem)]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {tCtas("requestIntroCall")}
                </span>
                <span className="text-current text-sm group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
