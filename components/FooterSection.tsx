"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import logo from "@/public/logo.png";

const directoryLinks = [
  { label: "Entity Grid", href: "#" },
  { label: "Manifesto", href: "#" },
  { label: "Cooperation Hub", href: "#" },
  { label: "Strategic Assets", href: "#" },
  { label: "Strategic Inquiry.", href: "#" },
  { label: "Press / Media Kit", href: "#" },
  { label: "Careers", href: "/careers" },
];

const protocolItems = [
  "Confidential by default",
  "Values-first selection",
  "Standards-led governance",
  "Execution over exposure",
];

export default function FooterSection() {
  const [time, setTime] = useState("");
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
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("Time formatting error:", errorMessage);
        setTime(
          new Date().toLocaleTimeString("en-US", { hour12: false }) + " LOCAL",
        );
      }
    };

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

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black text-white pt-16 lg:pt-24 pb-8 px-gutter z-10 overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════
           MAIN GRID: 4-column layout matching reference
         ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-6 pb-16 lg:pb-20">
        {/* ── COL 1: BRAND IDENTITY ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="w-max">
            <Image
              src={logo}
              alt="Gott Wald"
              width={56}
              height={56}
              className="rounded-full"
              suppressHydrationWarning
            />
          </Link>

          {/* Company name */}
          <h3 className="text-2xl font-bold tracking-[0.04em] uppercase leading-tight text-white/90">
            GOTT WALD HOLDING LLC
          </h3>

          {/* Tagline */}
          <p className="text-xl text-white/50 leading-relaxed max-w-sm">
            Georgia&apos;s strategic anchor for governance, standards-led
            execution, and industrial portfolio scaling.
          </p>

          {/* Ecosystem Portals */}
          <div className="mt-6">
            <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/70 mb-3">
              Ecosystem Portals
            </h4>
            <p className="text-lg text-white/50 leading-relaxed">
              gottwald.world · plhh.world · yig.care
            </p>
          </div>

          {/* Public Signal */}
          <div className="mt-2">
            <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/70 mb-3">
              Public Signal
            </h4>
            <p className="text-md text-white/50">YouTube: @GOTT_WALD</p>
          </div>
        </div>

        {/* ── COL 2: DIRECTORY ── */}
        <div className="lg:col-span-2">
          <h4 className=" uppercase tracking-[0.3em] font-light text-white/40 mb-8">
            Directory
          </h4>
          <nav className="flex flex-col">
            {directoryLinks.map((link, i) => (
              <Link
                href={link.href}
                key={i}
                className="group flex items-center py-3 relative overflow-hidden"
              >
                {/* ↗ Arrow reveal on hover (Left side) */}
                <span className="text-gold text-base font-light transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 group-hover:-translate-y-0.5">
                  ↗
                </span>

                {/* PRESERVED: Masking reveal hover effect Text */}
                <div className="relative overflow-hidden w-full h-[1.5em] flex items-center">
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base font-medium uppercase tracking-[0.15em] text-white/60 group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base font-medium uppercase tracking-[0.15em] text-white group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COL 3: PROTOCOLS ── */}
        <div className="lg:col-span-3">
          <h4 className=" uppercase tracking-[0.3em] font-light text-white/40 mb-8">
            Protocols
          </h4>
          <nav className="flex flex-col">
            {protocolItems.map((link, i) => (
              <Link
                href={link}
                key={i}
                className="group flex items-center py-3 relative overflow-hidden"
              >
                {/* ↗ Arrow reveal on hover (Left side) */}
                <span className="text-gold text-base font-light transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 group-hover:-translate-y-0.5">
                  ↗
                </span>

                {/* PRESERVED: Masking reveal hover effect Text */}
                <div className="relative overflow-hidden w-full h-[1.5em] flex items-center">
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base font-medium uppercase tracking-[0.15em] text-white/60 group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base font-medium uppercase tracking-[0.15em] text-white group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COL 4: REGISTRATION / BUILD / NETWORK ── */}
        <div className="lg:col-span-3 flex flex-col gap-8 lg:items-end lg:text-right">
          {/* Registration Code */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/40 mb-2">
              Registration Code
            </h4>
            <span className="text-white/50 tracking-[0.1em] tabular-nums font-mono">
              4OO415421
            </span>
          </div>

          {/* Build Version */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/40 mb-2">
              Build Version
            </h4>
            <span className="text-white/50 tracking-[0.1em] font-mono">
              GOTTWALD_INFRA_1.0
            </span>
          </div>

          {/* Network Signature */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/40 mb-2">
              Network Signature
            </h4>
            <span className=" font-bold tracking-widest text-gold font-mono drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]">
              888±
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           BOTTOM BAR: Copyright + Legal
         ═══════════════════════════════════════════════════════════ */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
        <p className=" text-white/50 tracking-wide font-light">
          © {new Date().getFullYear()} GOTTWALD HOLDING LLC. Security-led
          operations · Confidential by default.
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="text-white/50 hover:text-white transition-colors tracking-wide font-light"
          >
            Privacy
          </Link>
          <span className="text-white/10 ">·</span>
          <Link
            href="#"
            className="text-white/50 hover:text-white transition-colors tracking-wide font-light"
          >
            Governance & Standards
          </Link>
        </div>
      </div>
    </footer>
  );
}
