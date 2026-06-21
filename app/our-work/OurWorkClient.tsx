"use client";

import { useState } from "react";
import type { Pillar } from "@/lib/types/pillars";
import PillarFluidCanvas from "@/components/PillarFluidCanvas";
import FooterSection from "@/components/FooterSection";

import { useGhostCursor } from "./_hooks/useGhostCursor";
import { useActiveSnapSection } from "./_hooks/useActiveSnapSection";
import TopNavigation from "./_components/TopNavigation";
import CursorGlow from "./_components/CursorGlow";
import HeroSlide from "./_components/HeroSlide";
import StandardsSlide from "./_components/StandardsSlide";
import PillarSlide from "./_components/PillarSlide";

interface OurWorkClientProps {
  pillars: Pillar[];
}

interface SlideColor {
  base: string;
  petrol: string;
  turquoise: string;
}

const STATIC_SLIDE_COLORS: SlideColor[] = [
  { base: "#020205", petrol: "#050a15", turquoise: "#1a2b3c" }, // 0: Hero
  { base: "#010101", petrol: "#050505", turquoise: "#2a220a" }, // 1: Standards
  // pillar colors are appended dynamically
];

// Footer slide color — deep neutral
const FOOTER_SLIDE_COLOR: SlideColor = {
  base: "#020205",
  petrol: "#030308",
  turquoise: "#12a8ac",
};

const pillarToSlideColor = (pillar: Pillar): SlideColor => ({
  base: pillar.theme?.background || "#050505",
  petrol: pillar.theme?.background || "#151515",
  turquoise: pillar.theme?.accent || "#d4af37",
});

const scrollToSlide = (index: number) => {
  const el = document.getElementById(`slide-${index}`);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function OurWorkClient({ pillars }: OurWorkClientProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const cursorRef = useGhostCursor<HTMLDivElement>();
  const activeSlide = useActiveSnapSection();

  const slideColors: SlideColor[] = [
    ...STATIC_SLIDE_COLORS,
    ...pillars.map(pillarToSlideColor),
    FOOTER_SLIDE_COLOR, // footer slide
  ];

  const navItems = [
    "The Present",
    "Standards",
    ...pillars.map((p) => p.title.split(" ")[0]),
  ];

  const footerSlideIndex = pillars.length + 2;

  const currentColors = slideColors[activeSlide] ?? slideColors[0];
  const resetHover = () => setHoveredSlug(null);

  return (
    <div
      className="bg-[#050505] h-screen w-full overflow-hidden text-white selection:bg-white selection:text-black relative font-sans"
      style={{ cursor: "none" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-80 transition-colors duration-1000">
        <PillarFluidCanvas
          colorBase={currentColors.base}
          colorPetrol={currentColors.petrol}
          colorTurquoise={currentColors.turquoise}
          className="absolute inset-0 mix-blend-screen"
        />
      </div>

      <TopNavigation
        items={navItems}
        activeIndex={activeSlide}
        onSelect={scrollToSlide}
        onReset={resetHover}
      />

      <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <HeroSlide onMouseEnter={resetHover} />
        <StandardsSlide onMouseEnter={resetHover} />

        {pillars.map((pillar, index) => (
          <PillarSlide
            key={pillar.slug}
            pillar={pillar}
            index={index}
            slideIndex={index + 2}
            onHoverChange={setHoveredSlug}
          />
        ))}

        {/* Footer Slide */}
        <section
          id={`slide-${footerSlideIndex}`}
          data-index={footerSlideIndex}
          className="snap-section snap-always snap-start w-full relative z-10"
          onMouseEnter={resetHover}
        >
          <FooterSection />
        </section>
      </div>

      <CursorGlow ref={cursorRef} expanded={hoveredSlug !== null} />
    </div>
  );
}
