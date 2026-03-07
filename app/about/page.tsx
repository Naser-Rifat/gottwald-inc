import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Gottwald Holding LLC",
  description:
    "Georgia's strategic anchor for governance, standards-led execution, and industrial portfolio scaling.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#0d0d0d] font-sans overflow-x-hidden">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-[5vw] py-6 flex justify-between items-center mix-blend-multiply">
        <Link
          href="/"
          className="text-[11px] tracking-[0.25em] uppercase font-medium text-black/50 hover:text-black transition-colors flex items-center gap-2"
        >
          ← <span>Home</span>
        </Link>
        <span className="text-[11px] tracking-[0.2em] uppercase text-black/30 font-medium">
          Gottwald Holding LLC
        </span>
      </header>

      {/* ── Hero Block ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-end px-[5vw] pb-[12vh] pt-32">
        <div className="max-w-[900px]">
          <p className="text-[9px] tracking-[0.45em] uppercase text-black/30 mb-8 font-medium">
            02 — About the Entity
          </p>
          <h1
            className="font-bold tracking-[-0.04em] leading-[0.88] text-[#0d0d0d]"
            style={{ fontSize: "clamp(4rem, 11vw, 12rem)" }}
          >
            GOTT
            <br />
            WALD.
          </h1>
        </div>

        {/* Aside tagline */}
        <p className="absolute bottom-[12vh] right-[5vw] max-w-[280px] text-right text-[13px] leading-[1.8] text-black/40 hidden lg:block">
          Georgia's strategic anchor for governance, standards-led execution,
          and industrial portfolio scaling.
        </p>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-[1px] bg-black/8 mx-auto" />

      {/* ── Identity Section ── */}
      <section className="px-[5vw] py-[15vh] grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="text-[9px] tracking-[0.4em] uppercase text-black/30 mb-4 font-medium">
            Operating Identity
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-5 flex flex-col gap-8">
          <h2 className="text-[clamp(1.6rem,3vw,2.8rem)] font-bold tracking-tight leading-[1.1]">
            Not loud. Effective.
            <br />
            Precision-first by design.
          </h2>
          <p className="text-[15px] leading-[1.9] text-black/55 max-w-[540px] font-light">
            Gottwald Holding LLC operates as a multi-sector strategic holding
            anchored in Tbilisi, Georgia — deploying standards-led governance,
            value-driven partnership, and long-horizon industrial execution
            across 26+ countries.
          </p>
          <p className="text-[13px] leading-[2] text-black/35 max-w-[480px] font-light italic">
            "Responsibility is not a burden, but a propellant."
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-[1px] bg-black/8" />

      {/* ── Protocols ── */}
      <section className="px-[5vw] py-[15vh] grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="text-[9px] tracking-[0.4em] uppercase text-black/30 mb-4 font-medium">
            Operating Protocols
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-5">
          <ul className="flex flex-col divide-y divide-black/8">
            {[
              "Confidential by default",
              "Values-first selection",
              "Standards-led governance",
              "Execution over exposure",
            ].map((item) => (
              <li
                key={item}
                className="py-5 text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium tracking-tight text-black/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-[1px] bg-black/8" />

      {/* ── Systems ── */}
      <section className="px-[5vw] py-[12vh] flex flex-wrap gap-x-[8vw] gap-y-12">
        {[
          { label: "Registration ID (GE)", value: "400415421", mono: true },
          { label: "Build Version", value: "GOTTWALD_INFRA_1.0", mono: true },
          {
            label: "Network Signature",
            value: "888±",
            mono: false,
            large: true,
          },
          {
            label: "Ecosystem Portals",
            value: "gottwald.world · plhh.world · yig.care",
            mono: false,
          },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-2 min-w-[180px]">
            <span className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-medium">
              {item.label}
            </span>
            <span
              className={`${item.mono ? "font-mono" : "font-light"} text-black/70 ${item.large ? "text-[2.5rem] leading-none" : "text-[15px]"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* ── Bottom back link ── */}
      <div className="px-[5vw] pb-20 border-t border-black/8 pt-10 flex justify-between items-center">
        <p className="text-[11px] text-black/25 tracking-wide">
          © 2026 GOTTWALD HOLDING LLC.
        </p>
        <Link
          href="/"
          className="text-[11px] tracking-[0.25em] uppercase text-black/40 hover:text-black transition-colors font-medium flex items-center gap-2"
        >
          ← Back to main
        </Link>
      </div>
    </main>
  );
}
