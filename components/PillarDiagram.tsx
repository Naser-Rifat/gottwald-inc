"use client";

/**
 * PillarDiagram — bespoke abstract visualizations, one per principle.
 *
 * Each pillar's idea gets its own geometric study, rendered in SVG so it
 * scales crisp and stays light. Visuals lean on the brand's frequency /
 * instrumentation language: rings collapsing toward a center (truth),
 * branches converging (decisions), one clean wave above noise (signal),
 * stacked strata (infrastructure), and a vertical spectrum (presence).
 *
 * These read as "instrument plates" lifted from a technical manual — not
 * generic decorative shapes.
 */
export type PillarDiagramType =
  | "collapse"
  | "converge"
  | "isolation"
  | "foundation"
  | "resonance";

export default function PillarDiagram({
  type,
  className = "",
}: {
  type: PillarDiagramType;
  className?: string;
}) {
  const common = "w-full h-full overflow-visible";
  const cls = `${common} ${className}`;

  switch (type) {
    case "collapse":
      return <Collapse className={cls} />;
    case "converge":
      return <Converge className={cls} />;
    case "isolation":
      return <Isolation className={cls} />;
    case "foundation":
      return <Foundation className={cls} />;
    case "resonance":
      return <Resonance className={cls} />;
  }
}

/* 01 — Truth from noise. Four concentric rings + scattered "noise" particles
   outside; everything collapses toward a single luminous core. */
function Collapse({ className }: { className: string }) {
  const noise = Array.from({ length: 22 }, (_, i) => {
    // Deterministic pseudo-random based on i so the diagram is stable across
    // SSR / hydration. No Math.random() at render time.
    const a = (i * 73) % 360;
    const r = 95 + ((i * 17) % 55);
    const x = 100 + Math.cos((a * Math.PI) / 180) * r;
    const y = 100 + Math.sin((a * Math.PI) / 180) * r;
    return { x, y, op: 0.18 + ((i * 13) % 60) / 200 };
  });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {noise.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="0.7"
          fill="rgba(255,255,255,0.55)"
          opacity={n.op}
        />
      ))}
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="rgba(18,168,172,0.10)"
        strokeWidth="0.5"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="62"
        stroke="rgba(18,168,172,0.22)"
        strokeWidth="0.5"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="38"
        stroke="rgba(18,168,172,0.45)"
        strokeWidth="0.6"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="18"
        stroke="rgba(18,168,172,0.78)"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="100" cy="100" r="2.6" fill="rgba(18,168,172,0.95)" />
    </svg>
  );
}

/* 02 — Decisions branching, then converging back to a single line. Reads as
   "many paths, one outcome". */
function Converge({ className }: { className: string }) {
  const branches = [
    { mid: 30, op: 0.32 },
    { mid: 62, op: 0.5 },
    { mid: 100, op: 0.78 },
    { mid: 138, op: 0.5 },
    { mid: 170, op: 0.32 },
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {branches.map((b, i) => (
        <path
          key={i}
          d={`M 100 12 Q ${b.mid} 100 100 188`}
          stroke={`rgba(18,168,172,${b.op})`}
          strokeWidth="0.7"
          fill="none"
        />
      ))}
      {/* Anchors top + bottom. */}
      <circle cx="100" cy="12" r="2.4" fill="rgba(18,168,172,0.95)" />
      <circle cx="100" cy="188" r="2.4" fill="rgba(18,168,172,0.95)" />
      {/* Mid horizontal hairline = current "decision moment". */}
      <line
        x1="20"
        y1="100"
        x2="180"
        y2="100"
        stroke="rgba(255,255,255,0.10)"
        strokeDasharray="1.5 3.5"
      />
    </svg>
  );
}

/* 03 — One clean sine wave above a jagged noise pattern. The signal is
   literally lifted out of the noise floor. */
function Isolation({ className }: { className: string }) {
  // Deterministic noise polyline.
  const noisePts = Array.from({ length: 41 }, (_, i) => {
    const x = i * 5;
    const v = 140 + ((i * 37) % 40) - 20;
    return `${x},${v}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {/* Signal line — clean Q-curves */}
      <path
        d="M 0 56 Q 25 22 50 56 T 100 56 T 150 56 T 200 56"
        stroke="rgba(18,168,172,0.88)"
        strokeWidth="1.4"
        fill="none"
      />
      {/* Separator midline */}
      <line
        x1="0"
        y1="100"
        x2="200"
        y2="100"
        stroke="rgba(255,255,255,0.08)"
        strokeDasharray="2 5"
      />
      {/* Noise polyline */}
      <polyline
        points={noisePts}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="0.55"
        fill="none"
      />
      {/* Labels */}
      <text
        x="6"
        y="14"
        fill="rgba(18,168,172,0.65)"
        fontSize="6"
        fontFamily="monospace"
        letterSpacing="2"
      >
        SIGNAL
      </text>
      <text
        x="6"
        y="118"
        fill="rgba(255,255,255,0.35)"
        fontSize="6"
        fontFamily="monospace"
        letterSpacing="2"
      >
        NOISE
      </text>
    </svg>
  );
}

/* 04 — Architectural cross-section: four stacked strata with dashed verticals
   running through. Reads as "infrastructure beneath the surface". */
function Foundation({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {[42, 80, 118, 156].map((y, i) => (
        <line
          key={y}
          x1="10"
          y1={y}
          x2="190"
          y2={y}
          stroke={`rgba(18,168,172,${[0.65, 0.45, 0.32, 0.22][i]})`}
          strokeWidth="0.7"
        />
      ))}
      {[40, 100, 160].map((x) => (
        <line
          key={x}
          x1={x}
          y1="36"
          x2={x}
          y2="162"
          stroke="rgba(18,168,172,0.35)"
          strokeDasharray="1.2 3"
          strokeWidth="0.55"
        />
      ))}
      <circle cx="40" cy="42" r="1.8" fill="rgba(18,168,172,0.85)" />
      <circle cx="100" cy="80" r="1.8" fill="rgba(18,168,172,0.85)" />
      <circle cx="160" cy="118" r="1.8" fill="rgba(18,168,172,0.85)" />
      <circle cx="40" cy="156" r="1.8" fill="rgba(18,168,172,0.85)" />
    </svg>
  );
}

/* 05 — Audio-spectrum vertical bars, centered tallest (the human). Warm
   gold tint on the center bar contrasts with turquoise rest — the only
   pillar that gets the warm accent. */
function Resonance({ className }: { className: string }) {
  const heights = [28, 44, 58, 76, 96, 130, 96, 76, 58, 44, 28];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {heights.map((h, i) => {
        const x = 16 + i * 17;
        const isCenter = i === 5;
        const y = 178 - h;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x}
            y2="178"
            stroke={
              isCenter ? "rgba(212,175,55,0.9)" : "rgba(18,168,172,0.55)"
            }
            strokeWidth={isCenter ? 2.2 : 1.4}
          />
        );
      })}
      {/* Baseline */}
      <line
        x1="10"
        y1="178"
        x2="190"
        y2="178"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.55"
      />
    </svg>
  );
}
