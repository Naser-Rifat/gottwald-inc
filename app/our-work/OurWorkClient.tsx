"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import type { Project } from "@/lib/types/project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OurWorkClientProps {
  projects: Project[];
}

export default function OurWorkClient({ projects }: OurWorkClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word-wrap");
        gsap.fromTo(
          words,
          { y: "110%", rotateX: -80 },
          {
            y: "0%",
            rotateX: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out",
            delay: 0.2,
          }
        );
      }

      if (counterRef.current) {
        gsap.fromTo(
          counterRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.6,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-hidden selection:bg-gold selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="min-h-screen bg-transparent pt-[20vh] pb-[15vh]">
        <section className="flex flex-col px-gutter w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[8vw] mb-20 lg:mb-32 max-w-[1600px] mx-auto w-full">
            <div className="lg:w-1/2" style={{ perspective: "600px" }}>
              <h1
                ref={headlineRef}
                className="text-white text-[clamp(4.5rem,7vw,7rem)] leading-[0.9] font-bold tracking-[-0.02em] uppercase mb-6 overflow-hidden"
              >
                <span className="inline-block overflow-hidden">
                  <span className="word-wrap inline-block">All</span>
                </span>
                <br />
                <span className="inline-block overflow-hidden">
                  <span className="word-wrap inline-block">Pillars.</span>
                </span>
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gold text-[clamp(0.75rem,0.9vw,0.85rem)] tracking-[0.2em] font-medium uppercase">
                  Trust. Structure. Performance.
                </p>
                <span
                  ref={counterRef}
                  className="text-white/30 text-[clamp(1rem,1.2vw,1.4rem)] font-light opacity-0"
                >
                  {projects.length}
                </span>
              </div>
            </div>

            <div className="lg:w-[55%] flex flex-col gap-8 text-white/90 text-[clamp(1.1rem,1.4vw,1.6rem)] font-light leading-relaxed max-w-2xl lg:mt-2">
              <p>
                We build{" "}
                <span className="text-white font-medium">
                  operating-grade systems
                </span>{" "}
                for people and strategic assets—when outcomes must be clear,
                execution must be clean, and performance must be repeatable.
              </p>

              <div className="pt-6 mt-2 border-t border-white/20">
                <p className="text-white/70 text-[clamp(0.95rem,1.1vw,1.2rem)] leading-relaxed">
                  Explore our full registry of structural pillars below. Each
                  one is a complete component—designed to stand alone, and
                  engineered to connect into one integrated operating system.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[3.5vw] gap-y-[10vh] max-w-[1600px] mx-auto w-full">
            {projects.map((project, index) => (
              <PillarCard
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PillarCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const tags = tagsRef.current;
    if (!card || !imageWrap || !image || !title || !tags) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });

      tl.fromTo(
        imageWrap,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          delay: index % 2 === 1 ? 0.15 : 0,
        }
      );

      tl.fromTo(
        image,
        { scale: 1.3 },
        { scale: 1, duration: 1.4, ease: "power3.out" },
        "<"
      );

      tl.fromTo(
        tags,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.5"
      );

      const chars = title.textContent || "";
      title.innerHTML = chars
        .split("")
        .map(
          (c) =>
            `<span class="inline-block overflow-hidden"><span class="title-char inline-block translate-y-full">${c === " " ? "&nbsp;" : c}</span></span>`
        )
        .join("");

      tl.to(
        title.querySelectorAll(".title-char"),
        {
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power3.out",
        },
        "-=0.4"
      );

      gsap.to(image, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!card || !image || !overlay) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;

    gsap.to(image, {
      scale: 1.05,
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(overlay, {
      opacity: 0.15,
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,0.2), transparent 70%)`,
      duration: 0.3,
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!image || !overlay) return;

    gsap.to(image, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      overwrite: "auto",
    });
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug}`}
      className="group block cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageWrapRef}
        className="relative overflow-hidden rounded-xl aspect-3/2 mb-6"
        style={{ clipPath: "inset(100% 0 0 0)" }}
      >
        <div
          ref={imageRef}
          className="w-full h-full relative"
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none opacity-0"
          />
        </div>
      </div>

      <div ref={tagsRef} className="flex items-center gap-1 mb-4 opacity-0">
        {project.tags.map((tag, i) => (
          <span key={tag} className="flex items-center">
            <span className="text-[10px] tracking-[0.15em] text-white/35 uppercase font-medium">
              {tag}
            </span>
            {i < project.tags.length - 1 && (
              <span className="text-white/20 text-[8px] mx-2">•</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center">
        <span className="w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-hover:mr-4 opacity-0 transition-all duration-500 ease-out text-gold font-light text-2xl">
          →
        </span>
        <h3
          ref={titleRef}
          className="text-white text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-tight leading-[1.1] whitespace-pre-line group-hover:text-gold transition-colors duration-500"
        >
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
