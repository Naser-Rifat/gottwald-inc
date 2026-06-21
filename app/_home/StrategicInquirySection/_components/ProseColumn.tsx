"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Ref } from "react";
import type { MagneticHandlers } from "../_hooks/useMagneticPull";

interface ProseColumnProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  ctaRef: Ref<HTMLAnchorElement>;
  ctaHandlers: MagneticHandlers;
}

export default function ProseColumn({
  expanded,
  onToggleExpanded,
  ctaRef,
  ctaHandlers,
}: ProseColumnProps) {
  const t = useTranslations("home.strategicInquiry");

  return (
    <div className="strategic-reveal lg:col-span-5 lg:pt-4 flex flex-col gap-8 opacity-0">
      <p className="text-[clamp(1.7rem,2.6vw,3rem)] font-light leading-[1.18] tracking-[-0.018em] text-white max-w-[22ch]">
        We are currently selecting a limited number of values-aligned partners
        for our{" "}
        <strong className="font-semibold text-white">
          2030 infrastructure cycles.
        </strong>
      </p>

      <button
        type="button"
        onClick={onToggleExpanded}
        className="group flex items-center gap-3 self-start text-[10px] tracking-[0.25em] uppercase font-medium text-white/50 hover:text-white transition-colors duration-300 focus:outline-none mt-2"
      >
        <span className="w-6 h-[1px] bg-white/30 group-hover:bg-white/80 transition-colors" />
        <span>{expanded ? "SHOW LESS" : "DISCOVER MORE"}</span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-6 pt-1">
            <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
              This channel is reserved for principals and operators who build
              resilient systems—and who treat trust, discipline, and delivery
              as non-negotiable.
            </p>
            <p className="text-[clamp(1rem,1.15vw,1.2rem)] font-light leading-[1.7] text-white/72 max-w-[56ch]">
              We operate{" "}
              <span className="text-white/95">discreet by default</span> and{" "}
              <span className="text-white/95">standards-led by design</span>:
              a governance-first framework, engineered for execution, built to
              compound performance over time.
            </p>
            <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/65 max-w-[58ch]">
              No noise. No public theatrics. Clean interfaces, controlled
              access, measurable outcomes.
            </p>
            <p className="text-[clamp(0.95rem,1.05vw,1.1rem)] font-light leading-[1.7] text-white/80 max-w-[58ch]">
              If your work demands precision, confidentiality, and long-horizon
              thinking—this is the entry point.
            </p>
          </div>
        </div>
      </div>

      <div {...ctaHandlers} className="inline-block self-start mt-6 lg:mt-10">
        <Link
          ref={ctaRef}
          href="/partnerships#apply"
          translate="no"
          className="group inline-flex items-center gap-6 text-white hover:text-gold transition-colors duration-500 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold/60 focus-visible:outline-offset-6"
        >
          <span className="font-light uppercase tracking-[0.18em] text-[clamp(1.05rem,1.2vw,1.3rem)]">
            {t("requestCall")}
          </span>
          <span className="relative inline-block w-24 h-px bg-silver/45 overflow-visible">
            <span className="absolute inset-y-0 left-0 w-4 bg-gold transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
          </span>
          <span className="text-current text-base group-hover:translate-x-1.5 transition-transform duration-300">
            →
          </span>
        </Link>
      </div>

      <p
        className="text-silver/55 leading-[1.5] -mt-3"
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
        }}
      >
        Confidential inquiry. Values-first selection.
      </p>
    </div>
  );
}
