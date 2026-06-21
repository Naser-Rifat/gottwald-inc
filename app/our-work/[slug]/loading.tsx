export default function PillarLoading() {
  return (
    <section className="fixed inset-0 z-[9998] bg-[#040404] text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Background Noise & Line */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} 
      />
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/5 pointer-events-none" />
      
      {/* Brand Mark Top Left */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-4 opacity-50">
        <span className="font-mono text-[#d4af37] text-xs tracking-[0.5em] uppercase font-bold">GH</span>
        <span className="w-10 h-px bg-[#d4af37]/40" />
      </div>

      {/* Small Premium Circular Loader */}
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          {/* Active Progress Ring (CSS Animated) */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="289.026"
            className="animate-[svg-spin_2s_ease-in-out_infinite]"
          />
        </svg>
        
        {/* Inner Loading Pulse */}
        <div className="flex flex-col items-center animate-pulse">
          <span className="font-mono text-white/50 text-[9px] tracking-[0.3em] uppercase select-none">
            LOADING
          </span>
        </div>
      </div>

      {/* Minimal Page Route Label */}
      <h2 className="text-white/40 text-[10px] lg:text-[11px] font-mono tracking-[0.5em] uppercase mt-8 select-none">
        PROJECT
      </h2>

      {/* Bottom right — pathname */}
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 opacity-30 select-none">
        <span className="font-mono text-[9px] lg:text-[10px] tracking-[0.4em] uppercase text-white/70">
          Gottwald Holding
        </span>
      </div>

      <style>{`
        @keyframes svg-spin {
          0% { stroke-dashoffset: 289.026; }
          50% { stroke-dashoffset: 70; }
          100% { stroke-dashoffset: 289.026; transform: rotate(360deg); transform-origin: 50px 50px; }
        }
      `}</style>
    </section>
  );
}
