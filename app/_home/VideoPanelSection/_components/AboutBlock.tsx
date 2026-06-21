"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Ref } from "react";

interface AboutBlockProps {
  /** Animated by useScrollFadeIn — fade-up from y:50. */
  descRef?: Ref<HTMLParagraphElement>;
  /** Animated by useScrollFadeIn — scale-in with back.out easing. */
  ctaRef?: Ref<HTMLDivElement>;
}

export default function AboutBlock({ descRef, ctaRef }: AboutBlockProps) {
  const t = useTranslations("home.videoPanel");

  return (
    <div className="relative z-10 flex flex-col items-start md:items-end pb-[8vh] md:pb-[10vh]">
      <p
        ref={descRef}
        className="w-full sm:w-[70%] md:w-[55%] xl:w-[40%] mb-8 text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-sans opacity-0 text-white/75 border-l-2 border-silver/35 pl-5"
      >
        GOTT WALD is not a collection of services. It is a unified
        architecture: modular components, one standard, one language of
        delivery—built to turn complexity into clarity, clarity into
        decisions, and decisions into measurable impact.
      </p>
      <div
        ref={ctaRef}
        className="w-full sm:w-[70%] md:w-[55%] xl:w-[40%] mb-8 leading-relaxed text-white/50 font-sans opacity-0"
      >
        <Link
          href="/about"
          translate="no"
          className="notranslate h-11 w-fit rounded-full flex items-center gap-2.5 uppercase text-sm font-medium tracking-[0.02em] transition-all duration-300 mt-4 px-5.5 bg-turquoise/10 border border-turquoise/35 text-turquoise/95 hover:bg-turquoise/20 hover:border-turquoise/60"
        >
          <span>{t("aboutCta")}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-turquoise" />
        </Link>
      </div>
    </div>
  );
}
