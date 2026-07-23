"use client";

import { PARTICLES } from "../_data/particles";

const PARTICLE_TINTS = {
  turquoise: { bg: "rgba(18,168,172,0.6)", shadow: "0 0 6px rgba(18,168,172,0.3)" },
  gold: { bg: "rgba(212,175,55,0.5)", shadow: "0 0 6px rgba(212,175,55,0.2)" },
  white: { bg: "rgba(255,255,255,0.4)", shadow: "none" },
} as const;

/**
 * Fixed full-screen background ensemble for /contact:
 *  - A subtle radial overlay so foreground glass cards stay readable
 *    while the global WebGL canvas still bleeds at the page edges.
 *  - 18 CSS-animated floating particles (no JS overhead — keyframes
 *    declared at the bottom of this file via styled-jsx).
 *  - A massive blurred liquid aurora (turquoise + gold) sitting behind
 *    the layout; class hooks `.contact-liquid-aurora` and
 *    `.contact-parallax-target` are picked up by the parent's GSAP
 *    mouse-parallax handlers.
 *  - A ghost "contact." italic echo floating off-grid for editorial
 *    signature.
 */
export default function BackgroundLayers() {
  return (
    <>
      {/* Dark overlay for content readability */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(6,6,6,0.3) 0%, rgba(6,6,6,0.15) 50%, transparent 100%)",
        }}
      />

      {/* CSS Floating Particles */}
      <div
        className="fixed inset-0 pointer-events-none -z-[5] overflow-hidden"
        aria-hidden="true"
      >
        {PARTICLES.map((p) => {
          const tint = PARTICLE_TINTS[p.color];
          return (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                bottom: "-5%",
                opacity: p.opacity,
                backgroundColor: tint.bg,
                boxShadow: tint.shadow,
                animation: `floatUp ${p.duration}s linear ${p.delay}s infinite, sway${p.id % 3} ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>

      {/* Premium Liquid Aurora Background (Turquoise & Gold) */}
      <div className="contact-liquid-aurora fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] max-w-[1400px] max-h-[1400px] rounded-full mix-blend-screen opacity-[0.05] blur-[120px] z-[-5] will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#12a8ac] via-transparent to-[#d4af37] rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#d4af37] to-[#12a8ac] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      {/* Ghost echo — massive italic "contact." floats behind the headline */}
      {/* Wrapped with `max-w-[100vw] overflow-hidden` to keep the ghost
          text from pushing horizontal scroll into the viewport on mobile.
          Font-size min tightened from 12rem to 6rem so it fits comfortably
          within a 320 px width when scroll-parallax translates it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[10%] right-[-10vw] z-[-2] select-none opacity-40 max-w-[100vw] overflow-hidden"
      >
        <span
          className="contact-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(6rem, 25vw, 30rem)",
          }}
        >
          contact.
        </span>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: var(--particle-opacity, 0.12);
          }
          90% {
            opacity: var(--particle-opacity, 0.12);
          }
          100% {
            transform: translateY(-110vh) translateX(0);
            opacity: 0;
          }
        }
        @keyframes sway0 {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }
        @keyframes sway1 {
          0% { transform: translateX(-30px); }
          100% { transform: translateX(35px); }
        }
        @keyframes sway2 {
          0% { transform: translateX(-15px); }
          100% { transform: translateX(25px); }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
