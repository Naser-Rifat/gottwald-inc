"use client";

interface ReturnVisitLoaderProps {
  /** 0-100. */
  progress: number;
  isLoaded: boolean;
}

// Circumference of r=46 circle, used for the stroke-dashoffset trick.
const RING_CIRCUMFERENCE = 289.026;

/**
 * Minimal circular progress shown when the user is returning to the
 * site within the session (portal already dismissed previously).
 */
export default function ReturnVisitLoader({
  progress,
  isLoaded,
}: ReturnVisitLoaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070c14] transition-opacity duration-1000 ${
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full bg-[#05060A]">
        <div className="relative flex items-center justify-center w-28 h-28">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#f4f6f9"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={
                RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * progress) / 100
              }
              className="transition-all duration-200 ease-out shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
          </svg>

          <span className="text-[12px] font-sans tracking-wide text-[#f4f6f9] opacity-90">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
