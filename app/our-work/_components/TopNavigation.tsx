"use client";

import Link from "next/link";
import Image from "next/image";
import AudioToggle from "@/components/AudioToggle";
import MenuOverlay from "@/components/MenuOverlay";
import logo from "@/public/logo.png";
import { useState } from "react";

interface TopNavigationProps {
  items: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onReset: () => void;
}

export default function TopNavigation({
  items,
  activeIndex,
  onSelect,
  onReset,
}: TopNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 w-full max-w-[1600px] mx-auto z-50 px-6 md:px-8 py-5 pointer-events-auto flex items-center justify-between"
        onMouseEnter={onReset}
      >
        {/* ── Brand Logo ── */}
        <Link href="/" className="inline-flex items-center gap-3 group flex-shrink-0">
          <Image
            src={logo}
            alt="Gott Wald"
            width={34}
            height={34}
            className="rounded-full"
            priority
            suppressHydrationWarning
          />
          <span className="text-[13px] font-bold tracking-[0.15em] uppercase text-white leading-none hidden sm:block">
            GOTT WALD
          </span>
        </Link>

        {/* ── Center Slide Navigation Pills ── */}
        <div className="hidden lg:flex flex-1 items-center gap-3 xl:gap-5 cursor-pointer justify-center px-4 overflow-hidden mask-image-[linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
          <div className="flex items-center gap-3 xl:gap-5 flex-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-x-auto max-w-full">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`transition-all duration-300 uppercase text-[10px] xl:text-[11px] tracking-[0.15em] whitespace-nowrap flex-shrink-0 ${
                  activeIndex === idx
                    ? "text-white font-medium opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "text-white/35 font-light hover:text-white/70"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <AudioToggle />

          {/* Menu pill */}
          <button
            onClick={() => setMenuOpen(true)}
            translate="no"
            className="notranslate h-10 sm:h-[42px] px-4 sm:px-5 rounded-full flex items-center gap-2 sm:gap-2.5 uppercase text-xs sm:text-sm font-medium
                       tracking-[0.02em] transition-colors
                       bg-white/10 text-white hover:bg-white/15"
          >
            <span>Menu</span>
            <span className="flex items-center gap-[3px]">
              <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-white/60" />
              <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-white/60" />
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen Menu Overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
