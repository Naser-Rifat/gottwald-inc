"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { getDeviceTier } from "@/lib/deviceTier";

// -------------------------------------------------------------
// Resonance Field Shader — Phase A refinement
// Concept: a chamber of drifting wave sources that interfere
// organically (the "orchestra"), with subtle particle accents
// at wave peaks. Derived directly from the client's frequency
// manifesto — "different frequencies, one orchestra". Brand
// colors locked, restrained motion, premium stillness.
// -------------------------------------------------------------
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

// ── Desktop shader: 3 drifting wave sources + particles + mouse resonance ──
const fragmentShaderDesktop = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

// Theme Colors (locked to brand spec — do not change)
uniform vec3 uColorBase;
uniform vec3 uColorPetrol;
uniform vec3 uColorTurquoise;
uniform vec3 uColorGold;

varying vec2 vUv;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    // Centered, aspect-corrected so wave fronts stay circular
    vec2 p = (st - 0.5) * vec2(aspect, 1.0);

    vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);

    // Slow restrained time — premium stillness, no frenetic motion
    float t = uTime * 0.45;

    // ── Wave Source 1: drifts across the upper region ──
    vec2 source1 = vec2(sin(t * 0.07) * 0.7, 0.25 + cos(t * 0.09) * 0.12);
    float dist1 = length(p - source1);
    float wave1 = sin(dist1 * 11.0 - t * 0.6);

    // ── Wave Source 2: drifts across the lower region ──
    vec2 source2 = vec2(cos(t * 0.05) * 0.6, -0.25 + sin(t * 0.08) * 0.12);
    float dist2 = length(p - source2);
    float wave2 = sin(dist2 * 8.0 + t * 0.5) * 0.7;

    // ── Wave Source 3: slow central anchor pulse ──
    float dist3 = length(p);
    float wave3 = sin(dist3 * 5.0 - t * 0.35) * 0.55;

    // Interference field — the "orchestra" composition
    float interference = (wave1 + wave2 + wave3) / 2.25;

    // ── Mouse as additional frequency emitter ──
    float mouseDist = length(p - mouseP);
    float mouseWave = sin(mouseDist * 18.0 - t * 2.0);
    float mouseAttenuation = exp(-mouseDist * 1.6);
    float mouseResonance = mouseWave * mouseAttenuation;

    // Combined field
    float field = interference + mouseResonance * 0.6;
    float fieldPower = smoothstep(-0.5, 1.0, field);

    // ── Particle dots at wave peaks — Awwwards-style elegance ──
    vec2 gridP = p * 9.0;
    vec2 gridFract = fract(gridP) - 0.5;
    float dotMask = 1.0 - smoothstep(0.0, 0.07, length(gridFract));
    float dotIntensity = smoothstep(0.55, 0.95, field) * dotMask;

    // Slow ambient breathing — orchestral inhale/exhale
    float breathe = sin(t * 0.2) * 0.5 + 0.5;

    // ── Compose color ──
    vec3 color = uColorBase;

    // Petrol body — the deep mid-tone of the field
    color = mix(color, uColorPetrol, fieldPower * 0.5);

    // Turquoise on wave peaks — the brand's eye-catcher accent
    float peak = smoothstep(0.4, 1.0, field);
    color = mix(color, uColorTurquoise, peak * 0.55);

    // Gold filaments at the sharpest peaks — prestige warmth
    float goldFilament = smoothstep(0.72, 1.0, field) * (0.6 + 0.4 * breathe);
    color += uColorGold * goldFilament * 0.2;

    // Particle dots — turquoise twinkle at peaks
    color += uColorTurquoise * dotIntensity * 0.7;

    // Mouse resonance — turquoise radiating outward
    color += uColorTurquoise * abs(mouseResonance) * 0.3;

    // Soft gold warmth around the cursor
    color += uColorGold * mouseAttenuation * 0.07;

    // Subtle radial vignette — depth focus, premium feel
    float vignetteDist = length(p) * 1.35;
    float mask = 1.0 - smoothstep(0.5, 1.15, vignetteDist) * 0.55;
    color *= mask;

    color = max(color, vec3(0.0));
    gl_FragColor = vec4(color, 1.0);
}
`;

// ── Mobile shader: 2 wave sources, no particles, lighter mouse ──
const fragmentShaderMobile = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform vec3 uColorBase;
uniform vec3 uColorPetrol;
uniform vec3 uColorTurquoise;
uniform vec3 uColorGold;

varying vec2 vUv;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (st - 0.5) * vec2(aspect, 1.0);

    vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);

    float t = uTime * 0.45;

    // Two drifting wave sources (mobile budget)
    vec2 source1 = vec2(sin(t * 0.07) * 0.6, 0.2);
    vec2 source2 = vec2(cos(t * 0.05) * 0.5, -0.2);

    float dist1 = length(p - source1);
    float dist2 = length(p - source2);

    float wave1 = sin(dist1 * 10.0 - t * 0.6);
    float wave2 = sin(dist2 * 8.0 + t * 0.5) * 0.7;

    float interference = (wave1 + wave2) / 1.7;

    float mouseDist = length(p - mouseP);
    float mouseWave = sin(mouseDist * 16.0 - t * 1.8);
    float mouseAttenuation = exp(-mouseDist * 1.6);
    float mouseResonance = mouseWave * mouseAttenuation;

    float field = interference + mouseResonance * 0.6;
    float fieldPower = smoothstep(-0.5, 1.0, field);

    float breathe = sin(t * 0.2) * 0.5 + 0.5;

    vec3 color = uColorBase;
    color = mix(color, uColorPetrol, fieldPower * 0.5);

    float peak = smoothstep(0.4, 1.0, field);
    color = mix(color, uColorTurquoise, peak * 0.5);

    float goldFilament = smoothstep(0.75, 1.0, field) * (0.6 + 0.4 * breathe);
    color += uColorGold * goldFilament * 0.16;

    color += uColorTurquoise * abs(mouseResonance) * 0.28;
    color += uColorGold * mouseAttenuation * 0.06;

    float vignetteDist = length(p) * 1.35;
    float mask = 1.0 - smoothstep(0.5, 1.15, vignetteDist) * 0.5;
    color *= mask;

    color = max(color, vec3(0.0));
    gl_FragColor = vec4(color, 1.0);
}
`;

// ── Throttled Render Controller ──
// Drives R3F in "demand" mode at a capped framerate. Wave-field motion
// is slow enough that 30fps desktop / 24fps mobile is visually identical
// to 60fps while cutting GPU work meaningfully. When reducedMotion is
// true, paint exactly one frame so the field is visible as a still image.
const ThrottledRenderer = ({
  fps,
  reducedMotion,
}: {
  fps: number;
  reducedMotion: boolean;
}) => {
  const { invalidate } = useThree();

  useEffect(() => {
    if (reducedMotion) {
      invalidate();
      return;
    }

    let rafId: number;
    let lastTime = 0;
    const interval = 1000 / fps;

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (time - lastTime >= interval) {
        lastTime = time - ((time - lastTime) % interval);
        invalidate();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [fps, invalidate, reducedMotion]);

  return null;
};

const FluidPlane = ({ isMobile }: { isMobile: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePosRef = useRef(new THREE.Vector2(0.5, 0.5));

  // Choose shader based on device tier
  const fragShader = isMobile ? fragmentShaderMobile : fragmentShaderDesktop;

  // Stable uniform references — never recreated on resize
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1440,
          typeof window !== "undefined" ? window.innerHeight : 900,
        ),
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorBase: { value: new THREE.Color("#070c14") },
      uColorPetrol: { value: new THREE.Color("#006d84") },
      uColorTurquoise: { value: new THREE.Color("#12a8ac") },
      uColorGold: { value: new THREE.Color("#d4af37") },
    }),
    [],
  );

  // Mouse tracking — zero React re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight,
      );
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height,
    );
    materialRef.current.uniforms.uMouse.value.lerp(mousePosRef.current, 0.04);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function GlobalCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Pause R3F when tab is hidden
  useEffect(() => {
    const handler = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Freeze canvas when user prefers reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute device profile once
  const deviceProfile = useMemo(() => {
    const tier = getDeviceTier();
    return {
      isMobile: tier === "mobile",
      dpr: tier === "mobile" ? [1, 1] as [number, number] : [1, 1.5] as [number, number],
      // Desktop: 30fps, Mobile: 24fps. Field motion is slow enough that
      // throttled fps is visually identical to 60fps.
      fps: tier === "mobile" ? 24 : 30,
    };
  }, []);

  // Use "demand" frameloop — ThrottledRenderer drives invalidate() at target FPS.
  const frameloop = isTabVisible ? "demand" : "never";

  return (
    <div
      ref={containerRef}
      id="global-fluid-canvas"
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-20 bg-black"
      style={{ overflow: "hidden" }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={frameloop}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
        }}
        dpr={deviceProfile.dpr}
        style={{ outline: "none", display: "block" }}
      >
        <ThrottledRenderer fps={deviceProfile.fps} reducedMotion={reducedMotion} />
        <FluidPlane isMobile={deviceProfile.isMobile} />
      </Canvas>
    </div>
  );
}
