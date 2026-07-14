"use client";

interface HeroSlideProps {
  onMouseEnter: () => void;
}

export default function HeroSlide({ onMouseEnter }: HeroSlideProps) {
  return (
    <section
      id="slide-0"
      data-index="0"
      className="snap-section snap-always snap-center h-screen w-full relative flex flex-col items-center justify-center px-8 md:px-[10vw] z-20 text-center"
      onMouseEnter={onMouseEnter}
    >
      <p className="text-[11px] md:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#d4af37] mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">BUSINESS STANDARDS</p>
      {/* Primary <h1> for the /our-work route. This is the first slide the
          user sees and the strongest topical signal for the pillars index. */}
      <h1 className="text-[clamp(1.8rem,4vw,5rem)] leading-[1.2] font-normal tracking-widest uppercase font-sans text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] max-w-6xl mx-auto">
        TRUST. STRUCTURE. PERFORMANCE.
      </h1>
      <p className="mt-10 text-white/90 text-[clamp(1.1rem,1.3vw,1.5rem)] font-normal leading-relaxed max-w-2xl mx-auto font-playfair italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        We build operating-grade systems for people and strategic assets—when outcomes must be clear, execution must be clean, and performance must be repeatable.
      </p>
      <p className="mt-8 text-white/50 text-[12px] font-mono font-medium uppercase tracking-[0.3em] mx-auto drop-shadow-md">
        Explore our pillars below
      </p>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[8vh] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center animate-[spin_10s_linear_infinite] opacity-60">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <path id="curve" d="M 50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0" fill="transparent" />
            <text className="text-[8px] font-mono font-medium uppercase tracking-[0.2em] fill-white/80">
              <textPath href="#curve" startOffset="0%">SCROLL TO DISCOVER • SCROLL TO DISCOVER • </textPath>
            </text>
          </svg>
        </div>
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white] animate-pulse" />
      </div>
    </section>
  );
}
