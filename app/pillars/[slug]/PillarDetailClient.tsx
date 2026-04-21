"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import type { Pillar, ContentBlock, Offer } from "@/lib/types/pillars";
import { projects as mockProjects } from "@/lib/projectData";
import { useRouter } from "next/navigation";
/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — matched to homepage globals.css
   ───────────────────────────────────────────────────────────── */
const GOLD = "#d4af37";
const COPPER = "#b87333";
const SILVER = "#c0c0c0";
const TURQUOISE = "#0a9396";
const BG_DARK = "rgba(4, 9, 16, 0.02)";
const BG_PANEL = "rgba(10, 10, 14, 0.05)";
const BG_LIGHT = "rgba(245, 240, 235, 0.03)";
const GLASS_DARK = "rgba(4, 9, 16, 0.3)";
const GLASS_LIGHT = "rgba(245, 240, 235, 0.1)";
const TXT_LIGHT = "#f5f5f5";
const TXT_MUTED = "rgba(255,255,255,0.8)";
const TXT_DARK = "#1c1d21";
const TXT_DARK_MUTED = "rgba(28,29,33,0.5)";
const BORDER_DARK = "rgba(212,175,55,0.12)";
const BORDER_LIGHT = "rgba(28,29,33,0.08)";

/** Fallback: look up mock offers by slug when the API doesn't provide them yet */
function getOffersForPillar(slug: string): Offer[] | undefined {
  const mock = mockProjects.find((p) => p.slug === slug);
  return mock?.offers as Offer[] | undefined;
}

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

  // Merge API offers with fallback mock offers until backend supports the field
  const enrichedProject = useMemo(() => {
    if (project.offers && project.offers.length > 0) return project;
    const fallbackOffers = getOffersForPillar(project.slug);
    if (fallbackOffers) {
      return { ...project, offers: fallbackOffers };
    }
    return project;
  }, [project]);

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

  const hasOffers = enrichedProject.offers && enrichedProject.offers.length > 0;
  const totalPanels = 2 + (enrichedProject.contentBlocks?.length || 0) + (hasOffers ? 1 : 0);

  return (
    <div
      ref={outerRef}
      className="relative lg:fixed lg:inset-0 overflow-y-auto lg:overflow-hidden"
      style={{ backgroundColor: "transparent", color: TXT_LIGHT }}
    >
      {/* ─── Global Atmosphere Overlay ─── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          background: "radial-gradient(circle at center, rgba(6,6,6,0.7) 0%, rgba(6,6,6,0.3) 100%)" 
        }} 
      />
      {/* ─── Top Fade Protection ─── */}
      <div 
        className="fixed top-0 left-0 w-full h-32 z-40 bg-gradient-to-b from-[#060606]/90 via-[#060606]/50 to-transparent pointer-events-none" 
      />

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
            className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold backdrop-blur-md pointer-events-auto"
            style={{ 
              color: project.theme.background,
              backgroundColor: hexToRgba(project.theme.background, 0.1),
              border: `1px solid ${hexToRgba(project.theme.background, 0.2)}`
            }}
          >
            {project.tags?.join(" · ")}
          </span>
        )}
      </nav>

      {/* ─── Progress Bar ─── */}
      <div
        className="fixed bottom-0 left-0 w-full h-px z-50"
        style={{ backgroundColor: hexToRgba(project.theme.accent, 0.1) }}
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{ backgroundColor: project.theme.accent, width: 0, willChange: "width" }}
        />
      </div>

      {/* ─── Panel Counter ─── */}
      <div
        className="fixed bottom-10 right-8 z-50 text-sm tracking-[0.25em] uppercase font-medium hidden lg:block"
        style={{ color: TXT_MUTED }}
      >
        <span ref={counterRef} style={{ color: project.theme.accent }}>01</span>
        <span className="mx-1 opacity-30">/</span>
        {String(totalPanels).padStart(2, "0")}
      </div>

      {/* ─── Scroll Track ─── */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-screen lg:items-stretch opacity-0 will-change-transform relative z-10"
      >
        {/* ═══════ PANEL 1 — Hero ═══════ */}
        <section
          ref={(el) => registerPanel(el, 0)}
          className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col lg:flex-row"
          style={{ backgroundColor: "transparent" }}
        >
          {/* Left: Text Content */}
          <div className="w-full lg:w-[46%] h-auto lg:h-full flex flex-col justify-center px-6 py-20 lg:py-0 lg:pl-15 lg:pr-14 pt-28 lg:pt-0 relative z-10">
            {/* Section marker — matching homepage pattern */}
            <div
              className="hero-label mb-8 flex items-center gap-3"
              style={{ opacity: 0 }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.theme.accent, boxShadow: `0 0 8px ${hexToRgba(project.theme.accent, 0.6)}` }}
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
                        border: `1px solid ${hexToRgba(project.theme.accent, 0.5)}`,
                        color: project.theme.accent,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase" as const,
                        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = project.theme.accent;
                        e.currentTarget.style.color = project.theme.background;
                        e.currentTarget.style.borderColor = project.theme.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = project.theme.accent;
                        e.currentTarget.style.borderColor = hexToRgba(project.theme.accent, 0.5);
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
                      color: project.theme.background,
                    }}
                  >
                    Services
                  </h3>
                  <div
                    className="w-10 h-px mb-5"
                    style={{ backgroundColor: hexToRgba(project.theme.background, 0.35) }}
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
                          style={{ width: "4px", height: "4px", backgroundColor: project.theme.background, opacity: 0.7, display: "inline-block" }}
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
                boxShadow: `0 20px 80px rgba(0,0,0,0.5), 0 0 40px ${hexToRgba(project.theme.accent, 0.04)}`,
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
                      `repeating-linear-gradient(135deg, transparent, transparent 2px, ${hexToRgba(project.theme.accent, 0.15)} 2px, ${hexToRgba(project.theme.accent, 0.15)} 3px)`,
                    backgroundSize: "8px 8px",
                  }}
                />
                {/* Gold accent ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-[min(50vw,280px)] h-[min(50vw,280px)] rounded-full opacity-[0.03]"
                    style={{
                      border: `1px solid ${project.theme.accent}`,
                      boxShadow: `inset 0 0 80px ${hexToRgba(project.theme.accent, 0.03)}`,
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
                  border: `1px solid ${hexToRgba(project.theme.accent, 0.06)}`,
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>
        </section>

        {/* ═══════ OFFERS PANEL ═══════ */}
        {enrichedProject.offers && enrichedProject.offers.length > 0 && (
          <OffersBlock
            project={enrichedProject}
            panelIdx={1}
            ref={(el) => registerPanel(el, 1)}
          />
        )}

        {/* ═══════ DYNAMIC CMS PANELS ═══════ */}
        {enrichedProject.contentBlocks?.map((block, i) => {
          const hasOffers = enrichedProject.offers && enrichedProject.offers.length > 0;
          const panelIdx = i + (hasOffers ? 2 : 1);
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
          className="w-full min-h-[60vh] lg:w-screen lg:h-screen shrink-0 flex items-end overflow-hidden relative"
          style={{
            backgroundColor: GLASS_DARK,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderLeft: "1px solid rgba(255,255,255,0.03)"
          }}
        >
          {/* Guard: only show "Next Chapter" when a different pillar exists */}
          {nextProject.slug !== project.slug ? (
            <div className="panel-content w-full flex flex-col md:flex-row md:items-end justify-between gap-8 px-6 pb-20 lg:px-15 lg:pb-24 opacity-0">
              <Link
                href={`/pillars/${nextProject.slug}`}
                className="no-underline group"
              >
                <span
                  className="block text-[10px] tracking-[0.3em] uppercase font-semibold mb-4"
                  style={{ color: "rgba(255,255,255,0.5)" }}
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
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
                    whiteSpace: "pre-line" as const,
                    transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
                    transform: "translateX(0px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateX(20px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "transparent";
                    e.currentTarget.style.transform = "translateX(0px)";
                  }}
                >
                  {nextProject.title}
                </h2>
              </Link>
              <Link
                href={`/pillars/${nextProject.slug}`}
                className="flex items-center gap-4 mb-0 md:mb-4 no-underline group"
              >
                <span
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors duration-300"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Next Project
                </span>
                <span
                  className="block w-10 lg:w-16 h-px transition-all duration-300 group-hover:w-20"
                  style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                />
                <span
                  className="text-lg transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  →
                </span>
              </Link>
            </div>
          ) : (
            /* Fallback when only 1 pillar exists — elegant return-to-home CTA */
            <div className="panel-content w-full flex flex-col md:flex-row md:items-end justify-between gap-8 px-6 pb-20 lg:px-15 lg:pb-24 opacity-0">
              <Link href="/" className="no-underline group">
                <span
                  className="block text-[10px] tracking-[0.3em] uppercase font-semibold mb-4"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Return
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
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
                    whiteSpace: "pre-line" as const,
                    transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
                    transform: "translateX(0px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateX(20px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "transparent";
                    e.currentTarget.style.transform = "translateX(0px)";
                  }}
                >
                  GOTT WALD
                </h2>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-4 mb-0 md:mb-4 no-underline group"
              >
                <span
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Back to Home
                </span>
                <span
                  className="block w-10 lg:w-16 h-px transition-all duration-300 group-hover:w-20"
                  style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                />
                <span
                  className="text-lg transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  →
                </span>
              </Link>
            </div>
          )}
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
   SHARED UI COMPONENTS & UTILS
   ═══════════════════════════════════════════════════════════════ */

import { forwardRef } from "react";

/** Convert hex to rgba to easily mix dynamic API colors with glass effects */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.length === 3 ? cleanHex[0] + cleanHex[0] : cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.length === 3 ? cleanHex[1] + cleanHex[1] : cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.length === 3 ? cleanHex[2] + cleanHex[2] : cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface BlockProps {
  block: ContentBlock;
  project: Pillar;
  panelIdx: number;
}

/** Reusable premium fallback for images (dark gradient + gold accents) */
function ImageFallback({ idx, accentHex }: { idx: number; accentHex: string }) {
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
            `repeating-linear-gradient(135deg, transparent, transparent 2px, ${hexToRgba(accentHex, 0.12)} 2px, ${hexToRgba(accentHex, 0.12)} 3px)`,
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
        style={{ border: `1px solid ${hexToRgba(accentHex, 0.05)}`, borderRadius: "12px" }}
      />
    </div>
  );
}

/** Section label — "• 02 — HEADING" matching homepage style */
function SectionLabel({ idx, text, color, dotColor }: { idx: number; text: string; color: string; dotColor: string }) {
  return (
    <div className="panel-label flex items-center gap-3 mb-10 opacity-0">
      <span
        className="w-1.5 h-1.5 rounded-full shadow-lg"
        style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${hexToRgba(dotColor, 0.6)}` }}
      />
      <span
        className="text-[10px] tracking-[0.3em] uppercase font-bold"
        style={{ color: hexToRgba(color, 0.7) }}
      >
        {String(idx + 1).padStart(2, "0")} — {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OFFERS BLOCK COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const OffersBlock = forwardRef<HTMLElement, { project: Pillar; panelIdx: number }>(
  function OffersBlock({ project, panelIdx }, ref) {
    const router = useRouter();
    if (!project.offers || project.offers.length === 0) return null;

    /* ── Tier config — each metal has its own colour language ── */
    const TIER_CONFIG = {
      copper: {
        gradient: "linear-gradient(135deg, rgba(192,120,64,0.18) 0%, rgba(192,120,64,0.06) 60%, transparent 100%)",
        headerGlow: "rgba(192,120,64,0.55)",
        border: "rgba(192,120,64,0.35)",
        borderHover: "rgba(192,120,64,0.7)",
        accent: "#c07840",
        shadow: "0 12px 48px rgba(192,120,64,0.2), 0 0 0 1px rgba(192,120,64,0.12)",
        badgeBg: "rgba(192,120,64,0.12)",
        label: "Copper",
        labelColor: "#c07840",
        deliverableColor: "rgba(192,120,64,0.8)",
      },
      silver: {
        gradient: "linear-gradient(135deg, rgba(184,192,204,0.15) 0%, rgba(184,192,204,0.05) 60%, transparent 100%)",
        headerGlow: "rgba(184,192,204,0.55)",
        border: "rgba(184,192,204,0.30)",
        borderHover: "rgba(184,192,204,0.65)",
        accent: "#b8c0cc",
        shadow: "0 12px 48px rgba(184,192,204,0.15), 0 0 0 1px rgba(184,192,204,0.1)",
        badgeBg: "rgba(184,192,204,0.1)",
        label: "Silver",
        labelColor: "#b8c0cc",
        deliverableColor: "rgba(184,192,204,0.8)",
      },
      gold: {
        gradient: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.07) 60%, transparent 100%)",
        headerGlow: "rgba(212,175,55,0.65)",
        border: "rgba(212,175,55,0.40)",
        borderHover: "rgba(212,175,55,0.80)",
        accent: "#d4af37",
        shadow: "0 12px 48px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.15)",
        badgeBg: "rgba(212,175,55,0.12)",
        label: "Gold",
        labelColor: "#d4af37",
        deliverableColor: "rgba(212,175,55,0.85)",
      },
    } as const;

    type TierKey = keyof typeof TIER_CONFIG;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex flex-col justify-center px-6 py-16 lg:py-0 lg:px-15 relative"
        style={{
          background: "transparent",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top, ${hexToRgba(project.theme.accent, 0.03)} 0%, transparent 60%)` }} />
        <div className="panel-content w-full max-w-[1400px] mx-auto opacity-0 relative z-10 h-full max-h-[calc(100vh-160px)] overflow-y-auto [&::-webkit-scrollbar]:w-0 allow-native-scroll flex flex-col justify-start lg:justify-center">
          {/* Section header */}
          <div className="panel-label flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: project.theme.accent }}
              />
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {String(panelIdx + 1).padStart(2, "0")} — Strategic Offers
              </span>
            </div>
            <h3 className="panel-heading text-[clamp(1.5rem,3vw,2.5rem)] font-serif italic mt-1 opacity-90 text-white">
              Engagement Matrix
            </h3>
            {/* Copper · Silver · Gold legend strip */}
            <div className="flex items-center gap-6 mt-4">
              {(["copper", "silver", "gold"] as TierKey[]).map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: TIER_CONFIG[t].accent, boxShadow: `0 0 8px ${TIER_CONFIG[t].accent}` }}
                  />
                  <span
                    className="text-[9px] tracking-[0.25em] uppercase font-bold"
                    style={{ color: TIER_CONFIG[t].labelColor }}
                  >
                    {TIER_CONFIG[t].label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Based Engagement Matrix */}
          <div className="panel-body flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch w-full max-w-[1300px] mx-auto mt-12 pb-12 lg:pb-0 pt-4">
            {project.offers.map((offer, idx, arr) => {
              const tierKey = (offer.tier as TierKey) in TIER_CONFIG
                ? (offer.tier as TierKey)
                : "gold";
              const tc = TIER_CONFIG[tierKey];
              const isCenter = idx === Math.floor(arr.length / 2);
              
              const features = offer.description.includes("\n")
                ? offer.description.split("\n").map(s => s.trim()).filter(Boolean)
                : offer.description.split(". ").map(s => s.trim()).filter(Boolean).map(s => s.endsWith(".") ? s : s + ".");

              return (
                <div
                  key={idx}
                  className={`w-full lg:w-1/3 flex flex-col rounded-[2rem] overflow-hidden group transition-all duration-700 relative backdrop-blur-3xl ${
                    isCenter ? "lg:-translate-y-5 lg:scale-[1.05] z-10" : "z-0 opacity-80 hover:opacity-100 lg:translate-y-2"
                  }`}
                  style={{
                    backgroundColor: "rgba(5, 8, 12, 0.6)",
                    border: `1px solid ${isCenter ? tc.borderHover : tc.border}`,
                    boxShadow: isCenter ? `0 20px 80px -10px ${tc.accent}40` : `0 10px 40px -10px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Editorial Glassmorphic Header Plate */}
                  <div
                    className="w-full pt-10 pb-16 flex flex-col items-center justify-center relative shadow-2xl shrink-0"
                    style={{
                      backgroundColor: "rgba(2, 4, 8, 0.4)",
                      clipPath: "polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%)",
                    }}
                  >
                    {/* Glowing Top Edge */}
                    <div className="absolute top-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${tc.accent}80, transparent)` }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                    <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${tc.accent}30 0%, transparent 70%)` }} />
                    
                    <span 
                      className="relative z-10 text-[10px] tracking-[0.3em] font-bold uppercase mb-4 px-5 py-2 rounded-full border border-white/10 shadow-lg backdrop-blur-xl"
                      style={{ color: tc.labelColor, backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      {tc.label} Pack
                    </span>
                    <h3 className="relative z-10 text-2xl lg:text-3xl font-serif text-white text-center px-6 leading-tight drop-shadow-lg">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Body List */}
                  <div className="flex flex-col flex-1 px-8 lg:px-10 py-8 relative -mt-6">
                    {/* Glow inside edges */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at top, ${tc.accent}15 0%, transparent 60%)` }} />
                    
                    <ul className="flex flex-col gap-6 relative z-10 mb-10 flex-1 mt-4">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex gap-4 items-start">
                          <span className="w-5 h-5 mt-0.5 rounded-full flex flex-col items-center justify-center border shrink-0 bg-black/20 shadow-inner" style={{ borderColor: `${tc.accent}80`, color: tc.accent }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className="text-white text-[15px] font-normal leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Bottom CTA & Deliverable */}
                    <div className="mt-auto w-full flex flex-col items-center gap-8 relative z-10">
                      <div className="text-center w-full pt-8 border-t border-white/10">
                        <span className="block text-[9px] uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: tc.labelColor }}>Deliverable</span>
                        <span className="text-white text-[15px] block font-medium leading-snug">
                          {offer.deliverable}
                        </span>
                      </div>

                      <button
                      onClick={() => {
                        router.push("/contact");
                      }}
                        className="w-full py-4 rounded-full font-bold uppercase tracking-[0.25em] text-[11px] transition-all duration-500 relative overflow-hidden group/btn"
                        style={{
                          background: `linear-gradient(90deg, ${tc.accent}40 0%, ${tc.accent}15 100%)`,
                          border: `1px solid ${tc.accent}60`,
                        }}
                      >
                        <span className="relative z-10 transition-transform duration-300 group-hover/btn:scale-105 inline-block text-white">
                          GET STARTED
                        </span>
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(90deg, ${tc.accent}40 0%, ${tc.accent}15 100%)` }} />
                        <div className="absolute top-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${tc.accent}80, transparent)` }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);


/* ═══════════════════════════════════════════════════════════════
   CMS BLOCK COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const ShowcaseBlock = forwardRef<HTMLElement, BlockProps>(
  function ShowcaseBlock({ block, project, panelIdx }, ref) {
    const isLight = block.theme === "light";
    const bgHex = isLight ? project.theme.text : project.theme.background;
    const txtHex = isLight ? project.theme.background : project.theme.text;
    const accentHex = project.theme.accent;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div
          className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col items-center justify-center p-8 lg:p-12 relative"
          style={{
            backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
            color: txtHex,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
            boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          <SectionLabel idx={panelIdx} text="Showcase" color={txtHex} dotColor={accentHex} />
          <div
            className="panel-image relative w-full lg:max-w-[1050px] flex-1 min-h-[40vh] rounded-[32px] overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: `0 24px 80px ${hexToRgba(bgHex, 0.6)}`,
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
            <ImageFallback idx={panelIdx} accentHex={accentHex} />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${hexToRgba(bgHex, 0.4)}, transparent 60%)`,
              }}
            />
          </div>
        </div>
      </section>
    );
  }
);

const CaseStudyBlock = forwardRef<HTMLElement, BlockProps>(
  function CaseStudyBlock({ block, project, panelIdx }, ref) {
    const isLight = block.theme === "light";
    const bgHex = isLight ? project.theme.text : project.theme.background;
    const txtHex = isLight ? project.theme.background : project.theme.text;
    const accentHex = project.theme.accent;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div
          className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative"
          style={{
            backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
            color: txtHex,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
            boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          <div className="panel-content allow-native-scroll flex-1 min-h-0 overflow-y-auto p-10 lg:p-16 lg:pr-12 opacity-0 [&::-webkit-scrollbar]:w-0">
            <div className="flex flex-col justify-center min-h-full py-4">
              <SectionLabel idx={panelIdx} text="Case Study" color={txtHex} dotColor={accentHex} />
              <h3
                className="panel-heading"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: "24px",
                  color: txtHex,
                }}
              >
                {block.heading || "Case Study"}
              </h3>
              <p
                className="panel-body"
                style={{
                  fontSize: "clamp(16px, 1.2vw, 19px)",
                  color: isLight ? txtHex : hexToRgba(txtHex, 0.8),
                  lineHeight: 1.9,
                  maxWidth: "520px",
                  whiteSpace: "pre-line",
                }}
              >
                {block.body}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-stretch">
            <div
              className="panel-image relative w-full h-full min-h-[40vh] rounded-[32px] overflow-hidden"
              style={{
                clipPath: "inset(0 100% 0 0)",
                boxShadow: `0 20px 60px ${hexToRgba(bgHex, 0.4)}`,
              }}
            >
              {(block.image || project.image) ? (
                <Image
                  src={block.image || project.image}
                  alt="Case Study"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover z-10"
                  unoptimized
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
              ) : null}
              <ImageFallback idx={panelIdx} accentHex={accentHex} />
            </div>
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
  const isLight = block.theme === "light";
  const bgHex = isLight ? project.theme.text : project.theme.background;
  const txtHex = isLight ? project.theme.background : project.theme.text;
  const accentHex = project.theme.accent;

  return (
    <section
      ref={ref}
      className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
    >
      <div
        className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative"
        style={{
          backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
          color: txtHex,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
          boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}`,
        }}
      >
        <div className="panel-content allow-native-scroll flex-1 min-h-0 overflow-y-auto p-10 lg:p-16 lg:pr-12 opacity-0 [&::-webkit-scrollbar]:w-0">
          <div className="flex flex-col justify-center min-h-full py-4">
            <SectionLabel idx={panelIdx} text="Key Metrics" color={txtHex} dotColor={accentHex} />
            <p
              className="panel-body"
              style={{
                fontSize: "clamp(16px, 1.2vw, 19px)",
                color: isLight ? txtHex : hexToRgba(txtHex, 0.8),
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
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      color: accentHex,
                    }}
                  >
                    {stat.value}
                  </span>
                  <p
                    className="mt-2 text-[12px] uppercase font-bold tracking-[0.25em]"
                    style={{ color: hexToRgba(txtHex, 0.7) }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-stretch">
          <div
            className="panel-image relative w-full h-full min-h-[40vh] rounded-[32px] overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: `0 20px 60px ${hexToRgba(bgHex, 0.4)}`,
            }}
          >
            {(block.image || project.image) ? (
              <Image
                src={block.image || project.image}
                alt="Stats"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover z-10"
                unoptimized
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
            ) : null}
            <ImageFallback idx={panelIdx} accentHex={accentHex} />
          </div>
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
  const bgHex = isLight ? project.theme.text : project.theme.background;
  const txtHex = isLight ? project.theme.background : project.theme.text;
  const accentHex = project.theme.accent;

  return (
    <section
      ref={ref}
      className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
    >
      <div
        className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative"
        style={{
          backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
          color: txtHex,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
          boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}`,
        }}
      >
        {/* Image on left for feature block */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-stretch">
          <div
            className="panel-image relative w-full h-full min-h-[40vh] rounded-[32px] overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: `0 20px 60px ${hexToRgba(bgHex, 0.4)}`,
            }}
          >
            {(block.image || project.image) ? (
              <Image
                src={block.image || project.image}
                alt="Feature"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover z-10"
                unoptimized
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
            ) : null}
            <ImageFallback idx={panelIdx} accentHex={accentHex} />
          </div>
        </div>

        <div className="panel-content allow-native-scroll flex-1 min-h-0 overflow-y-auto p-10 lg:p-16 lg:pl-12 opacity-0 [&::-webkit-scrollbar]:w-0">
          <div className="flex flex-col justify-center min-h-full py-4">
            <SectionLabel idx={panelIdx} text="Feature Focus" color={txtHex} dotColor={accentHex} />
            <h3
              className="panel-heading"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: "24px",
                letterSpacing: "-0.02em",
                whiteSpace: "pre-line",
                WebkitTextStroke: `1px ${hexToRgba(txtHex, 0.9)}`,
                color: "transparent",
              }}
            >
              {block.heading}
            </h3>
            <p
              className="panel-body"
              style={{
                color: isLight ? txtHex : hexToRgba(txtHex, 0.8),
                fontSize: "clamp(16px, 1.2vw, 19px)",
                lineHeight: 1.85,
                maxWidth: "520px",
              }}
            >
              {block.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

const FullbleedBlock = forwardRef<HTMLElement, BlockProps>(
  function FullbleedBlock({ block, project, panelIdx }, ref) {
    const isLight = block.theme === "light";
    const bgHex = isLight ? project.theme.text : project.theme.background;
    const txtHex = isLight ? project.theme.background : project.theme.text;
    const accentHex = project.theme.accent;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div
          className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col items-center justify-center p-8 lg:p-12 relative"
          style={{
            backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
            color: txtHex,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
            boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          <SectionLabel idx={panelIdx} text="Visual" color={txtHex} dotColor={accentHex} />
          <div
            className="panel-image relative w-full lg:max-w-[1050px] flex-1 min-h-[40vh] rounded-[32px] overflow-hidden"
            style={{
              clipPath: "inset(0 100% 0 0)",
              boxShadow: `0 24px 80px ${hexToRgba(bgHex, 0.6)}`,
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
            <ImageFallback idx={panelIdx} accentHex={accentHex} />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${hexToRgba(bgHex, 0.45)}, transparent 50%)`,
              }}
            />
            <p
              className="absolute bottom-6 left-8 font-bold"
              style={{
                color: txtHex,
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              {block.body || "Pillar Highlight"}
            </p>
          </div>
        </div>
      </section>
    );
  }
);

const RichTextBlock = forwardRef<HTMLElement, BlockProps>(
  function RichTextBlock({ block, project, panelIdx }, ref) {
    const isLight = block.theme === "light";
    const bgHex = isLight ? project.theme.text : project.theme.background;
    const txtHex = isLight ? project.theme.background : project.theme.text;
    const accentHex = project.theme.accent;

    return (
      <section
        ref={ref}
        className="w-full lg:w-screen lg:h-screen shrink-0 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div
          className="w-full h-full max-h-[85vh] lg:max-w-[1400px] rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative"
          style={{
            backgroundColor: isLight ? bgHex : hexToRgba(bgHex, 0.9),
            color: txtHex,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${hexToRgba(txtHex, 0.08)}`,
            boxShadow: `0 30px 100px -20px ${hexToRgba(bgHex, 0.5)}, inset 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          <div className="panel-content allow-native-scroll flex-1 min-h-0 overflow-y-auto p-10 lg:p-16 lg:pr-12 opacity-0 [&::-webkit-scrollbar]:w-0">
            <div className="flex flex-col justify-center min-h-full py-4">
              <SectionLabel idx={panelIdx} text="System Specifications" color={txtHex} dotColor={accentHex} />
              <h3
                className="panel-heading"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  marginBottom: "32px",
                  letterSpacing: "-0.02em",
                  color: txtHex,
                }}
              >
                {block.heading}
              </h3>

              {block.body && (
                <div
                  className="panel-body prose max-w-none prose-headings:font-normal"
                  style={{ 
                    fontSize: "clamp(16px, 1.2vw, 19px)", 
                    lineHeight: 1.85,
                    color: isLight ? txtHex : hexToRgba(txtHex, 0.8),
                    "--tw-prose-body": isLight ? txtHex : hexToRgba(txtHex, 0.8),
                    "--tw-prose-headings": txtHex,
                    "--tw-prose-lead": isLight ? txtHex : hexToRgba(txtHex, 0.8),
                    "--tw-prose-links": accentHex,
                    "--tw-prose-bold": txtHex,
                    "--tw-prose-counters": hexToRgba(txtHex, 0.6),
                    "--tw-prose-bullets": hexToRgba(accentHex, 0.7),
                    "--tw-prose-hr": hexToRgba(txtHex, 0.1),
                    "--tw-prose-quotes": txtHex,
                    "--tw-prose-quote-borders": hexToRgba(txtHex, 0.2),
                    "--tw-prose-captions": hexToRgba(txtHex, 0.5),
                    "--tw-prose-code": txtHex,
                    "--tw-prose-pre-code": txtHex,
                    "--tw-prose-pre-bg": hexToRgba(bgHex, 0.5),
                  } as any}
                >
                  <div 
                    className="[&_a]:font-semibold [&_a:hover]:opacity-80 transition-opacity"
                    dangerouslySetInnerHTML={{ __html: block.body }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-4 lg:p-8 flex items-stretch">
            {block.image ? (
              <div
                className="panel-image relative w-full h-full min-h-[40vh] rounded-[32px] overflow-hidden"
                style={{
                  clipPath: "inset(0 100% 0 0)",
                  boxShadow: `0 20px 60px ${hexToRgba(bgHex, 0.4)}`,
                }}
              >
                <Image
                  src={block.image}
                  alt={block.heading || "Detail"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover z-10"
                  unoptimized
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
                <ImageFallback idx={panelIdx} accentHex={accentHex} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }
);
