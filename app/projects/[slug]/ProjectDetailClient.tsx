"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project, ContentBlock } from "@/lib/projectData";

interface Props {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetailClient({ project, nextProject }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
    if (!outer || !track) return;

    let xTo = 0;
    let currentX = 0;
    const ease = 0.08;
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
      raf = requestAnimationFrame(animate);
    };

    gsap.fromTo(
      track,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: "power2.out" },
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
      {/* ── Fixed nav ── */}
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
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: txt,
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.04em",
            opacity: 0.65,
            textDecoration: "none",
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.65")}
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

      {/* ── Horizontal track ── */}
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
          style={{
            flexShrink: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            backgroundColor: bg,
          }}
        >
          {/* Left column */}
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
              style={{
                fontSize: "clamp(2rem, 4vw, 3.8rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
                color: txt,
                whiteSpace: "pre-line",
              }}
            >
              {project.title}
            </h1>

            <div
              style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
            >
              {/* Col A: Description + Button */}
              <div style={{ flex: 1, maxWidth: "320px" }}>
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

              {/* Col B: Services + Recognitions */}
              <div style={{ width: "180px", flexShrink: 0 }}>
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

          {/* Right column — Hero image */}
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
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
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

        {/* ═══════ DYNAMIC CMS PANELS (Panels 2+) ═══════ */}
        {project.contentBlocks?.map((block, i) => {
          switch (block.type) {
            case "showcase":
              return <ShowcaseBlock key={i} block={block} project={project} />;
            case "case-study":
              return <CaseStudyBlock key={i} block={block} project={project} />;
            case "feature":
              return <FeatureBlock key={i} block={block} project={project} />;
            case "stats":
              return <StatsBlock key={i} block={block} project={project} />;
            case "fullbleed":
              return <FullbleedBlock key={i} block={block} project={project} />;
            case "rich-text":
              return <RichTextBlock key={i} block={block} project={project} />;
            default:
              return null;
          }
        })}

        {/* ═══════ PANEL 6 — Next project ═══════ */}
        <section
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
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 60px 48px",
            }}
          >
            <Link
              href={`/projects/${nextProject.slug}`}
              style={{ textDecoration: "none" }}
            >
              <h2
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

// ════════════════════════════════════════════════════════════════════
// DYNAMIC CMS BLOCK COMPONENTS
// ════════════════════════════════════════════════════════════════════

interface BlockProps {
  block: ContentBlock;
  project: Project;
}

function ShowcaseBlock({ block, project }: BlockProps) {
  return (
    <section
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1050px",
          aspectRatio: "16/10",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
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
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
      </div>
    </section>
  );
}

function CaseStudyBlock({ block, project }: BlockProps) {
  const isLight = block.theme !== "dark";
  const bg = isLight ? "#f0ece6" : "#0a0a12";
  const txt = isLight ? "#1a1a1a" : "#f5f5f5";
  const muted = isLight ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.55)";
  const border = isLight ? "rgba(26,26,26,0.08)" : "rgba(255,255,255,0.08)";

  return (
    <section
      style={{
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: bg,
        color: txt,
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 40px 40px 60px",
        }}
      >
        <h3
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
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/5",
            borderRadius: "12px",
            overflow: "hidden",
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

function StatsBlock({ block, project }: BlockProps) {
  const isLight = block.theme !== "dark";
  const bg = isLight ? "#f0ece6" : "#0a0a12";
  const txt = isLight ? "#1a1a1a" : "#f5f5f5";
  const muted = isLight ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.55)";
  const border = isLight ? "rgba(26,26,26,0.08)" : "rgba(255,255,255,0.08)";

  return (
    <section
      style={{
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: bg,
        color: txt,
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 40px 40px 60px",
        }}
      >
        <p
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
            <div key={idx}>
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
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            borderRadius: "12px",
            overflow: "hidden",
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

function FeatureBlock({ block, project }: BlockProps) {
  return (
    <section
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
        style={{
          position: "relative",
          width: "45vw",
          maxWidth: "560px",
          aspectRatio: "4/3",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
        }}
      >
        <Image
          src={block.image || project.image}
          alt="Feature"
          fill
          style={{ objectFit: "cover", transform: "scale(1.08)" }}
        />
      </div>
      <div style={{ maxWidth: "300px" }}>
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

function FullbleedBlock({ block, project }: BlockProps) {
  return (
    <section
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1050px",
          aspectRatio: "16/9",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
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
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
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

function RichTextBlock({ block, project }: BlockProps) {
  const isLight = block.theme === "light";
  return (
    <section
      style={{
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: isLight ? "#f0ece6" : "#0d0d12",
        color: isLight ? "#1a1a1a" : "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 120px",
      }}
    >
      <h3
        style={{
          fontSize: "2.4rem",
          fontWeight: 700,
          marginBottom: "48px",
          letterSpacing: "-0.01em",
        }}
      >
        {block.heading}
      </h3>
      <div style={{ display: "flex", gap: "64px" }}>
        {block.richText?.map((node, i) => (
          <div key={i} style={{ flex: 1, maxWidth: "400px" }}>
            {node.heading && (
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: project?.theme?.accent || (isLight ? "#111" : "#fff"),
                }}
              >
                {node.heading}
              </h4>
            )}
            <div
              style={{ fontSize: "15px", lineHeight: 1.8, opacity: 0.7 }}
              dangerouslySetInnerHTML={{ __html: node.body || "" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
