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
uniform vec3 uColorPage; // Page-specific accent tint
uniform float uPulse; // Pulse intensity

varying vec2 vUv;

// 2D Random
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// 2D Noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// Fractal Brownian Motion
#define NUM_OCTAVES 5
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    // Centered, aspect-corrected
    vec2 p = (st - 0.5) * vec2(aspect, 1.0);
    vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);

    // Premium ultra-slow motion
    float t = uTime * 0.12;

    // Fluid distortion around mouse
    float liquidDist = length(p - mouseP);
    float hoverMask = smoothstep(0.6, 0.0, liquidDist);
    vec2 safeDir = normalize(p - mouseP + 0.0001);
    
    // Base coordinates for the liquid smoke
    vec2 uv = p * 2.5; // Scale of the smoke
    
    // Add mouse push to the UVs
    uv += safeDir * hoverMask * 0.15 * sin(t * 5.0);

    // Domain warping (Liquid smoke effect)
    vec2 q = vec2(0.);
    q.x = fbm( uv + 0.00*t);
    q.y = fbm( uv + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( uv + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
    r.y = fbm( uv + 1.0*q + vec2(8.3,2.8)+ 0.126*t);

    float f = fbm(uv+r);

    // Normalize FBM value roughly from [-1, 1] to [0, 1]
    float field = (f + 1.0) * 0.5;

    // Slow ambient breathing
    float breathe = sin(t * 1.5) * 0.5 + 0.5;

    // ── Compose color ──
    vec3 color = uColorBase;

    // 1. Base Cloud: Deep Petrol
    color = mix(color, uColorPetrol, smoothstep(0.1, 0.8, field) * 0.75);

    // 2. Page Accent: Sharp rims instead of broad cloudy washes (prevents swampy green/brown mix)
    // We mix the page color over the brighter parts of the cloud
    float pageMask = smoothstep(0.45, 0.9, field);
    color = mix(color, uColorPage, pageMask * 0.6);

    // 3. Turquoise Highlights for depth
    color += uColorTurquoise * smoothstep(0.6, 0.95, field) * 0.3;

    // 4. Signature Gold Filaments at the extreme peaks
    float goldMask = smoothstep(0.75, 1.0, field) * (0.8 + 0.2 * breathe);
    color += uColorGold * goldMask * 0.4;

    // 5. Mouse resonance
    float mouseGlow = exp(-liquidDist * 2.5);
    color += uColorTurquoise * mouseGlow * 0.2;
    color += uColorPage * exp(-liquidDist * 5.0) * 0.15; // Mouse center glow is page color

    // 6. Pulse effect (triggered on navigation/clicks)
    color += uColorPage * (uPulse * 0.4) * smoothstep(0.3, 0.8, field);

    // 7. Subtle cinematic vignette
    float vignetteDist = length(p) * 1.35;
    float mask = 1.0 - smoothstep(0.5, 1.35, vignetteDist) * 0.7;
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
uniform vec3 uColorPage;
uniform float uPulse;

// 2D Random
vec2 random2Mobile(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// 2D Noise
float noiseMobile(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( random2Mobile(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2Mobile(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2Mobile(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2Mobile(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// Mobile FBM - Fewer octaves for performance
#define NUM_OCTAVES_MOBILE 3
float fbmMobile ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES_MOBILE; ++i) {
        v += a * noiseMobile(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (st - 0.5) * vec2(aspect, 1.0);
    vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);

    float t = uTime * 0.12;
    float liquidDist = length(p - mouseP);
    
    vec2 uv = p * 2.0; // Slightly larger scale on mobile

    vec2 q = vec2(0.);
    q.x = fbmMobile( uv + 0.00*t);
    q.y = fbmMobile( uv + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbmMobile( uv + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
    r.y = fbmMobile( uv + 1.0*q + vec2(8.3,2.8)+ 0.126*t);

    float f = fbmMobile(uv+r);
    float field = (f + 1.0) * 0.5;

    vec3 color = uColorBase;

    // 1. Base Cloud: Deep Petrol
    color = mix(color, uColorPetrol, smoothstep(0.1, 0.8, field) * 0.75);

    // 2. Page Accent
    float pageMask = smoothstep(0.45, 0.9, field);
    color = mix(color, uColorPage, pageMask * 0.6);

    // 3. Turquoise Highlights
    color += uColorTurquoise * smoothstep(0.6, 0.95, field) * 0.3;

    // 4. Mouse resonance
    float mouseGlow = exp(-liquidDist * 2.5);
    color += uColorTurquoise * mouseGlow * 0.15;

    // 5. Pulse effect
    color += uColorPage * (uPulse * 0.4) * smoothstep(0.3, 0.8, field);

    // 6. Subtle vignette
    float vignetteDist = length(p) * 1.35;
    float mask = 1.0 - smoothstep(0.5, 1.35, vignetteDist) * 0.7;
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

  // Page-specific accent color target (lerped smoothly in useFrame)
  const targetAccentRef = useRef(new THREE.Color("#cda434")); // default Muted Gold
  const currentAccentRef = useRef(new THREE.Color("#cda434"));

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
      uColorPetrol: { value: new THREE.Color("#0a4c5a") },
      uColorTurquoise: { value: new THREE.Color("#0f8b8d") },
      uColorGold: { value: new THREE.Color("#cda434") },
      uColorPage: { value: new THREE.Color("#cda434") }, // starts muted gold (Home)
      uPulse: { value: 0 },
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

  // Listen for page-color-shift events dispatched by each page on mount
  useEffect(() => {
    const handleColorShift = (e: Event) => {
      const { color } = (e as CustomEvent).detail;
      if (color) targetAccentRef.current.set(color);
    };
    const handlePulse = () => {
      // Create a temporary pulse value using GSAP if available, or just standard React state equivalent
      // Since we don't have direct access to gsap here easily without adding imports, we can use a ref
      pulseTargetRef.current = 1.0;
      setTimeout(() => {
        pulseTargetRef.current = 0.0;
      }, 100);
    };
    
    window.addEventListener("page-color-shift", handleColorShift);
    window.addEventListener("canvas-pulse", handlePulse);
    return () => {
      window.removeEventListener("page-color-shift", handleColorShift);
      window.removeEventListener("canvas-pulse", handlePulse);
    };
  }, []);

  const pulseTargetRef = useRef(0);
  const currentPulseRef = useRef(0);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uResolution.value.set(
      state.size.width,
      state.size.height,
    );
    materialRef.current.uniforms.uMouse.value.lerp(mousePosRef.current, 0.04);

    // Smoothly interpolate page accent color toward target
    const current = currentAccentRef.current;
    const target = targetAccentRef.current;
    const dist = Math.abs(current.r - target.r) + Math.abs(current.g - target.g) + Math.abs(current.b - target.b);
    
    if (dist > 0.001) {
      current.lerp(target, 0.025);
      // Drive uColorPage uniform (the dedicated page-tint uniform in the shader)
      materialRef.current.uniforms.uColorPage.value.copy(current);
    }
    
    // Animate pulse
    if (Math.abs(currentPulseRef.current - pulseTargetRef.current) > 0.001) {
      // Faster attack, slower decay
      const speed = pulseTargetRef.current > currentPulseRef.current ? 0.2 : 0.03;
      currentPulseRef.current += (pulseTargetRef.current - currentPulseRef.current) * speed;
      materialRef.current.uniforms.uPulse.value = currentPulseRef.current;
    }
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
      className="fixed inset-0 w-full h-full pointer-events-none -z-20 bg-black"
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
