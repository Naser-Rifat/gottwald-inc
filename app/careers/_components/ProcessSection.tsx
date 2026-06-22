"use client";

import { APPLICATION_PROCESS, FIND_HERE } from "../_data/process";

/**
 * Two-column proof block:
 *  - Left: "WHAT YOU'LL FIND HERE" — a list of values rendered as
 *    label/context rows. The closing row gets the copper accent and a
 *    two-line context for emphasis.
 *  - Right: "APPLICATION PROCESS" — a 5-step vertical timeline with a
 *    glowing copper→silver gradient rail running between the numbered
 *    badges.
 */
export default function ProcessSection() {
  return (
    <section className="px-gutter py-[15vh] border-t border-white/5 relative overflow-hidden bg-[#050505]">
      {/* Ghost watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[50%] right-[-5vw] -translate-y-1/2 z-0 select-none opacity-30 mix-blend-overlay"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(8rem, 20vw, 24rem)",
          }}
        >
          impact.
        </span>
      </div>

      {/* Premium liquid aurora background (copper & silver) */}
      <div className="about-liquid-aurora absolute top-[50%] left-[-20%] -translate-y-1/2 w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-[0.06] blur-[120px] z-0 will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#b8c0cc] via-transparent to-[#c07840] rounded-full animate-[spin_22s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#c07840] to-[#b8c0cc] rounded-full animate-[spin_28s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        {/* What you'll find */}
        <div className="reveal-text p-10 md:p-14 border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-sm relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(184,192,204,0.3), transparent)",
            }}
          />
          <h2 className="text-4xl text-white font-bold mb-10 tracking-tight">
            WHAT YOU&apos;LL FIND HERE
          </h2>
          <ul className="flex flex-col gap-6 font-light text-2xl text-white/90">
            {FIND_HERE.map((item, i) => {
              const isLast = i === FIND_HERE.length - 1;
              return (
                <li
                  key={item.label}
                  className={`flex justify-between ${isLast ? "pt-2" : "border-b border-white/10 pb-4"}`}
                >
                  <span
                    className={item.accent ? "text-copper" : "font-medium"}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-white/70 italic text-md ${item.multiline ? "text-right" : ""}`}
                  >
                    {item.multiline
                      ? item.context.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            {idx === 0 && <br />}
                          </span>
                        ))
                      : item.context}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Application Process */}
        <div className="reveal-text p-10 md:p-14 border border-white/10 bg-white/[0.04] backdrop-blur-sm rounded-sm">
          <h2 className="text-3xl font-bold mb-10 tracking-tight text-white">
            APPLICATION PROCESS
          </h2>

          <div className="flex flex-col gap-10 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-copper via-silver/40 to-transparent shadow-[0_0_15px_rgba(192,120,64,0.8)]" />

            {APPLICATION_PROCESS.map((step) => (
              <div key={step.n} className="flex gap-8 relative z-10">
                <div className="w-8 h-8 rounded-full border border-silver/40 bg-[#070c14] text-silver shadow-[0_0_10px_rgba(184,192,204,0.2)] flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                  {step.n}
                </div>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tighter text-white">
                    {step.t}
                  </h4>
                  <p className="text-white/50 font-medium text-sm mt-1">
                    {step.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
