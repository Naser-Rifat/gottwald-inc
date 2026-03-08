"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    title: "OUR WORK",
    href: "/work",
    motto: "SEE OUR LATEST PROJECTS.",
  },
  {
    title: "ABOUT US",
    href: "/about",
    motto: "LEARN ABOUT OUR VISION.",
  },
  {
    title: "ENTITIES",
    href: "/entities",
    motto: "FROM FINTECH TO HEALTHCARE — EXPLORING OUR REACH.",
  },
  {
    title: "CONTACT US",
    href: "/contact",
    motto: "LET'S BUILD SOMETHING TOGETHER.",
  },
  {
    title: "CAREERS",
    href: "/careers",
    motto: "JOIN OUR AWARD-WINNING TEAM.",
  },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuListRef = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialize GSAP timeline (paused)
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });

      // 1. Overlay background fades in
      tl.current.to(overlayRef.current, {
        autoAlpha: 1, // handles visibility and opacity
        duration: 0.6,
        ease: "power3.inOut",
      });

      // 2. Staggered reveal of menu items (sliding up)
      if (menuListRef.current) {
        const items = menuListRef.current.querySelectorAll(".menu-item-text");
        tl.current.fromTo(
          items,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.2", // overlap slightly with background fade
        );
      }

      // 3. Header/Footer fade in
      tl.current.fromTo(
        ".menu-fade-in",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.6",
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.classList.add("no-scroll"); // Prevent background scrolling
    } else {
      tl.current?.reverse();
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);

  // Handle z-indexing and pointer events based on isOpen state natively via Tailwind
  // but let GSAP manage visibility
  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 bg-[#060606] z-[100] flex flex-col justify-between px-[5vw] py-[6vh] invisible opacity-0 text-white`}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* ── Header Area ── */}
      <div className="flex justify-between items-center menu-fade-in">
        {/* 'G' Logo Circle */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 transition-colors"
        >
          <span className="text-[10px] font-bold tracking-widest mt-[1px]">
            G
          </span>
        </button>

        {/* CLOSE Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-[10px] uppercase font-medium tracking-[0.2em] hover:text-white/70 transition-colors"
        >
          <span>CLOSE</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Main Menu List ── */}
      <div className="flex-grow flex items-center mt-[4vh]">
        <ul ref={menuListRef} className="flex flex-col gap-[3vh] w-full">
          {MENU_ITEMS.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <li
                key={item.title}
                className="relative group w-full flex items-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block relative overflow-hidden"
                >
                  <span
                    className={`menu-item-text block text-[7vw] leading-[0.85] font-extrabold uppercase tracking-tight transition-all duration-500 ease-out
                      ${isOtherHovered ? "text-white/20" : "text-white"}
                      ${isHovered ? "text-white/60" : ""}
                    `}
                  >
                    {item.title}
                  </span>
                </Link>

                {/* Motto (Revealed on hover) */}
                <div
                  className={`absolute left-[50vw] transition-all duration-500 ease-out flex items-center gap-4
                    ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}
                  `}
                >
                  <span className="text-[10px] font-medium tracking-[0.2em] text-[#d4af37] uppercase">
                    {item.motto}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Footer Area ── */}
      <div className="flex justify-between items-end menu-fade-in text-[9px] uppercase tracking-[0.2em] text-white/40">
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            TWITTER
          </a>
          <a href="#" className="hover:text-white transition-colors">
            LINKEDIN
          </a>
          <a href="#" className="hover:text-white transition-colors">
            INSTAGRAM
          </a>
        </div>
        <div className="text-right">
          GOTTWALD PRO STANDARD — ARCHITECTURE 2026
        </div>
      </div>
    </div>
  );
}
