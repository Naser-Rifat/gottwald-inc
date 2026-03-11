"use client";

import Image from "next/image";
import Link from "next/link";
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
  return (
    <section
      id="project-tiles-section"
      className="flex flex-col px-[5vw] w-full py-[15vh]"
    >
      {/* Section header & Editorial description */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[8vw] mb-20 lg:mb-32">
        {/* Massive Headline Side */}
        <div className="lg:w-1/2">
          <h2 className="text-white text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] font-bold tracking-[-0.02em] uppercase mb-6">
            Business
            <br />
            Standards.
          </h2>
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
              Explore our pillars below. Each one is a complete
              component—designed to stand alone, and engineered to connect into
              one integrated operating system.
            </p>
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
