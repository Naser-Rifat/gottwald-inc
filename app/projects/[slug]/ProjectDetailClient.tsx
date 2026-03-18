"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Project, ContentBlock } from "@/lib/types/project";

interface Props {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetailClient({ project, nextProject }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const registerPanel = useCallback(
    (el: HTMLElement | null, idx: number) => {
      if (el) panelRefs.current[idx] = el;
    },
    []
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!outer || !track) return;

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

    const heroPanel = panelRefs.current[0];
    if (heroPanel) {
      gsap.fromTo(
        heroPanel.querySelector(".hero-title"),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-desc"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-services"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
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
        }
      );
      gsap.fromTo(
        heroPanel.querySelector(".hero-cta"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.8 }
      );
      if (heroPanel) heroPanel.dataset.revealed = "1";
    }

    gsap.fromTo(
      track,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    outer.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", recalc);
    raf = requestAnimationFrame(animate);

    return () => {
      outer.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", recalc);
      cancelAnimationFrame(raf);
    };
  }, []);

  const bg = project.theme.background;
  const txt = project.theme.text;
  const accent = project.theme.accent;

  const totalPanels =
    2 + (project.contentBlocks?.length || 0);

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
        <span style={{ color: accent }}>01</span> / {String(totalPanels).padStart(2, "0")}
      </div>

      <div
        ref={trackRef}
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "stretch",
          willChange: "transform",
          opacity: 0,
        }}
      >
        {/* ═══════ PANEL 1 — Hero ═══════ */}
        <section
          ref={(el) => registerPanel(el, 0)}
          style={{
            flexShrink: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            backgroundColor: bg,
          }}
        >
          <div
            style={{
              width: "46%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "60px",
              paddingRight: "40px",
              overflow: "hidden",
            }}
          >
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.8rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
                color: txt,
                whiteSpace: "pre-line",
                opacity: 0,
              }}
            >
              {project.title}
            </h1>

            <div
              style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
            >
              <div className="hero-desc" style={{ flex: 1, maxWidth: "320px", opacity: 0 }}>
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

              <div className="hero-services" style={{ width: "180px", flexShrink: 0, opacity: 0 }}>
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

          <div
            style={{
              width: "54%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              paddingRight: "30px",
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          >
            <div
              className="hero-image"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                clipPath: "inset(0 0 100% 0)",
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: "cover" }}
                priority
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
          style={{
            flexShrink: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background:
              "linear-gradient(90deg, #111118 0%, #f5f0eb 18%, #f5f0eb 100%)",
          }}
        >
          <div
            className="panel-content"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 60px 48px",
              opacity: 0,
            }}
          >
            <Link
              href={`/projects/${nextProject.slug}`}
              style={{ textDecoration: "none" }}
            >
              <h2
                className="next-title"
                style={{
                  fontSize: "clamp(3rem, 9vw, 10rem)",
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
              href={`/projects/${nextProject.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "16px",
                textDecoration: "none",
              }}
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
                style={{
                  display: "block",
                  width: "80px",
                  height: "1px",
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
      0
    );
  }

  if (heading) {
    tl.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      0.3
    );
  }

  if (body) {
    tl.fromTo(
      body,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.45
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
        stagger: 0.1,
        ease: "power3.out",
      },
      0.5
    );
  }
}

// ════════════════════════════════════════════════════════════════════
// DYNAMIC CMS BLOCK COMPONENTS — with ref forwarding for reveal
// ════════════════════════════════════════════════════════════════════

import { forwardRef } from "react";

interface BlockProps {
  block: ContentBlock;
  project: Project;
}

const ShowcaseBlock = forwardRef<HTMLElement, BlockProps>(
  function ShowcaseBlock({ block, project }, ref) {
    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: block.theme === "light" ? "#f0ece6" : "#0a0a12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <div
          className="panel-image"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1050px",
            aspectRatio: "16/10",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <Image
            src={block.image || project.image}
            alt={`${project.title} showcase`}
            fill
            style={{ objectFit: "cover" }}
          />
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
  }
);

const CaseStudyBlock = forwardRef<HTMLElement, BlockProps>(
  function CaseStudyBlock({ block, project }, ref) {
    const isLight = block.theme !== "dark";
    const bgColor = isLight ? "#f0ece6" : "#0a0a12";
    const txtColor = isLight ? "#1a1a1a" : "#f5f5f5";
    const muted = isLight
      ? "rgba(26,26,26,0.55)"
      : "rgba(255,255,255,0.55)";
    const border = isLight
      ? "rgba(26,26,26,0.08)"
      : "rgba(255,255,255,0.08)";

    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: bgColor,
          color: txtColor,
          display: "flex",
        }}
      >
        <div
          className="panel-content"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 40px 60px",
            opacity: 0,
          }}
        >
          <h3
            className="panel-heading"
            style={{
              fontSize: "2.6rem",
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
          style={{
            width: "38%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 40px 36px",
            borderLeft: `1px solid ${border}`,
          }}
        >
          <div
            className="panel-image"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/5",
              borderRadius: "12px",
              overflow: "hidden",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            <Image
              src={block.image || project.image}
              alt="Case Study"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    );
  }
);

const StatsBlock = forwardRef<HTMLElement, BlockProps>(
  function StatsBlock({ block, project }, ref) {
    const isLight = block.theme !== "dark";
    const bgColor = isLight ? "#f0ece6" : "#0a0a12";
    const txtColor = isLight ? "#1a1a1a" : "#f5f5f5";
    const muted = isLight
      ? "rgba(26,26,26,0.55)"
      : "rgba(255,255,255,0.55)";
    const border = isLight
      ? "rgba(26,26,26,0.08)"
      : "rgba(255,255,255,0.08)";

    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: bgColor,
          color: txtColor,
          display: "flex",
        }}
      >
        <div
          className="panel-content"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 40px 60px",
            opacity: 0,
          }}
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
          <div style={{ display: "flex", gap: "48px" }}>
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
          style={{
            width: "32%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 40px 40px 36px",
            borderLeft: `1px solid ${border}`,
          }}
        >
          <div
            className="panel-image"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "12px",
              overflow: "hidden",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            <Image
              src={block.image || project.image}
              alt="Stats"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    );
  }
);

const FeatureBlock = forwardRef<HTMLElement, BlockProps>(
  function FeatureBlock({ block, project }, ref) {
    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: block.theme === "light" ? "#f0ece6" : "#0a0a12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "48px",
          padding: "0 60px",
          color: block.theme === "light" ? "#1a1a1a" : "#fff",
        }}
      >
        <div
          className="panel-image"
          style={{
            position: "relative",
            width: "45vw",
            maxWidth: "560px",
            aspectRatio: "4/3",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <Image
            src={block.image || project.image}
            alt="Feature"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="panel-content" style={{ maxWidth: "300px", opacity: 0 }}>
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
  }
);

const FullbleedBlock = forwardRef<HTMLElement, BlockProps>(
  function FullbleedBlock({ block, project }, ref) {
    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#111118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <div
          className="panel-image"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1050px",
            aspectRatio: "16/9",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <Image
            src={block.image || project.image}
            alt="Final"
            fill
            style={{ objectFit: "cover" }}
          />
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
            {block.body || "Project Highlight"}
          </p>
        </div>
      </section>
    );
  }
);

const RichTextBlock = forwardRef<HTMLElement, BlockProps>(
  function RichTextBlock({ block }, ref) {
    const isLight = block.theme === "light";
    return (
      <section
        ref={ref}
        style={{
          flexShrink: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: isLight ? "#f0ece6" : "#0d0d12",
          color: isLight ? "#1a1a1a" : "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: "64px",
        }}
      >
        <div className="panel-content" style={{ flex: 1, maxWidth: "600px", opacity: 0 }}>
          <h3
            className="panel-heading"
            style={{
              fontSize: "2.4rem",
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

        {block.image && (
          <div
            className="panel-image"
            style={{
              width: "40%",
              aspectRatio: "4/5",
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            <Image
              src={block.image}
              alt={block.heading || "Rich Text Image"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </section>
    );
  }
);
