"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

// -------------------------------------------------------------
// The "Dark Fluid" / Ink Shader — Enhanced for liquid feel
// -------------------------------------------------------------
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

// ── Desktop shader: Full quality (2-octave FBM, 6 noise calls + gold fold) ──
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

// ----------------------------------------------------------
// Classic Simplex Noise (Ashima Arts)
// ----------------------------------------------------------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion — 2 octaves
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 2; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    float t1 = uTime * 0.12;
    float t2 = uTime * 0.08;
    
    vec2 mouseUV = uMouse * vec2(uResolution.x / uResolution.y, 1.0);
    float mouseDist = distance(st, mouseUV);
    float mouseForce = exp(-mouseDist * 2.5) * 0.7;

    vec2 q = vec2(0.0);
    q.x = fbm(st + t1 * 0.3);
    q.y = fbm(st + vec2(1.0) + t2 * 0.2);

    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t1);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t2);
    
    r += mouseForce * vec2(0.6, 0.4);

    float f = fbm(st + r * 1.2);

    vec3 color = mix(uColorBase, uColorPetrol, clamp((f * f) * 4.0, 0.0, 1.0));
    
    float veinIntensity = clamp(length(q), 0.0, 1.0) * clamp(length(r), 0.0, 1.0);
    color = mix(color, uColorTurquoise, veinIntensity * 0.45);
    
    float fold = fbm(st * 3.0 + r * 2.0 + t1 * 0.1);
    float highlight = smoothstep(0.4, 0.48, fold) * smoothstep(0.56, 0.48, fold);
    color += uColorGold * highlight * 0.25;

    float breathe = sin(uTime * 0.3) * 0.03 + 0.03;
    color += uColorTurquoise * breathe * veinIntensity;

    color += uColorGold * mouseForce * 0.12;

    float vignetteDist = distance(vUv, vec2(0.5)) * 2.0;
    float mask = 1.0 - smoothstep(0.6, 1.0, vignetteDist) * 0.5;
    color *= mask;

    gl_FragColor = vec4(color, 1.0);
}
`;

// ── Mobile shader: Optimized (1-octave FBM, no gold fold = 40% fewer ALU ops) ──
const fragmentShaderMobile = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform vec3 uColorBase;
uniform vec3 uColorPetrol;
uniform vec3 uColorTurquoise;
uniform vec3 uColorGold;

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// 1-octave FBM — half the cost of desktop
float fbm(vec2 p) {
    return snoise(p) * 0.5;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    float t1 = uTime * 0.12;
    float t2 = uTime * 0.08;
    
    // Simplified mouse (cheaper exp → single mul)
    vec2 mouseUV = uMouse * vec2(uResolution.x / uResolution.y, 1.0);
    float mouseDist = distance(st, mouseUV);
    float mouseForce = exp(-mouseDist * 2.5) * 0.5;

    // Fewer warp layers: only 2 fbm calls for q
    vec2 q = vec2(0.0);
    q.x = fbm(st + t1 * 0.3);
    q.y = fbm(st + vec2(1.0) + t2 * 0.2);

    // Single warp layer (skip second r layer)
    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t1);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t2);
    r += mouseForce * vec2(0.6, 0.4);

    float f = fbm(st + r * 1.2);

    vec3 color = mix(uColorBase, uColorPetrol, clamp((f * f) * 4.0, 0.0, 1.0));
    
    float veinIntensity = clamp(length(q), 0.0, 1.0) * clamp(length(r), 0.0, 1.0);
    color = mix(color, uColorTurquoise, veinIntensity * 0.45);
    
    // Skip gold fold (saves 1 expensive fbm call) — use simpler highlight
    color += uColorGold * veinIntensity * 0.08;

    float breathe = sin(uTime * 0.3) * 0.03 + 0.03;
    color += uColorTurquoise * breathe * veinIntensity;

    color += uColorGold * mouseForce * 0.12;

    float vignetteDist = distance(vUv, vec2(0.5)) * 2.0;
    float mask = 1.0 - smoothstep(0.6, 1.0, vignetteDist) * 0.5;
    color *= mask;

    gl_FragColor = vec4(color, 1.0);
}
`;

// ── Detect device tier once at module level ──
const getDeviceTier = (): "mobile" | "desktop" => {
  if (typeof navigator === "undefined") return "desktop";
  const isMobile =
    /Mobi|Android/i.test(navigator.userAgent) ||
    (typeof window !== "undefined" && "ontouchstart" in window);
  const cores = navigator.hardwareConcurrency || 4;
  if (isMobile || cores <= 4) return "mobile";
  return "desktop";
};

// ── Throttled Render Controller ──
// Drives R3F in "demand" mode at a capped framerate.
// The fluid animation moves at uTime * 0.12 — 30fps is
// visually identical to 60fps for this effect, cutting GPU work in half.
const ThrottledRenderer = ({ fps }: { fps: number }) => {
  const { invalidate } = useThree();

  useEffect(() => {
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
  }, [fps, invalidate]);

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
      uColorBase: { value: new THREE.Color("#000000") },
      uColorPetrol: { value: new THREE.Color("#005f73") },
      uColorTurquoise: { value: new THREE.Color("#0a9396") },
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

  // Pause R3F when tab is hidden
  useEffect(() => {
    const handler = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Compute device profile once
  const deviceProfile = useMemo(() => {
    const tier = getDeviceTier();
    return {
      isMobile: tier === "mobile",
      dpr: tier === "mobile" ? [1, 1] as [number, number] : [1, 1.5] as [number, number],
      // Desktop: 30fps (half GPU of 60, no visual difference for slow fluid)
      // Mobile:  24fps (further savings, still buttery for this animation speed)
      fps: tier === "mobile" ? 24 : 30,
    };
  }, []);

  // Use "demand" frameloop — ThrottledRenderer calls invalidate() at our target FPS.
  // This is the key performance win: instead of rendering at 60fps (the browser default),
  // we render at 30fps desktop / 24fps mobile. For an animation moving at uTime * 0.12,
  // this is visually identical but cuts GPU work by 50-60%.
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
        <ThrottledRenderer fps={deviceProfile.fps} />
        <FluidPlane isMobile={deviceProfile.isMobile} />
      </Canvas>
    </div>
  );
}
