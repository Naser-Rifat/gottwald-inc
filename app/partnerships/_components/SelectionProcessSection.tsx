"use client";

import VerticalSpineTimeline from "./VerticalSpineTimeline";

/**
 * "How it works" selection process. Editorial header + the shared
 * `<VerticalSpineTimeline/>` which renders the per-step spine animation.
 *
 * Section signature is the giant ghost italic "standards." floating
 * behind the timeline.
 */
export default function SelectionProcessSection() {
  return (
    <section className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] right-[-10vw] z-0 select-none opacity-40 mix-blend-overlay"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(8rem, 25vw, 30rem)",
          }}
        >
          standards.
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="reveal-up mb-20">
          <p className="text-sm tracking-[0.45em] uppercase text-gold/80 font-bold mb-6">
            How It Works
          </p>
          <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
            SHORT. CLEAR.
            <br />
            <span className="text-white/60">NO THEATRE.</span>
          </h2>
        </div>

        <VerticalSpineTimeline />
      </div>
    </section>
  );
}
