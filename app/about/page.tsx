"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero massive scale and fade
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 0.7,
          opacity: 0,
          y: 100,
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

      // 2. Horizontal Scroll Section
      if (horizontalRef.current && horizontalWrapperRef.current) {
        const sections = gsap.utils.toArray(".hz-panel");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            // End after scrolling the entire width of the wrapper
            end: () => `+=${horizontalWrapperRef.current?.offsetWidth || 0}`,
          },
        });
      }

      // 3. Reveal Y up
      const reveals = document.querySelectorAll(".reveal-up");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, rotationX: 10, transformOrigin: "0% 50%" },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // 4. Marquee Loop
      gsap.to(".marquee-inner", {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });

      // 5. Parallax glow spheres
      const glows = document.querySelectorAll(".float-glow");
      glows.forEach((glow, i) => {
        gsap.to(glow, {
          y: -200 - i * 50,
          rotate: 45,
          ease: "none",
          scrollTrigger: {
            trigger: glow.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-[#050505] min-h-screen text-white font-sans overflow-hidden selection:bg-white selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-[5vw] mix-blend-difference pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* ── HERO PINNED SECTION ── */}
        <section className="h-screen w-full flex items-center justify-center relative bg-[#020202]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="float-glow absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-white/[0.02] blur-[100px] rounded-full" />
            <div className="float-glow absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-[#d4af37]/[0.02] blur-[150px] rounded-full" />
          </div>

          <div
            ref={heroTextRef}
            className="flex flex-col items-center justify-center w-full px-[5vw]"
          >
            <span className="text-xs uppercase tracking-[0.5em] text-white/30 mb-8 font-bold reveal-up">
              ABOUT US — GOTTWALD HOLDING
            </span>
            <h1 className="text-[clamp(5rem,14vw,18rem)] leading-[0.8] font-black tracking-tighter uppercase text-center w-[120vw] !max-w-none text-white overflow-hidden mix-blend-screen">
              WE TURN COMPLEXITY <br />
              <span className="text-white/20 italic font-serif opacity-80 pl-[10vw]">
                INTO INEVITABILITY
              </span>
            </h1>
          </div>
        </section>

        {/* ── THE INTRO (Typography contrast) ── */}
        <section className="px-[5vw] py-[25vh] bg-[#050505] relative z-10 border-t border-white/5">
          <div className="max-w-5xl mx-auto flex flex-col gap-16 reveal-up">
            <p className="text-3xl md:text-5xl font-light leading-[1.4] text-white/50">
              If you&apos;re a CEO, founder, executive — or you run an SME that
              must grow — you know this moment: <br />
              <br />
              <span className="text-white">
                You can feel there&apos;s more possible&hellip; yet something in
                the system keeps draining energy.
              </span>
            </p>
            <div className="flex flex-col md:flex-row gap-12 pt-16 border-t border-white/10">
              <div className="flex-1 text-xl text-white/40 font-light leading-[1.8]">
                Too many topics, not enough sequence. Too much noise, not enough
                truth.
                <br />
                And even though everyone is smart, it doesn&apos;t get lighter —
                it just gets fuller.
              </div>
              <div className="flex-1 text-4xl text-[#d4af37] font-serif italic">
                That&apos;s where our work begins.
              </div>
            </div>
          </div>
        </section>

        {/* ── THE AXIS (Split layout) ── */}
        <section className="px-[5vw] pt-[15vh] pb-[25vh] bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10vw] max-w-7xl mx-auto items-center">
            <div className="reveal-up">
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-bold tracking-tighter uppercase leading-[0.9]">
                NOT A TRADITIONAL <br />
                <span className="text-white/20">SERVICE PROVIDER.</span>
              </h2>
            </div>
            <div className="reveal-up text-xl md:text-2xl text-white/50 font-light leading-[1.6]">
              <p className="mb-12">
                We are an execution standard: strategy, structure, technology,
                communication, and human performance — built as one integrated
                system that reduces complexity and makes outcomes inevitable.
              </p>
              <div className="p-12 border border-[#d4af37]/20 rounded-3xl bg-[#d4af37]/[0.02]">
                <span className="text-xs uppercase tracking-[0.5em] text-[#d4af37] font-bold block mb-6">
                  The Axis you feel
                </span>
                <p className="text-4xl text-white font-serif italic mb-4">
                  Nature
                </p>
                <p className="text-4xl text-white/60 font-serif italic mb-4 pl-8">
                  Animals
                </p>
                <p className="text-4xl text-white/30 font-serif italic pl-16">
                  Humans
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIFFERENCE / STAND FOR ── */}
        <section className="px-[5vw] py-[30vh] bg-[#020202] border-y border-white/5 relative flex flex-col items-center text-center">
          <div className="float-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-6xl relative z-10">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium block mb-12 reveal-up">
              THE DIFFERENCE (IN ONE SENTENCE)
            </span>
            <h2 className="text-[clamp(4rem,8vw,10rem)] font-black tracking-tighter uppercase leading-[0.9] reveal-up mix-blend-screen">
              WE DON&apos;T OPTIMIZE PARTS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">
                WE REDESIGN THE SYSTEM.
              </span>
            </h2>
            <p className="mt-16 text-4xl text-white/40 italic font-serif reveal-up">
              — until &ldquo;solved&rdquo; is felt in real life.
            </p>
          </div>
        </section>

        <section className="px-[5vw] py-[20vh] bg-[#050505]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24">
            <div className="flex-1 reveal-up">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block mb-8">
                WHAT WE STAND FOR
              </span>
              <p className="text-4xl md:text-6xl text-white font-light leading-[1.2]">
                We believe in something{" "}
                <span className="italic font-serif text-[#d4af37]">
                  radical
                </span>{" "}
                — and practical.
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-12 reveal-up text-xl md:text-2xl text-white/50 font-light pt-4 border-t border-white/10 md:border-none md:pt-0">
              <p className="text-white/90 font-medium text-3xl">
                When structure becomes visible, the right solution becomes
                inevitable.
              </p>
              <p>
                Not &ldquo;someday.&rdquo; Not &ldquo;when there&apos;s
                time.&rdquo;
                <br />
                But in a way that lets a CEO breathe again.
                <br />
                In a way that helps founders know what comes first.
                <br />
                In a way that lets teams deliver with focus.
              </p>
              <div className="p-8 bg-white/5 rounded-2xl">
                <strong className="text-white text-sm uppercase tracking-[0.3em] block mb-4">
                  Solved means solved.
                </strong>
                <p className="text-lg">
                  &ldquo;Solved&rdquo; means you feel it on Monday morning, not
                  in a pitch: Less friction. Clearer decisions. Higher speed.
                  More calm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO DIFFERENTLY (HORIZONTAL SCROLL) ── */}
        <div
          ref={horizontalRef}
          className="bg-[#020202] h-screen w-full flex overflow-hidden border-t border-white/5 relative"
        >
          <div className="absolute top-[10%] left-[5vw] z-10 pointer-events-none">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block">
              WHAT WE DO DIFFERENTLY
            </span>
            <p className="text-xl font-serif italic text-white/50 mt-4">
              We build architecture — for clarity.
            </p>
          </div>

          <div
            ref={horizontalWrapperRef}
            className="flex h-full w-[max-content]"
          >
            {/* Panel 1 */}
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  01
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Remove noise until only truth remains
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Most problems aren&apos;t complex — they&apos;re just
                    hidden. We reveal what truly drives the system: root cause,
                    leverage, sequence.
                  </p>
                </div>
              </div>
            </div>
            {/* Panel 2 */}
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  02
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Make decisions light again
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    When a system becomes clear, decisions almost make
                    themselves. Not because it&apos;s &ldquo;easy,&rdquo; but
                    because it is finally ordered.
                  </p>
                </div>
              </div>
            </div>
            {/* Panel 3 */}
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-[#d4af37]/20 italic font-serif">
                  03
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 text-[#d4af37]">
                    Build signal, not volume
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Marketing is Trust & Demand Infrastructure: positioning,
                    proof architecture, messaging, conversion — built so premium
                    clients take you seriously instantly.
                  </p>
                </div>
              </div>
            </div>
            {/* Panel 4 */}
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  04
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Technology as infrastructure
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Websites are not business cards. They are discovery, trust,
                    conversion, scale — including SEO and AI indexing.
                  </p>
                </div>
              </div>
            </div>
            {/* Panel 5 */}
            <div className="hz-panel w-screen h-full flex items-center justify-center px-[10vw]">
              <div className="flex gap-16 items-start max-w-5xl">
                <span className="text-[15vw] leading-[0.7] font-black text-white/5">
                  05
                </span>
                <div className="w-[50vw]">
                  <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
                    Strengthen the human behind the system
                  </h3>
                  <p className="text-2xl text-white/40 font-light leading-relaxed">
                    Because the best strategy fails when the human is burning
                    out. Coaching & Mentoring means regulation, focus, identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MINI CASE STORIES (STICKY STACK) ── */}
        <section className="px-[5vw] py-[20vh] bg-[#050505]">
          <div className="reveal-up text-center mb-32">
            <span className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-bold block mb-6">
              MINI CASE STORIES
            </span>
            <p className="text-5xl font-serif italic text-white/80">
              You&apos;ll recognize yourself.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative space-y-32">
            {/* Card 1 */}
            <div className="sticky top-[15vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#111] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (CEO / Founder / Entrepreneur)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 1 — &ldquo;Too many moving parts&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      Everything matters, nothing is ordered. Decisions are
                      heavy.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-[#d4af37] mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-[#d4af37]/80">
                      SolutionFinder → root cause visible → sequence + SSOT.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      fewer open loops, a clear line, noticeably more calm.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="sticky top-[18vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#141414] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (SME / Premium Offer)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 2 — &ldquo;We&apos;re great — but invisible&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      High quality, unclear external signal. Inconsistent leads.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-[#d4af37] mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-[#d4af37]/80">
                      messaging architecture + proof structure + trust system.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      the market understands you immediately. Trust forms
                      faster.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="sticky top-[21vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#181818] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (SME)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 3 — &ldquo;Old website, slow growth&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      Website as a brochure. Performance and structure hold you
                      back.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-[#d4af37] mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-[#d4af37]/80">
                      IT Solutions 2030 → SEO/AI readability, structure,
                      scalability.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      more discoverable, faster, clearer — growth engine.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="sticky top-[24vh] pb-12 transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#1a1a1a] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (Executive)
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-12">
                    Case 4 — &ldquo;High responsibility, inner drift&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-white/10 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      Function outwardly, but feel restless inside. Focus
                      breaks.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-[#d4af37] mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-[#d4af37]/80">
                      mentoring as a Human Operating System (regulation,
                      identity).
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      stable state, clearer decisions, stronger impact.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 5 */}
            <div className="sticky top-[27vh] transition-transform shadow-[0_-30px_50px_rgba(0,0,0,0.8)]">
              <div className="bg-[#1f1f1f] p-12 rounded-3xl border border-white/10 w-full min-h-[50vh] flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">
                    (Entrepreneur / Holding)
                  </span>
                  <h3 className="text-4xl font-bold text-[#d4af37] mb-12">
                    Case 5 — &ldquo;Structure Deployment (Georgia)&rdquo;
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base border-t border-[#d4af37]/20 pt-8">
                  <div>
                    <strong className="block text-white/50 mb-2 uppercase tracking-widest text-xs">
                      Before
                    </strong>
                    <span className="text-white/60">
                      You want structure, but risk chaos, wrong sequence.
                    </span>
                  </div>
                  <div>
                    <strong className="block text-[#d4af37] mb-2 uppercase tracking-widest text-xs">
                      Intervention
                    </strong>
                    <span className="text-[#d4af37]/80">
                      defensible setup → clean coordination (compliant,
                      bankable).
                    </span>
                  </div>
                  <div>
                    <strong className="block text-white mb-2 uppercase tracking-widest text-xs">
                      After
                    </strong>
                    <span className="text-white">
                      structure stands. operations are clear. less stress.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE PATRON MANIFESTO (Cinematic Typography) ── */}
        <section className="px-[5vw] py-[30vh] bg-[#000] relative overflow-hidden">
          <div className="float-glow absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#0f0a00] blur-[150px] opacity-50 pointer-events-none" />

          {/* Huge background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
            <h2 className="text-[clamp(10rem,25vw,30rem)] font-black tracking-tighter text-white/[0.03] uppercase whitespace-nowrap">
              THE PATRON
            </h2>
          </div>

          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            <h2 className="reveal-up text-[clamp(4rem,7vw,8rem)] font-extrabold tracking-tighter leading-[0.8] uppercase mb-16 mix-blend-screen text-white/90">
              THE PATRON <br />
              <span className="text-[#d4af37] italic font-serif lowercase text-[clamp(3rem,5vw,6rem)] font-light">
                of gott wald
              </span>
            </h2>

            <div className="text-3xl md:text-5xl text-white font-light leading-[1.6] max-w-4xl space-y-12 reveal-up">
              <p>
                In the fabric of GOTT WALD, the PATRON is not the &ldquo;single
                maker&rdquo; — and not the lone specialist.
              </p>
              <p className="font-serif italic text-white/50 text-2xl md:text-4xl">
                The PATRON is a philosophical anchor.
              </p>
              <p className="text-xl md:text-2xl text-white/40 border-l border-[#d4af37]/20 pl-8 text-left">
                Ensuring the human core remains present in every system — and
                enabling a diverse, global network of handpicked specialists to
                move as one aligned force.
              </p>
              <p className="font-serif italic text-[#d4af37] pt-8 text-4xl md:text-6xl">
                The PATRON is not the face — <br />
                the PATRON is the conscience.
              </p>
            </div>
          </div>
        </section>

        {/* ── OUR FOUNDATION (Marquee) ── */}
        <section className="py-[10vh] bg-[#0d0a00] border-y border-[#d4af37]/10 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-[15vw] bg-gradient-to-r from-[#0d0a00] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-[15vw] bg-gradient-to-l from-[#0d0a00] to-transparent z-10" />

          <div className="flex w-[200vw] whitespace-nowrap">
            <div className="marquee-inner flex gap-24 items-center">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-24 items-center text-[clamp(3rem,6vw,8rem)] font-serif italic text-[#d4af37]/80"
                >
                  <span>Love</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                  <span>Peace</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                  <span>Harmony</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                  <span>Compassion</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                  <span>Empathy</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                  <span>Service</span>
                  <span className="text-white/10 font-sans not-italic text-4xl">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE PATRON ROLE (Grid layout) ── */}
        <section className="px-[5vw] py-[25vh] bg-transparent">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="reveal-up">
              <h4 className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-bold mb-8">
                What the PATRON is truly exceptional at
              </h4>
              <p className="text-3xl text-white font-light leading-relaxed mb-8">
                A reader of people. A feeler. A gatherer — in the best sense.
              </p>
              <div className="text-white/50 text-xl font-light space-y-6">
                <p>
                  The PATRON sees you before you&apos;ve fully organized
                  yourself. Hears between your sentences. Feels what you mean.
                </p>
                <p>
                  The PATRON is the communicator. The living word. The one who
                  touches — without touching.
                </p>
                <div className="p-8 border border-white/10 rounded-2xl mt-8">
                  <p className="text-white font-bold mb-4 uppercase tracking-widest text-xs">
                    Proof without show
                  </p>
                  <p>
                    People open up. Conflict becomes clear. Disorder becomes
                    direction. Pressure becomes purpose.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-16 reveal-up">
              <div>
                <h4 className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-bold mb-8">
                  The role of the PATRON
                </h4>
                <p className="text-xl text-white/50 font-light mb-8">
                  The PATRON doesn&apos;t protect &ldquo;a company.&rdquo; The
                  PATRON protects what makes GOTT WALD possible:
                </p>
                <p className="text-3xl font-serif italic text-white/80 border-l border-[#d4af37]/30 pl-8">
                  Values. Alignment. Integrity. Humanity.
                </p>
              </div>
              <div className="bg-[#111] p-12 rounded-3xl mt-auto">
                <p className="uppercase tracking-[0.2em] font-bold text-white/40 text-sm mb-6">
                  So GOTT WALD remains:
                </p>
                <ul className="text-4xl md:text-5xl font-serif italic text-[#d4af37] space-y-4">
                  <li>A framework that carries.</li>
                  <li>A system that protects.</li>
                  <li>A force that unites.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="px-[5vw] py-[25vh] border-t border-[#d4af37]/20 relative overflow-hidden bg-[#0a0800]">
          <div className="float-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-[#d4af37]/[0.05] blur-[200px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="max-w-4xl mx-auto flex flex-col gap-24 relative z-10">
            <div className="text-center reveal-up">
              <span className="text-xs tracking-[0.5em] uppercase text-[#d4af37] font-bold block mb-8">
                HOW TO START (NO GAMES)
              </span>
              <h2 className="text-[clamp(4rem,8vw,7rem)] font-black tracking-tighter leading-[0.9] uppercase mb-8 text-white">
                IF YOU WANT IT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-white italic font-serif font-light tracking-normal lowercase">
                  cleanly solved
                </span>
              </h2>
              <button className="h-[80px] rounded-full bg-white text-black inline-flex items-center justify-center px-16 hover:scale-[1.05] transition-transform uppercase text-sm tracking-[0.3em] font-extrabold shadow-[0_0_80px_rgba(212,175,55,0.4)] mb-12 relative overflow-hidden group">
                <span className="relative z-10">
                  Request Strategic Conversation
                </span>
                <div className="absolute inset-0 bg-[#d4af37] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
