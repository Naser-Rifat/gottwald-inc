"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";

interface CtaSectionProps {
  /** Click handler that runs the cinematic curtain transition and pushes
   *  /contact. Lives on the parent because it interacts with GSAP's
   *  global ScrollTrigger and the page-level router. */
  onStrategicClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Final DECISION / CTA. Three `.cta-reveal` blocks fade in via the
 * parent GSAP context once the section enters the viewport, and the
 * `.magnetic-cta` button is captured by the magnetic-pull handler the
 * parent registers on `window`.
 */
export default function CtaSection({ onStrategicClick }: CtaSectionProps) {
  const t = useTranslations("about");

  return (
    <section
      data-journey="decision"
      className="cta-section about-atmosphere min-h-[78svh] py-[14vh] px-gutter relative flex items-center justify-center bg-[#070c14] overflow-hidden"
    >
      <div className="relative z-10 text-center flex flex-col items-center max-w-4xl space-y-16">
        <div className="cta-reveal">
          <p className="text-lg tracking-[0.3em] uppercase text-white/90 font-bold mb-6">
            For whom
          </p>
          <h3 className="text-3xl md:text-5xl font-light leading-[1.3] text-white/90">
            For CEOs, founders, executives, and SMEs who don&apos;t want to
            &quot;do more&quot; — but to do the right thing, the right way.
          </h3>
        </div>

        <p className="cta-reveal text-2xl font-light tracking-[0.04em] uppercase text-white/80">
          If you want it cleanly solved — we are.
        </p>

        <div className="cta-reveal pt-8 pb-4">
          <button
            onClick={onStrategicClick}
            translate="no"
            className="magnetic-cta notranslate group relative cursor-pointer px-9 md:px-12 py-5 md:py-6 overflow-hidden border border-turquoise/35 hover:border-turquoise/80 transition-colors duration-700"
          >
            {/* Sweep animation background */}
            <div className="absolute inset-0 bg-turquoise translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />

            <span className="relative z-10 text-[12px] md:text-sm tracking-[0.22em] uppercase font-bold text-turquoise group-hover:text-[#030303] transition-colors duration-500">
              {t("ctas.strategicConversation")}
            </span>
          </button>
        </div>

        <p className="cta-reveal text-xl text-white/90 font-light mt-8">
          We don&apos;t create noise. We create structure.
          <br />
          And structure creates inevitability.
        </p>
      </div>
    </section>
  );
}
