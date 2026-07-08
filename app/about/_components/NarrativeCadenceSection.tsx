"use client";

import Image from "next/image";

/**
 * NARRATIVE — Diagnostic Cadence.
 *
 * Editorial rhythm of four blocks: observation → assessment → weight →
 * turn. Each block earns its own position on the page; no template blur
 * orbs, no centered gradient moments. Alignment, scale and italic
 * emphasis carry the visual journey, and `.reveal-text` is the
 * convention picked up by the parent GSAP context for staggered reveals.
 */
export default function NarrativeCadenceSection() {
  return (
    <section
      data-journey="openness"
      className="about-atmosphere bg-[#070c14] relative z-10 py-[14vh] lg:py-[18vh] overflow-hidden"
    >
      {/* Asymmetrical depth marker — soft editorial off-grid image. */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[45vw] max-w-[800px] aspect-square pointer-events-none hidden lg:block opacity-[0.45] mix-blend-screen"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
        }}
      >
        <Image
          src="/about/about_diagnostic_editorial.png"
          alt="Editorial abstract"
          fill
          sizes="45vw"
          quality={65}
          loading="lazy"
          className="object-cover object-center grayscale-[20%]"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-gutter relative z-10 w-full">
        {/* Block 1 — The Observation. */}
        <div className="reveal-text max-w-4xl mb-[11vh] lg:mb-[13vh]">
          <p
            className="font-light leading-[1.2] tracking-[-0.015em]"
            style={{
              fontSize:
                "calc(clamp(1.75rem, 3.6vw, 3.4rem) * var(--heading-scale))",
            }}
          >
            <span className="text-white/55">
              You can feel there&apos;s more possible
            </span>
            <span className="text-white/40">…</span>
            <span className="block mt-3 text-white/95 italic font-light">
              yet something in the system keeps draining energy.
            </span>
          </p>
        </div>

        {/* Block 2 — The Assessment. */}
        <div className="reveal-text max-w-3xl ml-auto mr-0 mb-[11vh] lg:mb-[13vh] pr-0 lg:pr-12">
          <p
            className="font-light leading-[1.3] tracking-[-0.012em] text-white/55"
            style={{
              fontSize:
                "calc(clamp(1.45rem, 2.8vw, 2.6rem) * var(--heading-scale))",
            }}
          >
            Too many topics,{" "}
            <span className="text-white/95 font-normal">
              not enough sequence.
            </span>
            <br />
            Too much noise,{" "}
            <span className="text-white/95 font-normal">
              not enough truth.
            </span>
          </p>
        </div>

        {/* Block 3 — The Weight. */}
        <div className="reveal-text max-w-4xl mb-[10vh] lg:mb-[12vh]">
          <p
            className="font-light leading-[1.18] tracking-[-0.018em] text-white/55"
            style={{
              fontSize:
                "calc(clamp(1.85rem, 3.9vw, 3.6rem) * var(--heading-scale))",
            }}
          >
            And even though everyone is smart,
            <span className="block mt-2">
              it doesn&apos;t get lighter —{" "}
              <span className="text-white/95 font-normal">
                it just gets fuller.
              </span>
            </span>
          </p>
        </div>

        {/* Block 4 — The Turn. Resonance line connects back to the hero. */}
        <div className="reveal-text max-w-3xl ml-auto mr-0">
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
          <p
            className="font-light italic text-white/95 text-right leading-[1.05] tracking-[-0.018em]"
            style={{
              fontSize:
                "calc(clamp(1.85rem, 4.2vw, 3.4rem) * var(--heading-scale))",
            }}
          >
            That&apos;s where our work begins.
          </p>
        </div>
      </div>
    </section>
  );
}
