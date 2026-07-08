"use client";

interface PortalContentProps {
  onStart: () => void;
  onViewWork: () => void;
}

/**
 * First-visit hero: eyebrow + brand title + subtitle + start CTA +
 * skip link. All revealed by the staggered `.portal-reveal` GSAP
 * animation owned by usePortalEntrance.
 */
export default function PortalContent({
  onStart,
  onViewWork,
}: PortalContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
      <div className="portal-reveal mb-6">
        <span className="text-[12px] sm:text-[14px] tracking-[0.4em] uppercase text-white/70 font-semibold">
          THE STANDARD OF
        </span>
      </div>

      <h1 className="portal-reveal text-[clamp(2.5rem,8vw,8rem)] leading-[0.95] font-light tracking-[-0.03em] uppercase text-white mb-6">
        GOTT WALD<br />HOLDING
      </h1>

      <div className="portal-reveal mb-12">
        <span className="text-[12px] sm:text-[14px] tracking-[0.35em] uppercase text-white/80 font-medium">
          EST. 2024 &nbsp;·&nbsp; TBILISI, GEORGIA
        </span>
      </div>

      <div
        className="portal-reveal group relative cursor-pointer inline-block mb-8"
        onClick={onStart}
      >
        {/* Four corner brackets — animate to turquoise on hover */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 group-hover:border-turquoise transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 group-hover:border-turquoise transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 group-hover:border-turquoise transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 group-hover:border-turquoise transition-colors duration-300" />

        <div className="px-12 py-5 bg-transparent group-hover:bg-white/5 transition-colors duration-300">
          <span className="text-[12px] tracking-[0.25em] uppercase font-bold text-white">
            START EXPERIENCE
          </span>
        </div>
      </div>

      <div
        className="portal-reveal cursor-pointer group"
        onClick={onViewWork}
      >
        <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-white/80 group-hover:text-white transition-colors">
          SKIP INTRO & SHOW OUR WORK
        </span>
      </div>
    </div>
  );
}
