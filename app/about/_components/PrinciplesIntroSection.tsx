"use client";

/**
 * Editorial intro that frames the pinned 5-principles showcase below.
 * Pure presentational copy with a `.reveal-text` hook so the parent
 * GSAP context can fade it in on scroll.
 */
export default function PrinciplesIntroSection() {
  return (
    <section
      data-journey="pillars"
      className="about-atmosphere py-[14vh] lg:py-[18vh] px-gutter relative bg-[#070c14]"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="reveal-text mb-24 lg:mb-28 max-w-5xl">
          <div className="flex items-center gap-6 mb-12">
            <span className="w-16 h-px bg-turquoise/50 origin-left" />
            <p className="text-[10px] tracking-[0.38em] uppercase text-turquoise/75 font-light">
              What we do differently
            </p>
          </div>

          <h3 className="text-[clamp(3rem,5vw,6rem)] font-light leading-[1.05] tracking-tight text-white/80 space-y-1">
            <div className="overflow-hidden">
              <span className="block">The world is full of</span>
            </div>
            <div className="overflow-hidden">
              <span className="block md:pl-4 text-white">
                “optimizations.”
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block md:pl-8 text-white/80">
                We build{" "}
                <span className="font-semibold uppercase tracking-[0.04em] text-turquoise">
                  architecture
                </span>{" "}
                —
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block md:pl-16 text-white/70 text-[clamp(2rem,3.5vw,4rem)] py-2">
                so growth doesn&apos;t mean “more pressure,”
              </span>
            </div>
            <div className="overflow-hidden">
              <span className="block font-medium text-white pt-2">
                but more clarity.
              </span>
            </div>
          </h3>
        </div>
      </div>
    </section>
  );
}
