"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import {
  PARTNER_BENEFITS,
  PARTNER_EXPECTATIONS,
} from "@/lib/partnershipData";

/**
 * Two-column "what partners get / what we expect" diptych with a
 * central spine bead that drifts with scroll.
 *
 * Left card (turquoise tint): partner benefits — what we provide.
 * Right card (gold tint): partner expectations — what we require.
 * Central spine: a tall hairline with a beaded orb that translates
 * vertically as the section moves through the viewport, tying the two
 * cards together as a single equilibrium.
 */
export default function EquilibriumSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section
      ref={containerRef}
      className="px-gutter py-[20vh] bg-transparent relative z-10 border-t border-white/5 overflow-hidden"
    >
      {/* Background glow — dimmed so the global WebGL canvas shines through. */}
      <div className="about-liquid-aurora absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[80vw] md:h-[80vw] rounded-full mix-blend-screen opacity-[0.05] blur-[120px] pointer-events-none z-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-tr from-petrol via-turquoise to-transparent rounded-full animate-[spin_18s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gold to-petrol rounded-full animate-[spin_22s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 relative">
          {/* Central divider + drifting bead (desktop only) */}
          <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center w-24 z-20 pointer-events-none">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <motion.div
              style={{ y: yTransform }}
              className="absolute w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0a] flex items-center justify-center shadow-[0_0_30px_rgba(18,168,172,0.2)] backdrop-blur-md"
            >
              <div className="w-3 h-3 bg-turquoise rounded-full shadow-[0_0_15px_rgba(18,168,172,1)]" />
            </motion.div>
          </div>

          {/* LEFT: What Partners Get */}
          <div className="lg:w-1/2 lg:pr-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full flex flex-col justify-between p-10 lg:p-14 bg-[#06080a]/80 border border-white/5 rounded-3xl backdrop-blur-2xl hover:border-turquoise/30 transition-colors duration-700 relative overflow-hidden group"
            >
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-turquoise/10 blur-[80px] rounded-full group-hover:bg-turquoise/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-8 h-px bg-turquoise" />
                  <h3 className="text-sm uppercase tracking-[0.3em] text-turquoise/90 font-bold">
                    What Partners Get
                  </h3>
                </div>

                <h4 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 leading-[1.1] text-white">
                  A premium ecosystem.
                  <br />
                  <span className="text-white/40 font-light">Clean projects.</span>
                </h4>

                <ul className="flex flex-col gap-6 mb-16">
                  {PARTNER_BENEFITS.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex gap-5 items-start text-white/70 text-lg lg:text-xl font-light"
                    >
                      <span className="mt-3 w-1.5 h-1.5 bg-turquoise shadow-[0_0_10px_rgba(18,168,172,0.8)] rounded-full shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 border-l-2 border-turquoise pl-8 mt-auto group-hover:translate-x-2 transition-transform duration-500">
                <p className="text-xl font-medium tracking-tight text-white/90 leading-tight">
                  We keep the frame stable.
                  <br />
                  <span className="text-white/60 font-light">
                    You deliver excellence.
                  </span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: What We Expect */}
          <div className="lg:w-1/2 lg:pl-24 mt-10 lg:mt-32">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full flex flex-col justify-between p-10 lg:p-14 bg-[#0a0806]/80 border border-white/5 rounded-3xl backdrop-blur-2xl hover:border-gold/30 transition-colors duration-700 relative overflow-hidden group"
            >
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gold/10 blur-[80px] rounded-full group-hover:bg-gold/15 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-8 h-px bg-gold" />
                  <h3 className="text-sm uppercase tracking-[0.3em] text-gold/90 font-bold">
                    What We Expect
                  </h3>
                </div>

                <h4 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 leading-[1.1] text-white">
                  Professionalism that
                  <br />
                  <span className="text-white/40 font-light">
                    doesn&apos;t require supervision.
                  </span>
                </h4>

                <ul className="flex flex-col gap-6">
                  {PARTNER_EXPECTATIONS.map((expectation, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex gap-5 items-start text-white/70 text-lg lg:text-xl font-light"
                    >
                      <span className="mt-3 w-1.5 h-1.5 bg-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.4)] rounded-full shrink-0" />
                      <span className="leading-relaxed">{expectation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
