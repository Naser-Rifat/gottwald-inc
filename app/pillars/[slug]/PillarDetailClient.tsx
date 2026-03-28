"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Pillar, ContentBlock } from "@/lib/types/pillars";

interface Props {
  project: Pillar;
  nextProject: Pillar;
}

export default function PillarDetailClient({ project, nextProject }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const registerPanel = useCallback((el: HTMLElement | null, idx: number) => {
    if (el) panelRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!outer || !track) return;

    const mm = gsap.matchMedia();

    // =============== DESKTOP: Horizontal Scroll ===============
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

        const panels = panelRefs.current;
        panels.forEach((panel) => {
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          const viewW = window.innerWidth;
          const visible = rect.left < viewW && rect.right > 0;

          if (visible && !panel.dataset.revealed) {
            panel.dataset.revealed = "1";
            revealPanel(panel);
          }
        });

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

    // =============== MOBILE: Vertical Native Scroll ===============
    mm.add("(max-width: 1023px)", () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";

      let raf: number;

      // Simple intersection observer polyfill via rAF for mobile reveals
      const animateMobile = () => {
        const panels = panelRefs.current;
        panels.forEach((panel) => {
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          // Reveal when top is within viewport
          const visible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

          if (visible && !panel.dataset.revealed) {
            panel.dataset.revealed = "1";
            revealPanel(panel);
          }
        });

        // Update progress bar based on vertical scroll
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

    // =============== INITIAL HERO REVEAL (Both) ===============
    const heroPanel = panelRefs.current[0];
    if (heroPanel) {
      gsap.fromTo(
        heroPanel.querySelector(".hero-title"),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 },
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-desc"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-services"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 },
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-image"),
        { clipPath: "inset(0 0 100% 0)", scale: 1.1 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.4,
          ease: "power4.inOut",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-cta"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.8 },
      );
      heroPanel.dataset.revealed = "1";
    }

    gsap.fromTo(
      track,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
    );

    return () => mm.revert();
  }, []);

  const bg = project.theme.background;
  const txt = project.theme.text;
  const accent = project.theme.accent;

  const totalPanels = 2 + (project.contentBlocks?.length || 0);

  return (
    <div
      ref={outerRef}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        backgroundColor: bg,
        color: txt,
      }}
    >
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 60px",
          pointerEvents: "none",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wider opacity-65 no-underline transition-opacity duration-300 hover:opacity-100 pointer-events-auto"
          style={{ color: txt }}
        >
          ← back
        </Link>
        <span
          style={{
            color: txt,
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.35,
          }}
        >
          {project.tags?.join(" · ")}
        </span>
      </nav>

      {/* Progress bar */}
      <div
        className="fixed bottom-0 left-0 w-full h-[2px] z-50"
        style={{ backgroundColor: `${txt}10` }}
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{ backgroundColor: accent, width: 0, willChange: "width" }}
        />
      </div>

      {/* Panel counter */}
      <div
        className="fixed bottom-6 right-8 z-50 text-[11px] tracking-[0.2em] uppercase font-medium"
        style={{ color: `${txt}40` }}
      >
        <span style={{ color: accent }}>01</span> /{" "}
        {String(totalPanels).padStart(2, "0")}
      </div>

      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-screen lg:items-stretch opacity-0 will-change-transform"
      >
        {/* ═══════ PANEL 1 — Hero ═══════ */}
        <section
          ref={(el) => registerPanel(el, 0)}
          className="w-full h-auto min-h-screen lg:w-[100vw] lg:h-[100vh] shrink-0 flex flex-col lg:flex-row"
          style={{ backgroundColor: bg }}
        >
          <div className="w-full lg:w-[46%] h-auto lg:h-full flex flex-col justify-center px-6 py-24 lg:py-0 lg:pl-[60px] lg:pr-[40px] overflow-hidden pt-32 lg:pt-0">
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
                color: txt,
                whiteSpace: "pre-line",
                opacity: 0,
              }}
            >
              {project.title}
            </h1>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-8 items-start">
              <div
                className="hero-desc flex-1 max-w-[320px] lg:max-w-[100%]"
                style={{ opacity: 0 }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.65,
                    opacity: 0.7,
                    margin: "0 0 10px 0",
                  }}
                >
                  {project.description}
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.65,
                    opacity: 0.7,
                    margin: "0 0 20px 0",
                  }}
                >
                  {project.details}
                </p>
                {project.launchUrl && (
                  <a
                    href={project.launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-cta"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "12px",
                      backgroundColor: "#fff",
                      color: accent || "#222",
                      padding: "14px 32px",
                      borderRadius: "100px",
                      border: "none",
                      textDecoration: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase" as const,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s",
                      opacity: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: accent || "#c00",
                        flexShrink: 0,
                      }}
                    />
                    Visit Website
                  </a>
                )}
              </div>

              <div
                className="hero-services w-full sm:w-[180px] shrink-0"
                style={{ opacity: 0 }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <h3
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      marginBottom: "8px",
                      color: accent,
                    }}
                  >
                    Services
                  </h3>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.6,
                      opacity: 0.7,
                    }}
                  >
                    {project.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                {project.recognitions && (
                  <div>
                    <h3
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.18em",
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        marginBottom: "8px",
                        color: accent,
                      }}
                    >
                      Recognitions
                    </h3>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: 1.6,
                        opacity: 0.7,
                      }}
                    >
                      {project.recognitions.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[54%] h-[50vh] lg:h-full flex items-center px-6 pb-24 lg:pb-4 lg:pr-[30px] lg:pt-4">
            <div
              className="hero-image relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            >
              {project.image ? (
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
              ) : null}

              {/* Premium abstract fallback */}
              <div className="absolute inset-0 pointer-events-none select-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                    backgroundSize: "6px 6px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <span className="text-[min(40vw,20rem)] font-black tracking-tighter mix-blend-overlay">
                    01
                  </span>
                </div>
              </div>
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
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "case-study":
              return (
                <CaseStudyBlock
                  key={i}
                  block={block}
                  project={project}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "feature":
              return (
                <FeatureBlock
                  key={i}
                  block={block}
                  project={project}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "stats":
              return (
                <StatsBlock
                  key={i}
                  block={block}
                  project={project}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "fullbleed":
              return (
                <FullbleedBlock
                  key={i}
                  block={block}
                  project={project}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            case "rich-text":
              return (
                <RichTextBlock
                  key={i}
                  block={block}
                  project={project}
                  ref={(el) => registerPanel(el, panelIdx)}
                />
              );
            default:
              return null;
          }
        })}

        {/* ═══════ LAST PANEL — Next project ═══════ */}
        <section
          ref={(el) =>
            registerPanel(el, (project.contentBlocks?.length || 0) + 1)
          }
          className="w-full h-[60vh] lg:w-[100vw] lg:h-[100vh] shrink-0 flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #111118 0%, #f5f0eb 18%, #f5f0eb 100%)",
          }}
        >
          <div
            className="panel-content w-full flex flex-col md:flex-row md:align-bottom justify-between gap-8 px-8 pb-12 lg:px-[60px] lg:pb-[48px] opacity-0"
          >
            <Link
              href={`/pillars/${nextProject.slug}`}
              style={{ textDecoration: "none" }}
            >
              <h2
                className="next-title"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 10rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.92,
                  color: "rgba(26,26,26,0.1)",
                  whiteSpace: "pre-line",
                  transition: "color 0.5s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(26,26,26,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(26,26,26,0.1)")
                }
              >
                {nextProject.title}
              </h2>
            </Link>
            <Link
              href={`/pillars/${nextProject.slug}`}
              className="flex items-center gap-4 lg:gap-5 mb-0 md:mb-4 no-underline"
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "rgba(26,26,26,0.4)",
                  transition: "color 0.3s",
                }}
              >
                NEXT PROJECT
              </span>
              <span
                className="block w-12 lg:w-20 h-[1px]"
                style={{
                  backgroundColor: "rgba(26,26,26,0.2)",
                  transition: "width 0.3s",
                }}
              />
              <span
                style={{
                  color: "rgba(26,26,26,0.4)",
                  fontSize: "18px",
                  transition: "all 0.3s",
                }}
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

function revealPanel(panel: HTMLElement) {
  const content = panel.querySelector(".panel-content");
  const image = panel.querySelector(".panel-image");
  const heading = panel.querySelector(".panel-heading");
  const body = panel.querySelector(".panel-body");
  const stats = panel.querySelectorAll(".panel-stat");

  const tl = gsap.timeline();

  if (image) {
    tl.fromTo(
      image,
      { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.2,
        ease: "power4.inOut",
      },
      0,
    );
  }

  if (heading) {
    tl.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      0.3,
    );
  }

  if (body) {
    tl.fromTo(
      body,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.45,
    );
  }

  if (content) {
    tl.fromTo(
      content,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      0.1,
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
        stagger: 0.1,
        ease: "power3.out",
      },
      0.5,
    );
  }
}

// ════════════════════════════════════════════════════════════════════
// DYNAMIC CMS BLOCK COMPONENTS — with ref forwarding for reveal
// ════════════════════════════════════════════════════════════════════

import { forwardRef } from "react";

interface BlockProps {
  block: ContentBlock;
  project: Pillar;
}

const ShowcaseBlock = forwardRef<HTMLElement, BlockProps>(
  function ShowcaseBlock({ block, project }, ref) {
    return (
      <section
        ref={ref}
        className="w-full min-h-[60vh] lg:w-[100vw] lg:h-[100vh] shrink-0 flex items-center justify-center px-6 py-16 lg:py-0 lg:px-[60px]"
        style={{
          backgroundColor: block.theme === "light" ? "#f0ece6" : "#0a0a12",
        }}
      >
        <div
          className="panel-image relative w-full lg:max-w-[1050px] aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {block.image || project.image ? (
            <Image
              src={block.image || project.image}
              alt={`${project.title} showcase`}
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}

          {/* Premium abstract fallback */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                backgroundSize: "6px 6px",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
            }}
          />
        </div>
      </section>
    );
  },
);

const CaseStudyBlock = forwardRef<HTMLElement, BlockProps>(
  function CaseStudyBlock({ block, project }, ref) {
    const isLight = block.theme !== "dark";
    const bgColor = isLight ? "#f0ece6" : "#0a0a12";
    const txtColor = isLight ? "#1a1a1a" : "#f5f5f5";
    const muted = isLight ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.55)";
    const border = isLight ? "rgba(26,26,26,0.08)" : "rgba(255,255,255,0.08)";

    return (
      <section
        ref={ref}
        className="w-full min-h-screen lg:w-[100vw] lg:h-[100vh] shrink-0 flex flex-col lg:flex-row"
        style={{
          backgroundColor: bgColor,
          color: txtColor,
        }}
      >
        <div
          className="panel-content flex-1 flex flex-col justify-center px-6 py-16 lg:p-[40px_40px_40px_60px] opacity-0"
        >
          <h3
            className="panel-heading"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {block.heading || "Case Study"}
          </h3>
          <p
            className="panel-body"
            style={{
              fontSize: "15px",
              color: muted,
              lineHeight: 1.75,
              maxWidth: "480px",
              marginBottom: "40px",
              whiteSpace: "pre-line",
            }}
          >
            {block.body}
          </p>
        </div>
        <div
          className="w-full lg:w-[38%] flex flex-col justify-center px-6 pb-16 lg:pb-0 lg:p-[40px_40px_40px_36px]"
          style={{ borderLeft: `1px solid ${border}` }}
        >
          <div
            className="panel-image relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {block.image || project.image ? (
              <Image
                src={block.image || project.image}
                alt="Case Study"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
                unoptimized
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                }}
              />
            ) : null}

            {/* Premium abstract fallback */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                  backgroundSize: "6px 6px",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  },
);

const StatsBlock = forwardRef<HTMLElement, BlockProps>(function StatsBlock(
  { block, project },
  ref,
) {
  const isLight = block.theme !== "dark";
  const bgColor = isLight ? "#f0ece6" : "#0a0a12";
  const txtColor = isLight ? "#1a1a1a" : "#f5f5f5";
  const muted = isLight ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.55)";
  const border = isLight ? "rgba(26,26,26,0.08)" : "rgba(255,255,255,0.08)";

  return (
    <section
      ref={ref}
      className="w-full min-h-screen lg:w-[100vw] lg:h-[100vh] shrink-0 flex flex-col lg:flex-row"
      style={{
        backgroundColor: bgColor,
        color: txtColor,
      }}
    >
      <div
        className="panel-content flex-1 flex flex-col justify-center px-6 py-16 lg:p-[40px_40px_40px_60px] opacity-0"
      >
        <p
          className="panel-body"
          style={{
            fontSize: "15px",
            color: muted,
            lineHeight: 1.75,
            marginBottom: "40px",
            maxWidth: "380px",
          }}
        >
          {block.body}
        </p>
        <div className="flex gap-8 lg:gap-12 flex-wrap">
          {block.stats?.map((stat, idx) => (
            <div key={idx} className="panel-stat">
              <span
                style={{
                  fontSize: "3rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  color: muted,
                  marginTop: "8px",
                  letterSpacing: "0.04em",
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
        className="w-full lg:w-[32%] flex flex-col justify-center px-6 pb-16 lg:pb-0 lg:p-[40px_40px_40px_36px]"
        style={{ borderLeft: `1px solid ${border}` }}
      >
        <div
          className="panel-image relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {block.image || project.image ? (
            <Image
              src={block.image || project.image}
              alt="Stats"
              fill
              sizes="(max-width: 1024px) 100vw, 32vw"
              className="object-cover"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}

          {/* Premium abstract fallback */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                backgroundSize: "6px 6px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

const FeatureBlock = forwardRef<HTMLElement, BlockProps>(function FeatureBlock(
  { block, project },
  ref,
) {
  return (
    <section
      ref={ref}
      className="w-full min-h-screen lg:w-[100vw] lg:h-[100vh] shrink-0 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 px-6 py-16 lg:py-0 lg:px-[60px]"
      style={{
        backgroundColor: block.theme === "light" ? "#f0ece6" : "#0a0a12",
        color: block.theme === "light" ? "#1a1a1a" : "#fff",
      }}
    >
      <div
        className="panel-image relative w-full lg:w-[45vw] max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        {block.image || project.image ? (
          <Image
            src={block.image || project.image}
            alt="Feature"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            unoptimized
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : null}

        {/* Premium abstract fallback */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
              backgroundSize: "6px 6px",
            }}
          />
        </div>
      </div>
      <div className="panel-content w-full lg:max-w-[300px] opacity-0">
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "currentColor",
            opacity: 0.4,
            textTransform: "uppercase",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Feature Focus
        </span>
        <h3
          className="panel-heading"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "14px",
            whiteSpace: "pre-line",
          }}
        >
          {block.heading}
        </h3>
        <p
          className="panel-body"
          style={{
            color: "currentColor",
            opacity: 0.6,
            fontSize: "15px",
            lineHeight: 1.75,
          }}
        >
          {block.body}
        </p>
      </div>
    </section>
  );
});

const FullbleedBlock = forwardRef<HTMLElement, BlockProps>(
  function FullbleedBlock({ block, project }, ref) {
    return (
      <section
        ref={ref}
        className="w-full min-h-[60vh] lg:w-[100vw] lg:h-[100vh] shrink-0 flex items-center justify-center px-6 py-16 lg:py-0 lg:px-[60px]"
        style={{ backgroundColor: "#111118" }}
      >
        <div
          className="panel-image relative w-full lg:max-w-[1050px] aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {block.image || project.image ? (
            <Image
              src={block.image || project.image}
              alt="Final"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : null}

          {/* Premium abstract fallback */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                backgroundSize: "6px 6px",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
            }}
          />
          <p
            style={{
              position: "absolute",
              bottom: "24px",
              left: "32px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {block.body || "Pillar Highlight"}
          </p>
        </div>
      </section>
    );
  },
);

const RichTextBlock = forwardRef<HTMLElement, BlockProps>(
  function RichTextBlock({ block }, ref) {
    const isLight = block.theme === "light";
    return (
      <section
        ref={ref}
        className="w-full min-h-screen lg:w-[100vw] lg:h-[100vh] shrink-0 flex flex-col lg:flex-row items-center justify-center px-6 py-16 lg:py-0 lg:px-[120px] gap-12 lg:gap-[64px]"
        style={{
          backgroundColor: isLight ? "#f0ece6" : "#0d0d12",
          color: isLight ? "#1a1a1a" : "#f5f5f5",
        }}
      >
        <div
          className="panel-content flex-1 w-full lg:max-w-[600px] opacity-0"
        >
          <h3
            className="panel-heading"
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 700,
              marginBottom: "32px",
              letterSpacing: "-0.01em",
            }}
          >
            {block.heading}
          </h3>

          {block.body && (
            <div
              className={`panel-body prose max-w-none ${isLight ? "prose-zinc" : "prose-invert prose-zinc"} prose-headings:font-semibold prose-a:text-gold`}
              dangerouslySetInnerHTML={{ __html: block.body }}
            />
          )}
        </div>

        {block.image ? (
          <div
            className="panel-image relative w-full lg:w-[40%] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <Image
              src={block.image}
              alt={block.heading || "Rich Text Image"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              unoptimized
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />

            {/* Premium abstract fallback */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0c1018 0%, #0a0e16 30%, #0d111b 60%, #08090e 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,.12) 2px, rgba(255,255,255,.12) 3px)",
                  backgroundSize: "6px 6px",
                }}
              />
            </div>
          </div>
        ) : null}
      </section>
    );
  },
);
