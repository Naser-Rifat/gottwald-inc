"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrutalistContactForm from "@/components/BrutalistContactForm";
import { usePageColorShift } from "@/lib/usePageColorShift";

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
  const t = useTranslations("contact.hero");
  const tCtas = useTranslations("contact.ctas");
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  // Live Georgia Time
  const [georgiaTime, setGeorgiaTime] = useState("");
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      // Georgia is GMT+4
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tbilisi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const now = new Date();
      const timeString = new Intl.DateTimeFormat("en-GB", options).format(now);
      setGeorgiaTime(timeString + " GET");

      const hour = parseInt(timeString.substring(0, 2), 10);
      const day = now.getDay(); // Note: This gets local day, but close enough for visual effect
      // Open Mon-Fri, 9am - 6pm
      if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
        setIsOfficeOpen(true);
      } else {
        setIsOfficeOpen(false);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Contact page shifts the GlobalCanvas to Golden Amber
  usePageColorShift("#b67d33");

  useEffect(() => {
    let parallaxHandler: ((e: MouseEvent) => void) | null = null;
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

      // Awwwards Premium Mouse Parallax for Background Elements
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reducedMotion) {
        parallaxHandler = (e: MouseEvent) => {
          const px = (e.clientX / window.innerWidth - 0.5);
          const py = (e.clientY / window.innerHeight - 0.5);
          
          gsap.to(".contact-parallax-target", {
            x: px * 160,
            y: py * 160,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto"
          });
          
          gsap.to(".contact-liquid-aurora", {
            x: px * -250,
            y: py * -250,
            duration: 2.5,
            ease: "power3.out",
            overwrite: "auto"
          });
        };
        window.addEventListener("mousemove", parallaxHandler);
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (parallaxHandler) window.removeEventListener("mousemove", parallaxHandler);
    };
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
            "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(6,6,6,0.3) 0%, rgba(6,6,6,0.15) 50%, transparent 100%)",
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

      {/* AWWWARDS Premium Liquid Aurora Background (Turquoise & Gold) */}
      <div className="contact-liquid-aurora fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] max-w-[1400px] max-h-[1400px] rounded-full mix-blend-screen opacity-[0.05] blur-[120px] z-[-5] will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#12a8ac] via-transparent to-[#d4af37] rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#d4af37] to-[#12a8ac] rounded-full animate-[spin_25s_linear_infinite_reverse] mix-blend-overlay" />
      </div>

      {/* AWWWARDS Ghost echo — massive italic "contact." floats behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[10%] right-[-10vw] z-[-2] select-none opacity-40"
      >
        <span
          className="contact-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(12rem, 25vw, 30rem)",
          }}
        >
          contact.
        </span>
      </div>

      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[25vh] pb-32 relative z-10">
        {/* ── HERO ── */}
        <section className="px-gutter mb-8 relative">
          {/* Eyebrow (#3) */}
          {/* <p
            className="hero-eyebrow text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase mb-8"
            style={{ color: "rgba(212,175,55,0.85)", opacity: 0 }}
          >
            STRATEGIC INQUIRY // CONFIDENTIAL CHANNEL
          </p> */}

          {/* Hero text is owned by next-intl. translate="no" keeps GT
              from double-translating and from breaking the gradient-clip
              via <font> wrappers. */}
          <h1
            ref={heroTextRef}
            translate="no"
            aria-label={`${t("line1")} ${t("line2")}`}
            className="notranslate leading-[0.85] font-black uppercase tracking-tighter flex flex-col"
            style={{
              fontSize: "clamp(5rem, 14vw, 16rem)",
            }}
          >
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span
                className="hero-line block will-change-transform origin-left drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] text-white/95"
              >
                {t("line1")}
              </span>
            </span>
            {' '}
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span
                className="hero-line block will-change-transform origin-left text-transparent"
                style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.25)" }}
              >
                {t("line2")}
              </span>
            </span>
          </h1>
        </section>

        {/* ── Live Signal Waveform & Status ── */}
        <div className="px-gutter mb-[12vh] flex items-center gap-6">
          <div className="status-pulse flex items-center gap-3 opacity-0">
            {/* Animated CSS Waveform */}
            <div className="flex items-center gap-1 h-4">
              <div className="w-[2px] h-full bg-turquoise rounded-full animate-[wave_1s_ease-in-out_infinite]" />
              <div className="w-[2px] h-[40%] bg-turquoise rounded-full animate-[wave_1.2s_ease-in-out_infinite_0.1s]" />
              <div className="w-[2px] h-[80%] bg-turquoise rounded-full animate-[wave_0.8s_ease-in-out_infinite_0.2s]" />
              <div className="w-[2px] h-[30%] bg-turquoise rounded-full animate-[wave_1.5s_ease-in-out_infinite_0.3s]" />
              <div className="w-[2px] h-[60%] bg-turquoise rounded-full animate-[wave_1.1s_ease-in-out_infinite_0.4s]" />
            </div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium ml-2">
              Frequency Open · Accepting Inquiries
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
        <section className="content-grid px-gutter grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 relative">
          
          {/* Form Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-5%] right-[-5vw] z-0 select-none opacity-30"
          >
            <span
              className="contact-parallax-target block italic font-light text-white/[0.04] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(8rem, 15vw, 20rem)",
              }}
            >
              office.
            </span>
          </div>
          {/* Left Column: Direct Inquiries — Glassmorphic Card (#4) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="fade-up-element p-8 lg:p-10 rounded-3xl border border-white/10 bg-[#0a0c12]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-700">
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04),_transparent_60%)] pointer-events-none rounded-3xl" />
              {/* Ultra-subtle Film Grain */}
              <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-3xl overflow-hidden" 
                   style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
              />
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
                  {/* ── Stylized Dark Map ── */}
                  <a
                    href="https://maps.app.goo.gl/HG8uekt8zZF4CWgWA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block mt-8 w-full aspect-[16/10] max-w-[420px] rounded-lg overflow-hidden cursor-pointer border border-white/10 bg-white/[0.03] backdrop-blur-md"
                  >
                    {/* Top edge glow — matching site cards */}
                    <div
                      className="absolute top-0 left-0 w-full h-px pointer-events-none z-10"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
                      }}
                    />

                    {/* SVG Road Network */}
                    <svg
                      viewBox="0 0 420 260"
                      fill="none"
                      className="absolute inset-0 w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <filter id="roadGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Major roads — warm gold tones to match amber canvas */}
                      <g filter="url(#roadGlow)" opacity="0.6">
                        <path d="M0 130 Q60 125, 120 128 T240 120 T360 135 L420 132" stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
                        <path d="M210 0 Q205 50, 215 100 T208 180 T220 260" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
                        <path d="M0 40 Q100 80, 200 130 T420 200" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
                        {/* River — turquoise accent */}
                        <path d="M0 200 Q80 185, 160 195 T320 175 L420 180" stroke="rgba(18,168,172,0.4)" strokeWidth="1.5" strokeDasharray="6 3" />
                      </g>

                      {/* Secondary roads — muted white/gold */}
                      <g opacity="0.25">
                        <path d="M80 0 L90 260" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                        <path d="M150 0 Q145 130, 155 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                        <path d="M280 0 Q285 100, 275 200 T290 260" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                        <path d="M340 0 L350 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                        <path d="M0 70 Q100 65, 200 75 T420 60" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                        <path d="M0 180 Q150 175, 300 185 T420 170" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                        <path d="M0 230 L420 220" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                      </g>

                      {/* Minor streets */}
                      <g opacity="0.12">
                        <path d="M40 0 L45 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M120 0 L125 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M180 0 L175 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M250 0 L245 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M310 0 L315 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M380 0 L375 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                        <path d="M0 30 L420 25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M0 100 L420 95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M0 160 L420 155" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M100 0 L0 80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M320 0 L420 100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M250 260 L420 140" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                        <path d="M0 160 L120 260" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
                      </g>

                      {/* Block fills */}
                      <g opacity="0.03">
                        <rect x="85" y="75" width="60" height="50" fill="rgba(212,175,55,1)" rx="2" />
                        <rect x="155" y="135" width="50" height="40" fill="rgba(212,175,55,1)" rx="2" />
                        <rect x="220" y="65" width="55" height="50" fill="rgba(212,175,55,1)" rx="2" />
                        <rect x="285" y="130" width="50" height="40" fill="rgba(212,175,55,1)" rx="2" />
                        <rect x="90" y="140" width="55" height="35" fill="rgba(212,175,55,1)" rx="2" />
                      </g>

                      {/* HQ Location Marker — gold */}
                      <g filter="url(#strongGlow)">
                        <circle cx="210" cy="130" r="14" stroke="rgba(212,175,55,0.3)" strokeWidth="1" fill="none">
                          <animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="210" cy="130" r="8" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" fill="none">
                          <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="210" cy="130" r="3.5" fill="rgba(212,175,55,1)" />
                        <circle cx="210" cy="130" r="1.5" fill="#fff" opacity="0.9" />
                      </g>
                    </svg>

                    {/* Corner coordinates */}
                    <span className="absolute top-3 left-3 text-[8px] font-mono tracking-wider text-white/30 uppercase">
                      41.7851° N
                    </span>
                    <span className="absolute top-3 right-3 text-[8px] font-mono tracking-wider text-white/30 uppercase">
                      44.8271° E
                    </span>

                    {/* HQ Label */}
                    <div className="absolute top-1/2 left-1/2 translate-x-4 -translate-y-6 pointer-events-none">
                      <span className="text-[9px] font-mono tracking-[0.15em] text-gold/80 uppercase whitespace-nowrap">
                        GOTT WALD HQ
                      </span>
                    </div>

                    {/* Bottom bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-between px-3 pb-2">
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold/60 group-hover:text-gold transition-colors">
                        {tCtas("viewOnMap")}
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-white/30">
                        TBILISI · GE
                      </span>
                    </div>

                    {/* Hover glow overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
                      }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form — Glassmorphic Container (#5) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="fade-up-element p-8 lg:p-12 rounded-3xl border border-white/[0.08] bg-[#0a0c12]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-700">
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(18,168,172,0.05),_transparent_60%)] pointer-events-none rounded-3xl" />
              {/* Ultra-subtle Film Grain */}
              <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-3xl overflow-hidden" 
                   style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
              />
              {/* Top edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
                }}
              />

              {/* Secure Channel Badge */}
              <div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <svg className="w-3 h-3 text-gold opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[8px] font-mono tracking-widest uppercase text-white/50">
                  Encrypted Channel
                </span>
              </div>

              <div className="mb-10 mt-4">
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase mb-6">
                  Send us a message
                </h2>
                
                {/* Response Commitment Strip */}
                {/* <div className="flex items-center gap-4 py-3 border-y border-white/10 w-max mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/60">
                    Average Response Time:
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-gold">
                    &lt; 24H
                  </span>
                </div> */}

                <p className="text-white/70 text-base max-w-md leading-relaxed">
                  We review all inquiries. If there is alignment, our team will
                  coordinate a secure briefing.
                </p>
              </div>

              <BrutalistContactForm subject="General Inquiry" />
            </div>
          </div>
        </section>
      </main>

      {/* Journey Conclusion Statement */}
      <section className="relative px-8 md:px-16 pb-32 pt-16 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-gold/50 mb-12" />
        <h2 
          className="font-light italic tracking-tight text-white/90 mb-6"
          style={{ fontSize: "clamp(3rem, 6vw, 6rem)", fontFamily: "var(--font-playfair)" }}
        >
          The standard has been set.
        </h2>
        <p className="font-sans text-xl md:text-2xl font-light text-white/60 max-w-2xl leading-relaxed">
          The digital journey concludes here. <br />
          The real-world partnership begins.
        </p>
      </section>

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
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
