"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrutalistContactForm from "@/components/BrutalistContactForm";

gsap.registerPlugin(ScrollTrigger);

// ── Floating Particles Data (CSS-only, no JS overhead) ──
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  left: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 30 + Math.random() * 30,
  opacity: 0.08 + Math.random() * 0.15,
  color: i % 3 === 0 ? "turquoise" : i % 3 === 1 ? "gold" : "white",
  sway: 20 + Math.random() * 40,
}));

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal (Clip-path slide up)
      if (heroTextRef.current) {
        const lines = heroTextRef.current.querySelectorAll(".hero-line span");
        gsap.fromTo(
          lines,
          { yPercent: 120, rotationZ: 5, opacity: 0 },
          {
            yPercent: 0,
            rotationZ: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.2,
          },
        );

        // Hero breathing pulse (#3)
        gsap.to(heroTextRef.current, {
          scale: 1.008,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "left center",
        });
      }

      // 2. Form & Details Fade Up
      gsap.fromTo(
        ".fade-up-element",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".content-grid",
            start: "top 80%",
          },
        },
      );

      // 3. Animated separator line (#7)
      if (separatorRef.current) {
        gsap.fromTo(
          separatorRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: separatorRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 4. Status pulse reveal
      gsap.fromTo(
        ".status-pulse",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
        },
      );

      // 5. Eyebrow reveal
      gsap.fromTo(
        ".hero-eyebrow",
        { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.8,
        },
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white selection:bg-gold selection:text-black overflow-hidden flex flex-col relative"
      /* #1 — Transparent background reveals the global WebGL fluid canvas */
    >
      {/* Dark overlay for content readability — lets fluid bleed through edges */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(6,6,6,0.88) 0%, rgba(6,6,6,0.7) 50%, rgba(6,6,6,0.5) 100%)",
        }}
      />

      {/* ── CSS Floating Particles (#2) ── */}
      <div className="fixed inset-0 pointer-events-none -z-[5] overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: "-5%",
              opacity: p.opacity,
              backgroundColor:
                p.color === "turquoise"
                  ? "rgba(18,168,172,0.6)"
                  : p.color === "gold"
                    ? "rgba(212,175,55,0.5)"
                    : "rgba(255,255,255,0.4)",
              boxShadow:
                p.color === "turquoise"
                  ? "0 0 6px rgba(18,168,172,0.3)"
                  : p.color === "gold"
                    ? "0 0 6px rgba(212,175,55,0.2)"
                    : "none",
              animation: `floatUp ${p.duration}s linear ${p.delay}s infinite, sway${p.id % 3} ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[25vh] pb-32 relative z-10">
        {/* ── HERO ── */}
        <section className="px-gutter mb-8">
          {/* Eyebrow (#3) */}
          <p
            className="hero-eyebrow text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase mb-8"
            style={{ color: "rgba(212,175,55,0.85)", opacity: 0 }}
          >
            STRATEGIC INQUIRY // CONFIDENTIAL CHANNEL
          </p>

          {/* Hero heading with gradient text (#3) */}
          <h1
            ref={heroTextRef}
            className="text-[clamp(4rem,14vw,16rem)] leading-[0.8] font-black uppercase tracking-tighter flex flex-col"
          >
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span
                className="hero-line block will-change-transform origin-left drop-shadow-lg"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, rgba(18,168,172,0.7) 50%, #ffffff 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                LET&apos;S
              </span>
            </span>
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span
                className="hero-line block will-change-transform origin-left drop-shadow-lg"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, rgba(18,168,172,0.7) 50%, #ffffff 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TALK
              </span>
            </span>
          </h1>
        </section>

        {/* ── Status Indicator (#8) ── */}
        <div className="px-gutter mb-[12vh]">
          <div className="status-pulse flex items-center gap-3 opacity-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a9396] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0a9396] shadow-[0_0_8px_rgba(10,147,150,0.6)]" />
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium">
              Accepting Inquiries
            </span>
          </div>
        </div>

        {/* ── Animated Separator (#7) ── */}
        <div className="px-gutter mb-[8vh]">
          <div
            ref={separatorRef}
            className="h-px w-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(18,168,172,0.4) 0%, rgba(212,175,55,0.3) 50%, rgba(18,168,172,0.1) 100%)",
            }}
          />
        </div>

        {/* ── CONTENT GRID ── */}
        <section className="content-grid px-gutter grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Left Column: Direct Inquiries — Glassmorphic Card (#4) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="fade-up-element p-8 lg:p-10 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-md relative overflow-hidden">
              {/* Subtle turquoise edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(18,168,172,0.3), transparent)",
                }}
              />

              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
                    Head Office
                  </h3>
                  <div className="flex flex-col gap-2 text-xl font-medium tracking-tight">
                    <a
                      href="mailto:office@gottwald.world"
                      data-magnetic
                      className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
                    >
                      office@gottwald.world
                    </a>
                    <a
                      href="tel:+995800800800"
                      data-magnetic
                      className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
                    >
                      +995 800 800 800
                    </a>
                  </div>
                </div>

                <div className="w-full h-px bg-white/10" />

                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
                    Website
                  </h3>
                  <div className="flex flex-col gap-2 text-xl font-medium tracking-tight">
                    <a
                      href="https://www.gottwald.world"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-magnetic
                      className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
                    >
                      www.gottwald.world
                    </a>
                  </div>
                </div>

                <div className="w-full h-px bg-white/10" />

                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
                    GOTT WALD HOLDING
                  </h3>
                  <address className="text-xl font-medium tracking-tight not-italic text-white leading-relaxed">
                    Company ID: 400415421
                    <br />
                    <br />
                    Georgia, Tbilisi,
                    <br />
                    Gldani district
                    <br />
                    Maseli Street N2a
                    <br />
                    Entrance N2,
                    <br />
                    Office N201
                    <br />
                    reference 35.64,
                    <br />
                    block G
                  </address>
                  <a
                    href="https://maps.app.goo.gl/HG8uekt8zZF4CWgWA"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic
                    className="inline-block mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gold border-b border-gold/30 pb-1 hover:border-gold transition-colors px-4 pt-4 -mx-4"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form — Glassmorphic Container (#5) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="fade-up-element p-8 lg:p-12 rounded-sm border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
              {/* Top edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
                }}
              />

              <div className="mb-12">
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase">
                  Send us a message
                </h2>
                <p className="mt-4 text-white/80 text-lg max-w-md">
                  We review all inquiries. If there is alignment, our team will
                  coordinate a secure briefing.
                </p>
              </div>

              <BrutalistContactForm subject="General Inquiry" />
            </div>
          </div>
        </section>
      </main>

      <FooterSection />

      {/* ── Particle Keyframes (injected once) ── */}
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
      `}</style>
    </div>
  );
}
