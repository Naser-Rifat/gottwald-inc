"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";
import CinematicImage from "@/components/CinematicImage";
import {
  MANIFESTO_LINES,
  PARTNER_BENEFITS,
  PARTNER_EXPECTATIONS,
  PARTNERSHIP_ARCHETYPES,
  PARTNERSHIP_DOMAINS,
  PARTNERSHIP_PRINCIPLES,
  NON_NEGOTIABLES,
} from "@/lib/partnershipData";

gsap.registerPlugin(ScrollTrigger);

export default function PartnershipPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Immediate Hero Entrance — no ScrollTrigger, fires on mount
      if (heroTextRef.current) {
        const heroChildren =
          heroTextRef.current.querySelectorAll(".hero-reveal");

        // Set initial state instantly (no flash of unstyled content)
        gsap.set(heroChildren, { opacity: 0, y: 30 });

        // Staggered entrance timeline
        const heroTl = gsap.timeline({ delay: 0.2 });

        // Text reveals with stagger
        heroTl.to(heroChildren, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
        });

        // Hero parallax on scroll (pin + scale down)
        gsap.to(heroTextRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: heroTextRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
          },
        });
      }

      // 2. Global Reveal Up (below-fold sections only)
      const reveals = document.querySelectorAll(".reveal-up");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 3. Staggered Manifesto Lines
      const manifestoLines = document.querySelectorAll(".manifesto-line");
      gsap.fromTo(
        manifestoLines,
        { opacity: 0.1, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".manifesto-container",
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );

      // 4. Standards Horizontal Scroll interactions
      const scrollWrapper = document.querySelector(
        ".standards-scroll-wrapper",
      ) as HTMLElement;
      if (scrollWrapper && window.innerWidth >= 768) {
        // Calculate the total scrollable distance based on full scrollWidth minus viewport width
        // Adding a slight buffer to the end using window.innerWidth * 0.1
        const xOffset = -(
          scrollWrapper.scrollWidth -
          window.innerWidth +
          window.innerWidth * 0.1
        );

        gsap.to(scrollWrapper, {
          x: xOffset,
          ease: "none",
          scrollTrigger: {
            trigger: "#standards-section",
            start: "top top",
            end: () => `+=${scrollWrapper.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div
      ref={pageRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-hidden selection:bg-gold selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter mix-blend-difference pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* ── HERO — PARTNERSHIP MANIFESTO ── */}
        <section className="h-screen w-full flex items-end relative bg-transparent overflow-hidden">
          {/* Subtle depth gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />

          {/* Thin top rule — entry signal */}
          <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-2" />

          {/* Main hero content */}
          <div
            ref={heroTextRef}
            className="relative w-full px-gutter pb-12 will-change-transform z-5"
          >
            {/* Main two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-end">
              {/* LEFT: Power-statement manifesto */}
              <div className="hero-reveal">
                {/* Gold chapter number */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-gold text-[11px] font-bold tracking-[0.4em] uppercase">
                    02/
                  </span>
                  <span className="w-12 h-px bg-white/15" />
                  <span className="text-[10px] tracking-[0.35em] text-white/30 uppercase font-bold">
                    Partnerships
                  </span>
                </div>

                <h1 className="text-[clamp(2.8rem,8vw,9rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-white">
                  WE DON&apos;T
                  <br />
                  BUY
                  <br />
                  VENDORS.
                </h1>

                <p className="hero-reveal flex items-center gap-4 text-[clamp(1.6rem,3.5vw,4.5rem)] font-serif italic text-gold/60 tracking-tight leading-tight mt-12 pl-0.5">
                  <span className="w-8 md:w-12 h-0.5 bg-gold/50" />
                  We select partners.
                </p>
              </div>

              {/* RIGHT: HUD Metric Strip — elevated */}
              <div className="hero-reveal hidden lg:flex flex-col gap-0 self-end bg-black/70 backdrop-blur-md rounded-sm p-8 -m-8 border border-white/10 shadow-2xl">
                {/* Column header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gold/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gold/70 font-bold">
                    Our Reach — Live
                  </p>
                </div>

                {/* Metric rows */}
                {[
                  { label: "Countries", value: "26" },
                  { label: "Partner Origins", value: "71" },
                  { label: "Network Size", value: "888+" },
                  { label: "Languages", value: "17" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="group flex items-baseline justify-between py-4 border-b border-white/5 last:border-0 cursor-default"
                  >
                    <span className="text-[11px] uppercase tracking-widest text-white/50 group-hover:text-white/70 transition-colors duration-300">
                      {label}
                    </span>
                    <span className="text-3xl font-light text-white/90 tabular-nums group-hover:text-gold transition-colors duration-300">
                      {value}
                    </span>
                  </div>
                ))}

                {/* CTA link — prominent gold */}
                <a
                  href="#apply"
                  className="group mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300 w-max"
                >
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold">
                    Apply Now
                  </span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section className="px-gutter py-32 bg-black/90 relative z-10 border-t border-white/5 manifesto-container">
          <div className="max-w-5xl mx-auto">
            {/* Section header — highlighted */}
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold/50 font-bold block mb-4">
                  Foundation
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
                  Our Foundation
                </h2>
                <p className="text-lg md:text-xl font-serif italic text-gold/70 mt-3">
                  A 7-Line Manifesto
                </p>
              </div>
              <div className="w-24 h-px bg-gold/30 hidden md:block mb-3" />
            </div>

            {/* Manifesto cards */}
            <div className="flex flex-col gap-4">
              {MANIFESTO_LINES.map((line, i) => (
                <div
                  key={i}
                  className="manifesto-line group relative bg-white/3 border border-white/5 rounded-sm px-8 py-7 flex items-start gap-6 hover:bg-white/5 hover:border-gold/20 transition-all duration-300 cursor-default"
                >
                  {/* Number */}
                  <span className="text-gold/40 text-sm font-bold tracking-wider tabular-nums shrink-0 pt-1 group-hover:text-gold/70 transition-colors duration-300">
                    0{i + 1}
                  </span>
                  {/* Statement */}
                  <p className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-white/80 group-hover:text-white transition-colors duration-300">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABSTRACT ARCHITECTURE IMAGE (FULL BLEED) ── */}
        <section className="w-full relative z-10 bg-[#020202]">
          <CinematicImage
            src="/images/partnership_abstract.png"
            alt="Gott Wald Abstract Partnership Architecture"
            overlay
            className="w-full h-[50vh] md:h-[70vh] object-cover filter grayscale contrast-125 rounded-none"
          />
        </section>

        {/* ── PRINCIPLES & ARCHETYPES ── */}
        <section className="px-gutter py-[20vh] bg-[#050505] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="reveal-up">
                <h3 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter leading-[0.9] uppercase mb-12">
                  Partnership is <span className="text-gold">alignment</span> —
                  not procurement.
                </h3>
                <p className="text-xl text-white/50 mb-12 font-light leading-relaxed max-w-lg">
                  We don&apos;t &quot;source services.&quot; We select partners
                  who can carry our foundation and protect our standard.
                </p>
                <div className="flex flex-col gap-4 border-l border-white/10 pl-6">
                  <p className="text-sm font-medium tracking-widest uppercase text-white/30 mb-2">
                    We work with partners who:
                  </p>
                  {PARTNERSHIP_PRINCIPLES.map((principle, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <p className="text-lg text-white/80">{principle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal-up">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-12 text-white/40 border-b border-white/10 pb-4">
                  Who we&apos;re looking for
                </h4>
                <p className="text-2xl text-white mb-10 font-serif italic">
                  Outstanding companies — proven in action, not in slides.
                </p>
                <div className="flex flex-col gap-8">
                  {PARTNERSHIP_ARCHETYPES.map((arch, i) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex gap-4 items-baseline">
                        <span className="text-xs text-gold font-mono">
                          0{i + 1}
                        </span>
                        <h5 className="text-xl font-bold tracking-tight group-hover:text-gold transition-colors">
                          {arch.title}
                        </h5>
                      </div>
                      <p className="pl-8 text-white/40 mt-1">{arch.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NON-NEGOTIABLES GRID (HORIZONTAL SCROLL) ── */}
        <section
          id="standards-section"
          className="bg-[#020202] relative z-10 overflow-hidden"
        >
          <div className="standards-pin-container h-screen flex flex-col justify-center px-gutter md:pl-gutter md:pr-0">
            <div className="flex justify-between items-end mb-20 shrink-0 reveal-up pr-gutter">
              <h2 className="text-[clamp(3.5rem,8vw,9rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mix-blend-difference">
                OUR
                <br />
                PARTNERSHIP
                <br />
                STANDARD
              </h2>
              <div className="hidden lg:flex flex-col items-end pb-4">
                <span className="w-2 h-2 rounded-full bg-gold mb-4" />
                <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold">
                  Non-Negotiables
                </p>
              </div>
            </div>

            {/* Scroll Wrapper */}
            <div className="standards-scroll-wrapper flex flex-col md:flex-row gap-6 md:gap-8 w-full md:w-max shrink-0 reveal-up pb-20">
              {NON_NEGOTIABLES.map((item, i) => (
                <div
                  key={i}
                  className="standard-card relative bg-[#050505] p-10 md:p-12 w-full md:w-[400px] lg:w-[460px] aspect-[4/5] md:aspect-square flex flex-col justify-between shrink-0 border border-white/5 group overflow-hidden transition-all duration-700 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)]"
                >
                  {/* Subtle Cinematic Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={
                        i % 2 === 0
                          ? "/images/partnership_abstract.png"
                          : "/images/about_office.png"
                      }
                      alt="Abstract background"
                      fill
                      className="object-cover opacity-[0.15] filter grayscale scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Deep shadow gradient to protect text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#020202] via-[#020202]/90 to-[#020202]/40" />
                  </div>

                  {/* Premium internal gradient */}
                  <div className="card-bg absolute inset-0 z-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-50 group-hover:from-gold/10 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 z-0 w-16 h-16 border-t border-r border-gold/0 group-hover:border-gold/30 transition-colors duration-700 opacity-50" />

                  {/* Header / Number */}
                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
                      / 0{i + 1}
                    </span>
                    <span className="text-white/20 group-hover:text-gold/50 transition-colors duration-500 font-serif italic text-xl">
                      Standard
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-3xl md:text-3xl font-bold tracking-tight mb-5 text-white/90 group-hover:text-white transition-colors duration-500">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-base md:text-lg leading-relaxed mix-blend-screen group-hover:text-white/70 transition-colors duration-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOMAINS ACCORDION ── */}
        <section className="px-gutter py-[20vh] bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 reveal-up">
              <h2 className="text-5xl font-bold tracking-tighter uppercase mb-6 sticky top-[20vh]">
                Partnership <br />{" "}
                <span className="text-white/40">Domains</span>
              </h2>
              <p className="text-white/40 leading-relaxed font-light mb-8 max-w-sm sticky top-[30vh]">
                Full transparency across all our operating pillars. We integrate
                partners natively into our architecture.
              </p>
            </div>

            <div
              className="lg:w-2/3 flex flex-col border-t border-white/10"
              ref={accordionWrapperRef}
            >
              {PARTNERSHIP_DOMAINS.map((domain) => {
                const isActive = activeAccordion === domain.id;
                return (
                  <div
                    key={domain.id}
                    className="reveal-up border-b border-white/10 group"
                  >
                    <button
                      onClick={() => toggleAccordion(domain.id)}
                      className="w-full py-10 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-8">
                        <span
                          className={`text-sm font-mono transition-colors ${isActive ? "text-gold" : "text-white/30"}`}
                        >
                          {domain.id}
                        </span>
                        <h3
                          className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
                        >
                          {domain.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-xl font-light text-white/50">
                          {isActive ? "-" : "+"}
                        </span>
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
                      style={{
                        maxHeight: isActive ? "800px" : "0px",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div className="pb-10 pl-14">
                        <ul className="flex flex-col gap-4">
                          {domain.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-lg text-white/50 flex items-start gap-3"
                            >
                              <span className="text-gold mt-2 leading-none shrink-0 border-t border-gold w-3" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── EXPECTATIONS & ECOSYSTEM ── */}
        <section className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
            <div className="reveal-up">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-12">
                What Partners Get
              </h3>
              <h4 className="text-4xl font-bold tracking-tighter mb-8 leading-[1.1]">
                A premium ecosystem. Clear decisions. Clean projects.
              </h4>
              <ul className="flex flex-col gap-6">
                {PARTNER_BENEFITS.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-start text-white/60 text-lg"
                  >
                    <span className="mt-1.75 w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mt-12 text-2xl font-serif italic text-white/80 border-l border-gold pl-6">
                We keep the frame stable.
                <br />
                You deliver excellence.
              </p>
            </div>

            <div className="reveal-up">
              <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-12">
                What We Expect
              </h3>
              <h4 className="text-4xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Professionalism that doesn&apos;t require supervision.
              </h4>
              <ul className="flex flex-col gap-6">
                {PARTNER_EXPECTATIONS.map((expectation, i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-start text-white/60 text-lg"
                  >
                    <span className="mt-1.75 w-1.5 h-1.5 bg-white/20 rounded-full shrink-0" />
                    {expectation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── APPLICATION FORM ── */}
        <section
          id="apply"
          className="px-gutter py-[20vh] bg-[#050505] relative z-10 border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto reveal-up">
            <div className="mb-20 text-center">
              <h2 className="text-[clamp(3rem,6vw,6rem)] font-black tracking-tighter uppercase mb-6">
                Partnership <br /> Application
              </h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                If foundation and proof are real — you&apos;re welcome. If not —
                honesty is better. That&apos;s how we operate. Please keep it
                clear and proof-based.
              </p>
            </div>

            <form
              className="flex flex-col gap-12"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Application captured. We will review and connect.");
              }}
            >
              {/* Group 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="company"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Company Name"
                  />
                  <label
                    htmlFor="company"
                    className="absolute left-0 top-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 peer-focus:text-gold peer-focus:-translate-y-4 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/30 transition-all"
                  >
                    Company Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="url"
                    id="website"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Website URL"
                  />
                  <label
                    htmlFor="website"
                    className="absolute left-0 top-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 peer-focus:text-gold peer-focus:-translate-y-4 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/30 transition-all"
                  >
                    Website
                  </label>
                </div>
              </div>

              {/* Group 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="contact"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Main Contact (Name, Email)"
                  />
                  <label
                    htmlFor="contact"
                    className="absolute left-0 top-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 peer-focus:text-gold peer-focus:-translate-y-4 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/30 transition-all"
                  >
                    Main Contact (Name, Email)
                  </label>
                </div>
                <div className="relative">
                  <select
                    required
                    id="type"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-black">
                      Select Partnership Type
                    </option>
                    <option value="strategic" className="text-black">
                      Strategic PARTNERSHIP
                    </option>
                    <option value="delivery" className="text-black">
                      Delivery PARTNERSHIP
                    </option>
                    <option value="tech" className="text-black">
                      Technology PARTNERSHIP
                    </option>
                    <option value="creative" className="text-black">
                      Creative & Media PARTNERSHIP
                    </option>
                    <option value="local" className="text-black">
                      Local Operations PARTNERSHIP
                    </option>
                  </select>
                  <label
                    htmlFor="type"
                    className="absolute left-0 top-0 text-xs font-bold tracking-[0.2em] uppercase text-white/40"
                  >
                    Partnership Type
                  </label>
                  <div className="absolute right-0 bottom-5 pointer-events-none">
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Group 3 */}
              <div className="relative">
                <textarea
                  required
                  id="capabilities"
                  rows={3}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none"
                  placeholder="Top 3 capabilities (bullet points) & Proof of work (links)"
                />
                <label
                  htmlFor="capabilities"
                  className="absolute left-0 top-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 peer-focus:text-gold peer-focus:-translate-y-4 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/30 transition-all"
                >
                  Capabilities & Proof of Work
                </label>
              </div>

              {/* Group 4 */}
              <div className="relative">
                <textarea
                  required
                  id="values"
                  rows={3}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none"
                  placeholder="Values Fit: 2-3 sentences describing your stance on responsibility, integrity..."
                />
                <label
                  htmlFor="values"
                  className="absolute left-0 top-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40 peer-focus:text-gold peer-focus:-translate-y-4 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/30 transition-all"
                >
                  Values Fit (Required)
                </label>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="nda"
                    className="peer w-6 h-6 appearance-none border border-white/20 rounded-sm checked:bg-gold checked:border-gold cursor-pointer transition-colors"
                  />
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <label
                  htmlFor="nda"
                  className="text-white/60 cursor-pointer text-lg"
                >
                  We are NDA-ready and operate with strict discretion.
                </label>
              </div>

              <button
                type="submit"
                data-magnetic
                className="group relative flex items-center gap-4 bg-white text-black px-12 py-6 overflow-hidden w-full md:w-max mt-8"
              >
                <span className="relative z-10 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors duration-300">
                  Submit Application
                </span>
                <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[30] transition-transform duration-500 ease-out origin-center" />
              </button>
            </form>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section className="relative z-10 bg-[#0a0a0a]">
          <FooterSection />
        </section>

        {/* ── NEXT CHAPTER ── */}
        <NextChapterTransition nextTitle="CAREERS" nextHref="/careers" />
      </main>
    </div>
  );
}
