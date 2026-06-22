"use client";

import { PARTNERSHIP_PRINCIPLES } from "@/lib/partnershipData";

import ParallaxShard from "./ParallaxShard";

/**
 * "Partnership is Alignment — not Procurement" editorial spread.
 *
 * Top half: monumental typography statement with the rhetorical pivot
 * (italic "Partnership is" → massive italic "Alignment" → outlined sans
 * "Procurement"). Bottom half: grid of `<ParallaxShard/>` cards, one
 * per principle from `PARTNERSHIP_PRINCIPLES`. The shards alternate
 * scroll-parallax direction and dim siblings on hover via the
 * `group/shards` utility group.
 */
export default function PrincipleSection() {
  return (
    <section className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* TOP: principle statement */}
        <div className="reveal-up relative">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-turquoise/40 via-petrol/20 to-transparent" />

          <div className="pl-10 lg:pl-16">
            <div className="flex items-center gap-6 mb-16">
              <span className="w-12 h-px bg-white/20" />
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-turquoise/80">
                The Principle
              </p>
            </div>

            <div className="flex flex-col">
              <h2
                className="font-light tracking-tight leading-none text-white/90 mb-2"
                style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}
              >
                Partnership is
              </h2>
              <h2
                className="font-serif italic tracking-tighter leading-[0.85] text-white"
                style={{ fontSize: "clamp(6rem, 11vw, 12rem)" }}
              >
                Alignment
              </h2>

              <div className="flex items-center gap-8 mt-10 mb-8 max-w-4xl">
                <span
                  className="font-light text-white/30 italic"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  not
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <h2
                className="inline-block font-black tracking-normal leading-[0.9] uppercase text-transparent whitespace-nowrap"
                style={{
                  fontSize: "clamp(5rem, 9vw, 11rem)",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.18)",
                }}
              >
                Procurement.
              </h2>
            </div>

            <p className="mt-16 text-2xl lg:text-[2rem] text-white/50 leading-[1.4] font-light max-w-3xl">
              We don&apos;t{" "}
              <span className="text-white/90 italic font-serif">
                &quot;source services.&quot;
              </span>{" "}
              We select partners who can carry our foundation and protect our
              standard.
            </p>
          </div>
        </div>

        {/* BOTTOM: partner qualities — parallax shards */}
        <div className="reveal-up">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-10 font-semibold">
            We work with partners who:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 group/shards relative z-10 pt-10 pb-20">
            {PARTNERSHIP_PRINCIPLES.map((principle, i) => (
              <ParallaxShard key={i} principle={principle} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
