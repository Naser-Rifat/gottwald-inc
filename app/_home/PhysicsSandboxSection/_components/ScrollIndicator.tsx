"use client";

import type { Ref } from "react";
import { useTranslations } from "next-intl";
import type { MagneticHandlers } from "../_hooks/useMagneticPull";

interface ScrollIndicatorProps {
  /** Ref consumed by useHeroEntrance (entrance fade-up) and useMagneticPull. */
  ref?: Ref<HTMLDivElement>;
  handlers: MagneticHandlers;
}

const scrollToFirstFold = () => {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
};

export default function ScrollIndicator({ ref, handlers }: ScrollIndicatorProps) {
  const tCommon = useTranslations("common");

  return (
    <div
      ref={ref}
      translate="no"
      className="notranslate hero-scroll group flex items-center gap-3 cursor-pointer lg:mt-8 opacity-0"
      style={{ willChange: "transform" }}
      onClick={scrollToFirstFold}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-white/80 group-hover:text-white transition-colors"
      >
        <path
          d="M5 5L19 19M19 19V5M19 19H5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/80 group-hover:text-white transition-colors pb-px">
        {tCommon("scrollDown")}
      </span>
    </div>
  );
}
