"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Pillar, ContentBlock } from "@/lib/types/pillars";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — matched to homepage globals.css
   ───────────────────────────────────────────────────────────── */
const GOLD = "#d4af37";
const BG_DARK = "#000000";
const BG_PANEL = "#0a0a0e";
const BG_LIGHT = "#f5f0eb";
const TXT_LIGHT = "#f5f5f5";
const TXT_MUTED = "rgba(255,255,255,0.8)";
const TXT_DARK = "#1c1d21";
const TXT_DARK_MUTED = "rgba(28,29,33,0.5)";
const BORDER_DARK = "rgba(212,175,55,0.12)";
const BORDER_LIGHT = "rgba(28,29,33,0.08)";

interface Props {
  project: Pillar;
  nextProject: Pillar;
}

export default function PillarDetailClient({ project, nextProject }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const registerPanel = useCallback((el: HTMLElement | null, idx: number) => {
    if (el) panelRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!outer || !track) return;

    const mm = gsap.matchMedia();

    // ─── Desktop: Horizontal Scroll ───────────────────────────
    mm.add("(min-width: 1024px)", () => {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.overflow = "hidden";

      let xTo = 0;
      let currentX = 0;
      const ease = 0.07;
      let raf: number;
      let maxScroll = 0;

      const recalc = () => {
        maxScroll = track.scrollWidth - window.innerWidth;
      };
      recalc();

      const onWheel = (e: WheelEvent) => {
        // Check if the user is hovering over an internal scrollable zone
        const target = e.target as HTMLElement;
        const scrollableNode = target.closest(".allow-native-scroll");
        
        if (scrollableNode) {
          const el = scrollableNode as HTMLElement;
          const isScrollable = el.scrollHeight > el.clientHeight;
          
          if (isScrollable) {
            const isAtTop = el.scrollTop === 0;
            // +1px variance for fractional pixel rendering differences
            const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;
            
            // Bypass GSAP hijack if internal native scrolling is possible
            if (e.deltaY < 0 && !isAtTop) return; 
            if (e.deltaY > 0 && !isAtBottom) return;
          }
        }

        e.preventDefault();
        const delta =
          Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        xTo = Math.max(0, Math.min(xTo + delta, maxScroll));
      };

      const animate = () => {
        currentX += (xTo - currentX) * ease;
        gsap.set(track, { x: -currentX });

        if (progress && maxScroll > 0) {
          const pct = (currentX / maxScroll) * 100;
          gsap.set(progress, { width: `${pct}%` });
        }

        // Counter update
        const panels = panelRefs.current;
        let activeIdx = 0;
        panels.forEach((panel, idx) => {
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          if (rect.left < window.innerWidth * 0.5) activeIdx = idx;
          const visible = rect.left < window.innerWidth && rect.right > 0;
          if (visible && !panel.dataset.revealed) {
            panel.dataset.revealed = "1";
            revealPanel(panel);
          }
        });
        if (counterRef.current) {
          counterRef.current.textContent = String(activeIdx + 1).padStart(2, "0");
        }

        raf = requestAnimationFrame(animate);
      };

      outer.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("resize", recalc);
      raf = requestAnimationFrame(animate);

      return () => {
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.documentElement.style.overflow = "";
        outer.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", recalc);
        cancelAnimationFrame(raf);
        gsap.set(track, { clearProps: "x" });
      };
    });

    // ─── Mobile: Vertical Native Scroll ──────────────────────
    mm.add("(max-width: 1023px)", () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";

      let raf: number;

      const animateMobile = () => {
        const panels = panelRefs.current;
        panels.forEach((panel) => {
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          const visible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
          if (visible && !panel.dataset.revealed) {
            panel.dataset.revealed = "1";
            revealPanel(panel);
          }
        });

        if (progress) {
          const scrollY = window.scrollY;
          const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
          const pct = maxScrollY > 0 ? (scrollY / maxScrollY) * 100 : 0;
          gsap.set(progress, { width: `${pct}%` });
        }

        raf = requestAnimationFrame(animateMobile);
      };

      raf = requestAnimationFrame(animateMobile);

      return () => {
        cancelAnimationFrame(raf);
      };
    });

    // ─── Initial Hero Reveal ─────────────────────────────────
    const heroPanel = panelRefs.current[0];
    if (heroPanel) {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        heroPanel.querySelector(".hero-label"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0
      );
      tl.fromTo(
        heroPanel.querySelector(".hero-title"),
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
        0.1
      );
      tl.fromTo(
        heroPanel.querySelector(".hero-desc"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.4
      );
      tl.fromTo(
        heroPanel.querySelector(".hero-services"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.5
      );
      tl.fromTo(
        heroPanel.querySelector(".hero-cta"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.6
      );
      tl.fromTo(
        heroPanel.querySelector(".hero-image"),
        { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.6,
          ease: "power4.inOut",
        },
        0.1
      );
      heroPanel.dataset.revealed = "1";
    }

    gsap.fromTo(
      track,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    return () => mm.revert();
  }, []);

  const totalPanels = 2 + (project.contentBlocks?.length || 0);

  return (
    <div
      ref={outerRef}
      className="relative lg:fixed lg:inset-0 overflow-y-auto lg:overflow-hidden"
      style={{ backgroundColor: BG_DARK, color: TXT_LIGHT }}
    >
      {/* ─── Top Navigation ─── */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-5 lg:px-15 lg:py-6 pointer-events-none">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-md font-medium tracking-[0.18em] uppercase opacity-50 no-underline transition-opacity duration-300 hover:opacity-100 pointer-events-auto"
          style={{ color: TXT_LIGHT }}
        >
          <span className="inline-block w-5 h-px bg-current opacity-60" />
          Back
        </Link>
        {project.tags && project.tags.length > 0 && (
          <span
            className="hidden sm:inline text-sm tracking-[0.25em] uppercase font-medium"
            style={{ color: GOLD, opacity: 0.8 }}
          >
            {project.tags?.join(" · ")}
          </span>
        )}
      </nav>

      {/* ─── Progress Bar ─── */}
      <div
        className="fixed bottom-0 left-0 w-full h-px z-50"
        style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{ backgroundColor: GOLD, width: 0, willChange: "width" }}
        />
      </div>

      {/* ─── Panel Counter ─── */}
      <div
        className="fixed bottom-10 right-8 z-50 text-sm tracking-[0.25em] uppercase font-medium hidden lg:block"
        style={{ color: TXT_MUTED }}
      >
        <span ref={counterRef} style={{ color: GOLD }}>01</span>
        <span className="mx-1 opacity-30">/</span>
        {String(totalPanels).padStart(2, "0")}
      </div>

      {/* ─── Scroll Track ─── */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-screen lg:items-stretch opacity-0 will-change-transform"
      >
        {/* ═══════ PANEL 1 — Hero ═══════ */}
        <section
          ref={(el) => registerPanel(el, 0)}
          className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row"
          style={{ backgroundColor: BG_DARK }}
        >
          {/* Left: Text Content */}
          <div className="w-full lg:w-[46%] h-auto lg:h-full flex flex-col justify-center px-6 py-20 lg:py-0 lg:pl-15 lg:pr-14 pt-28 lg:pt-0">
            {/* Section marker — matching homepage pattern */}
            <div
              className="hero-label mb-8 flex items-center gap-3"
              style={{ opacity: 0 }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <span
                className="text-xs tracking-[0.25em] uppercase font-semibold"
                style={{ color: TXT_MUTED }}
              >
                01 — {project.tags?.[0] || "Pillar"}
              </span>
            </div>

            <h1
              className="hero-title pt-2"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: "40px",
                color: TXT_LIGHT,
                opacity: 0,
              }}
            >
              {project.title}
            </h1>

            <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-start w-full">
              <div
                className="hero-desc w-full xl:max-w-105 flex flex-col"
                style={{ opacity: 0 }}
              >
                {/* Scrollable description zone */}
                <div
                  className="allow-native-scroll overflow-y-auto mb-6"
                  style={{
                    maxHeight: "clamp(160px, 28vh, 340px)",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.12) transparent",
                  }}
                >
                  {project.description && project.description !== project.title && (
                    <p
                      className="mb-4"
                      style={{
                        fontSize: "clamp(14px, 1.15vw, 16px)",
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.95)",
                        fontWeight: 300,
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.details && project.details !== project.description && project.details !== project.title && (
                    <p
                      style={{
                        fontSize: "clamp(12px, 1vw, 15px)",
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.80)",
                        fontWeight: 300,
                      }}
                    >
                      {project.details}
                    </p>
                  )}
                </div>

                {/* CTA — separated cleanly below description */}
                {project.launchUrl && (
                  <div className="pt-2">
                    <a
                      href={project.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-cta inline-flex items-center gap-4 no-underline group w-max"
                      style={{
                        padding: "14px 32px",
                        border: `1px solid rgba(212,175,55,0.5)`,
                        color: GOLD,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase" as const,
                        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = GOLD;
                        e.currentTarget.style.color = BG_DARK;
                        e.currentTarget.style.borderColor = GOLD;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = GOLD;
                        e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
                      }}
                    >
                      Visit Website
                      <span className="transition-transform duration-300 group-hover:translate-x-1 text-sm">→</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Services column */}
              {project.services && project.services.length > 0 && (
                <div
                  className="hero-services w-full xl:w-60 shrink-0 xl:pt-1"
                  style={{ opacity: 0 }}
                >
                  <h3
                    className="mb-3"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.45em",
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      color: GOLD,
                    }}
                  >
                    Services
                  </h3>
                  <div
                    className="w-10 h-px mb-5"
                    style={{ backgroundColor: "rgba(212,175,55,0.35)" }}
                  />
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.75)",
                      fontWeight: 300,
                    }}
                    className="flex flex-col gap-3"
                  >
                    {project.services.map((s) => (
                      <li key={s} className="flex items-start gap-3">
                        <span
                          className="mt-[9px] shrink-0 rounded-full"
                          style={{ width: "4px", height: "4px", backgroundColor: GOLD, opacity: 0.7, display: "inline-block" }}
                        />
                        <span style={{ fontSize: "clamp(12px, 1vw, 14px)" }} className="tracking-wide">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="w-full lg:w-[54%] h-[50vh] lg:h-full flex items-stretch px-4 pb-8 lg:pb-6 lg:pr-6 lg:pt-6 lg:pl-4">
            <div
              className="hero-image relative w-full h-full rounded-xl overflow-hidden"
              style={{
                clipPath: "inset(0 0 100% 0)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.04)",
              }}
            >
              {/* Premium abstract fallback — consistent dark palette (z-0 behind the image) */}
              <div className="absolute inset-0 pointer-events-none select-none z-0">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(145deg, #08090e 0%, #0c1020 35%, #0a0e18 65%, #060810 100%)",
                  }}
                />
                {/* Diagonal fine lines */}
                <div
                  className="absolute inset-0 opacity-[0.025]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(212,175,55,.15) 2px, rgba(212,175,55,.15) 3px)",
                    backgroundSize: "8px 8px",
                  }}
                />
                {/* Gold accent ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-[min(50vw,280px)] h-[min(50vw,280px)] rounded-full opacity-[0.03]"
                    style={{
                      border: `1px solid ${GOLD}`,
                      boxShadow: `inset 0 0 80px rgba(212,175,55,0.03)`,
                    }}
                  />
                </div>
                {/* Index watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                  <span
                    className="font-black tracking-tighter"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "min(35vw, 16rem)",
                    }}
                  >
                    01
                  </span>
                </div>
              </div>

              {project.image ? (
                <div className="absolute inset-0 z-10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 54vw"
                    className="object-cover"
                    priority
                    unoptimized
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                    }}
                  />
                </div>
              ) : null}

              {/* Subtle gold edge glow */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  border: "1px solid rgba(212,175,55,0.06)",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>
        </section>

        {/* ═══════ DYNAMIC CMS PANELS ═══════ */}
        {project.contentBlocks?.map((block, i) => {
          const panelIdx = i + 1;
          switch (block.type) {
            case "showcase":
              return (
                <ShowcaseBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "case-study":
              return (
                <CaseStudyBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "feature":
              return (
                <FeatureBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "stats":
              return (
                <StatsBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "fullbleed":
              return (
                <FullbleedBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "rich-text":
              return (
                <RichTextBlock
                  key={i}
                  block={block}
                  project={project}
                  panelIdx={panelIdx}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            default:
              return null;
          }
        })}

        {/* ═══════ LAST PANEL — Next Project ═══════ */}
        <section
          ref={(el) =>
            registerPanel(el, (project.contentBlocks?.length || 0) + 1)
          }
          className="w-full min-h-[60vh] lg:w-screen lg:h-screen shrink-0 flex items-end overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG_PANEL} 20%, ${BG_LIGHT} 20.5%, ${BG_LIGHT} 100%)`,
          }}
        >
          <div className="panel-content w-full flex flex-col md:flex-row md:items-end justify-between gap-8 px-6 pb-20 lg:px-15 lg:pb-24 opacity-0">
            <Link
              href={`/pillars/${nextProject.slug}`}
              className="no-underline group"
            >
              <span
                className="block text-[10px] tracking-[0.3em] uppercase font-semibold mb-4"
                style={{ color: "rgba(28,29,33,0.6)" }}
              >
                Next Chapter
              </span>
              <h2
                className="next-title"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(3rem, 10vw, 11rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  paddingBottom: "12px",
                  color: "rgba(28,29,33,0.45)",
                  whiteSpace: "pre-line" as const,
                  transition: "color 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#1c1d21")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(28,29,33,0.45)")
                }
              >
                {nextProject.title}
              </h2>
            </Link>
            <Link
              href={`/pillars/${nextProject.slug}`}
              className="flex items-center gap-4 mb-0 md:mb-4 no-underline group"
            >
              <span
                className="text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors duration-300 group-hover:text-text-primary"
                style={{ color: "rgba(28,29,33,0.7)" }}
              >
                Next Project
              </span>
              <span
                className="block w-10 lg:w-16 h-px transition-all duration-300 group-hover:w-20 group-hover:bg-text-primary"
                style={{ backgroundColor: "rgba(28,29,33,0.4)" }}
              />
              <span
                className="text-lg transition-all duration-300 group-hover:translate-x-1 group-hover:text-text-primary"
                style={{ color: "rgba(28,29,33,0.7)" }}
              >
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REVEAL ANIMATION — cinematic panel entrance
   ═══════════════════════════════════════════════════════════════ */

function revealPanel(panel: HTMLElement) {
  const content = panel.querySelector(".panel-content");
  const image = panel.querySelector(".panel-image");
  const heading = panel.querySelector(".panel-heading");
  const body = panel.querySelector(".panel-body");
  const stats = panel.querySelectorAll(".panel-stat");
  const label = panel.querySelector(".panel-label");

  const tl = gsap.timeline();

  if (label) {
    tl.fromTo(
      label,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      0
    );
  }

  if (image) {
    tl.fromTo(
      image,
      { clipPath: "inset(0 100% 0 0)", scale: 1.06 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.4,
        ease: "power4.inOut",
      },
      0
    );
  }

  if (heading) {
    tl.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      0.25
    );
  }

  if (body) {
    tl.fromTo(
      body,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.4
    );
  }

  if (content) {
    tl.fromTo(
      content,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      0.1
    );
  }

  if (stats.length) {
    tl.fromTo(
      stats,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      },
      0.5
    );
  }
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

import { forwardRef } from "react";

interface BlockProps {
  block: ContentBlock;
  project: Pillar;
  panelIdx: number;
}

/** Reusable premium fallback for images (dark gradient + gold accents) */
function ImageFallback({ idx }: { idx: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, #08090e 0%, #0c1020 35%, #0a0e18 65%, #060810 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(212,175,55,.12) 2px, rgba(212,175,55,.12) 3px)",
          backgroundSize: "8px 8px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <span
          className="font-black tracking-tighter"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "min(30vw, 12rem)",
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>
      <div
        className="absolute inset-0"
        style={{ border: "1px solid rgba(212,175,55,0.05)", borderRadius: "12px" }}
      />
    </div>
  );
}

/** Section label — "• 02 — HEADING" matching homepage style */
function SectionLabel({ idx, text, light }: { idx: number; text: string; light?: boolean }) {
  return (
    <div className="panel-label flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: light ? TXT_DARK : GOLD }}
      />
      <span
        className="text-[10px] tracking-[0.25em] uppercase font-semibold"
        style={{ color: light ? TXT_DARK_MUTED : TXT_MUTED }}
      >
        {String(idx + 1).padStart(2, "0")} — {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CMS BLOCK COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const ShowcaseBlock = forwardRef<HTMLElement, BlockProps>(
  function ShowcaseBlock({ block, project, panelIdx }, ref) {
    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col items-center justify-center px-6 py-16 lg:py-0 lg:px-15 gap-6"
        style={{
          backgroundColor: block.theme === "light" ? BG_LIGHT : BG_PANEL,
        }}
      >
        <SectionLabel idx={panelIdx} text="Showcase" light={block.theme === "light"} />
        <div
          className="panel-image relative w-full lg:max-w-[1050px] aspect-[16/10] rounded-xl overflow-hidden"
          style={{
            clipPath: "inset(0 100% 0 0)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          }}
        >
          {(block.image || project.image) ? (
            <Image
              src={block.image || project.image}
              alt={`${project.title} showcase`}
              fill
              sizes="100vw"
              className="object-cover z-10"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}
          <ImageFallback idx={panelIdx} />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 60%)",
            }}
          />
        </div>
      </section>
    );
  }
);

const CaseStudyBlock = forwardRef<HTMLElement, BlockProps>(
  function CaseStudyBlock({ block, project, panelIdx }, ref) {
    const isLight = block.theme !== "dark";
    const bgColor = isLight ? BG_LIGHT : BG_PANEL;
    const txtColor = isLight ? TXT_DARK : TXT_LIGHT;
    const muted = isLight ? TXT_DARK_MUTED : TXT_MUTED;
    const border = isLight ? BORDER_LIGHT : BORDER_DARK;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row"
        style={{ backgroundColor: bgColor, color: txtColor }}
      >
        <div className="panel-content flex-1 flex flex-col justify-center px-6 py-16 lg:py-0 lg:pl-15 lg:pr-10 opacity-0">
          <SectionLabel idx={panelIdx} text="Case Study" light={isLight} />
          <h3
            className="panel-heading"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            {block.heading || "Case Study"}
          </h3>
          <p
            className="panel-body"
            style={{
              fontSize: "clamp(16px, 1.2vw, 19px)",
              color: muted,
              lineHeight: 1.9,
              maxWidth: "520px",
              whiteSpace: "pre-line",
            }}
          >
            {block.body}
          </p>
        </div>
        <div
          className="w-full lg:w-[38%] flex flex-col justify-center px-6 pb-16 pt-16 lg:pt-0 lg:pb-0 lg:p-10 border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: border }}
        >
          <div
            className="panel-image relative w-full aspect-square lg:aspect-4/5 rounded-xl overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {(block.image || project.image) ? (
              <Image
                src={block.image || project.image}
                alt="Case Study"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover z-10"
                unoptimized
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
            ) : null}
            <ImageFallback idx={panelIdx} />
          </div>
        </div>
      </section>
    );
  }
);

const StatsBlock = forwardRef<HTMLElement, BlockProps>(function StatsBlock(
  { block, project, panelIdx },
  ref
) {
  const isLight = block.theme !== "dark";
  const bgColor = isLight ? BG_LIGHT : BG_PANEL;
  const txtColor = isLight ? TXT_DARK : TXT_LIGHT;
  const muted = isLight ? TXT_DARK_MUTED : TXT_MUTED;
  const border = isLight ? BORDER_LIGHT : BORDER_DARK;

  return (
    <section
      ref={ref}
      className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row"
      style={{ backgroundColor: bgColor, color: txtColor }}
    >
      <div className="panel-content flex-1 flex flex-col justify-center px-6 py-16 lg:py-0 lg:pl-15 lg:pr-10 opacity-0">
        <SectionLabel idx={panelIdx} text="Key Metrics" light={isLight} />
        <p
          className="panel-body"
          style={{
            fontSize: "clamp(16px, 1.2vw, 19px)",
            color: muted,
            lineHeight: 1.85,
            marginBottom: "48px",
            maxWidth: "420px",
          }}
        >
          {block.body}
        </p>
        <div className="flex gap-10 lg:gap-16 flex-wrap">
          {block.stats?.map((stat, idx) => (
            <div key={idx} className="panel-stat">
              <span
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "3.5rem",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: GOLD,
                }}
              >
                {stat.value}
              </span>
              <p
                className="mt-2"
                style={{
                  fontSize: "12px",
                  color: muted,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-full lg:w-[32%] flex flex-col justify-center px-6 pb-16 pt-16 lg:pt-0 lg:pb-0 lg:p-10 border-t lg:border-t-0 lg:border-l"
        style={{ borderColor: border }}
      >
        <div
          className="panel-image relative w-full aspect-square rounded-xl overflow-hidden"
          style={{
            clipPath: "inset(0 100% 0 0)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {(block.image || project.image) ? (
            <Image
              src={block.image || project.image}
              alt="Stats"
              fill
              sizes="(max-width: 1024px) 100vw, 32vw"
              className="object-cover z-10"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}
          <ImageFallback idx={panelIdx} />
        </div>
      </div>
    </section>
  );
});

const FeatureBlock = forwardRef<HTMLElement, BlockProps>(function FeatureBlock(
  { block, project, panelIdx },
  ref
) {
  const isLight = block.theme === "light";
  return (
    <section
      ref={ref}
      className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-16 lg:py-0 lg:px-15"
      style={{
        backgroundColor: isLight ? BG_LIGHT : BG_PANEL,
        color: isLight ? TXT_DARK : TXT_LIGHT,
      }}
    >
      <div
        className="panel-image relative w-full lg:w-[45vw] max-w-[560px] aspect-[4/3] rounded-xl overflow-hidden"
        style={{
          clipPath: "inset(0 100% 0 0)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {(block.image || project.image) ? (
          <Image
            src={block.image || project.image}
            alt="Feature"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover z-10"
            unoptimized
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : null}
        <ImageFallback idx={panelIdx} />
      </div>
      <div className="panel-content w-full lg:max-w-[320px] opacity-0">
        <SectionLabel idx={panelIdx} text="Feature Focus" light={isLight} />
        <h3
          className="panel-heading"
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: "20px",
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {block.heading}
        </h3>
        <p
          className="panel-body"
          style={{
            color: "currentColor",
            opacity: 0.75,
            fontSize: "clamp(16px, 1.2vw, 19px)",
            lineHeight: 1.85,
          }}
        >
          {block.body}
        </p>
      </div>
    </section>
  );
});

const FullbleedBlock = forwardRef<HTMLElement, BlockProps>(
  function FullbleedBlock({ block, project, panelIdx }, ref) {
    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col items-center justify-center px-6 py-16 lg:py-0 lg:px-15 gap-6"
        style={{ backgroundColor: BG_PANEL }}
      >
        <SectionLabel idx={panelIdx} text="Visual" />
        <div
          className="panel-image relative w-full lg:max-w-[1050px] aspect-[16/9] rounded-xl overflow-hidden"
          style={{
            clipPath: "inset(0 100% 0 0)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {(block.image || project.image) ? (
            <Image
              src={block.image || project.image}
              alt="Visual"
              fill
              sizes="100vw"
              className="object-cover z-10"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}
          <ImageFallback idx={panelIdx} />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent 50%)",
            }}
          />
          <p
            className="absolute bottom-5 left-6"
            style={{
              color: TXT_MUTED,
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {block.body || "Pillar Highlight"}
          </p>
        </div>
      </section>
    );
  }
);

const RichTextBlock = forwardRef<HTMLElement, BlockProps>(
  function RichTextBlock({ block, panelIdx }, ref) {
    const isLight = block.theme === "light";
    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row items-center justify-center px-6 py-16 lg:py-0 lg:px-[120px] gap-12 lg:gap-16"
        style={{
          backgroundColor: isLight ? BG_LIGHT : BG_PANEL,
          color: isLight ? TXT_DARK : TXT_LIGHT,
        }}
      >
        <div className="panel-content flex-1 w-full lg:max-w-[600px] opacity-0">
          <SectionLabel idx={panelIdx} text="System Specifications" light={isLight} />
          <h3
            className="panel-heading"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: "32px",
              letterSpacing: "-0.02em",
            }}
          >
            {block.heading}
          </h3>

          {block.body && (
            <div
              className={`panel-body prose max-w-none ${isLight ? "prose-zinc" : "prose-invert prose-zinc"} prose-headings:font-normal prose-a:text-gold [&_form]:flex [&_form]:flex-col [&_form]:gap-5 [&_input]:w-full [&_input]:bg-current/5 [&_input]:border [&_input]:border-current/10 [&_input]:rounded-md [&_input]:px-4 [&_input]:py-3 [&_input]:text-[13px] [&_input]:outline-none focus:[&_input]:border-gold focus:[&_input]:ring-1 focus:[&_input]:ring-gold [&_textarea]:w-full [&_textarea]:bg-current/5 [&_textarea]:border [&_textarea]:border-current/10 [&_textarea]:rounded-md [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-[13px] [&_textarea]:outline-none focus:[&_textarea]:border-gold focus:[&_textarea]:ring-1 focus:[&_textarea]:ring-gold [&_label]:block [&_label]:text-[10px] [&_label]:tracking-[0.2em] [&_label]:uppercase [&_label]:mb-1.5 [&_label]:opacity-60 [&_button]:mt-4 [&_button]:bg-gold [&_button]:text-black [&_button]:px-8 [&_button]:py-4 [&_button]:rounded-full [&_button]:font-semibold [&_button]:text-[11px] [&_button]:tracking-[0.2em] [&_button]:uppercase [&_button]:transition-transform hover:[&_button]:scale-105 active:[&_button]:scale-95`}
              style={{ fontSize: "clamp(16px, 1.2vw, 19px)", lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{ __html: block.body }}
            />
          )}
        </div>

        {block.image ? (
          <div
            className="panel-image relative w-full lg:w-[40%] aspect-square lg:aspect-4/5 rounded-xl overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <Image
              src={block.image}
              alt={block.heading || "Detail"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover z-10"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
            <ImageFallback idx={panelIdx} />
          </div>
        ) : null}
      </section>
    );
  }
);
