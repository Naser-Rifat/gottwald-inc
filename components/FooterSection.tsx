"use client";

import Link from "next/link";

const directoryLinks = [
  { label: "Entity Grid", href: "#" },
  { label: "Manifesto", href: "#" },
  { label: "Cooperation Hub", href: "#" },
  { label: "Strategic Assets", href: "#" },
  { label: "Strategic Inquiry.", href: "#" },
  { label: "Press / Media Kit", href: "#" },
  { label: "Careers", href: "#" },
];

const protocols = [
  "Confidential by default",
  "Values-first selection",
  "Standards-led governance",
  "Execution over exposure",
];

export default function FooterSection() {
  return (
    <footer className="w-full font-sans text-white overflow-hidden">
      {/* ── Top separator line ── */}
      <div className="w-full h-px bg-white/5" />

      {/* ── Main Footer Body ── */}
      <div
        className="bg-[#080808] w-full pt-32 pb-16"
        style={{ paddingLeft: "5vw", paddingRight: "5vw" }}
      >
        {/* ── ROW 1: Brand + Columns ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-16 pb-24 border-b border-white/6"
          style={{ columnGap: "3vw" }}
        >
          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-10 min-w-0 overflow-hidden">
            {/* Gold mark */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                background:
                  "radial-gradient(circle at 38% 30%, #f9e07a, #d4961f 55%, #8b5e10)",
              }}
            >
              <span className="text-[9px] font-black tracking-wide leading-tight text-white text-center">
                GOTT
                <br />
                WALD
              </span>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col gap-1">
              <p
                className="font-bold tracking-[-0.025em] leading-[0.88] text-white"
                style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.6rem)" }}
              >
                GOTT
                <br />
                WALD
                <br />
                HOLDING LLC
              </p>
            </div>

            {/* Tagline */}
            <p className="text-[12px] leading-[1.9] text-white/35 max-w-[240px]">
              Georgia's strategic anchor for governance, standards-led
              execution, and industrial portfolio scaling.
            </p>

            {/* Portals */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 font-medium">
                Ecosystem Portals
              </span>
              <p className="text-[12px] text-white/45 tracking-wide font-light">
                gottwald.world · plhh.world · yig.care
              </p>
            </div>

            {/* Signal */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 font-medium">
                Public Signal
              </span>
              <p className="text-[12px] text-white/45 font-light">
                YouTube: @GOTT_WALD
              </p>
            </div>
          </div>

          {/* ── Directory ── */}
          <div className="flex flex-col gap-7">
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 font-medium">
              Directory
            </span>
            <nav className="flex flex-col gap-4">
              {directoryLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-200 tracking-wide uppercase"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Protocols ── */}
          <div className="flex flex-col gap-7">
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 font-medium">
              Protocols
            </span>
            <ul className="flex flex-col gap-4">
              {protocols.map((p) => (
                <li
                  key={p}
                  className="text-[13px] text-white/45 leading-relaxed font-light"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Systems ── */}
          <div className="flex flex-col gap-7">
            <span className="text-[8px] tracking-[0.4em] uppercase text-white/20 font-medium">
              Systems
            </span>
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] tracking-[0.3em] uppercase text-white/25 font-semibold">
                  Registration ID (GE)
                </p>
                <p className="text-[13px] text-white/55 font-mono">400415421</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[8px] tracking-[0.3em] uppercase text-white/25 font-semibold">
                  Build Version
                </p>
                <p className="text-[12px] text-white/55 font-mono">
                  GOTTWALD_INFRA_1.0
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[8px] tracking-[0.3em] uppercase text-white/25 font-semibold">
                  Network Signature
                </p>
                <p className="text-[28px] text-white/75 font-light leading-none">
                  888±
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Bottom bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-8">
            <p className="text-[10px] text-white/25 tracking-[0.06em]">
              © 2026 GOTTWALD HOLDING LLC.
            </p>
            <p className="text-[10px] text-white/15 tracking-wide font-light">
              Security-led operations · Confidential by default.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-[10px] tracking-[0.18em] text-white/25 hover:text-white/60 transition-colors uppercase font-medium"
            >
              Privacy
            </Link>
            <span className="text-white/10">·</span>
            <Link
              href="#"
              className="text-[10px] tracking-[0.18em] text-white/25 hover:text-white/60 transition-colors uppercase font-medium"
            >
              Governance & Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
