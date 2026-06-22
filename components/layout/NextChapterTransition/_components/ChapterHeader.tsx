"use client";

import { useTranslations } from "next-intl";

interface ChapterHeaderProps {
  narrativeLine?: string;
  accentColor: string;
}

export default function ChapterHeader({
  narrativeLine,
  accentColor,
}: ChapterHeaderProps) {
  const t = useTranslations("common");

  return (
    <div className="absolute top-[20vh] text-center w-full flex flex-col items-center gap-4">
      {narrativeLine && (
        <p
          className="text-[11px] tracking-[0.4em] uppercase font-light max-w-xs mx-auto leading-relaxed"
          style={{ color: accentColor + "70" }}
        >
          {narrativeLine}
        </p>
      )}
      <span
        translate="no"
        className="notranslate text-[10px] tracking-[0.5em] uppercase font-semibold"
        style={{ color: accentColor + "cc" }}
      >
        {t("nextChapter")}
      </span>
    </div>
  );
}
