"use client";

import { useState } from "react";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between w-full pt-12 pb-4">
        {/* ── Brand ── */}
        <Link href="/" className="inline-block group">
          <span className="text-[22px] font-bold tracking-[0.04em] uppercase text-white leading-none">
            LUSION
          </span>
        </Link>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">
          {/* Dash / Minimize button */}
          <button
            className="w-[46px] h-[46px] rounded-full border border-white/20 flex items-center justify-center
                       hover:border-white/40 transition-colors"
            aria-label="Minimize"
          >
            <span className="block w-[18px] h-[2px] bg-white/70" />
          </button>

          {/* LET'S TALK pill */}
          <button
            className="h-[46px] rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-[#2b2e3a] text-white hover:bg-[#3a3e4e]"
            style={{ padding: "0 18px 0 22px" }}
          >
            <span>Let&apos;s Talk</span>
            <span className="w-[6px] h-[6px] rounded-full bg-green-400" />
          </button>

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
