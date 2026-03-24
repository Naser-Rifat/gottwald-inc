"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

      // 3. Brutalist Form Focus Animations
      const inputs = formRef.current?.querySelectorAll(
        "input, textarea",
      ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
      inputs?.forEach((input) => {
        const label = input.nextElementSibling as HTMLElement | null;
        const line = input.parentElement?.querySelector(
          ".focus-line",
        ) as HTMLElement | null;

        if (!label || !line) return;

        input.addEventListener("focus", () => {
          gsap.to(label, {
            y: -24,
            scale: 0.8,
            color: "#d4af37",
            duration: 0.3,
            ease: "power2.out",
            transformOrigin: "left bottom",
          });
          gsap.to(line, { scaleX: 1, duration: 0.4, ease: "expo.out" });
        });

        input.addEventListener("blur", () => {
          if (!input.value) {
            gsap.to(label, {
              y: 0,
              scale: 1,
              color: "var(--tw-text-opacity, 1)",
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            // Keep label up, but revert color to white/gray
            gsap.to(label, { color: "rgba(255,255,255,0.5)", duration: 0.3 });
          }
          gsap.to(line, { scaleX: 0, duration: 0.4, ease: "expo.out" });
        });
      });
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
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
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
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
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
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                GOTT WALD HOLDING
              </h3>
              <address className="text-xl font-medium tracking-tight not-italic text-white/80 leading-relaxed">
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

            <form
              ref={formRef}
              className="fade-up-element flex flex-col gap-12"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative group/input">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors"
                  placeholder="Your Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
                >
                  Your Name
                </label>
                <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
              </div>

              <div className="relative group/input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors"
                  placeholder="Email Address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
                >
                  Email Address
                </label>
                <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
              </div>

              <div className="relative group/input">
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors"
                  placeholder="Organization (Optional)"
                />
                <label
                  htmlFor="organization"
                  className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
                >
                  Organization (Optional)
                </label>
                <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
              </div>

              <div className="relative group/input">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer resize-none focus:border-transparent transition-colors"
                  placeholder="Message Details"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-6 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:top-6 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-gold origin-top-left"
                >
                  Message Details
                </label>
                <div className="focus-line absolute bottom-1 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  data-magnetic
                  className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full overflow-hidden w-max"
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors duration-300">
                    Submit Inquiry
                  </span>
                  <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[30] transition-transform duration-500 ease-out origin-center" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
