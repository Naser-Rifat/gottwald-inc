export default function PillarLoading() {
  return (
    <section className="fixed inset-0 z-[9998] bg-[#040404] text-white">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative h-full w-full flex flex-col items-center justify-center gap-6">
        <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-white/55">
          Loading
        </span>

        <div className="w-28 h-px bg-white/15 overflow-hidden">
          <div className="h-full w-1/2 bg-[#C9A84C] animate-[pulse_1.1s_ease-in-out_infinite]" />
        </div>

        <p className="font-mono text-xs tracking-[0.35em] uppercase text-white/40">
          Pillar Details
        </p>
      </div>
    </section>
  );
}
