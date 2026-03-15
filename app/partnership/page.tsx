"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";
import {
  NON_NEGOTIABLES,
  PARTNERSHIP_DOMAINS,
  PARTNERSHIP_ARCHETYPES,
  PARTNER_BENEFITS,
} from "@/lib/partnershipData";

gsap.registerPlugin(ScrollTrigger);

export default function PartnershipPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      if (heroTextRef.current) {
        const heroChildren =
          heroTextRef.current.querySelectorAll(".hero-reveal");
        gsap.set(heroChildren, { opacity: 0, y: 30 });

        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl.to(heroChildren, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          force3D: true,
        });

        // Hero parallax on scroll (NO pin — avoids double-pin conflict
        // with standards horizontal scroll section)
        gsap.to(heroTextRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroTextRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Reveal Up animations
      const reveals = gsap.utils.toArray(
        ".reveal-up",
        pageRef.current!,
      ) as HTMLElement[];
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 3. Standards Horizontal Scroll
      const scrollWrapper = gsap.utils.toArray(
        ".standards-scroll-wrapper",
        pageRef.current!,
      )[0] as HTMLElement;
      if (scrollWrapper && window.innerWidth >= 768) {
        const xOffset = -(scrollWrapper.scrollWidth - window.innerWidth);

        gsap.to(scrollWrapper, {
          x: xOffset,
          force3D: true,
          ease: "none",
          scrollTrigger: {
            trigger: "#standards-section",
            start: "top top",
            end: () => `+=${scrollWrapper.scrollWidth - window.innerWidth}`,
            scrub: 0.5, // Snappier than 1, less input lag
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
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
      className="bg-transparent min-h-screen text-white font-sans overflow-x-hidden selection:bg-gold selection:text-black"
    >
      {/* Fixed header — same pattern as all other pages */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* ── SECTION 1: HERO ── */}
        <section className="h-screen w-full flex items-end relative bg-transparent overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-2" />

          <div
            ref={heroTextRef}
            className="relative w-full px-gutter pb-12 will-change-transform z-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-end">
              {/* LEFT: Power-statement */}
              <div className="hero-reveal">
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-gold text-xs lg:text-sm font-bold tracking-[0.4em] uppercase">
                    02/
                  </span>
                  <span className="w-16 h-px bg-white/15" />
                  <span className="text-xs lg:text-sm tracking-[0.35em] text-white/40 uppercase font-bold">
                    Partnerships
                  </span>
                </div>

                <h1 className="text-[clamp(3.5rem,8vw,10rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-white">
                  APPLY TO
                  <br />
                  THE
                  <br />
                  ECOSYSTEM.
                </h1>

                <p className="hero-reveal flex items-center gap-4 text-[clamp(1.8rem,3vw,3.5rem)] font-serif italic text-gold/80 tracking-tight leading-tight mt-14 pl-0.5">
                  <span className="w-8 md:w-16 h-0.5 bg-gold/50" />
                  Proven partners only.
                </p>
              </div>

              {/* RIGHT: HUD Metric Strip — solid bg, no blur (perf) */}
              <div className="hero-reveal hidden lg:flex flex-col gap-0 self-end bg-[#0a0a0a]/95 rounded-sm p-8 lg:p-10 -m-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gold/20">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <p className="text-[10px] lg:text-xs uppercase tracking-[0.5em] text-gold/80 font-bold">
                    Our Reach — Live
                  </p>
                </div>

                {[
                  { label: "Countries", value: "26" },
                  { label: "Partner Origins", value: "71" },
                  { label: "Network Size", value: "888+" },
                  { label: "Languages", value: "17" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="group flex items-baseline justify-between py-5 border-b border-white/5 last:border-0 cursor-default"
                  >
                    <span className="text-xs lg:text-sm uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-300">
                      {label}
                    </span>
                    <span className="text-4xl lg:text-5xl font-light text-white/90 tabular-nums group-hover:text-gold transition-colors duration-300">
                      {value}
                    </span>
                  </div>
                ))}

                <a
                  href="#apply"
                  className="group mt-10 inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300 w-full"
                >
                  <span className="text-xs lg:text-sm tracking-[0.3em] uppercase font-bold">
                    Apply Now
                  </span>
                  <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: NON-NEGOTIABLES (HORIZONTAL SCROLL) ── */}
        <section
          id="standards-section"
          className="bg-[#020202] relative z-10 isolate"
        >
          <div className="standards-pin-container">
            {/* Section Title Row */}
            <div className="flex justify-between items-end px-gutter pt-[12vh] pb-10 lg:pb-14 reveal-up">
              <h2 className="text-[clamp(3rem,max(5vw,6vh),8rem)] font-black tracking-tighter leading-[0.85] uppercase text-white drop-shadow-xl">
                OUR
                <br />
                PARTNERSHIP
                <br />
                STANDARD
              </h2>
              <div className="hidden lg:flex flex-col items-end pb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-gold mb-5" />
                <p className="text-xs lg:text-sm tracking-[0.4em] text-white/50 uppercase font-bold">
                  Non-Negotiables
                </p>
              </div>
            </div>

            {/* Scroll Wrapper — full-width monolithic columns */}
            <div className="standards-scroll-wrapper flex flex-row w-max reveal-up border-t border-white/10 will-change-transform">
              {NON_NEGOTIABLES.map((item, i) => (
                <div
                  key={i}
                  className="relative group flex flex-col justify-between w-[88vw] md:w-[50vw] lg:w-[38vw] h-[55vh] lg:h-[62vh] border-r border-white/10 p-10 lg:p-16 overflow-hidden cursor-pointer shrink-0"
                >
                  {/* Solid dark background — no backdrop-blur (GPU killer on mobile) */}
                  <div className="absolute inset-0 bg-[#0a0a0a] z-0" />

                  {/* Image Background — no mix-blend or filter (GPU-expensive) */}
                  <div className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <Image
                      src={`/images/futuristic_standard_${(i % 3) + 1}.png`}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 38vw"
                      quality={50}
                      loading="eager"
                      className="object-cover opacity-25 scale-110 group-hover:scale-105 transition-transform duration-[2000ms] ease-out will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/30" />
                  </div>

                  {/* Ambient Hover Glow — lightweight radial gradient */}
                  <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  {/* Top — index & label */}
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="font-mono text-white/20 group-hover:text-gold text-sm lg:text-base tracking-[0.5em] uppercase font-bold transition-colors duration-700">
                      / 0{i + 1}
                    </span>
                    <span className="font-serif italic text-2xl text-white/10 group-hover:text-white/40 transition-colors duration-700">
                      Standard
                    </span>
                  </div>

                  {/* Bottom — title + divider + desc */}
                  <div className="relative z-10">
                    <h3 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8 text-white/50 group-hover:text-white leading-[0.9] translate-y-6 group-hover:translate-y-0 transition-[color,transform] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                      {item.title}
                    </h3>

                    <div className="w-full h-px bg-white/5 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-full bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    </div>

                    <p className="text-xl lg:text-2xl text-white/30 font-light leading-relaxed tracking-wide translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white/80 transition-[color,opacity,transform] duration-700 delay-100 ease-[cubic-bezier(0.19,1,0.22,1)] pr-8">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom spacing */}
            <div className="pb-[10vh]" />
          </div>
        </section>

        {/* ── SECTION 3: DOMAINS ACCORDION ── */}
        <section className="px-gutter py-[20vh] bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 reveal-up">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-8 sticky top-[20vh]">
                Partnership <br />{" "}
                <span className="text-white/40">Domains</span>
              </h2>
              <p className="text-white/70 text-xl lg:text-2xl leading-relaxed font-light mb-8 max-w-md sticky top-[30vh]">
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
                      <div className="flex items-center gap-6 lg:gap-8">
                        <span
                          className={`text-base font-mono transition-colors ${isActive ? "text-gold" : "text-white/50"}`}
                        >
                          {domain.id}
                        </span>
                        <h3
                          className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
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
                      className="overflow-hidden transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
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
                              className="text-xl text-white/70 flex items-start gap-4"
                            >
                              <span className="text-gold mt-3 leading-none shrink-0 border-t border-gold w-4" />
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

        {/* ── SECTION 4: ARCHETYPES & VALUE PROPOSITION ── */}
        <section className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
            {/* Partnership Types */}
            <div className="reveal-up">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-14">
                Partnership Types
              </h3>
              <h4 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-14 leading-[1.1]">
                Five ways to work with us.
              </h4>
              <div className="flex flex-col gap-8">
                {PARTNERSHIP_ARCHETYPES.map((arch, i) => (
                  <div
                    key={i}
                    className="flex gap-6 lg:gap-8 items-start py-6 border-b border-white/5 last:border-0 group"
                  >
                    <span className="text-gold font-mono text-sm mt-1.5 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <h5 className="text-2xl font-bold text-white/90 mb-2 group-hover:text-gold transition-colors">
                        {arch.title}
                      </h5>
                      <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed">
                        {arch.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What Partners Get */}
            <div className="reveal-up">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-14">
                What Partners Get
              </h3>
              <h4 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-12 leading-[1.1]">
                A premium ecosystem. Clear decisions. Clean projects.
              </h4>
              <ul className="flex flex-col gap-8">
                {PARTNER_BENEFITS.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex gap-5 items-start text-white/70 text-xl"
                  >
                    <span className="mt-2.5 w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mt-16 text-3xl font-serif italic text-white/80 border-l-2 border-gold pl-8 leading-tight">
                We keep the frame stable.
                <br />
                You deliver excellence.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: APPLICATION FORM ── */}
        <section
          id="apply"
          className="px-gutter py-[20vh] bg-[#050505] relative z-10 border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto reveal-up">
            <div className="mb-24 text-center">
              <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                Partnership <br /> Application
              </h2>
              <p className="text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
                If foundation and proof are real — you&apos;re welcome. If not —
                honesty is better. Please keep it clear and proof-based.
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
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Company Name"
                  />
                  <label
                    htmlFor="company"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Company Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="url"
                    id="website"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Website URL"
                  />
                  <label
                    htmlFor="website"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Website
                  </label>
                </div>
              </div>

              {/* Group 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-2">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="contact"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                    placeholder="Main Contact (Name, Email)"
                  />
                  <label
                    htmlFor="contact"
                    className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                  >
                    Main Contact (Name, Email)
                  </label>
                </div>
                <div className="relative mt-2 md:mt-0">
                  <label
                    htmlFor="type"
                    className="absolute left-0 -top-4 md:-top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50"
                  >
                    Partnership Type
                  </label>
                  <select
                    required
                    id="type"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white/80 focus:text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
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
                      Creative &amp; Media PARTNERSHIP
                    </option>
                    <option value="local" className="text-black">
                      Local Operations PARTNERSHIP
                    </option>
                  </select>
                  <div className="absolute right-0 bottom-6 pointer-events-none transition-transform peer-focus:rotate-180">
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
              <div className="relative mt-2">
                <textarea
                  required
                  id="capabilities"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                  placeholder="Top 3 capabilities (bullet points) & Proof of work (links)"
                />
                <label
                  htmlFor="capabilities"
                  className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                >
                  Capabilities &amp; Proof of Work
                </label>
              </div>

              {/* Group 4 */}
              <div className="relative mt-2">
                <textarea
                  required
                  id="values"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-gold transition-colors placeholder-transparent resize-none leading-relaxed"
                  placeholder="Values Fit: 2-3 sentences describing your stance on responsibility, integrity..."
                />
                <label
                  htmlFor="values"
                  className="absolute left-0 top-3 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50 peer-focus:text-gold peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/40 transition-all duration-300 pointer-events-none"
                >
                  Values Fit (Required)
                </label>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-4 mt-8">
                <div className="relative flex items-center shrink-0">
                  <input
                    type="checkbox"
                    id="nda"
                    className="peer w-6 h-6 appearance-none border border-white/30 rounded-sm checked:bg-gold checked:border-gold cursor-pointer transition-colors"
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
                  className="text-white/60 cursor-pointer text-lg md:text-xl font-light hover:text-white transition-colors"
                >
                  We are NDA-ready and operate with strict discretion.
                </label>
              </div>

              <button
                type="submit"
                data-magnetic
                className="group relative flex items-center justify-center gap-4 bg-white text-black px-12 py-6 overflow-hidden w-full md:w-max mt-4"
              >
                <span className="relative z-10 font-bold uppercase tracking-[0.15em] text-sm group-hover:text-white transition-colors duration-300 pointer-events-none">
                  Submit Application
                </span>
                <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[40] transition-transform duration-500 ease-out origin-center pointer-events-none" />
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
