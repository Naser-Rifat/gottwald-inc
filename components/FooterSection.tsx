"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setMounted(true);
    let interval: NodeJS.Timeout;

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

    updateTime();
    interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#020202] text-white overflow-hidden pt-24 lg:pt-32 pb-8 px-[5vw] xl:px-[8vw] border-t border-white/10 font-sans z-10">
      {/* ── TOP SECTION: Call to Action & Philosophy ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-32 border-b border-white/10">
        {/* Left: The Promise & CTA */}
        <div className="lg:col-span-8 flex flex-col justify-between items-start">
          <p className="font-serif italic text-white/40 text-3xl md:text-5xl leading-tight max-w-3xl mb-16 lg:mb-24">
            "We don't buy vendors. <br />
            <span className="text-white">We select partners.</span>"
          </p>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-16">
            {/* Magnetic Button */}
            <a
              href="mailto:office@gottwald.world"
              data-magnetic
              className="group relative w-36 h-36 lg:w-44 lg:h-44 rounded-full border border-white/20 flex items-center justify-center overflow-hidden transition-all duration-700 hover:border-[#d4af37] hover:bg-[#d4af37]/5"
            >
              <div className="absolute inset-0 bg-[#d4af37] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />
              <span className="relative z-10 text-[11px] uppercase font-bold tracking-[0.3em] text-white group-hover:text-black transition-colors duration-700 text-center leading-relaxed">
                Initiate
                <br />
                Inquiry
              </span>
            </a>

            {/* Email & Contact */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">
                Direct Line
              </span>
              <a
                href="mailto:office@gottwald.world"
                className="text-2xl lg:text-4xl font-light tracking-wide hover:text-[#d4af37] transition-colors duration-300"
              >
                office@gottwald.world
              </a>
            </div>
          </div>
        </div>

        {/* Right: Operational Data & Live Time */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="flex flex-col gap-16 mt-12 lg:mt-0 lg:items-end lg:text-right">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mb-4">
                Georgia Hub
              </h4>
              <p className="text-sm text-white/60 leading-relaxed font-mono">
                Tbilisi, Georgia
                <br />
                41°43'0"N 44°47'0"E
              </p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mb-4">
                Local Time
              </h4>
              <div className="text-sm text-white/60 leading-relaxed font-mono flex items-center gap-3 lg:justify-end">
                <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                <span>{mounted ? time : "00:00:00 GET"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mb-4">
                Network Protocol
              </h4>
              <p className="text-sm text-[#d4af37] leading-relaxed font-mono font-bold tracking-widest">
                SIG_888±
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION: Directory Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 py-24 relative">
        <div className="lg:col-span-4 flex flex-col justify-between">
          {/* Minimal Logo / Sig */}
          <div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border border-white/20 mb-10 bg-[#0a0a0a]">
              <span className="text-[9px] font-black tracking-widest leading-none text-white text-center">
                G<br />W
              </span>
            </div>
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4 max-w-xs leading-relaxed font-bold">
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
              className="group flex flex-col justify-center py-6 border-b border-white/10 hover:border-[#d4af37]/50 transition-colors duration-500 relative overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10 w-full">
                <span className="text-xs text-white/20 font-mono transition-colors duration-500 group-hover:text-[#d4af37]">
                  0{i + 1}
                </span>

                {/* text masking reveal effect */}
                <div className="relative overflow-hidden w-full h-[1.4em]">
                  <span className="absolute top-0 left-0 block text-base font-bold uppercase tracking-[0.25em] text-white/50 group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                  <span className="absolute top-0 left-0 block text-base font-bold uppercase tracking-[0.25em] text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                </div>

                {/* arrow right popping in */}
                <span className="absolute right-4 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#d4af37] text-xl">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── BOTTOM SECTION: The Monolith Typography ── */}
      <div className="relative w-full pt-16 mt-8 overflow-hidden pointer-events-none select-none mix-blend-screen flex flex-col items-center">
        {/* We use fit-text logic using viewport units, exact scaling */}
        <h1 className="text-[14.5vw] leading-[0.75] font-black tracking-[-0.04em] text-white opacity-90 whitespace-nowrap">
          GOTT WALD
        </h1>

        {/* Meta row lying directly beneath */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end mt-12 gap-6 md:gap-0 text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">
          <span>© 2026 GOTT WALD HOLDING LLC</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 pointer-events-auto relative z-30">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Governance
            </Link>
            <span className="hidden md:inline text-white/20">|</span>
            <button
              onClick={scrollToTop}
              className="text-[#d4af37] hover:text-white transition-colors flex items-center gap-3 group px-4 py-2 border border-[#d4af37]/20 rounded-full hover:border-white/50 bg-[#d4af37]/5 cursor-pointer"
            >
              <span className="group-hover:-translate-y-1 transition-transform">
                ↑
              </span>{" "}
              TOP
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
