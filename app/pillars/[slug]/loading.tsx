export default function PillarLoading() {
  return (
    <section className="fixed inset-0 z-[9998] bg-[#040404] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(120deg,transparent,rgba(201,168,76,0.25),transparent)]" />
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/5 pointer-events-none" />

      <div className="relative h-full w-full flex flex-col items-center justify-center gap-7">
        <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/50">
          Loading
        </span>

        <h2 className="font-mono text-[clamp(1.8rem,4vw,3.4rem)] tracking-[0.18em] uppercase text-white/90">
          Pillar
        </h2>

        <div className="relative w-44 h-px bg-white/10 overflow-hidden">
          <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-[#C9A84C] animate-[pillar-shimmer_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/40">
          Details
        </p>
      </div>

      <style>{`
        @keyframes pillar-shimmer {
          0% { transform: translateX(0%); opacity: 0.25; }
          50% { opacity: 1; }
          100% { transform: translateX(320%); opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
