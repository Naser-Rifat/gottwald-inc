"use client";

/**
 * Ambient sine-wave drift along the bottom edge — connects this section
 * to the brand's signal/frequency vocabulary (also seen in PILLARS
 * imagery and the TuningInstrument HUD).
 */
export default function FrequencyWave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] lg:h-[28vh] z-0 overflow-hidden"
    >
      <div
        className="strategic-signal-drift absolute bottom-0 left-0 w-[200%] h-full will-change-transform"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
        }}
      >
        <svg
          viewBox="0 0 1600 200"
          preserveAspectRatio="none"
          className="block w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0,100 Q100,40 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100 T1400,100 T1600,100"
            fill="none"
            stroke="rgba(18, 168, 172, 0.20)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0,130 Q100,90 200,130 T400,130 T600,130 T800,130 T1000,130 T1200,130 T1400,130 T1600,130"
            fill="none"
            stroke="rgba(18, 168, 172, 0.10)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
