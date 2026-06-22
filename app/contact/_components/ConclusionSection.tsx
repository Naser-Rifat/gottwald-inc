"use client";

/**
 * Closing editorial line that sits between the contact grid and the
 * footer. Single-purpose presentational component; no animation hooks
 * because it's late enough on the page that the in-flow position is
 * already after the GSAP timeline finishes.
 */
export default function ConclusionSection() {
  return (
    <section className="relative px-8 md:px-16 pb-32 pt-16 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
      <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-gold/50 mb-12" />
      <h2
        className="font-light italic tracking-tight text-white/90 mb-6"
        style={{
          fontSize: "clamp(3rem, 6vw, 6rem)",
          fontFamily: "var(--font-playfair)",
        }}
      >
        The standard has been set.
      </h2>
      <p className="font-sans text-xl md:text-2xl font-light text-white/60 max-w-2xl leading-relaxed">
        The digital journey concludes here. <br />
        The real-world partnership begins.
      </p>
    </section>
  );
}
