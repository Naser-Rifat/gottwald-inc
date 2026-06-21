"use client";

interface ProgressIndicatorProps {
  activeIndex: number;
  total: number;
}

/** Bottom-center horizontal progress: "01 ──── 08". */
export default function ProgressIndicator({
  activeIndex,
  total,
}: ProgressIndicatorProps) {
  const displayIndex = Math.max(1, activeIndex);
  const fillPercent = (displayIndex / total) * 100;

  return (
    <div
      className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 mix-blend-screen pointer-events-none transition-opacity duration-700 ease-in-out ${activeIndex > 0 ? "opacity-100" : "opacity-0"}`}
    >
      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50">
        {String(displayIndex).padStart(2, "0")}
      </span>
      <div className="w-24 sm:w-40 h-[1px] bg-white/20 relative overflow-hidden rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50">
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
