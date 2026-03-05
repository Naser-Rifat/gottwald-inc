import Header from "./Header";

export default function PhysicsSandboxSection() {
  return (
    <section className="relative w-screen h-screen flex flex-col px-[5vw] pointer-events-none text-white">
      {/* Header */}
      <div className="pointer-events-auto z-20 w-full relative">
        <Header />
      </div>

      {/* Hero Content — centered vertically in remaining space */}
      <div className="flex-1 flex items-center z-10 relative">
        {/* Left: Label + Title */}
        <div className="flex-1">
          <div className="mb-5 text-[10px] md:text-[11px] tracking-[0.35em] text-white/35 font-normal uppercase">
            LABS AREA
          </div>
          <h1
            className="font-bold tracking-[-0.03em] leading-[0.88]"
            style={{ fontSize: "clamp(2.8rem, 7vw, 9rem)" }}
          >
            PLAY GROUND
            <br />
            R&D COLLECTION
            <br />
            EXPERIMENTS
          </h1>
        </div>

        {/* Right: Description anchored to bottom of title block */}
        <div className="hidden md:block max-w-[22rem] text-white/45 text-[13px] leading-[1.75] pointer-events-auto self-end mb-1">
          A space dedicated to anticipate how new technologies will affect
          brands and how we interact with them through R&D.
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-[5vw] text-[10px] tracking-[0.2em] flex items-center gap-2 pointer-events-auto z-10 text-white/40">
        <span className="text-[11px] leading-none">↘</span> SCROLL DOWN
      </div>
    </section>
  );
}
