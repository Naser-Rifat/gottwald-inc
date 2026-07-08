"use client";

import ArchetypeBentoGrid from "./ArchetypeBentoGrid";

/**
 * Editorial header + the 5-archetype bento grid. Section signature is
 * the giant ghost italic "alliance." floating behind the content.
 *
 * The grid itself owns its own hover/focus interaction — this section
 * only frames it with title + intro.
 */
export default function WhoWereLookingForSection() {
  return (
    <section className="px-gutter py-[18vh] bg-[#010101] relative z-10 border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-5vw] z-0 select-none opacity-40 mix-blend-overlay"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(8rem, 25vw, 30rem)",
          }}
        >
          alliance.
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="reveal-up mb-20">
          <p className="text-sm tracking-[0.45em] uppercase text-copper/90 font-bold mb-6">
            Who We&apos;re Looking For
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
            OUTSTANDING COMPANIES —
            <br />
            <span className="font-mono text-turquoise/75 uppercase tracking-[0.12em] text-[clamp(1rem,1.8vw,2rem)]">
              proven in action, not in slides.
            </span>
          </h2>
          <p className="text-xl text-white/80 font-light max-w-2xl">
            We select five partnership archetypes.
          </p>
        </div>

        <ArchetypeBentoGrid />
      </div>
    </section>
  );
}
