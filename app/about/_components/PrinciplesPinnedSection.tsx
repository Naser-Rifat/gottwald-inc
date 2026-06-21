"use client";

import Image from "next/image";

import { PRINCIPLES } from "../_data/principles";

/**
 * Pinned cinematic showcase of the 5 principles — the signature SOTD
 * move of the About page.
 *
 * Outer wrapper is 500vh tall (one viewport per principle). The inner
 * `.about-pillars-stage` is `position:sticky` so it holds each frame in
 * view while the reader scrolls. The parent GSAP context wires a scrub
 * timeline against `.about-pillars-pin` and crossfades the
 * `.pillar-stage-frame` elements; this component owns the JSX/markup
 * convention those selectors expect.
 *
 * Reduced motion path: the scrub is disabled in the parent — frames
 * remain stacked and only the first is visible, which is acceptable
 * because each frame is independently legible.
 */
export default function PrinciplesPinnedSection() {
  return (
    <section
      className="about-pillars-pin relative bg-[#070c14]"
      style={{ height: "500vh" }}
    >
      <div className="about-pillars-stage sticky top-0 h-screen overflow-hidden">
        {/* Vertical turquoise progress bar — left edge signature */}
        <div className="absolute left-0 top-0 bottom-0 w-px z-30 pointer-events-none">
          <div
            className="pillar-progress-bar absolute top-0 left-0 w-full bg-turquoise/60"
            style={{ height: "20%" }}
          />
        </div>

        {/* Top banner — section label + counter */}
        <div className="absolute top-[5vh] left-0 right-0 px-8 lg:px-16 z-20">
          <div className="flex items-center gap-5">
            <span className="w-8 h-px bg-turquoise/55" />
            <p className="text-[10px] tracking-[0.42em] uppercase text-turquoise/75 font-light">
              5 Principles
            </p>
            <span className="hidden md:block flex-1 h-px bg-gradient-to-r from-turquoise/12 to-transparent" />
            <p className="text-[11px] tracking-[0.32em] uppercase text-white/30 font-mono">
              <span className="text-turquoise pillar-counter">01</span>
              <span className="opacity-40"> / 05</span>
            </p>
          </div>
        </div>

        {/* Stage — all 5 frames stacked, GSAP fades between them */}
        {PRINCIPLES.map((pillar, i) => (
          <div
            key={i}
            className="pillar-stage-frame absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Full-height image — full width on mobile (watermark), left 50% on desktop. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-full md:w-[50vw] lg:w-[46vw] z-[1] overflow-hidden opacity-[0.12] md:opacity-100"
            >
              <Image
                src={pillar.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center"
                style={{
                  mixBlendMode: "screen",
                  filter: "brightness(1.08) saturate(1.12)",
                }}
                priority={i === 0}
              />
              {/* Right edge fade — bleeds image into text zone on desktop */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#070c14] hidden md:block" />
              {/* Subtle vignette top + bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#070c14]/60 md:from-[#070c14]/40 via-transparent to-[#070c14]/60 md:to-[#070c14]/40" />
            </div>

            {/* Right half — full width on mobile, right anchored on desktop */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-[54vw] lg:w-[56vw] flex flex-col justify-center px-6 sm:px-12 md:pl-8 lg:pl-16 md:pr-8 lg:pr-24 z-10 pt-[10vh] pb-[14vh]">
              <div className="flex items-center gap-4 mb-10 lg:mb-14">
                <span className="font-mono text-[10px] tracking-[0.4em] text-turquoise/60">
                  {pillar.num}
                </span>
                <span className="w-12 h-px bg-turquoise/30" />
                <span className="font-mono text-[10px] tracking-[0.36em] uppercase text-white/35">
                  {pillar.principle}
                </span>
              </div>

              <h4
                className="font-light leading-[0.95] tracking-[-0.034em] text-white mb-10 lg:mb-14"
                style={{
                  fontSize:
                    "calc(clamp(2.8rem, 6.2vw, 6.4rem) * var(--heading-scale))",
                }}
              >
                {pillar.title}.
              </h4>

              <div className="w-16 h-px bg-turquoise/35 mb-8 lg:mb-10" />

              <p className="text-[clamp(1.05rem,1.3vw,1.4rem)] text-white/65 font-light leading-[1.65] max-w-[36rem]">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Bottom — chapter progress bar, one segment per pillar */}
        <div className="absolute bottom-[7vh] left-0 right-0 px-8 lg:px-16 z-20">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                data-pillar-dot={i}
                className={`pillar-dot h-px flex-1 transition-all duration-700 ${
                  i === 0 ? "bg-turquoise" : "bg-white/12"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
