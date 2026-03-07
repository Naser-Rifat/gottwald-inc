"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   GEOGRAPHIC DATA — real lat/lng coordinates
   ────────────────────────────────────────────── */

interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  tier: "control" | "hub" | "presence";
}

const markers: MapMarker[] = [
  // ── Control Node ──
  { name: "Tbilisi", lat: 41.72, lng: 44.79, tier: "control" },

  // ── Strategic Hubs (DACH) ──
  { name: "Munich", lat: 48.14, lng: 11.58, tier: "hub" },
  { name: "Vienna", lat: 48.21, lng: 16.37, tier: "hub" },
  { name: "Zurich", lat: 47.38, lng: 8.54, tier: "hub" },

  // ── Active Presence (26 countries) ──
  { name: "London", lat: 51.51, lng: -0.13, tier: "presence" },
  { name: "Paris", lat: 48.86, lng: 2.35, tier: "presence" },
  { name: "Amsterdam", lat: 52.37, lng: 4.9, tier: "presence" },
  { name: "Stockholm", lat: 59.33, lng: 18.07, tier: "presence" },
  { name: "Madrid", lat: 40.42, lng: -3.7, tier: "presence" },
  { name: "Rome", lat: 41.9, lng: 12.5, tier: "presence" },
  { name: "Warsaw", lat: 52.23, lng: 21.01, tier: "presence" },
  { name: "Prague", lat: 50.08, lng: 14.44, tier: "presence" },
  { name: "Istanbul", lat: 41.01, lng: 28.98, tier: "presence" },
  { name: "Dubai", lat: 25.2, lng: 55.27, tier: "presence" },
  { name: "Singapore", lat: 1.35, lng: 103.82, tier: "presence" },
  { name: "Tokyo", lat: 35.68, lng: 139.69, tier: "presence" },
  { name: "New York", lat: 40.71, lng: -74.01, tier: "presence" },
  { name: "São Paulo", lat: -23.55, lng: -46.63, tier: "presence" },
  { name: "Sydney", lat: -33.87, lng: 151.21, tier: "presence" },
  { name: "Nairobi", lat: -1.29, lng: 36.82, tier: "presence" },
  { name: "Mumbai", lat: 19.08, lng: 72.88, tier: "presence" },
  { name: "Seoul", lat: 37.57, lng: 127.0, tier: "presence" },
  { name: "Helsinki", lat: 60.17, lng: 24.94, tier: "presence" },
  { name: "Bucharest", lat: 44.43, lng: 26.1, tier: "presence" },
  { name: "Brussels", lat: 50.85, lng: 4.35, tier: "presence" },
  { name: "Copenhagen", lat: 55.68, lng: 12.57, tier: "presence" },
  { name: "Lisbon", lat: 38.72, lng: -9.14, tier: "presence" },
  { name: "Tallinn", lat: 59.44, lng: 24.75, tier: "presence" },
  { name: "Cape Town", lat: -33.93, lng: 18.42, tier: "presence" },
];

/**
 * Convert lat/lng → % position on the Wikimedia SVG map.
 * The SVG uses a standard equirectangular (plate carrée) projection:
 * - Longitude: -180° → +180° maps to 0% → 100% (x)
 * - Latitude:  ~90°N → ~90°S maps to 0% → 100% (y)
 */
function geoToPercent(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */

export default function GlobalAuthoritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({
    countries: 0,
    partners: 0,
    languages: 0,
    capacity: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Setup initial state for elements before timeline so they don't flash
      const mapImg = mapContainerRef.current?.querySelector(".world-map-img");
      if (mapImg) gsap.set(mapImg, { opacity: 0, scale: 1.05 });

      const dataStreams =
        mapContainerRef.current?.querySelectorAll(".data-stream-path");
      if (dataStreams)
        gsap.set(dataStreams, { strokeDashoffset: 1, opacity: 0 });

      // Master Choreography Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      // --- SECTION 1: Copy & Map Fade In ---
      if (copyRef.current) {
        const els = copyRef.current.querySelectorAll(".ga-animate");
        tl.fromTo(
          els,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1 },
          0,
        );
      }

      if (mapImg) {
        tl.to(
          mapImg,
          { opacity: 0.8, scale: 1, duration: 1.5, ease: "power2.out" },
          0.2,
        );
      }

      // --- SECTION 2: Node Ignition Sequence ---
      if (mapContainerRef.current) {
        const controlPin =
          mapContainerRef.current.querySelectorAll(".pin-control");
        const hubPins = mapContainerRef.current.querySelectorAll(".pin-hub");
        const presencePins =
          mapContainerRef.current.querySelectorAll(".pin-presence");

        // Ignite Control Node
        tl.fromTo(
          controlPin,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)" },
          0.5,
        );

        // Ignite Strategic Hubs
        tl.fromTo(
          hubPins,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2.5)",
            stagger: 0.1,
          },
          0.7,
        );

        // Stagger Ignite Presence Points
        tl.fromTo(
          presencePins,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.02,
          },
          0.9,
        );

        // --- SECTION 3: Draw SVG Data Streams ---
        if (dataStreams) {
          tl.to(
            dataStreams,
            {
              strokeDashoffset: 0,
              opacity: 0.5,
              duration: 1.2,
              ease: "power2.inOut",
              stagger: 0.01,
            },
            1.2,
          );
        }
      }

      // --- SECTION 4: Show Legend ---
      if (legendRef.current) {
        tl.fromTo(
          legendRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          1.5,
        );
      }

      // --- SECTION 5: Start Data Metrics Tick ---
      // We trigger the state updates precisely when the lines finish drawing
      tl.add(() => {
        [
          { key: "countries", to: 26, dur: 1.5 },
          { key: "partners", to: 71, dur: 1.8 },
          { key: "languages", to: 17, dur: 1.3 },
          { key: "capacity", to: 888, dur: 2.2 },
        ].forEach(({ key, to, dur }) => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: to,
            duration: dur,
            ease: "power2.out",
            onUpdate: () =>
              setCounters((prev) => ({
                ...prev,
                [key]: Math.round(obj.val),
              })),
          });
        });
      }, 1.8);

      // Note: Removed old 'pulseRings' GSAP block.
      // Pulse effects are now purely driven by 60fps CSS @keyframes (animate-ping-large)
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a] overflow-hidden flex flex-col"
    >
      {/* ── Top Copy ── */}
      <div ref={copyRef} className="relative z-[15] pt-[15vh] px-[5vw]">
        <p
          className="ga-animate"
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "12px",
            opacity: 0,
          }}
        >
          01 — Global Authority
        </p>
        <h2
          className="ga-animate"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.6rem)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "16px",
            opacity: 0,
          }}
        >
          GLOBAL AUTHORITY.
        </h2>
        <p
          className="ga-animate"
          style={{
            fontSize: "14px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "540px",
            marginBottom: "6px",
            opacity: 0,
          }}
        >
          A global operating system for strategic assets and engineered systems
          — coordinated from our Head Office in Tbilisi and deployed worldwide.
        </p>
        <p
          className="ga-animate"
          style={{
            fontSize: "12px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.3)",
            maxWidth: "460px",
            opacity: 0,
          }}
        >
          Not loud. Effective. Precise, responsibility-led, long-term.
        </p>
      </div>

      {/* ═══════ MAP AREA ═══════ */}
      {/* Container with known dimensions so pin coordinates align */}
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* SVG World Map — real Wikimedia Commons vector, perfectly crisp */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/world-map-dark.svg"
          alt="Global presence map"
          className="world-map-img"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            opacity: 0.8,
          }}
        />

        {/* ── LIVE NETWORK LAYER (SVG DATA LINES) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[9]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(77, 166, 255, 0)" />
              <stop offset="50%" stopColor="rgba(77, 166, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 180, 60, 0.8)" />
            </linearGradient>
          </defs>
          {markers.map((m, idx) => {
            if (m.tier === "control") return null;
            // Control Node Position (Tbilisi) mapped to %
            const startNode = geoToPercent(41.72, 44.79);
            const endNode = geoToPercent(m.lat, m.lng);

            return (
              <path
                key={`curve-${idx}`}
                d={`M ${startNode.x}% ${startNode.y}% Q ${endNode.x}% ${startNode.y}% ${endNode.x}% ${endNode.y}%`}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="1.5"
                pathLength="1"
                strokeDasharray="1"
                className="data-stream-path"
              />
            );
          })}
        </svg>

        {/* ── Location pin overlays ── */}
        {markers.map((m) => {
          const pos = geoToPercent(m.lat, m.lng);

          if (m.tier === "control") {
            return (
              <div
                key={m.name}
                className="pin-control"
                style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="relative">
                  {/* Expanding pulse */}
                  <div className="absolute inset-0 rounded-full bg-[#ffb43c] animate-ping-large" />
                  {/* Core dot */}
                  <div
                    className="relative"
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#ffb43c",
                      borderRadius: "50%",
                      border: "1.5px solid rgba(255,255,255,0.8)",
                      boxShadow: "0 0 10px rgba(255,180,60,0.8)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "rgba(255,180,60,0.9)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: "6px",
                  }}
                >
                  {m.name}
                </p>
              </div>
            );
          }

          // Hubs (DACH)
          if (m.name.includes("Hub")) {
            return (
              <div
                key={m.name}
                className="pin-hub"
                style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 15,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="relative">
                  {/* Expanding pulse */}
                  <div className="absolute inset-0 rounded-full bg-[#4da6ff] animate-ping-medium" />
                  {/* Core dot */}
                  <div
                    className="relative"
                    style={{
                      width: "7px",
                      height: "7px",
                      backgroundColor: "#4da6ff",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 0 8px rgba(77,166,255,0.6)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "8px",
                    color: "rgba(77,166,255,0.65)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                >
                  {m.name}
                </p>
              </div>
            );
          }

          // Presence dot
          return (
            <div
              key={m.name}
              className="pin-presence"
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.35)",
                  boxShadow: "0 0 4px rgba(255,255,255,0.15)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── GRADIENT FADES ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[30%] z-[8] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] z-[8] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #000 0%, #000 15%, rgba(0,0,0,0.8) 45%, transparent 100%)",
        }}
      />

      {/* Spacer to push stats bar down */}
      <div style={{ flex: 1 }} />

      {/* ── STATS & TYPOGRAPHY SECTION ── */}
      <div className="relative z-[15] flex flex-col items-center w-full px-[5vw] pb-12 pt-8 border-t border-white/5 bg-gradient-to-t from-black to-transparent">
        {/* Caption moved above stats */}
        <p className="text-[11px] md:text-[12px] text-white/40 tracking-[0.25em] hoverline uppercase mb-8 font-medium">
          Centralized in Tbilisi. Adopted worldwide.
        </p>

        {/* Stats Grid */}
        <div className="flex justify-center gap-12 md:gap-32 flex-wrap max-w-6xl w-full">
          {[
            { val: counters.countries, suffix: "", label: "Countries" },
            { val: counters.partners, suffix: "", label: "Partner Origins" },
            { val: counters.languages, suffix: "", label: "Languages" },
            { val: counters.capacity, suffix: "±", label: "Network Capacity" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center flex flex-col items-center"
            >
              <span className="text-4xl md:text-5xl lg:text-[4rem] font-light text-white tracking-tight leading-none drop-shadow-lg">
                {s.val}
                {s.suffix}
              </span>
              <p className="text-[9px] md:text-[10px] text-white/30 tracking-[0.2em] uppercase mt-4">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Legend (bottom-right) ── */}
      <div
        ref={legendRef}
        className="absolute bottom-32 md:bottom-20 right-[5vw] z-[15] flex flex-col gap-3 opacity-0"
      >
        {[
          {
            color: "#ffb43c",
            border: "rgba(255,255,255,0.8)",
            size: 10,
            glow: true,
            label: "Head Office (Control Node)",
          },
          {
            color: "#4da6ff",
            border: "rgba(255,255,255,0.6)",
            size: 7,
            glow: true,
            label: "Strategic Hub",
          },
          {
            color: "rgba(255,255,255,0.35)",
            border: "transparent",
            size: 4,
            glow: false,
            label: "Active Presence",
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                borderRadius: "50%",
                backgroundColor: item.color,
                border: `1.5px solid ${item.border}`,
                boxShadow: item.glow ? `0 0 6px ${item.color}50` : "none",
                flexShrink: 0,
              }}
            />
            <span className="text-[9px] text-white/40 tracking-[0.08em] uppercase">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
