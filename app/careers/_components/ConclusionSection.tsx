"use client";

/**
 * Closing editorial line — italic Playfair quote + sans-serif coda.
 *
 * Mirrors the same closing pattern used by /contact and /about so the
 * three companion routes share a consistent "journey conclusion"
 * signature.
 */
export default function ConclusionSection() {
  return (
    <section className="relative px-8 md:px-16 pb-32 pt-16 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
      <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-turquoise/50 mb-12" />
      <h2 className="font-playfair text-3xl md:text-5xl font-semibold italic text-white/90 mb-6 tracking-wide">
        If this felt normal, you belong here.
      </h2>
      <p className="font-sans text-xl md:text-2xl font-light text-white/60 max-w-2xl leading-relaxed">
        The digital journey concludes here. <br />
        The real-world partnership begins.
      </p>
    </section>
  );
}
