"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projectData";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MotionLink = motion.create(Link);

const arrowContainerVariants = {
  initial: { width: 0, opacity: 0, marginRight: 0 },
  hover: {
    width: "auto",
    opacity: 1,
    marginRight: 16,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const arrowVariants = {
  initial: { x: -20 },
  hover: { x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const titleVariants = {
  initial: { x: 0, color: "#ffffff" },
  hover: {
    x: 4,
    color: "#d4af37",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.7, ease: "easeOut" } },
};

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 0.1, transition: { duration: 0.5 } },
};

export default function OurWorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Trigger when top of card hits 85% of viewport
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-transparent pt-[20vh] pb-[15vh]">
      <section ref={containerRef} className="flex flex-col px-gutter w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[8vw] mb-20 lg:mb-32 max-w-[1600px] mx-auto w-full">
          {/* Massive Headline Side */}
          <div className="lg:w-1/2">
            <h1 className="text-white text-[clamp(4.5rem,7vw,7rem)] leading-[0.9] font-bold tracking-[-0.02em] uppercase mb-6">
              All
              <br />
              Pillars.
            </h1>
            <p className="text-gold text-[clamp(0.75rem,0.9vw,0.85rem)] tracking-[0.2em] font-medium uppercase">
              Trust. Structure. Performance.
            </p>
          </div>

          {/* Editorial Text Block Side */}
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
                Explore our full registry of structural pillars below. Each one
                is a complete component—designed to stand alone, and engineered
                to connect into one integrated operating system.
              </p>
            </div>
          </div>
        </div>

        {/* Full Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[3.5vw] gap-y-[10vh] max-w-[1600px] mx-auto w-full">
          {projects.map((project) => (
            <MotionLink
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card block cursor-pointer"
              initial="initial"
              whileHover="hover"
            >
              {/* Image container */}
              <div className="relative overflow-hidden rounded-xl aspect-[3/2] mb-6">
                <motion.div
                  variants={imageVariants}
                  className="w-full h-full relative"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Subtle overlay on hover */}
                  <motion.div
                    variants={overlayVariants}
                    className="absolute inset-0 bg-black"
                  />
                </motion.div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 mb-4">
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

              {/* Title with Framer Motion animated arrow */}
              <div className="flex items-center text-white text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold tracking-tight leading-[1.1] whitespace-pre-line">
                <motion.div
                  variants={arrowContainerVariants}
                  className="overflow-hidden flex items-center"
                >
                  <motion.span
                    variants={arrowVariants}
                    className="text-gold font-light block"
                  >
                    →
                  </motion.span>
                </motion.div>
                <motion.h3 variants={titleVariants}>{project.title}</motion.h3>
              </div>
            </MotionLink>
          ))}
        </div>
      </section>
    </main>
  );
}
