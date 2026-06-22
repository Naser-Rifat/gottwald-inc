"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import logo from "@/public/logo.png";
import AudioToggle from "@/components/system/AudioToggle";
import GoogleTranslate from "@/components/system/GoogleTranslate";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("header");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`flex items-center justify-between w-full max-w-[1600px] mx-auto transition-all duration-500 ${
        scrolled ? "pt-5 pb-5" : "pt-12 pb-4"
      }`}>
        {/* ── Brand ── */}
        <Link href="/" className="inline-flex items-center gap-4 group">
          <Image
            src={logo}
            alt="Gott Wald"
            width={38}
            height={38}
            className="rounded-full"
            priority
            suppressHydrationWarning
          />
          <span className="text-lg font-bold tracking-[0.06em] uppercase text-white leading-none hidden sm:block">
            GOTT WALD
          </span>
        </Link>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Toggle — animated equalizer */}
          <AudioToggle />

          {/* Language picker — Google Translate */}
          <GoogleTranslate />
          <Link
            href="/partnerships#apply"
            translate="no"
            className="notranslate hidden lg:flex h-[46px] rounded-full items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-all duration-300 px-5
                       border border-turquoise/35 text-turquoise bg-turquoise/5 hover:border-turquoise/70 hover:bg-turquoise/12 hover:text-white"
          >
            <span>{t("apply")}</span>
            <span className="text-xs">→</span>
          </Link>

          {/* LET'S TALK pill */}
          <Link
            href="/contact"
            translate="no"
            className="notranslate hidden md:flex h-[46px] rounded-full items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors px-5
                       bg-white/8 text-white hover:bg-white/15 hover:shadow-[0_0_12px_rgba(18,168,172,0.3)]"
          >
            <span>{t("letsTalk")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-turquoise shadow-[0_0_8px_rgba(18,168,172,0.6)] animate-pulse" />
          </Link>

          {/* MENU pill */}
          <button
            onClick={() => setMenuOpen(true)}
            translate="no"
            className="notranslate h-10 sm:h-[46px] px-4 sm:px-5 rounded-full flex items-center gap-2 sm:gap-2.5 uppercase text-xs sm:text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/10 text-white hover:bg-white/15"
          >
            <span>{t("menu")}</span>
            <span className="flex items-center gap-[3px]">
              <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-white/60" />
              <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-white/60" />
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
