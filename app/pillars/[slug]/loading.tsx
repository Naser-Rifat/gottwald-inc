export default function PillarLoading() {
  return (
    <section className="fixed inset-0 z-[9998] bg-[#040404] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(120deg,transparent,rgba(201,168,76,0.25),transparent)]" />
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/5 pointer-events-none" />
      <div className="absolute top-10 left-10 font-mono text-[10px] tracking-[0.45em] text-[#C9A84C]/45 uppercase pointer-events-none select-none">
        GH
      </div>

      <div className="relative h-full w-full flex flex-col items-center justify-center gap-7">
        <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-white/50">
          Loading
        </span>

        <h2 className="font-mono text-[clamp(1.8rem,4vw,3.4rem)] tracking-[0.22em] uppercase text-white/90 animate-[pillar-title_680ms_ease-out_forwards]">
          Pillar
        </h2>

        <div className="relative w-44 h-px bg-white/10 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent animate-[pillar-progress-base_2.2s_ease-in-out_infinite]" />
          <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-[#C9A84C] animate-[pillar-shimmer_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/40">
          Details
        </p>
      </div>

      <style>{`
        @keyframes pillar-title {
          0% { opacity: 0; transform: translateY(10px); letter-spacing: 0.34em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.22em; }
        }
        @keyframes pillar-progress-base {
          0% { opacity: 0.12; }
          50% { opacity: 0.45; }
          100% { opacity: 0.12; }
        }
        @keyframes pillar-shimmer {
          0% { transform: translateX(0%); opacity: 0.25; }
          65% { opacity: 1; }
          100% { transform: translateX(320%); opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
