"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NextChapterProps {
  nextTitle: string;
  nextHref: string;
  prevHref?: string;
}

/**
 * NextChapterTransition
 *
 * Uses CSS `position: sticky` for pinning instead of GSAP `pin: true`.
 * This avoids the `.pin-spacer` DOM wrapper injection that causes
 * React's "Failed to execute removeChild on Node" crash during
 * client-side route transitions.
 *
 * Architecture:
 *   <div class="wrapper" style="height: 250vh">   ← scrollable runway
 *     <section class="sticky top-0 h-screen">     ← visually pinned
 *       ...content...
 *     </section>
 *   </div>
 *
 * ScrollTrigger reads scroll progress on the wrapper (no DOM mutation).
 */
export default function NextChapterTransition({
  nextTitle,
  nextHref,
  prevHref,
}: NextChapterProps) {
  const t = useTranslations("common");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  // Disable transition if any link is clicked on the page
  // This prevents the DOM collapse unmount from triggering a false scroll completion
  // when navigating via Header or Footer links.
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) {
        hasNavigatedRef.current = true;
      }
    };
    // Use capture phase to ensure we catch it before any default behavior or unmounts
    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () =>
      window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  const navigate = useCallback((href: string) => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // 1. Kill ALL current ScrollTrigger instances immediately.
    //    This is critical: the partnership page's pinned horizontal scroll
    //    creates a massive scroll area. If we don't kill triggers before
    //    navigating, the browser tries to recalculate the entire pin-spacer
    //    layout during unmount, causing severe lag/freeze.
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // 2. Force scroll to top BEFORE navigation so the new page
    //    initializes its GSAP triggers at y=0
    window.scrollTo(0, 0);

    // 3. Create a smooth fade-to-black overlay
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:black;z-index:9999;opacity:0;transition:opacity 0.35s ease-out;pointer-events:none";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // 4. Navigate after the overlay fades in
    setTimeout(() => {
      router.push(href);

      // 5. Remove overlay after the new page has time to render
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.style.opacity = "0";
          setTimeout(() => {
            if (overlay.parentNode) document.body.removeChild(overlay);
          }, 400);
        }
      }, 500);
    }, 350);
  }, [router]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Virtual progress (0..1). Advances ONLY via wheel/touch input while
    // the section is visible, so forward navigation requires a deliberate
    // sustained scroll — and the page takes no extra vertical space.
    let forwardCharge = 0;
    const FORWARD_NAV_DISTANCE = 3000; // px of aggregate downward delta
    const FORWARD_DRAIN_DISTANCE = 800; // upward drain rate inside section

    // Back-to-previous charge (hidden).
    let backCharge = 0;
    const BACK_NAV_DISTANCE = 1200;
    const BACK_RESET_DISTANCE = 400;
    let backDrainTimer: number | null = null;

    let touchStartY = 0;
    let touchLastY = 0;

    const updateForwardUI = () => {
      const p = forwardCharge;
      if (titleRef.current) {
        titleRef.current.style.transform = `scale(${1 + p * 0.15})`;
        titleRef.current.style.opacity = String(0.3 + p * 0.7);
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
      }
      if (pctRef.current) {
        pctRef.current.textContent = `${String(Math.floor(p * 100)).padStart(2, "0")}%`;
      }
    };

    const isSectionActive = () => {
      const rect = wrapper.getBoundingClientRect();
      // Active once the section has scrolled into view by more than half.
      return rect.top <= 1 && rect.bottom > window.innerHeight * 0.5;
    };

    const scheduleBackDrain = () => {
      if (backDrainTimer !== null) return;
      backDrainTimer = window.setInterval(() => {
        backCharge = Math.max(0, backCharge - 0.04);
        if (backCharge === 0 && backDrainTimer !== null) {
          clearInterval(backDrainTimer);
          backDrainTimer = null;
        }
      }, 80);
    };

    const addBackCharge = (deltaPx: number) => {
      if (hasNavigatedRef.current) return;
      backCharge = Math.min(1, backCharge + deltaPx / BACK_NAV_DISTANCE);
      scheduleBackDrain();
      if (backCharge >= 1) {
        backCharge = 0;
        if (prevHref) navigate(prevHref);
      }
    };

    const drainBackCharge = (deltaPx: number) => {
      backCharge = Math.max(0, backCharge - deltaPx / BACK_RESET_DISTANCE);
    };

    const onWheel = (e: WheelEvent) => {
      if (hasNavigatedRef.current) return;
      const active = isSectionActive();

      // Forward charge: hijack wheel while the section is pinned so native
      // scroll cannot race past the section.
      if (active) {
        if (e.deltaY > 0) {
          e.preventDefault();
          forwardCharge = Math.min(
            1,
            forwardCharge + e.deltaY / FORWARD_NAV_DISTANCE
          );
          updateForwardUI();
          if (forwardCharge >= 1) navigate(nextHref);
          return;
        }
        if (e.deltaY < 0 && forwardCharge > 0) {
          e.preventDefault();
          forwardCharge = Math.max(
            0,
            forwardCharge - Math.abs(e.deltaY) / FORWARD_DRAIN_DISTANCE
          );
          updateForwardUI();
          return;
        }
      }

      // Back charge: only when at the very top of the page.
      if (!prevHref) return;
      if (window.scrollY > 2) return;
      if (e.deltaY < 0) {
        addBackCharge(Math.abs(e.deltaY));
      } else if (e.deltaY > 0 && backCharge > 0) {
        drainBackCharge(e.deltaY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchLastY = touchStartY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (hasNavigatedRef.current) return;
      const y = e.touches[0]?.clientY ?? 0;
      const frameDelta = y - touchLastY;
      touchLastY = y;
      const active = isSectionActive();

      if (active) {
        // Swipe up (finger moves up, frameDelta < 0) → advance forward charge.
        if (frameDelta < 0) {
          e.preventDefault();
          forwardCharge = Math.min(
            1,
            forwardCharge + Math.abs(frameDelta) / FORWARD_NAV_DISTANCE
          );
          updateForwardUI();
          if (forwardCharge >= 1) navigate(nextHref);
          return;
        }
        if (frameDelta > 0 && forwardCharge > 0) {
          e.preventDefault();
          forwardCharge = Math.max(
            0,
            forwardCharge - frameDelta / FORWARD_DRAIN_DISTANCE
          );
          updateForwardUI();
          return;
        }
      }

      if (!prevHref) return;
      if (window.scrollY > 2) return;
      if (frameDelta > 0) {
        addBackCharge(frameDelta);
      } else if (frameDelta < 0 && backCharge > 0) {
        drainBackCharge(Math.abs(frameDelta));
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (hasNavigatedRef.current) return;
      if (!prevHref) return;
      if (window.scrollY > 2) return;
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") {
        addBackCharge(120);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      if (backDrainTimer !== null) clearInterval(backDrainTimer);
    };
  }, [navigate, nextHref, prevHref]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-screen bg-[#050505] -mt-1 overflow-hidden"
    >
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-20">
        {/* Massive Interactive Title Container */}
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-[20vh] text-center w-full">
            {/* Eyebrow owned by next-intl. translate="no" keeps GT out so
                "Next Chapter" doesn't get double-translated by both i18n and
                GT during a language switch. */}
            <span
              translate="no"
              className="notranslate text-[10px] tracking-[0.5em] uppercase font-semibold text-white/58"
            >
              {t("nextChapter")}
            </span>
          </div>

          {/* Title comes pre-translated from the parent page's nav namespace
              (e.g. tNav("about") → "ABOUT US"/"ÜBER UNS"). translate="no"
              prevents GT from translating it again. */}
          <h2
            ref={titleRef}
            translate="no"
            className="notranslate text-[15vw] leading-[0.92] font-black tracking-[-0.04em] uppercase text-center will-change-transform whitespace-nowrap text-white/88"
            style={{ opacity: 0.3 }}
          >
            {nextTitle}
          </h2>

          {/* Bottom Progress UI */}
          <div className="absolute bottom-[10vh] flex flex-col items-center gap-3 w-52 sm:w-64">
            <div className="flex justify-between w-full items-center text-[9px] uppercase tracking-[0.34em] font-semibold text-white/52 mb-1">
              <span>Next Page</span>
              <span className="text-white/55">
                →
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-px bg-white/14 relative origin-left">
              <div
                ref={barRef}
                className="absolute top-0 left-0 w-full h-full bg-white/80 origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            {/* Percentage */}
            <span ref={pctRef} className="text-[10px] font-mono text-white/44 tracking-[0.18em] tabular-nums">
              0%
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
