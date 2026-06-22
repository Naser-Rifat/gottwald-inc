"use client";

import { useEffect, type RefObject } from "react";

// Forward navigation requires this much aggregate downward delta (px).
const FORWARD_NAV_DISTANCE = 3000;
// Upward drain rate while the section is pinned.
const FORWARD_DRAIN_DISTANCE = 800;
// Back-to-previous: hidden, only triggered at scrollY=0.
const BACK_NAV_DISTANCE = 1200;
const BACK_RESET_DISTANCE = 400;
const BACK_DRAIN_TICK_MS = 80;
const BACK_DRAIN_STEP = 0.04;
const TOP_THRESHOLD_PX = 2;

interface UseChapterScrollChargeArgs {
  wrapperRef: RefObject<HTMLElement | null>;
  lockRef: RefObject<boolean>;
  nextHref: string;
  prevHref?: string;
  navigate: (href: string) => void;
  /** Called with current forward charge (0..1) every input frame. */
  onForwardProgress: (progress: number) => void;
}

/**
 * Hijacks wheel / touch / keyboard input while the chapter section is
 * pinned. Two virtual charges:
 *   • forward — downward scroll fills it; at 1.0 we navigate to next.
 *   • back    — only at scrollY=0; upward scroll fills it; at 1.0 we
 *               navigate to previous (if `prevHref` provided).
 */
export function useChapterScrollCharge({
  wrapperRef,
  lockRef,
  nextHref,
  prevHref,
  navigate,
  onForwardProgress,
}: UseChapterScrollChargeArgs) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let forwardCharge = 0;
    let backCharge = 0;
    let backDrainTimer: number | null = null;
    let touchLastY = 0;

    const isSectionActive = () => {
      const rect = wrapper.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom > window.innerHeight * 0.5;
    };

    const scheduleBackDrain = () => {
      if (backDrainTimer !== null) return;
      backDrainTimer = window.setInterval(() => {
        backCharge = Math.max(0, backCharge - BACK_DRAIN_STEP);
        if (backCharge === 0 && backDrainTimer !== null) {
          clearInterval(backDrainTimer);
          backDrainTimer = null;
        }
      }, BACK_DRAIN_TICK_MS);
    };

    const addBackCharge = (deltaPx: number) => {
      if (lockRef.current) return;
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

    const advanceForward = (deltaPx: number) => {
      forwardCharge = Math.min(1, forwardCharge + deltaPx / FORWARD_NAV_DISTANCE);
      onForwardProgress(forwardCharge);
      if (forwardCharge >= 1) navigate(nextHref);
    };

    const drainForward = (deltaPx: number) => {
      forwardCharge = Math.max(0, forwardCharge - deltaPx / FORWARD_DRAIN_DISTANCE);
      onForwardProgress(forwardCharge);
    };

    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;

      if (isSectionActive()) {
        if (e.deltaY > 0) {
          e.preventDefault();
          advanceForward(e.deltaY);
          return;
        }
        if (e.deltaY < 0 && forwardCharge > 0) {
          e.preventDefault();
          drainForward(Math.abs(e.deltaY));
          return;
        }
      }

      if (!prevHref || window.scrollY > TOP_THRESHOLD_PX) return;
      if (e.deltaY < 0) addBackCharge(Math.abs(e.deltaY));
      else if (e.deltaY > 0 && backCharge > 0) drainBackCharge(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchLastY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lockRef.current) return;
      const y = e.touches[0]?.clientY ?? 0;
      const frameDelta = y - touchLastY;
      touchLastY = y;

      if (isSectionActive()) {
        // Swipe up (finger moves up, delta < 0) → advance forward.
        if (frameDelta < 0) {
          e.preventDefault();
          advanceForward(Math.abs(frameDelta));
          return;
        }
        if (frameDelta > 0 && forwardCharge > 0) {
          e.preventDefault();
          drainForward(frameDelta);
          return;
        }
      }

      if (!prevHref || window.scrollY > TOP_THRESHOLD_PX) return;
      if (frameDelta > 0) addBackCharge(frameDelta);
      else if (frameDelta < 0 && backCharge > 0) drainBackCharge(Math.abs(frameDelta));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (lockRef.current) return;
      if (!prevHref || window.scrollY > TOP_THRESHOLD_PX) return;
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
  }, [wrapperRef, lockRef, nextHref, prevHref, navigate, onForwardProgress]);
}
