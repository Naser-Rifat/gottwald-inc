"use client";

import { useState } from "react";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {/* Apply Now — gold accent pill */}
          <Link
            href="/partnership#apply"
            className="hidden sm:flex h-[46px] rounded-full items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-all duration-300
                       border border-gold/40 text-gold hover:bg-gold hover:text-black"
            style={{ padding: "0 20px 0 22px" }}
          >
            <span>Apply</span>
            <span className="text-xs">→</span>
          </Link>

          {/* LET'S TALK pill */}
          <Link
            href="/contact"
            className="h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/8 text-white hover:bg-white/15"
            style={{ padding: "0 18px 0 22px" }}
          >
            <span>Let&apos;s Talk</span>
            <span className="w-[6px] h-[6px] rounded-full bg-green-400" />
          </Link>

          {/* MENU pill */}
          <button
            onClick={() => setMenuOpen(true)}
            className="h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/10 text-white hover:bg-white/15"
            style={{ padding: "0 18px 0 22px" }}
          >
            <span>Menu</span>
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
