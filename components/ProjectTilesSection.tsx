"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projectData";

export default function ProjectTilesSection() {
  return (
    <section
      id="project-tiles-section"
      className="flex flex-col px-[5vw] w-full py-[15vh]"
    >
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-14">
        <h2 className="text-white text-[clamp(1.6rem,3.5vw,4rem)] font-bold tracking-tight">
          Featured Work
        </h2>
        <Link
          href="#"
          className="text-[11px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase flex items-center gap-2"
        >
          See all projects
          <span className="text-sm">→</span>
        </Link>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[2.5vw] gap-y-[8vh]">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group cursor-pointer block"
          >
            {/* Image container */}
            <div className="relative overflow-hidden rounded-xl aspect-[3/2] mb-5">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1 mb-2.5">
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

            {/* Title with arrow */}
            <h3 className="text-white text-[clamp(1.2rem,2vw,2rem)] font-semibold tracking-tight flex items-center gap-3">
              {index === 0 && (
                <span className="text-white/50 text-lg font-light">→</span>
              )}
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                {project.title}
              </span>
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
