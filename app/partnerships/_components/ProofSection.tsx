/**
 * "GOTT WALD is a standard." declaration.
 *
 * Centered monumental composition that pivots from an italic Playfair
 * question ("GOTT WALD is not a marketplace.") to a bold sans answer
 * ("GOTT WALD IS A STANDARD."). A 5-frequency hairline ties this beat
 * back to the brand's orchestra of pillars + frequencies.
 */
export default function ProofSection() {
  return (
    <section
      data-journey="proof"
      className="px-gutter py-[26vh] lg:py-[32vh] bg-transparent relative z-10 border-t border-white/5 overflow-hidden"
    >
      <div className="relative max-w-[88rem] mx-auto text-center reveal-up z-10">
        <p
          className="text-[clamp(1.7rem,3.8vw,4.4rem)] font-light leading-[1.18] tracking-[-0.018em] text-white/72 mb-8 lg:mb-12"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
          }}
        >
          GOTT WALD is not a marketplace.
        </p>

        <div className="flex flex-col items-center justify-center w-full">
          <h2
            className="font-black leading-[0.85] tracking-[-0.04em] uppercase"
            style={{ fontSize: "clamp(4rem, 10vw, 12rem)" }}
          >
            <span className="block text-white opacity-95">GOTT WALD</span>
            <span className="block bg-gradient-to-r from-white via-white/70 to-white/20 bg-clip-text text-transparent">
              IS A STANDARD.
            </span>
          </h2>
        </div>

        {/* 5-frequency hairline */}
        <span
          aria-hidden="true"
          className="block mx-auto h-px w-24 mt-16 lg:mt-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.55) 0%, rgba(184,192,204,0.42) 28%, rgba(0,109,132,0.55) 52%, rgba(18,168,172,0.70) 76%, rgba(192,120,64,0.45) 100%)",
          }}
        />

        <p
          className="mt-10 lg:mt-14 text-[clamp(1.05rem,1.35vw,1.5rem)] font-light leading-[1.65] text-white/65 max-w-[44ch] mx-auto"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
          }}
        >
          We only work with companies that have principle — and can deliver.
          When both are true, partnership becomes inevitable.
        </p>
      </div>
    </section>
  );
}
