"use client";

import { type Ref } from "react";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
  /** Owned by the parent — `.hero-line span` children are animated in
   *  via a GSAP clip-path slide, then the whole headline gets a slow
   *  breathing pulse. */
  heroTextRef?: Ref<HTMLHeadingElement>;
  /** Owned by the parent — scales from 0 → 1 on entry as a separator. */
  separatorRef?: Ref<HTMLDivElement>;
}

/**
 * Hero block + live "frequency open" status strip + animated separator.
 *
 * Lives in one component because the three blocks are visually one
 * editorial unit (the status strip is positioned directly under the
 * massive headline and the separator caps the whole thing) and the
 * parent timeline animates them as a single sequence.
 */
export default function HeroSection({
  heroTextRef,
  separatorRef,
}: HeroSectionProps) {
  const t = useTranslations("contact.hero");

  return (
    <>
      <section className="px-gutter mb-8 relative">
        {/* Hero headline — owned by next-intl. translate="no" keeps Google
            Translate from breaking the gradient-clip via <font> wrappers. */}
        <h1
          ref={heroTextRef}
          translate="no"
          aria-label={`${t("line1")} ${t("line2")}`}
          className="notranslate leading-[0.85] font-black uppercase tracking-tighter flex flex-col"
          style={{ fontSize: "clamp(5rem, 14vw, 16rem)" }}
        >
          <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
            <span className="hero-line block will-change-transform origin-left drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] text-white/95">
              {t("line1")}
            </span>
          </span>{" "}
          <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
            <span
              className="hero-line block will-change-transform origin-left text-transparent"
              style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.25)" }}
            >
              {t("line2")}
            </span>
          </span>
        </h1>
      </section>

      {/* Live Signal Waveform & Status */}
      <div className="px-gutter mb-[12vh] flex items-center gap-6">
        <div className="status-pulse flex items-center gap-3 opacity-0">
          {/* Animated CSS Waveform */}
          <div className="flex items-center gap-1 h-4">
            <div className="w-[2px] h-full bg-turquoise rounded-full animate-[wave_1s_ease-in-out_infinite]" />
            <div className="w-[2px] h-[40%] bg-turquoise rounded-full animate-[wave_1.2s_ease-in-out_infinite_0.1s]" />
            <div className="w-[2px] h-[80%] bg-turquoise rounded-full animate-[wave_0.8s_ease-in-out_infinite_0.2s]" />
            <div className="w-[2px] h-[30%] bg-turquoise rounded-full animate-[wave_1.5s_ease-in-out_infinite_0.3s]" />
            <div className="w-[2px] h-[60%] bg-turquoise rounded-full animate-[wave_1.1s_ease-in-out_infinite_0.4s]" />
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium ml-2">
            Frequency Open · Accepting Inquiries
          </span>
        </div>
      </div>

      {/* Animated Separator */}
      <div className="px-gutter mb-[8vh]">
        <div
          ref={separatorRef}
          className="h-px w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(18,168,172,0.4) 0%, rgba(212,175,55,0.3) 50%, rgba(18,168,172,0.1) 100%)",
          }}
        />
      </div>
    </>
  );
}
