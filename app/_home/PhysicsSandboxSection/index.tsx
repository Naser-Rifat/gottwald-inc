"use client";

import { useRef } from "react";

import { usePageColorShift } from "@/lib/usePageColorShift";

import { useHeroEntrance } from "./_hooks/useHeroEntrance";
import { useMagneticPull } from "./_hooks/useMagneticPull";

import HeaderSlot from "./_components/HeaderSlot";
import HeroTitleBlock from "./_components/HeroTitleBlock";
import AmbientOrb from "./_components/AmbientOrb";
import ScrollIndicator from "./_components/ScrollIndicator";

// Home page tints the GlobalCanvas toward a vibrant cyan/teal to match the first pillar immediately.
const HOME_COLOR_SHIFT = "#27c6cd";

/**
 * PhysicsSandboxSection — opening hero of the home page. Builds the
 * full entrance choreography for the headline, ambient orb, and scroll
 * indicator; subscribes the GlobalCanvas color shift; and registers
 * the magnetic-pull handlers for the scroll indicator.
 */
export default function PhysicsSandboxSection() {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  usePageColorShift(HOME_COLOR_SHIFT);

  const { ref: scrollBtnRef, handlers: scrollBtnHandlers } =
    useMagneticPull<HTMLDivElement>();

  useHeroEntrance({ heroRef, headerRef, orbRef, scrollBtnRef });

  return (
    <>
      <HeaderSlot ref={headerRef} />

      <section
        ref={heroRef}
        data-journey="perception"
        aria-label="GOTT WALD Hero — Turning Complexity Into Clarity"
        className="relative w-full h-screen flex flex-col pointer-events-none text-white overflow-hidden pb-[8vh] sm:pb-[10vh] px-gutter"
        style={{ perspective: "1000px" }}
      >
        <div className="flex-1 flex items-end z-10 relative w-full max-w-[1600px] mx-auto pointer-events-auto">
          <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-8">
            <HeroTitleBlock />

            <div className="flex flex-row lg:flex-col justify-between items-end lg:items-end w-full lg:w-auto gap-4 lg:gap-6 mb-2">
              <AmbientOrb ref={orbRef} />
              <ScrollIndicator
                ref={scrollBtnRef}
                handlers={scrollBtnHandlers}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
