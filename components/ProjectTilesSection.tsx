"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/projectData";
import { motion, Variants } from "framer-motion";

const MotionLink = motion.create(Link);

const arrowContainerVariants: Variants = {
  initial: { width: 0, opacity: 0, marginRight: 0 },
  hover: {
    width: "auto",
    opacity: 1,
    marginRight: 16,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const arrowVariants: Variants = {
  initial: { x: -20 },
  hover: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const titleVariants: Variants = {
  initial: { x: 0, color: "#ffffff" },
  hover: {
    x: 4,
    color: "#d4af37",
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const imageVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const overlayVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 0.1, transition: { duration: 0.5 } },
};

export default function ProjectTilesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="project-tiles-section"
      className="flex flex-col px-[5vw] w-full py-[15vh]"
    >
      {/* Section header & Editorial description (One Column) */}
      <div className="flex flex-col items-center text-center gap-10 mb-20 lg:mb-32 w-full">
        {/* Massive Headline */}
        <div className="flex flex-col items-center w-full max-w-[95vw] px-4">
          <h2 className="text-white text-[clamp(2.5rem,6vw,9rem)] leading-[0.9] font-bold tracking-tighter uppercase mb-6 whitespace-normal md:whitespace-nowrap">
            BUSINESS STANDARDS.
          </h2>
          <p className="text-gold text-[clamp(0.65rem,0.9vw,0.85rem)] tracking-[0.3em] font-bold uppercase">
            TRUST. STRUCTURE. PERFORMANCE.
          </p>
        </div>

        {/* Editorial Text Block (Expandable) */}
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-6 lg:px-0">
          <div className="text-white/80 font-light text-[clamp(1rem,1.3vw,1.5rem)] leading-[1.7] flex flex-col gap-8 w-full">
            <p className="text-white/90">
              We build{" "}
              <strong className="font-semibold text-white">
                operating-grade systems
              </strong>{" "}
              for people and strategic assets—when outcomes must be clear,
              execution must be clean, and performance must be repeatable.
            </p>

            <div
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]`}
              style={{
                maxHeight: isExpanded ? "1500px" : "0px",
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? "1rem" : "0",
              }}
            >
              <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/10 w-full max-w-3xl mx-auto text-[clamp(1rem,1.3vw,1.5rem)] text-white/90">
                <p>
                  GOTT WALD is not a collective of services. It is a unified
                  architecture: modular components, one standard, one language
                  of delivery—built to turn complexity into clarity, clarity
                  into decisions, and decisions into measurable impact.
                </p>
                <p className="text-white/90 text-4xl">
                  We don&apos;t market partnerships.
                  <br />
                  <strong className="text-white font-medium text-[clamp(1.15rem,1.6vw,1.8rem)] leading-tight block mt-3">
                    We operate them.
                  </strong>
                </p>
                <p>
                  Discreet. Stable. Security-first.
                  <br />
                  Confidentiality is not a promise—it is engineered into the
                  framework.
                </p>
                <p>
                  We don&apos;t talk about partners or projects, not out of
                  distance, but out of principle: trust compounds when it is
                  protected.
                </p>
                <p>
                  Our matrix scales without losing integrity: components evolve,
                  new layers can be added, markets can shift—yet the standard
                  remains.
                </p>
                <p>
                  At the core is a non-negotiable filter:
                  <br />
                  <strong className="text-gold font-medium tracking-[0.05em] block mt-3">
                    Peace. Love. Harmony — for more Humanity.
                  </strong>
                </p>
                <p>
                  Skill matters. Character decides.
                  <br />
                  Money is not the driver. Money is the result of alignment,
                  responsibility, and clean execution.
                </p>
              </div>
            </div>

            {/* Always visible bottom para driving to action */}
            <div className="pt-2 mt-2  border-t border-white/20 w-full max-w-3xl mx-auto"></div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group mx-auto flex items-center gap-4 text-[12px] font-bold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors mt-6 w-max"
            >
              <span className="relative overflow-hidden w-8 h-8 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/5 transition-all">
                <span
                  className={`block w-3 h-px bg-current transition-transform duration-500 absolute`}
                />
                <span
                  className={`block w-px h-3 bg-current transition-transform duration-500 absolute ${
                    isExpanded ? "rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                />
              </span>
              <span>{isExpanded ? "Read Less" : "Discover more"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project grid - Curated to top 4 for premium density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[2.5vw] gap-y-[8vh]">
        {projects.slice(0, 4).map((project) => (
          <MotionLink
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group cursor-pointer block"
            initial="initial"
            whileHover="hover"
          >
            {/* Image container */}
            <div className="relative overflow-hidden rounded-xl aspect-[3/2] mb-5">
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
            <div className="flex items-center gap-1 mb-2.5 mt-5">
              {project.tags.map((tag, i) => (
                <span key={tag} className="flex items-center">
                  <span className="text-[10px] tracking-[0.15em] text-white/35 uppercase font-normal">
                    {tag}
                  </span>
                  {i < project.tags.length - 1 && (
                    <span className="text-white/20 text-[8px] mx-1.5">•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Title with Framer Motion animated arrow */}
            <div className="flex items-center text-white text-[clamp(1.2rem,2vw,2rem)] font-semibold tracking-tight whitespace-pre-line">
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

      <Link
        href="/our-work"
        className="group mx-auto inline-flex items-center gap-4 text-white hover:text-gold transition-colors mt-12 w-fit"
      >
        <span className="text-[clamp(1rem,1vw,1.3rem)] tracking-[0.2em] uppercase font-bold">
          View all pillars
        </span>
        <span className="text-2xl font-light transform transition-transform duration-500 group-hover:translate-x-3">
          →
        </span>
      </Link>
    </section>
  );
}
