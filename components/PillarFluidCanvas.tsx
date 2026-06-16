"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { getDeviceTier } from "@/lib/deviceTier";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

const fragmentShaderDesktop = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

// Theme Colors
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

    float liquidDist = length(p - mouseP);
    // Removed ripple completely to make it a smooth fluid
    float hoverMask = smoothstep(0.5, 0.0, liquidDist);
    
    vec2 safeDir = p - mouseP;
    if (length(safeDir) < 0.0001) safeDir = vec2(0.0001, 0.0);
    // Subtle warp instead of ripples
    p = p + normalize(safeDir) * 0.01 * hoverMask;

    vec2 source1 = vec2(sin(t * 0.07) * 0.7, 0.25 + cos(t * 0.09) * 0.12);
    float dist1 = length(p - source1);
    float wave1 = sin(dist1 * 11.0 - t * 0.6);

    vec2 source2 = vec2(cos(t * 0.05) * 0.6, -0.25 + sin(t * 0.08) * 0.12);
    float dist2 = length(p - source2);
    float wave2 = sin(dist2 * 8.0 + t * 0.5) * 0.7;

    float dist3 = length(p);
    float wave3 = sin(dist3 * 5.0 - t * 0.35) * 0.55;

    float interference = (wave1 + wave2 + wave3) / 2.25;

    float mouseDist = length(p - mouseP);
    float mouseAttenuation = exp(-mouseDist * 1.6);
    // Removed mouseWave rings, just keeping a smooth resonance glow
    float mouseResonance = mouseAttenuation * 0.5;

    float field = interference + mouseResonance * 0.6;
    float fieldPower = smoothstep(-0.5, 1.0, field);

    vec2 gridP = p * 9.0;
    vec2 gridFract = fract(gridP) - 0.5;
    float dotMask = 1.0 - smoothstep(0.0, 0.07, length(gridFract));
    float dotIntensity = smoothstep(0.55, 0.95, field) * dotMask;

    float breathe = sin(t * 0.2) * 0.5 + 0.5;

    vec3 color = uColorBase;
    color = mix(color, uColorPetrol, fieldPower * 0.5);

    float peak = smoothstep(0.4, 1.0, field);
    color = mix(color, uColorTurquoise, peak * 0.55);

    float goldFilament = smoothstep(0.72, 1.0, field) * (0.6 + 0.4 * breathe);
    color += uColorGold * goldFilament * 0.2;

    color += uColorTurquoise * dotIntensity * 0.7;
    color += uColorTurquoise * abs(mouseResonance) * 0.3;
    color += uColorGold * mouseAttenuation * 0.07;

    float vignetteDist = length(p) * 1.35;
    float mask = 1.0 - smoothstep(0.5, 1.15, vignetteDist) * 0.55;
    color *= mask;

    color = max(color, vec3(0.0));
    gl_FragColor = vec4(color, 1.0);
}
`;

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

    float liquidDist = length(p - mouseP);
    // Removed ripple
    float hoverMask = smoothstep(0.5, 0.0, liquidDist);
    
    vec2 safeDir = p - mouseP;
    if (length(safeDir) < 0.0001) safeDir = vec2(0.0001, 0.0);
    p = p + normalize(safeDir) * 0.01 * hoverMask;

    vec2 source1 = vec2(sin(t * 0.07) * 0.6, 0.2);
    vec2 source2 = vec2(cos(t * 0.05) * 0.5, -0.2);

    float dist1 = length(p - source1);
    float dist2 = length(p - source2);

    float wave1 = sin(dist1 * 10.0 - t * 0.6);
    float wave2 = sin(dist2 * 8.0 + t * 0.5) * 0.7;

    float interference = (wave1 + wave2) / 1.7;

    float mouseDist = length(p - mouseP);
    float mouseAttenuation = exp(-mouseDist * 1.6);
    // Removed mouseWave rings
    float mouseResonance = mouseAttenuation * 0.5;

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

const ThrottledRenderer = ({ fps, reducedMotion }: { fps: number; reducedMotion: boolean }) => {
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

const FluidPlane = ({ isMobile, colorPetrol, colorTurquoise, colorBase }: { isMobile: boolean, colorPetrol: string, colorTurquoise: string, colorBase: string }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePosRef = useRef(new THREE.Vector2(0.5, 0.5));
  const fragShader = isMobile ? fragmentShaderMobile : fragmentShaderDesktop;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(
        typeof window !== "undefined" ? window.innerWidth : 1440,
        typeof window !== "undefined" ? window.innerHeight : 900,
      ),
    },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorBase: { value: new THREE.Color(colorBase) },
    uColorPetrol: { value: new THREE.Color(colorPetrol) },
    uColorTurquoise: { value: new THREE.Color(colorTurquoise) },
    uColorGold: { value: new THREE.Color("#d4af37") },
  }), []);

  useEffect(() => {
    uniforms.uColorBase.value.set(colorBase);
    uniforms.uColorPetrol.value.set(colorPetrol);
    uniforms.uColorTurquoise.value.set(colorTurquoise);
  }, [colorBase, colorPetrol, colorTurquoise, uniforms]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
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

export default function PillarFluidCanvas({
  colorPetrol = "#006d84",
  colorTurquoise = "#12a8ac",
  colorBase = "#000000",
  opacity = 1,
  className = "absolute inset-0 z-0 pointer-events-none"
}: {
  colorPetrol?: string;
  colorTurquoise?: string;
  colorBase?: string;
  opacity?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const handler = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const deviceProfile = useMemo(() => {
    const tier = getDeviceTier();
    return {
      isMobile: tier === "mobile",
      dpr: tier === "mobile" ? [1, 1] as [number, number] : [1, 1.5] as [number, number],
      fps: tier === "mobile" ? 24 : 30,
    };
  }, []);

  const frameloop = isTabVisible ? "demand" : "never";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden", opacity, transition: 'opacity 1s ease-in-out' }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={frameloop}
        gl={{ powerPreference: "high-performance", alpha: true, antialias: false }}
        dpr={deviceProfile.dpr}
        style={{ outline: "none", display: "block", background: "transparent" }}
      >
        <ThrottledRenderer fps={deviceProfile.fps} reducedMotion={reducedMotion} />
        <FluidPlane isMobile={deviceProfile.isMobile} colorPetrol={colorPetrol} colorTurquoise={colorTurquoise} colorBase={colorBase} />
      </Canvas>
    </div>
  );
}
