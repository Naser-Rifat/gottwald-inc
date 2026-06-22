"use client";

import Image from "next/image";

import { MANIFESTO_LINES } from "@/lib/partnershipData";

/**
 * 7-line manifesto. Renders as a list under a left-rail title with
 * each line:
 *   - prefixed by a zero-padded gold ordinal,
 *   - getting a turquoise left-bar + scale-up on hover,
 *   - dimming/blurring its siblings (via the `group/manifesto` +
 *     `group/line` named utility groups) so the active line reads as
 *     the only line on the page while it's hovered.
 *
 * Line index 5 swaps the rendered text for a special highlight of the
 * brand axis ("NATURE — ANIMALS — HUMANS"). All other lines render the
 * raw data string from `MANIFESTO_LINES`.
 */
export default function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="px-gutter py-[18vh] bg-[#020305] relative z-10 border-t border-white/5 overflow-hidden"
    >
      <div
        className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[70vw] max-w-[1200px] aspect-square pointer-events-none hidden lg:block opacity-[0.45] mix-blend-screen grayscale-[30%]"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
        }}
      >
        <Image
          src="/images/partnership_manifesto_bg.png"
          alt="Liquid Obsidian"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="reveal-up mb-20">
          <p className="text-sm tracking-[0.45em] uppercase text-gold/90 font-bold mb-4">
            Our Foundation
          </p>
          <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white">
            A 7-LINE
            <br />
            <span className="text-white/60">MANIFESTO</span>
          </h2>
        </div>
        <div className="flex flex-col border-t border-white/10 group/manifesto">
          {MANIFESTO_LINES.map((line, i) => (
            <div
              key={i}
              className="manifesto-line group/line relative flex items-center gap-8 py-8 border-b border-white/5 hover:bg-white/[0.02] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] px-4 -mx-4 group-hover/manifesto:opacity-20 group-hover/manifesto:blur-sm hover:!opacity-100 hover:!blur-none"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-turquoise opacity-0 group-hover/line:opacity-100 transition-opacity duration-700 shadow-[0_0_20px_rgba(18,168,172,0.8)]" />
              <span className="text-gold font-mono text-sm shrink-0 w-8 text-right opacity-90 transition-all duration-700 group-hover/line:opacity-100">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] leading-tight group-hover/line:text-white group-hover/line:translate-x-6 group-hover/line:scale-[1.02] origin-left">
                {i === 5 ? (
                  <>
                    We build for{" "}
                    <span className="font-black text-gold group-hover/line:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all duration-700">
                      NATURE — ANIMALS — HUMANS
                    </span>
                    .
                  </>
                ) : (
                  line
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
