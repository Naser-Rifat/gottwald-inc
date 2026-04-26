"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import logo from "@/public/logo.png";
import AudioToggle from "./AudioToggle";
import GoogleTranslate from "./GoogleTranslate";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("header");

  return (
    <>
      <header className="flex items-center justify-between w-full pt-12 pb-4">
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
        <div className="flex items-center gap-3">
          {/* Audio Toggle — animated equalizer */}
          <AudioToggle />

          {/* Language picker — Google Translate */}
          <GoogleTranslate />
          <Link
            href="/partnerships#apply"
            translate="no"
            className="notranslate hidden sm:flex h-[46px] rounded-full items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-all duration-300
                       border border-gold/40 text-gold hover:border-[#0a9396] hover:text-[#0a9396]"
            style={{ padding: "0 20px 0 22px" }}
          >
            <span>{t("apply")}</span>
            <span className="text-xs">→</span>
          </Link>

          {/* LET'S TALK pill */}
          <Link
            href="/contact"
            translate="no"
            className="notranslate h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/8 text-white hover:bg-white/15 hover:shadow-[0_0_12px_rgba(10,147,150,0.3)]"
            style={{ padding: "0 18px 0 22px" }}
          >
            <span>{t("letsTalk")}</span>
            <span className="w-[6px] h-[6px] rounded-full bg-[#0a9396] shadow-[0_0_8px_rgba(10,147,150,0.6)] animate-pulse" />
          </Link>

          {/* MENU pill */}
          <button
            onClick={() => setMenuOpen(true)}
            translate="no"
            className="notranslate h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/10 text-white hover:bg-white/15"
            style={{ padding: "0 18px 0 22px" }}
          >
            <span>{t("menu")}</span>
            <span className="flex items-center gap-[3px]">
              <span className="w-[5px] h-[5px] rounded-full bg-white/60" />
              <span className="w-[5px] h-[5px] rounded-full bg-white/60" />
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
