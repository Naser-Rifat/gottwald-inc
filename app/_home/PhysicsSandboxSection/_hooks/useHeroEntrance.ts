"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap-bootstrap";
import { getDeviceTier } from "@/lib/deviceTier";

interface UseHeroEntranceArgs {
  heroRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  orbRef: RefObject<HTMLElement | null>;
  scrollBtnRef: RefObject<HTMLElement | null>;
}

// Portal entry adds a longer breath delay before the hero choreography starts.
const ENTRY_DELAY_FROM_PORTAL = 1.2;
const ENTRY_DELAY_DEFAULT = 0.3;

/**
 * Hero choreography:
 *  1. Build the entrance timeline (header → top-label → words → accent
 *     line → orb → desc → scroll indicator). Longer breath if the user
 *     just dismissed the intro portal.
 *  2. Loop ambient tweens (orb rings rotation, orb glow yoyo, scroll
 *     arrow bob) and pause them when the hero scrolls off-screen.
 *  3. Apply a parallax `yPercent` to `.hero-title-block` scrubbed to
 *     the hero's scroll position.
 */
export function useHeroEntrance({
  heroRef,
  headerRef,
  orbRef,
  scrollBtnRef,
}: UseHeroEntranceArgs) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Mobile skips the choreographed entrance. Setting `opacity: 0` on the
    // hero words + then animating them in from a GSAP timeline made
    // Lighthouse count the H1 as invisible until the animation resolved
    // — pushing mobile LCP to 6.4 s even though the H1 was already in the
    // SSR HTML. On mobile the hero renders in its natural CSS state so
    // LCP pins on the H1 the moment the browser paints it (~1.2 s).
    if (getDeviceTier() === "mobile") return;

    const ctx = gsap.context(() => {
      const words = hero.querySelectorAll(".hero-word");
      const desc = hero.querySelector(".hero-desc");
      const topLabel = hero.querySelector(".hero-top-label");
      const accentLine = hero.querySelector(".accent-line");
      const scrollBtn = scrollBtnRef.current;
      const header = headerRef.current;
      const orb = orbRef.current;

      // ── Initial state ───────────────────────────────────────────────
      gsap.set(words, { y: "130%", rotateX: -45, opacity: 0 });
      gsap.set([desc, topLabel, scrollBtn, header].filter(Boolean), {
        opacity: 0,
      });
      if (orb) gsap.set(orb, { scale: 0, opacity: 0 });
      if (accentLine) gsap.set(accentLine, { scaleX: 0 });

      // ── Entrance timeline ───────────────────────────────────────────
      const fromPortal =
        sessionStorage.getItem("portal-visited") === "true";
      const entryDelay = fromPortal
        ? ENTRY_DELAY_FROM_PORTAL
        : ENTRY_DELAY_DEFAULT;

      const tl = gsap.timeline({ delay: entryDelay });

      if (header) {
        tl.to(header, { opacity: 1, duration: 0.8, ease: "power2.out" });
      }
      if (topLabel) {
        tl.fromTo(
          topLabel,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "-=0.3",
        );
      }
      tl.to(
        words,
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.4",
      );
      if (accentLine) {
        tl.to(
          accentLine,
          { scaleX: 1, duration: 1, ease: "power3.inOut" },
          "-=0.8",
        );
      }
      if (orb) {
        tl.to(
          orb,
          { scale: 1, opacity: 0.7, duration: 1.5, ease: "power2.out" },
          "-=1.2",
        );
      }
      if (desc) {
        tl.fromTo(
          desc,
          { y: 20 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.8",
        );
      }
      if (scrollBtn) {
        tl.fromTo(
          scrollBtn,
          { y: 15 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        );
      }

      // ── Continuous ambient tweens ───────────────────────────────────
      // All four loops below are decorative (orb-ring rotations, orb-glow
      // breathing, scroll-arrow bob). Under prefers-reduced-motion we
      // skip them entirely — the IntersectionObserver block below has
      // nothing to pause/resume when the array is empty.
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const infiniteTweens: gsap.core.Tween[] = [];

      if (orb && !reducedMotion) {
        infiniteTweens.push(
          gsap.to(orb.querySelector(".orb-ring-1"), {
            rotation: 360,
            duration: 20,
            ease: "none",
            repeat: -1,
          }),
          gsap.to(orb.querySelector(".orb-ring-2"), {
            rotation: -360,
            duration: 15,
            ease: "none",
            repeat: -1,
          }),
          gsap.to(orb.querySelector(".orb-glow"), {
            scale: 1.3,
            opacity: 0.4,
            duration: 2.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );
      }

      const arrow = hero.querySelector(".hero-scroll svg");
      if (arrow && !reducedMotion) {
        infiniteTweens.push(
          gsap.to(arrow, {
            y: 4,
            x: 4,
            duration: 1.2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );
      }

      // Pause ambient loops when the hero is off-screen (saves paint).
      const observer = new IntersectionObserver(
        ([entry]) => {
          infiniteTweens.forEach((t) =>
            entry.isIntersecting ? t.resume() : t.pause(),
          );
        },
        { threshold: 0.01 },
      );
      observer.observe(hero);

      // ── Scroll-driven parallax on the title block ──────────────────
      gsap.to(hero.querySelector(".hero-title-block"), {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, [heroRef, headerRef, orbRef, scrollBtnRef]);
}
