"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    title: "OUR WORK",
    href: "/our-work",
    motto: "Case-level execution. Systems delivered—never promised.",
  },
  {
    title: "ABOUT US",
    href: "/about",
    motto: "The Central Node behind the system. Tbilisi HQ.",
  },
  {
    title: "PARTNERSHIPS",
    href: "/partnership",
    motto: "Values-first selection. Confidential by default.",
  },
  {
    title: "CAREERS",
    href: "/careers",
    motto: "Join the standard. Character + capability.",
  },
  {
    title: "CONTACT US",
    href: "/contact",
    motto: "Strategic inquiry (confidential). Start the dialogue.",
  },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuListRef = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = (onComplete?: () => void) => {
    if (!isOpen || closingRef.current) return;
    closingRef.current = true;

    // Kill everything instantly — no reverse animation
    document.body.classList.remove("no-scroll");

    if (tl.current) {
      tl.current.kill();
      tl.current = null;
    }

    // Kill any orphan hover tweens
    if (menuListRef.current) {
      const els = menuListRef.current.querySelectorAll(
        "li.group, .menu-item-text-group, .menu-motto",
      );
      els.forEach((el) => gsap.killTweensOf(el));
    }

    // Instantly hide overlay
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
    }

    closingRef.current = false;
    onClose();
    if (onComplete) onComplete();
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault(); // Stop instant navigation!

    if (pathname === href) {
      closeMenu();
      return;
    }

    // Pass the router.push into the GSAP completion callback
    closeMenu(() => {
      router.push(href);
    });
  };

  // ── Build the GSAP open-animation timeline (reusable after kill) ──
  const buildTimeline = () => {
    if (!overlayRef.current || !menuListRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(overlayRef.current, {
      autoAlpha: 1,
      duration: 0.35,
      ease: "power3.inOut",
    });

    tl.current.fromTo(
      ".menu-fade-in",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.2",
    );

    if (menuListRef.current) {
      const items = menuListRef.current.querySelectorAll(".menu-item-text");
      tl.current.fromTo(
        items,
        { yPercent: 120, rotationZ: 3, opacity: 0 },
        {
          yPercent: 0,
          rotationZ: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "expo.out",
        },
        "-=0.3",
      );
    }
  };

  useEffect(() => {
    if (!mounted || !overlayRef.current || !menuListRef.current) return;

    const ctx = gsap.context(() => {
      buildTimeline();
    }, overlayRef);

    // Setup Native GSAP Hover Interactions
    const listItems = menuListRef.current?.querySelectorAll("li.group");
    if (listItems) {
      listItems.forEach((item) => {
        const textGroup = item.querySelector(".menu-item-text-group");
        const motto = item.querySelector(".menu-motto");

        item.addEventListener("mouseenter", () => {
          gsap.to(
            Array.from(listItems).filter((el) => el !== item),
            { opacity: 0.2, duration: 0.3, ease: "power2.out" },
          );
          gsap.to(textGroup, {
            x: 20,
            color: "rgba(255, 255, 255, 0.6)",
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(motto, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "back.out(1.5)",
            delay: 0.1,
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(listItems, { opacity: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(textGroup, {
            x: 0,
            color: "rgba(255, 255, 255, 1)",
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(motto, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            ease: "power2.in",
          });
        });
      });
    }

    return () => ctx.revert();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      closingRef.current = false;
      // Rebuild timeline if it was killed on previous close
      if (!tl.current) buildTimeline();
      if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";
      tl.current?.timeScale(1).play(0);
      document.body.classList.add("no-scroll");
    }
  }, [isOpen, mounted]);

  const overlayContent = (
    <div
      ref={overlayRef}
      className={`fixed inset-0 bg-[#060606] z-9999 flex flex-col justify-between p-gutter invisible opacity-0 text-white`}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* ── Header Area ── */}
      <div className="flex justify-between items-center menu-fade-in flex-none">
        {/* 'G' Logo Circle */}
        <button
          onClick={() => closeMenu()}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
        >
          <span className="text-[10px] font-bold tracking-widest mt-[1px]">
            G
          </span>
        </button>

        {/* CLOSE Button */}
        <button
          onClick={() => closeMenu()}
          className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors"
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
      {/* 
        Using flex-1 min-h-0 so the middle section can scroll if needed on very small devices, 
        preventing header/footer overlap issues. 
      */}
      <div className="flex-1 min-h-0 flex items-center justify-start overflow-y-auto overflow-x-hidden my-[4vh] lg:my-0">
        <ul
          ref={menuListRef}
          className="flex flex-col gap-[1vh] lg:gap-[2vh] w-full"
        >
          {MENU_ITEMS.map((item) => (
            <li
              key={item.title}
              className="group w-full flex flex-col lg:flex-row lg:items-center relative"
            >
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="block relative z-10 w-max"
              >
                <div className="menu-item-text-group will-change-transform">
                  {/* Overflow hidden mask now inside the group so hover x: 20 moves the mask too. 
                      Added generous padding and negative margins to prevent tracking-tighter and tight leading text from clipping on any edge. */}
                  <div className="overflow-hidden pt-4 pb-8 pr-12 pl-2 -mt-4 -mb-8 -mr-12 -ml-2">
                    <span className="menu-item-text block text-[clamp(2.5rem,7vw,8rem)] leading-[0.85] font-black uppercase tracking-tighter will-change-transform origin-left text-white">
                      {item.title}
                    </span>
                  </div>
                </div>
              </a>

              {/* Motto (Hidden by default, Revealed via GSAP hover) */}
              <div className="menu-motto opacity-0 -translate-x-5 pointer-events-none lg:absolute lg:left-[55vw] lg:top-1/2 lg:-translate-y-1/2 mt-2 mb-6 lg:mb-0 lg:mt-0 flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 pl-2 lg:pl-0 relative z-0">
                <span className="w-8 h-px bg-gold hidden lg:block" />
                <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-gold uppercase whitespace-normal leading-normal max-w-[85vw] lg:max-w-md mt-1 lg:mt-0 drop-shadow-md">
                  {item.motto}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer Area ── */}
      <div className="flex justify-between items-end menu-fade-in flex-none text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-white/40">
        <div className="flex gap-6 lg:gap-8 flex-col sm:flex-row">
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
        <div className="hidden sm:block text-right tracking-[0.3em]">
          GOTT WALD PRO STANDARD — ARCHITECTURE 2026
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(overlayContent, document.body);
}
