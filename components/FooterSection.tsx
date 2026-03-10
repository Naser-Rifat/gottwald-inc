"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const directoryLinks = [
  { label: "Entity Grid", href: "#" },
  { label: "Manifesto", href: "#" },
  { label: "Cooperation Hub", href: "#" },
  { label: "Strategic Assets", href: "#" },
  { label: "Strategic Inquiry.", href: "#" },
  { label: "Press / Media Kit", href: "#" },
  { label: "Careers", href: "/careers" },
  { label: "Partnership", href: "/partnership" },
];

export default function FooterSection() {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Tbilisi",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(formatter.format(new Date()) + " GET");
      } catch (e) {
        setTime(
          new Date().toLocaleTimeString("en-US", { hour12: false }) + " LOCAL",
        );
      }
    };

    // Only run the interval when footer is visible — avoids re-renders when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          updateTime();
          interval = setInterval(updateTime, 1000);
        } else if (interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      { threshold: 0 },
    );

    observer.observe(footerEl);

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black text-white pt-32 lg:pt-48 pb-12 px-gutter border-t border-white/10 font-sans z-10 overflow-hidden"
    >
      {/* ── TOP LAYER: PHILOSOPHY & INITIATION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-32 border-b border-white/10">
        {/* Left: The Promise */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          <p className="font-serif italic text-white/50 text-4xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl tracking-tight mb-20 lg:mb-32">
            "We don't buy vendors. <br />
            <span className="text-white">We select partners.</span>"
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 sm:gap-20">
            {/* Massive Magnetic Button */}
            <a
              href="mailto:office@gottwald.world"
              data-magnetic
              className="group relative w-40 h-40 lg:w-52 lg:h-52 rounded-full border border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 hover:border-gold hover:bg-gold/5"
            >
              <div className="absolute inset-0 bg-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] rounded-full" />
              <span className="relative z-10 text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-white group-hover:text-black transition-colors duration-700 text-center leading-loose">
                Initiate
                <br />
                Inquiry
              </span>
              {/* Arrow */}
              <span className="relative z-10 text-white group-hover:text-black mt-2 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>

            {/* Direct Line */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">
                Direct Line
              </span>
              <a
                href="mailto:office@gottwald.world"
                className="text-2xl lg:text-3xl font-light tracking-wide hover:text-gold transition-colors duration-300 relative group w-max"
              >
                office@gottwald.world
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full ease-[cubic-bezier(0.76,0,0.24,1)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Hub Data */}
        <div className="lg:col-span-4 flex flex-col justify-between mt-12 lg:mt-0 lg:items-end lg:text-right">
          <div className="flex flex-col gap-16">
            <div className="group">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4 transition-colors group-hover:text-gold">
                Georgia Hub
              </h4>
              <p className="text-sm font-mono text-white/70 leading-relaxed uppercase tracking-widest">
                Tbilisi, Georgia
                <br />
                41°43'0"N 44°47'0"E
              </p>
            </div>

            <div className="group">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4 transition-colors group-hover:text-gold">
                Local Time
              </h4>
              <div className="text-sm font-mono text-white/70 tracking-widest flex items-center gap-4 lg:justify-end">
                <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse" />
                <span>{mounted ? time : "00:00:00 GET"}</span>
              </div>
            </div>

            <div className="group">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4 transition-colors group-hover:text-gold">
                Network Protocol
              </h4>
              <p className="text-sm font-mono font-bold tracking-widest text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                SIG_888±
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE LAYER: DIRECTORY INDEX ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 py-24 relative">
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center shrink-0 border border-white/10 mb-12 bg-black hover:border-gold/50 transition-colors duration-500">
              <span className="text-[10px] font-black tracking-widest leading-[1.2] text-white">
                G
              </span>
              <span className="text-[10px] font-black tracking-widest leading-[1.2] text-white">
                W
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-4 max-w-xs leading-loose">
              Confidential by default. <br />
              Standards-led governance.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 relative z-20">
          {directoryLinks.map((link, i) => (
            <Link
              href={link.href}
              key={i}
              className="group flex flex-col justify-center py-8 border-b border-white/10 hover:border-gold/30 transition-colors duration-500 relative overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10 w-full">
                <span className="text-xs font-mono text-white/20 transition-colors duration-500 group-hover:text-gold">
                  0{i + 1}
                </span>

                {/* Masking reveal effect */}
                <div className="relative overflow-hidden w-full h-[1.5em] flex items-center">
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base sm:text-lg font-bold uppercase tracking-[0.3em] text-white/40 group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base sm:text-lg font-bold uppercase tracking-[0.3em] text-white group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                </div>

                {/* Elegant Arrow Reveal */}
                <span className="absolute right-4 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-gold text-xl">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── BASE LAYER: THE ARCHITECTURAL MONOLITH ── */}
      <div className="relative w-full pt-20 mt-12 overflow-hidden select-none flex flex-col items-center border-t border-white/5">
        {/* Typographic Anchor */}
        <h1 className="text-[15.5vw] leading-[0.75] font-black tracking-[-0.03em] text-white whitespace-nowrap opacity-[0.95] mix-blend-screen pointer-events-none">
          GOTT WALD
        </h1>

        {/* Utilitarian Data Row */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-center lg:items-end mt-16 gap-8 lg:gap-0">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
            © {new Date().getFullYear()} GOTT WALD HOLDING LLC
          </span>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 z-30">
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              Legal Terms
            </Link>

            <span className="hidden md:inline text-white/10">|</span>

            {/* Precision Scroll To Top */}
            <button
              onClick={scrollToTop}
              className="group relative flex items-center justify-center w-24 h-10 rounded-full border border-white/10 bg-white/5 hover:border-gold/30 hover:bg-gold/5 transition-colors overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-2 transform transition-transform duration-500 group-hover:-translate-y-10">
                <span className="text-white/50 text-[10px] font-bold tracking-[0.2em]">
                  TOP
                </span>
                <span className="text-gold">↑</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                <span className="text-white text-[10px] font-bold tracking-[0.2em]">
                  TOP
                </span>
                <span className="text-gold">↑</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
