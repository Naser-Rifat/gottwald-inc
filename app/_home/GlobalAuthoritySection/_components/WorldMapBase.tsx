"use client";

import Image from "next/image";

export default function WorldMapBase() {
  return (
    <div className="relative inset-x-0 w-full z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="relative w-full sm:w-[130%] md:w-[120%] lg:w-[90%] max-w-[1600px] aspect-[1.47] flex items-center justify-center">
        {/* Localized ambient glow behind the map */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-turquoise/5 rounded-full blur-[150px] mix-blend-screen" />

        <Image
          src="/assets/world-map-dark.svg"
          alt="Global Network Map"
          fill
          className="object-contain opacity-[0.25] drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] mix-blend-screen"
          priority={false}
        />
      </div>
    </div>
  );
}
