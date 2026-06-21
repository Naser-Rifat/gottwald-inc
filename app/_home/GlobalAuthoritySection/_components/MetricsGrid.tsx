"use client";

import type { Ref } from "react";
import {
  authorityMetrics,
  type AuthorityMetric,
  type MetricVariant,
} from "../_data/metrics";

interface MetricsGridProps {
  /** Wrapper ref consumed by useEntranceReveal for child stagger. */
  ref?: Ref<HTMLDivElement>;
}

interface VariantTheme {
  label: string;
  value: string;
  suffix: string;
  unit: string;
}

const VARIANT_THEMES: Record<MetricVariant, VariantTheme> = {
  white: {
    label: "text-white/50",
    value: "text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]",
    suffix: "text-white/60",
    unit: "text-white/40",
  },
  turquoise: {
    label: "text-turquoise/70",
    value: "text-turquoise drop-shadow-[0_4px_16px_rgba(18,168,172,0.3)]",
    suffix: "text-turquoise/60",
    unit: "text-turquoise/50",
  },
  copper: {
    label: "text-[#c07840]/80",
    value: "text-[#c07840] drop-shadow-[0_4px_16px_rgba(192,120,64,0.4)]",
    suffix: "text-[#c07840]/60",
    unit: "text-[#c07840]/50",
  },
  silver: {
    label: "text-silver/70",
    value: "text-silver drop-shadow-[0_4px_16px_rgba(184,192,204,0.3)]",
    suffix: "text-silver/60",
    unit: "text-silver/50",
  },
};

function MetricColumn({ metric }: { metric: AuthorityMetric }) {
  const theme = VARIANT_THEMES[metric.variant];

  return (
    <div className="flex flex-col gap-3">
      <span
        className={`uppercase text-[10px] tracking-[0.3em] font-bold drop-shadow-md ${theme.label}`}
      >
        {metric.label}
      </span>
      <span
        className={`text-5xl lg:text-[5rem] font-medium tracking-tight leading-none flex items-baseline gap-2 ${theme.value}`}
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {metric.value}
        {metric.suffix && (
          <span
            className={`text-3xl lg:text-4xl -ml-2 -mt-6 font-sans ${theme.suffix}`}
          >
            {metric.suffix}
          </span>
        )}
        <span
          className={`text-[10px] tracking-[0.2em] uppercase font-bold relative -top-4 ${metric.suffix ? "ml-1 " : ""}font-sans ${theme.unit}`}
        >
          {metric.unit}
        </span>
      </span>
    </div>
  );
}

/**
 * Bottom metrics grid (4 columns: Coverage / Partners / Network / Language)
 * plus the mobile-only fallback list of the HUD node names — the desktop
 * HUD is positioned on the map, so on mobile we surface those names here.
 */
export default function MetricsGrid({ ref }: MetricsGridProps) {
  return (
    <div
      ref={ref}
      className="order-1 lg:order-2 flex flex-col gap-8 w-full lg:max-w-[900px] xl:max-w-[1100px] relative z-20 pt-16 pb-8 lg:pb-0"
    >
      <div className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/90 via-black/30 to-transparent blur-2xl -z-10 pointer-events-none" />

      {/* Mobile-only fallback for the map HUD nodes */}
      <div className="md:hidden flex flex-col gap-8 pb-8 border-b border-white/10">
        <div className="flex flex-col gap-1 border-l-2 border-turquoise pl-4">
          <p className="text-turquoise font-bold tracking-[0.3em] uppercase text-[9px]">
            01 — HEAD OFFICE
          </p>
          <p className="text-white font-mono uppercase tracking-[0.14em] text-base">
            Tbilisi, Georgia
          </p>
        </div>
        <div className="flex flex-col gap-1 border-l-2 border-turquoise/60 pl-4">
          <p className="text-white font-bold tracking-[0.3em] uppercase text-[9px] drop-shadow-sm">
            02 — STRATEGIC HUBS
          </p>
          <p className="text-turquoise text-xl font-bold tracking-wide drop-shadow-[0_0_8px_rgba(18,168,172,0.3)]">
            DACH Region
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-sm w-full">
        {authorityMetrics.map((metric) => (
          <MetricColumn key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}
