"use client";

import Image from "next/image";

/**
 * "We believe in something radical — and practical" diptych.
 *
 * Two-column manifesto: principles list on the left, an oversized
 * "Solved means solved" type-stack on the right with a soft depth
 * anchor behind it. Pure presentation; no client-side state.
 */
export default function RadicalPracticalSection() {
  return (
    <section className="about-atmosphere bg-[#070c14] relative px-gutter py-[12vh] lg:py-[18vh]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left Side: Radical & Practical */}
        <div className="lg:col-span-7">
          <h2 className="text-white leading-[0.95] tracking-tight mb-8 md:mb-12">
            <span className="block font-light text-[clamp(2.8rem,4.5vw,4.8rem)]">
              We believe in something
            </span>
            <span className="block font-light text-[clamp(2.8rem,4.5vw,4.8rem)]">
              radical —
            </span>
            <span className="block italic text-turquoise font-light mt-2 text-[clamp(3.2rem,5vw,5.2rem)] tracking-tight">
              and practical:
            </span>
          </h2>

          <p className="text-silver/60 font-light text-[clamp(1.1rem,1.3vw,1.25rem)] leading-[1.6] max-w-[48ch] mb-16 lg:mb-20">
            When structure becomes visible, the right solution becomes
            inevitable. Not &ldquo;someday.&rdquo; Not &ldquo;when there&rsquo;s
            time.&rdquo;
          </p>

          <div className="flex flex-col mt-12">
            {[
              "But in a way that lets a CEO breathe again.",
              "In a way that helps founders know what comes first.",
              "In a way that lets teams deliver with focus — and systems carry instead of pull.",
            ].map((text, i, arr) => (
              <div
                key={i}
                className={`flex items-center gap-8 py-6 group ${i !== arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}
              >
                <span className="text-[#c09e50] font-mono text-[11px] tracking-[0.2em] font-bold">
                  0{i + 1}
                </span>
                <span className="text-silver/60 font-light text-[clamp(0.95rem,1.1vw,1.1rem)]">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Solved means solved */}
        <div className="lg:col-span-5 lg:pl-16 lg:border-l border-white/[0.06] pt-4 lg:pt-0 relative">
          <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[200%] aspect-square pointer-events-none z-[-1] hidden lg:block opacity-[0.15] mix-blend-screen blur-[2px]">
            <Image
              src="/about/about_solved_anchor.png"
              alt="Depth Anchor"
              fill
              sizes="(max-width: 1023px) 1px, 50vw"
              quality={50}
              loading="lazy"
              className="object-contain"
            />
          </div>

          <div className="flex flex-col mb-10 md:mb-12">
            <span className="text-silver/50 font-extralight leading-[0.9] tracking-tight text-[clamp(4rem,6vw,6.5rem)]">
              Solved
            </span>
            <span className="text-silver/30 font-light leading-none text-xl md:text-2xl mt-5 mb-3">
              means
            </span>
            <span className="text-white font-black leading-[0.85] tracking-tighter text-[clamp(4.5rem,7vw,8rem)]">
              solved.
            </span>
          </div>

          <div className="w-full max-w-[85%] h-[1px] bg-gradient-to-r from-turquoise/30 via-turquoise/10 to-transparent mb-10" />

          <div className="flex flex-col gap-8 pr-4">
            <p className="text-silver/60 font-light text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6]">
              &ldquo;Solved&rdquo; means you feel it on Monday morning, not in a
              pitch.
            </p>
            <p className="text-silver/40 font-light text-[clamp(0.95rem,1.1vw,1.05rem)] leading-[1.6]">
              Less friction. Clearer decisions. Higher speed. More calm in the
              system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
