"use client";

import { useRef, useState, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card with a soft silver radial gradient that follows the cursor.
 *
 * Used in the "3 Ways to Join" grid. Tracks the mouse position relative
 * to the card and renders a 600px radial gradient at that point; opacity
 * blends in/out on enter/leave for a smooth reveal.
 *
 * `.stagger-item` keeps it in sync with the parent's stagger group
 * scroll-trigger animation in CareersClient.
 */
export default function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-10 transition-all duration-500 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(184,192,204,0.06)] stagger-item ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(184,192,204,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
        {children}
      </div>
    </div>
  );
}
