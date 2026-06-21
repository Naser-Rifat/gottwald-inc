"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * THE DIFFERENCE — Manifesto cadence.
 *
 * Three-movement editorial flow:
 *   1. Foundation statement (left title + right-indented body)
 *   2. The "axis" rendered as orchestral movements (Roman-numeral
 *      tabulation of Nature / Animals / Humans) with the abstract axis
 *      visual to the right.
 *   3. Standalone right-aligned anchor "We don't optimize parts."
 *
 * The whole block is wrapped in `translate="no" notranslate` because
 * Google Translate would otherwise shred the per-segment copy that
 * next-intl owns.
 */
export default function ManifestoAxisSection() {
  const t = useTranslations("about");

  return (
    <section
      data-journey="trust"
      className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14] overflow-hidden"
    >
      <div
        translate="no"
        className="notranslate max-w-[1400px] mx-auto relative z-10"
      >
        {/* Block 1 — Foundation Statement. */}
        <div className="reveal-text mb-[12vh] lg:mb-[14vh]">
          <h2
            className="font-light text-white leading-[1.15] tracking-[-0.018em] max-w-4xl"
            style={{
              fontSize:
                "calc(clamp(1.8rem, 3.6vw, 3.2rem) * var(--heading-scale))",
            }}
          >
            {t("manifesto.title")}
          </h2>
          <div className="mt-10 lg:mt-14 ml-auto max-w-2xl pl-0 lg:pl-8">
            <p
              className="font-light text-white/65 leading-[1.55] tracking-[-0.005em]"
              style={{
                fontSize:
                  "calc(clamp(1.05rem, 1.5vw, 1.45rem) * var(--heading-scale))",
              }}
            >
              {t("manifesto.body")}
            </p>
          </div>
        </div>

        {/* Block 2 — The Axis as orchestral movements. */}
        <div className="reveal-text mb-[12vh] lg:mb-[14vh] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative">
          <div className="relative z-10 lg:col-span-7">
            <p className="text-[11px] tracking-[0.42em] text-white/45 font-light uppercase mb-10 lg:mb-12 max-w-md">
              {t("manifesto.axisLead")}
            </p>
            <div className="w-full">
              {[
                { word: t("manifesto.nature"), num: "I" },
                { word: t("manifesto.animals"), num: "II" },
                { word: t("manifesto.humans"), num: "III" },
              ].map((it) => (
                <div
                  key={it.num}
                  className="flex items-baseline gap-6 lg:gap-10 border-b border-white/[0.07] py-3 lg:py-5"
                >
                  <span className="text-[10px] tracking-[0.4em] text-gold/55 font-mono uppercase shrink-0 w-8">
                    {it.num}
                  </span>
                  <span
                    className="font-light text-white/95 tracking-[-0.022em] leading-none whitespace-nowrap"
                    style={{
                      fontSize:
                        "calc(clamp(2rem, 5vw, 4.4rem) * var(--heading-scale))",
                    }}
                  >
                    {it.word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="living-system-visual about-visual about-visual--living pointer-events-none hidden lg:block lg:col-span-5 relative aspect-[4/5] overflow-hidden opacity-[0.8]"
            style={{
              maskImage:
                "radial-gradient(circle at center, black 40%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 40%, transparent 85%)",
            }}
          >
            <Image
              src="/images/about_axis_abstract_ci.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="living-system-img about-visual-image object-cover"
            />
          </div>
        </div>

        {/* Block 3 — Standalone right-aligned anchor. */}
        <div className="reveal-text max-w-5xl ml-auto mr-0 text-right border-y border-white/[0.08] py-10 md:py-14">
          <div className="mb-6 max-w-[14rem] ml-auto pointer-events-none">
            <svg
              viewBox="0 0 200 8"
              preserveAspectRatio="none"
              className="w-full h-2 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M0,4 Q25,1 50,4 T100,4 T150,4 T200,4"
                fill="none"
                stroke="rgba(18,168,172,0.55)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <h3
            className="font-black text-white leading-[0.92] tracking-[-0.04em]"
            style={{
              fontSize:
                "calc(clamp(2.3rem, 6.2vw, 90px) * var(--heading-scale))",
            }}
          >
            We don&apos;t optimize parts.
          </h3>
          <p
            className="mt-6 lg:mt-8 font-light italic text-white/75 leading-[1.3] tracking-[-0.01em]"
            style={{
              fontSize:
                "calc(clamp(1.2rem, 2.2vw, 2rem) * var(--heading-scale))",
            }}
          >
            We redesign the system — until &quot;solved&quot; is felt in real
            life.
          </p>
        </div>
      </div>
    </section>
  );
}
