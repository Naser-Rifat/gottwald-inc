"use client";

import { useTranslations } from "next-intl";

/**
 * Left column of the hero:
 *   - eyebrow ("WHAT THE STANDARD LOOKS LIKE")
 *   - 3-line tagline with per-word GSAP reveal
 *   - (commented) accent gradient line
 *
 * `.hero-title-block`, `.hero-top-label`, and `.hero-word` are read by
 * useHeroEntrance — preserve these classnames.
 */
export default function HeroTitleBlock() {
  const t = useTranslations("home.hero");

  return (
    <div className="hero-title-block flex flex-col gap-6 lg:gap-8 w-full lg:w-auto">
      <div className="hero-top-label flex items-center gap-3 opacity-0">
        <div className="inline-flex items-center gap-4 opacity-80">
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/70">
            WHAT THE STANDARD LOOKS LIKE
          </span>
        </div>
      </div>

      {/* `translate="no"` prevents Google Translate from wrapping the
          .hero-word spans in <font> tags, which would break the GSAP
          word-flip reveal. */}
      <h1
        translate="no"
        className="notranslate font-light tracking-[-0.03em] leading-[0.95] uppercase mix-blend-screen shrink-0"
        style={{
          fontSize: "calc(clamp(1.6rem, 5.5vw, 8rem) * var(--heading-scale))",
          transformStyle: "preserve-3d",
        }}
      >
        <span className="block overflow-hidden py-1">
          <span
            className="hero-word block"
            style={{ transformOrigin: "bottom center" }}
          >
            {t("line1")}
          </span>
        </span>
        <span className="block overflow-hidden py-1">
          <span
            className="hero-word block text-white/90"
            style={{ transformOrigin: "bottom center" }}
          >
            {t("line2")}
          </span>
        </span>
        <span className="block overflow-hidden py-1">
          <span
            className="hero-word block"
            style={{ transformOrigin: "bottom center" }}
          >
            {t("line3")}
          </span>
        </span>
      </h1>

      {/* Accent line under heading — full 5-frequency span (currently
          disabled; preserved as design intent). */}
      {/* <div
        className="accent-line h-[2px] w-full max-w-[320px] origin-left"
        style={{
          background:
            "linear-gradient(90deg, rgba(212,175,55,0.55) 0%, rgba(184,192,204,0.42) 28%, rgba(0,109,132,0.55) 52%, rgba(18,168,172,0.70) 76%, rgba(192,120,64,0.45) 100%)",
        }}
      /> */}
    </div>
  );
}
