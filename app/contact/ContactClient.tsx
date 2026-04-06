"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrutalistContactForm from "@/components/BrutalistContactForm";

gsap.registerPlugin(ScrollTrigger);

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

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
            delay: 0.2, // Wait for page load
          },
        );
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

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#060606] text-white selection:bg-gold selection:text-black overflow-hidden flex flex-col"
    >
      {/* ── Fixed Header ── */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-none">
        <div className="pointer-events-auto">
          <Header />
        </div>
      </div>

      <main className="flex-1 w-full pt-[25vh] pb-32">
        {/* ── HERO ── */}
        <section className="px-gutter mb-[15vh]">
          <h1
            ref={heroTextRef}
            className="text-[clamp(4rem,14vw,16rem)] leading-[0.8] font-black uppercase tracking-tighter flex flex-col"
          >
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span className="hero-line block will-change-transform origin-left text-white drop-shadow-lg">
                LET&apos;S
              </span>
            </span>
            <span className="overflow-hidden block py-4 -my-4 pr-12 -mr-12">
              <span className="hero-line block will-change-transform origin-left text-white drop-shadow-lg">
                TALK
              </span>
            </span>
          </h1>
        </section>

        {/* ── CONTENT GRID ── */}
        <section className="content-grid px-gutter grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div className="fade-up-element space-y-2">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
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

            <div className="fade-up-element space-y-2">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
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

            <div className="fade-up-element space-y-2">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
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
                href="#"
                data-magnetic
                className="inline-block mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gold border-b border-gold/30 pb-1 hover:border-gold transition-colors px-4 pt-4 -mx-4"
              >
                View on Map
              </a>
            </div>
          </div>

          {/* Right Column: Brutalist Form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="fade-up-element mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase">
                Send us a message
              </h2>
              <p className="mt-4 text-white/50 text-lg max-w-md">
                We review all inquiries. If there is alignment, our team will
                coordinate a secure briefing.
              </p>
            </div>

            <BrutalistContactForm subject="General Inquiry" />
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
