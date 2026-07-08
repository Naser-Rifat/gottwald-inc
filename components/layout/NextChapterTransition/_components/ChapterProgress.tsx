"use client";

import type { Ref } from "react";
import { useTranslations } from "next-intl";

interface ChapterProgressProps {
  accentColor: string;
  /** Refs are mutated imperatively by useChapterScrollCharge. */
  barRef?: Ref<HTMLDivElement>;
  pctRef?: Ref<HTMLSpanElement>;
}

export default function ChapterProgress({
  accentColor,
  barRef,
  pctRef,
}: ChapterProgressProps) {
  const t = useTranslations("common");

  return (
    <div className="absolute bottom-[10vh] flex flex-col items-center gap-3 w-52 sm:w-64">
      <div className="flex justify-between w-full items-center text-[9px] uppercase tracking-[0.34em] font-semibold text-white/72 mb-1">
        <span>{t("nextPage")}</span>
        <span className="text-white/72">→</span>
      </div>
      <div className="w-full h-px bg-white/14 relative origin-left">
        <div
          ref={barRef}
          className="absolute top-0 left-0 w-full h-full origin-left will-change-transform"
          style={{ transform: "scaleX(0)", backgroundColor: accentColor }}
        />
      </div>
      <span
        ref={pctRef}
        className="text-[10px] font-mono text-white/70 tracking-[0.18em] tabular-nums"
      >
        0%
      </span>
    </div>
  );
}
