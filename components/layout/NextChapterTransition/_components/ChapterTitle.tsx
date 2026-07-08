"use client";

import type { Ref } from "react";

interface ChapterTitleProps {
  title: string;
  /** Ref consumed by useChapterScrollCharge to imperatively scale/fade. */
  ref?: Ref<HTMLHeadingElement>;
}

/**
 * Title arrives pre-translated from the parent (e.g. tNav("about") →
 * "ABOUT US" / "ÜBER UNS"). `translate="no"` prevents Google Translate
 * from re-translating it on top.
 */
export default function ChapterTitle({ title, ref }: ChapterTitleProps) {
  return (
    <h2
      ref={ref}
      translate="no"
      className="notranslate leading-[0.92] uppercase text-center will-change-transform whitespace-nowrap text-white/88"
      style={{
        fontFamily: "var(--font-serif), Georgia, serif",
        fontSize: "clamp(3rem, 10vw, 11rem)",
        fontWeight: 400,
        letterSpacing: "-0.04em",
        opacity: 0.3,
      }}
    >
      {title}
    </h2>
  );
}
