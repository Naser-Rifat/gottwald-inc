"use client";

export default function HomeIntroSection() {
  return (
    <section className="relative w-full bg-[#0a0808] text-white pt-32 pb-32 overflow-hidden flex flex-col items-center z-10">
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[#00a8cc]/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* Intro */}
      <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center shrink-0 z-10 px-6">
        <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/80 font-mono mb-6">
          Standards-Led Architecture
        </span>
        
        <h1 className="text-[clamp(1.5rem,3.5vw,4rem)] font-light uppercase tracking-widest leading-[1.3] max-w-5xl text-center text-white">
          We build <span className="font-medium text-white">operating-grade systems</span> helping businesses scale cleanly.
        </h1>

        {/* Scroll down indicator */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center mt-20 opacity-60">
          <div className="absolute inset-0 border border-white/20 rounded-full" />
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
            <text className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] fill-white/80 font-mono">
              <textPath href="#circlePath" startOffset="0%">
                SCROLL TO DISCOVER • SCROLL TO DISCOVER • 
              </textPath>
            </text>
          </svg>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
