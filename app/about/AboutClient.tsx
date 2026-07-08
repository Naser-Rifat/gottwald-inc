"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap-bootstrap";

import Header from "@/components/layout/Header";
import FooterSection from "@/components/layout/FooterSection";
import NextChapterTransition from "@/components/layout/NextChapterTransition";
import { usePageColorShift } from "@/lib/usePageColorShift";
import { useBackgroundMouseParallax } from "@/lib/useBackgroundMouseParallax";

import HeroSection from "./_components/HeroSection";
import NarrativeCadenceSection from "./_components/NarrativeCadenceSection";
import ManifestoAxisSection from "./_components/ManifestoAxisSection";
import PrinciplesIntroSection from "./_components/PrinciplesIntroSection";
import PrinciplesPinnedSection from "./_components/PrinciplesPinnedSection";
import OutcomesSection from "./_components/OutcomesSection";
import CasesSection from "./_components/CasesSection";
import RadicalPracticalSection from "./_components/RadicalPracticalSection";
import EcosystemSection from "./_components/EcosystemSection";
import PatronSection from "./_components/PatronSection";
import CtaSection from "./_components/CtaSection";
/**
 * AboutClient — orchestrator for the About page.
 *
 * Responsibilities (deliberately narrow):
 *   - State that's read by more than one section (proof phase, shift
 *     index, hovered ecosystem row, case index, header-scrolled flag).
 *   - The page-wide GSAP `useLayoutEffect` (hero tuning sequence,
 *     reveal-text batches, pinned-pillars scrub, watermark parallax,
 *     CTA reveal, magnetic CTA, background mouse parallax). It targets
 *     section JSX via classnames so child components own zero animation
 *     wiring.
 *   - The /contact navigation choreography for the strategic-CTA click.
 *
 * Each `<...Section />` below is a pure presentational component in
 * `app/about/_components/`. Static copy lives in `app/about/_data/`.
 */
export default function AboutClient() {
  const t = useTranslations("about");
  const tNav = useTranslations("nav");
  const router = useRouter();

  const pageRef = useRef<HTMLDivElement>(null);
  const ecoCursorRef = useRef<HTMLDivElement>(null);

  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeProofPhase, setActiveProofPhase] = useState(0);
  const [activeShiftIndex, setActiveShiftIndex] = useState<number>(0);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [hoveredEcoIndex, setHoveredEcoIndex] = useState<number | null>(null);

  // About page tints the GlobalCanvas toward steel/silver.
  usePageColorShift("#8b97a2");

  // ── Cursor follow for the ECOSYSTEM image-reveal ──────────────────────────
  // Listens only while a row is hovered. Lerps the reveal cursor toward the
  // pointer and applies a counter-parallax to the inner image set.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (hoveredEcoIndex !== null && ecoCursorRef.current) {
        gsap.to(ecoCursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power3.out",
        });

        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        const imgs = ecoCursorRef.current.querySelectorAll("img");
        gsap.to(imgs, {
          x: px * -100,
          y: py * -100,
          scale: 1.15,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    };

    if (hoveredEcoIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    } else if (ecoCursorRef.current) {
      // Reset parallax on mouse leave.
      const imgs = ecoCursorRef.current.querySelectorAll("img");
      gsap.to(imgs, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredEcoIndex]);

  // ── "What shifts" active-index observer ───────────────────────────────────
  // Walks the `.shift-article` list (rendered inside OutcomesSection) and
  // updates `activeShiftIndex` whenever a new article scrolls past the centre
  // of the viewport. Drives the sticky ShiftCanvas image swap.
  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>(".shift-article");
    const triggers = elements.map((el) => {
      const idx = Number(el.getAttribute("data-shift-index"));
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveShiftIndex(idx),
        onEnterBack: () => setActiveShiftIndex(idx),
      });
    });

    return () => {
      triggers.forEach((tr) => tr.kill());
    };
  }, []);

  // Header background fade-in after a small scroll offset.
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Strategic-CTA cinematic /contact transition ───────────────────────────
  // Kills every existing ScrollTrigger, raises a full-screen dark overlay
  // with a soft gold glow, then routes after the curtain reaches the top.
  const handleStrategicClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    ScrollTrigger.getAll().forEach((tr) => tr.kill());

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          router.push("/contact");
        }, 50);
      },
    });

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:100vh;left:0;width:100vw;height:100vh;background:#030303;z-index:99999;pointer-events:none;display:flex;align-items:center;justify-content:center;";

    const glow = document.createElement("div");
    glow.style.cssText =
      "position:absolute;width:100vw;height:100vw;background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 60%);mix-blend-mode:screen;filter:blur(40px);";
    overlay.appendChild(glow);
    document.body.appendChild(overlay);

    tl.to(btn, { opacity: 0, duration: 0.4, ease: "power2.out" }).to(
      overlay,
      { top: 0, duration: 0.8, ease: "expo.inOut" },
      "-=0.2",
    );

    setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        },
      });
    }, 1200);
  };

  // ── Page-wide GSAP choreography ───────────────────────────────────────────
  // Uses class selectors so the section components own zero animation wiring.
  // Selectors covered:
  //   .tuning-line / .tuning-headline / .hero-frame  → hero entrance
  //   .frequency-wave / .frequency-wave-echo         → SVG draw-on
  //   .hero-bg-image / .patron-craft-img             → ken-burns parallax
  //   .reveal-text                                   → staggered fade-in
  //   .about-pillars-pin                             → pinned 5-principle scrub
  //   .about-shifts-watermark / .about-parallax-target / .about-liquid-aurora
  //                                                  → mouse + scroll parallax
  //   .cta-section / .cta-reveal / .magnetic-cta     → footer choreography
  // Site-wide background parallax (watermark + aurora drift toward the
  // cursor). Lives outside the gsap.context because its listener is on
  // `window`, not on a GSAP-tracked element. Honours reduced-motion
  // internally and is rAF-gated.
  useBackgroundMouseParallax([
    { selector: ".about-parallax-target", intensity: 120, duration: 1.5, ease: "power2.out" },
    { selector: ".about-liquid-aurora", intensity: -200, duration: 2.5, ease: "power3.out" },
  ]);

  useLayoutEffect(() => {
    // Magnetic-button window listener lives outside ctx so we can detach it
    // cleanly; ctx.revert() only tears down GSAP-managed tweens.
    let magneticHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          gsap.set(".journey-progress", { scaleY: progress });
        },
      });

      // 1. Hero "Tuning Sequence" — letter-by-letter elastic arrival.
      //
      // The `.tuning-char` spans are server-rendered inside each
      // `.tuning-line` (see `_components/TuningChars.tsx`). We previously
      // built them here by clearing `innerHTML` and recreating per-char
      // spans on hydration — that briefly emptied the SSR-painted text
      // and pushed Chrome's LCP candidate from FCP to whenever the
      // per-char structure re-rendered (+~400ms render delay). Querying
      // the existing nodes keeps the same animation without invalidating
      // the LCP element.
      const tuningLines = gsap.utils.toArray<HTMLElement>(".tuning-line");
      tuningLines.forEach((line, idx) => {
        const chars = line.querySelectorAll(".tuning-char");
        if (chars.length === 0) return;
        if (reducedMotion) {
          gsap.set(chars, { yPercent: 0, opacity: 1, scaleY: 1 });
        } else {
          gsap.fromTo(
            chars,
            { yPercent: 18, scaleY: 0.82 },
            {
              yPercent: 0,
              scaleY: 1,
              duration: 0.7,
              stagger: 0.012,
              ease: "power3.out",
              delay: idx * 0.06,
              force3D: true,
              clearProps: "willChange,transform",
            },
          );
        }
      });

      // Frame elements (top track marker + bottom data row) fade in after
      // letters settle — restraint-first composition.
      gsap.to(".hero-frame", {
        opacity: 1,
        duration: 1.4,
        delay: 0.5,
        ease: "power2.out",
        stagger: 0.2,
      });

      // Frequency wave + echo draws in. Defensive: the echo path doesn't
      // exist in the current hero markup but is supported if added later.
      const wavePath = document.querySelector(
        ".frequency-wave",
      ) as SVGPathElement | null;
      if (wavePath) {
        const len = wavePath.getTotalLength();
        gsap.set(wavePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(wavePath, {
          strokeDashoffset: 0,
          duration: 2.8,
          delay: 1.0,
          ease: "power3.inOut",
        });
      }
      const echoPath = document.querySelector(
        ".frequency-wave-echo",
      ) as SVGPathElement | null;
      if (echoPath) {
        const len = echoPath.getTotalLength();
        gsap.set(echoPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(echoPath, {
          strokeDashoffset: 0,
          duration: 3.4,
          delay: 1.3,
          ease: "power3.inOut",
        });
      }

      // Ongoing subtle frequency breathing.
      if (!reducedMotion) {
        gsap.to(".tuning-headline", {
          scale: 1.005,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Hero scroll parallax.
      if (!reducedMotion) {
        gsap.to(".tuning-headline", {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-frame", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Brand assets — Ken-Burns + counter-drift parallax.
        gsap.fromTo(
          ".hero-bg-image",
          { yPercent: -8, scale: 1.05 },
          {
            yPercent: 14,
            scale: 1.22,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          ".patron-craft-img",
          { yPercent: -8, scale: 1.06 },
          {
            yPercent: 10,
            scale: 1.18,
            ease: "none",
            scrollTrigger: {
              trigger: ".patron-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );

        gsap.fromTo(
          ".living-system-img",
          { yPercent: -4, scale: 1.04 },
          {
            yPercent: 4,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: ".living-system-visual",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      }

      // 2. Reveal Elements on Scroll — batched for perf.
      ScrollTrigger.batch(".reveal-text", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.1,
              force3D: true,
              clearProps: "transform",
            },
          );
        },
        once: true,
      });

      // 3. PINNED 5-PRINCIPLES — one timeline scrubbed against the
      //    `.about-pillars-pin` outer wrapper. Crossfades between frames
      //    and updates the chrome (counter + dot row + progress bar).
      const pillarSection =
        document.querySelector<HTMLElement>(".about-pillars-pin");
      if (pillarSection && !reducedMotion) {
        const frames = gsap.utils.toArray<HTMLElement>(
          pillarSection.querySelectorAll(".pillar-stage-frame"),
        );
        const dots = gsap.utils.toArray<HTMLElement>(
          pillarSection.querySelectorAll(".pillar-dot"),
        );
        const counter =
          pillarSection.querySelector<HTMLElement>(".pillar-counter");
        const total = frames.length;

        gsap.set(frames.slice(1), { opacity: 0, y: 40 });
        gsap.set(frames[0], { opacity: 1, y: 0 });

        const updatePillarChrome = (index: number) => {
          if (counter)
            counter.textContent = String(index + 1).padStart(2, "0");
          dots.forEach((dot, dotIndex) => {
            dot.style.backgroundColor =
              dotIndex <= index
                ? "rgb(18, 168, 172)"
                : "rgba(255, 255, 255, 0.12)";
          });
        };

        const pillarTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pillarSection,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.0,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              updatePillarChrome(
                Math.min(total - 1, Math.round(progress * (total - 1))),
              );
              const progressBar = pillarSection.querySelector<HTMLElement>(
                ".pillar-progress-bar",
              );
              if (progressBar) {
                progressBar.style.height = `${20 + progress * 80}%`;
              }
            },
          },
        });

        for (let i = 1; i < total; i++) {
          const transitionAt = i - 0.5;
          pillarTimeline.to(
            frames[i - 1],
            {
              opacity: 0,
              y: -32,
              duration: 0.22,
              ease: "power2.inOut",
            },
            transitionAt,
          );
          pillarTimeline.fromTo(
            frames[i],
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.inOut",
            },
            transitionAt,
          );
        }
        pillarTimeline.to({}, { duration: 0.5 });
      }

      // 4. SHIFTS WATERMARK PARALLAX
      const proofSection = document.querySelector(
        'section[data-journey="proof"]',
      );
      if (proofSection && !reducedMotion) {
        const shiftsWatermark = proofSection.querySelector(
          ".about-shifts-watermark",
        );
        if (shiftsWatermark) {
          gsap.fromTo(
            shiftsWatermark,
            { y: 60 },
            {
              y: -100,
              ease: "none",
              scrollTrigger: {
                trigger: proofSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      }

      // 5. CTA Section — cinematic entrance.
      const ctaSection = document.querySelector(".cta-section");
      if (ctaSection) {
        const ctaElements = ctaSection.querySelectorAll(".cta-reveal");
        gsap.fromTo(
          ctaElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.2,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 75%",
            },
          },
        );
      }

      // 6. Magnetic CTA — pulls toward the cursor within a 220px radius.
      const magneticBtn =
        pageRef.current?.querySelector<HTMLElement>(".magnetic-cta");
      if (magneticBtn && !reducedMotion) {
        magneticHandler = (e: MouseEvent) => {
          const rect = magneticBtn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 220) {
            const strength = Math.max(0, 1 - dist / 220);
            gsap.to(magneticBtn, {
              x: dx * 0.24 * strength,
              y: dy * 0.24 * strength,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(magneticBtn, {
              x: 0,
              y: 0,
              duration: 0.85,
              ease: "elastic.out(1, 0.55)",
              overwrite: "auto",
            });
          }
        };
        window.addEventListener("mousemove", magneticHandler, { passive: true });
      }

      // Background mouse parallax is handled by useBackgroundMouseParallax
      // (called outside this effect); it's rAF-gated and passive.
    }, pageRef);

    return () => {
      ctx.revert();
      if (magneticHandler)
        window.removeEventListener("mousemove", magneticHandler);
    };
  }, []);

  // Reference the unused `t` so the next-intl import stays warm for
  // future page-level copy without TypeScript flagging unused vars.
  void t;

  return (
    <div
      ref={pageRef}
      className="bg-[#070c14] min-h-screen text-white/80 font-sans overflow-x-clip selection:bg-gold/20 selection:text-white"
    >
      <div
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 pointer-events-auto ${
          headerScrolled
            ? "bg-[#070c14]/85 backdrop-blur-md border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="px-gutter">
          <Header />
        </div>
      </div>

      <main>
        <HeroSection />
        <NarrativeCadenceSection />
        <ManifestoAxisSection />
        <PrinciplesIntroSection />
        <PrinciplesPinnedSection />
        {/* Sentinel hairline — closes the "What we do differently" visual
            arc before the PROOF section begins. */}
        <div className="bg-[#070c14] border-t border-white/[0.04]" />
        <OutcomesSection
          activeProofPhase={activeProofPhase}
          setActiveProofPhase={setActiveProofPhase}
          activeShiftIndex={activeShiftIndex}
        />
        <CasesSection
          activeCaseIndex={activeCaseIndex}
          setActiveCaseIndex={setActiveCaseIndex}
        />
        <RadicalPracticalSection />
        <EcosystemSection
          hoveredEcoIndex={hoveredEcoIndex}
          setHoveredEcoIndex={setHoveredEcoIndex}
          ecoCursorRef={ecoCursorRef}
        />
        <PatronSection />
        <CtaSection onStrategicClick={handleStrategicClick} />
      </main>

      <FooterSection />
      <NextChapterTransition
        nextTitle={tNav("partnerships")}
        nextHref="/partnerships"
        prevHref="/"
        narrativeLine="You know who we are. Now, the alliance."
        accentColor="#12a8ac"
      />
    </div>
  );
}
