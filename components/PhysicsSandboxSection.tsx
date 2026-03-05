import Header from "./Header";

export default function PhysicsSandboxSection() {
  return (
    <section className="relative w-screen min-h-screen flex flex-col px-[4.5vw] pointer-events-none text-white">
      <div className="pointer-events-auto z-20 w-full relative">
        <Header />
      </div>

      {/* Hero Typography - positioned in the lower third */}
      <div className="flex-1 flex flex-col justify-end pb-[10vh] z-10 relative">
        <div className="mb-4 text-[10px] md:text-[11px] tracking-[0.3em] text-white/40 font-normal uppercase">
          LABS AREA
        </div>
        <h1
          className="font-bold tracking-tighter"
          style={{ fontSize: "clamp(2.5rem, 7vw, 10rem)", lineHeight: "0.92" }}
        >
          PLAY GROUND
          <br />
          R&D COLLECTION
          <br />
          EXPERIMENTS
        </h1>

        {/* Description text - positioned to the right, aligned with bottom of title */}
        <div className="absolute bottom-[10vh] right-0 max-w-96 text-white/60 text-[13px] md:text-[14px] leading-[1.7] pointer-events-auto">
          A space dedicated to anticipate how new technologies will affect
          brands and how we interact with them through R&D.
        </div>
      </div>

      <div className="absolute bottom-6 right-[4.5vw] text-[10px] tracking-[0.2em] flex items-center gap-2 pointer-events-auto z-10 text-white/50">
        <span className="text-[11px] leading-none">↘</span> SCROLL DOWN
      </div>
    </section>
  );
}
