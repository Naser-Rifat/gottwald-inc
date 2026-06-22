"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { NON_NEGOTIABLES } from "@/lib/partnershipData";

import StandardCanvas from "./StandardCanvas";
import StandardsPagination from "./StandardsPagination";

/**
 * "Our partnership standard" horizontal-scroll section.
 *
 * On desktop the parent's GSAP context pins this section and scrubs the
 * `.standards-scroll-wrapper` horizontally; on mobile (<768px) the pin
 * is disabled and native horizontal scroll takes over. Pagination dots
 * track the active card in both modes (see `<StandardsPagination/>`).
 *
 * Each card:
 *   - sets `--mx`/`--my` from mousemove for the gold spotlight overlay,
 *   - plays/pauses an embedded WebGL `<StandardCanvas/>` on hover,
 *   - reveals the title + description from below on hover.
 */
export default function NonNegotiablesSection() {
  const tCtas = useTranslations("partnerships.ctas");

  return (
    <section
      id="standards-section"
      className="bg-transparent relative z-10 isolate"
    >
      <StandardsPagination />

      <div className="standards-pin-container h-screen flex flex-col overflow-hidden">
        {/* Section title row */}
        <div className="flex-none flex flex-col justify-start items-start px-gutter pt-24 pb-20 lg:pb-28 reveal-up shrink-0">
          <h2 className="text-[clamp(3rem,6vw,8rem)] font-serif tracking-tight leading-[0.9] text-white">
            Our{" "}
            <span className="italic font-light text-white/80">partnership</span>{" "}
            standard.
          </h2>

          {/* Elegant solid resonance wave beneath the heading */}
          <div className="mt-8 lg:mt-10 w-[60vw] max-w-[600px] pointer-events-none">
            <svg
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
              className="w-full h-3 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M0,6 Q50,2 100,6 T200,6 T300,6 T400,6"
                fill="none"
                stroke="rgba(18,168,172,0.8)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="500"
                strokeDashoffset="500"
                className="animate-[draw-wave_2.5s_ease-out_forwards]"
              />
            </svg>
          </div>
        </div>

        {/* Scroll wrapper — flex-1 to fill remaining screen height entirely */}
        <div className="standards-scroll-wrapper flex-1 min-h-0 flex flex-row items-center w-max will-change-transform pb-28 pl-gutter">
          {NON_NEGOTIABLES.map((item, i) => (
            <div
              key={i}
              className="standards-card relative group flex flex-col w-[88vw] md:w-[52vw] lg:w-[38vw] xl:w-[34vw] h-full max-h-[60vh] lg:max-h-[65vh] mr-6 lg:mr-10 last:mr-0 overflow-hidden cursor-pointer shrink-0 rounded-3xl border border-white/10 bg-[#0a0c12] hover:border-white/30 hover:shadow-2xl transition-all duration-700"
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                requestAnimationFrame(() => {
                  el.style.setProperty("--mx", `${x}px`);
                  el.style.setProperty("--my", `${y}px`);
                });
              }}
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video");
                if (video) video.play();
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video");
                if (video) {
                  video.pause();
                  video.currentTime = 0;
                }
              }}
            >
              {/* Full-bleed image + hover canvas */}
              <div className="absolute inset-0 z-0 bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 88vw, (max-width: 1200px) 50vw, 35vw"
                  quality={75}
                  loading="lazy"
                  className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 w-full h-full bg-[#0a0c12] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out z-10 pointer-events-none">
                  <StandardCanvas index={i} />
                </div>
              </div>

              {/* Mouse-follow gold spotlight */}
              <div
                className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                style={{
                  background: `radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(18,168,172,0.1), transparent 60%)`,
                }}
              />

              {/* Bottom hover content reveal */}
              <div className="absolute bottom-0 left-0 w-full flex flex-col justify-end p-8 lg:p-10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-40">
                <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-[#040608]/90 to-transparent pointer-events-none -z-10" />

                <div className="flex flex-col gap-3 relative z-10">
                  <div className="w-10 h-0.5 bg-turquoise/60 group-hover:w-20 group-hover:bg-turquoise transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] mb-1" />

                  <h3 className="text-[clamp(1.4rem,2.6vw,2.8rem)] font-black tracking-tighter leading-[0.9] text-white uppercase drop-shadow-2xl break-words hyphens-auto">
                    {item.title}
                  </h3>

                  <div className="overflow-hidden mb-2">
                    <p className="text-sm lg:text-base text-white/75 font-light leading-relaxed max-w-sm drop-shadow-md">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-start pt-3 border-t border-white/15">
                    <span className="text-[9px] tracking-[0.45em] uppercase text-white/70 font-medium">
                      GOTT WALD Standard
                    </span>
                  </div>
                </div>
              </div>

              {/* Giant watermark number */}
              <div className="absolute top-[18%] -right-4 text-[10rem] lg:text-[14rem] font-black leading-none text-white/3 group-hover:text-gold/5 group-hover:-translate-y-3 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] select-none pointer-events-none z-[5]">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}

          {/* CTA end card */}
          <div className="standards-card relative flex flex-col items-center justify-center w-[60vw] md:w-[40vw] lg:w-[25vw] h-full max-h-[60vh] lg:max-h-[65vh] mr-[10vw] shrink-0 rounded-3xl bg-[#0a0c12] border border-white/10 px-8 hover:border-white/30 hover:shadow-2xl transition-all duration-700">
            <div className="w-px h-16 bg-linear-to-b from-transparent via-gold to-transparent mb-6" />
            <p className="text-center text-xs tracking-[0.4em] uppercase text-white/70 font-bold mb-3">
              All of These
            </p>
            <p className="text-center text-xl lg:text-2xl font-black uppercase text-white leading-tight mb-8">
              Are Non-
              <br />
              Negotiable
            </p>
            <a
              href="#apply"
              translate="no"
              className="notranslate inline-flex items-center gap-3 px-6 py-3 rounded-md border border-turquoise/45 bg-[#061018] text-turquoise text-xs tracking-[0.18em] uppercase font-bold hover:bg-turquoise hover:text-[#03080c] transition-all duration-300"
            >
              {tCtas("applyNow")}
            </a>
            <div className="w-px h-16 bg-linear-to-b from-transparent via-turquoise/30 to-transparent mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
