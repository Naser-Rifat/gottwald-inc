"use client";

import { useTranslations } from "next-intl";

/**
 * Stylized dark map of the Tbilisi HQ rendered as inline SVG.
 *
 * A hand-drawn road network (no map tiles, no network requests) with
 * an animated radial location marker. Renders inside the contact info
 * card and links out to Google Maps. Extracted into its own component
 * because the SVG is dense and would dominate any parent file.
 */
export default function HqMap() {
  const tCtas = useTranslations("contact.ctas");

  return (
    <a
      href="https://maps.app.goo.gl/HG8uekt8zZF4CWgWA"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block mt-8 w-full aspect-[16/10] max-w-[420px] rounded-lg overflow-hidden cursor-pointer border border-white/10 bg-white/[0.03] backdrop-blur-md"
    >
      {/* Top edge glow */}
      <div
        className="absolute top-0 left-0 w-full h-px pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
        }}
      />

      {/* SVG Road Network */}
      <svg
        viewBox="0 0 420 260"
        fill="none"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="roadGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Major roads — warm gold tones */}
        <g filter="url(#roadGlow)" opacity="0.6">
          <path d="M0 130 Q60 125, 120 128 T240 120 T360 135 L420 132" stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
          <path d="M210 0 Q205 50, 215 100 T208 180 T220 260" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5" />
          <path d="M0 40 Q100 80, 200 130 T420 200" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
          {/* River — turquoise accent */}
          <path d="M0 200 Q80 185, 160 195 T320 175 L420 180" stroke="rgba(18,168,172,0.4)" strokeWidth="1.5" strokeDasharray="6 3" />
        </g>

        {/* Secondary roads */}
        <g opacity="0.25">
          <path d="M80 0 L90 260" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M150 0 Q145 130, 155 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <path d="M280 0 Q285 100, 275 200 T290 260" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path d="M340 0 L350 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <path d="M0 70 Q100 65, 200 75 T420 60" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <path d="M0 180 Q150 175, 300 185 T420 170" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <path d="M0 230 L420 220" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        </g>

        {/* Minor streets */}
        <g opacity="0.12">
          <path d="M40 0 L45 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M120 0 L125 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M180 0 L175 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M250 0 L245 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M310 0 L315 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M380 0 L375 260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <path d="M0 30 L420 25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M0 100 L420 95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M0 160 L420 155" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M100 0 L0 80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M320 0 L420 100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M250 260 L420 140" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <path d="M0 160 L120 260" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        </g>

        {/* Block fills */}
        <g opacity="0.03">
          <rect x="85" y="75" width="60" height="50" fill="rgba(212,175,55,1)" rx="2" />
          <rect x="155" y="135" width="50" height="40" fill="rgba(212,175,55,1)" rx="2" />
          <rect x="220" y="65" width="55" height="50" fill="rgba(212,175,55,1)" rx="2" />
          <rect x="285" y="130" width="50" height="40" fill="rgba(212,175,55,1)" rx="2" />
          <rect x="90" y="140" width="55" height="35" fill="rgba(212,175,55,1)" rx="2" />
        </g>

        {/* HQ Location Marker — pulsing gold */}
        <g filter="url(#strongGlow)">
          <circle cx="210" cy="130" r="14" stroke="rgba(212,175,55,0.3)" strokeWidth="1" fill="none">
            <animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="130" r="8" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" fill="none">
            <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="130" r="3.5" fill="rgba(212,175,55,1)" />
          <circle cx="210" cy="130" r="1.5" fill="#fff" opacity="0.9" />
        </g>
      </svg>

      {/* Corner coordinates */}
      <span className="absolute top-3 left-3 text-[8px] font-mono tracking-wider text-white/30 uppercase">
        41.7851° N
      </span>
      <span className="absolute top-3 right-3 text-[8px] font-mono tracking-wider text-white/30 uppercase">
        44.8271° E
      </span>

      {/* HQ Label */}
      <div className="absolute top-1/2 left-1/2 translate-x-4 -translate-y-6 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.15em] text-gold/80 uppercase whitespace-nowrap">
          GOTT WALD HQ
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-between px-3 pb-2">
        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold/60 group-hover:text-gold transition-colors">
          {tCtas("viewOnMap")}
        </span>
        <span className="text-[9px] font-mono tracking-wider text-white/30">
          TBILISI · GE
        </span>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
        }}
      />
    </a>
  );
}
