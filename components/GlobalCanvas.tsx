"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
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

const fragmentShader = `
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

// Fractal Brownian Motion — 2 octaves (optimized for dual-context GPU)
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

    // Slow organic time — two independent time flows for complex motion
    float t1 = uTime * 0.12;
    float t2 = uTime * 0.08;
    
    // Mouse Interaction — expanded, smoother influence
    vec2 mouseUV = uMouse * vec2(uResolution.x / uResolution.y, 1.0);
    float mouseDist = distance(st, mouseUV);
    float mouseForce = exp(-mouseDist * 2.5) * 0.7;

    // ── Layer 1: Primary warp field ──
    vec2 q = vec2(0.0);
    q.x = fbm(st + t1 * 0.3);
    q.y = fbm(st + vec2(1.0) + t2 * 0.2);

    // ── Layer 2: Secondary flow field — creates liquid depth ──
    vec2 r = vec2(0.0);
    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t1);
    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t2);
    
    // Mouse pushes the fluid
    r += mouseForce * vec2(0.6, 0.4);

    // ── Layer 3: Final warp for deep liquid complexity ──
    float f = fbm(st + r * 1.2);

    // ── Color mixing ──
    // Base is deep black/petrol
    vec3 color = mix(uColorBase, uColorPetrol, clamp((f * f) * 4.0, 0.0, 1.0));
    
    // Turquoise veins in the folds
    float veinIntensity = clamp(length(q), 0.0, 1.0) * clamp(length(r), 0.0, 1.0);
    color = mix(color, uColorTurquoise, veinIntensity * 0.45);
    
    // Gold dust highlights where ink folds tightly
    float fold = fbm(st * 3.0 + r * 2.0 + t1 * 0.1);
    float highlight = smoothstep(0.4, 0.48, fold) * smoothstep(0.56, 0.48, fold);
    color += uColorGold * highlight * 0.25;

    // Subtle breathing pulse on turquoise
    float breathe = sin(uTime * 0.3) * 0.03 + 0.03;
    color += uColorTurquoise * breathe * veinIntensity;

    // Mouse glow — warm gold near cursor
    color += uColorGold * mouseForce * 0.12;

    // Vignette for cinematic depth
    float mask = smoothstep(0.85, 0.15, distance(vUv, vec2(0.5)));
    color *= mask + 0.15;

    gl_FragColor = vec4(color, 1.0);
}
`;

const FluidPlane = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mousePosRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorBase: { value: new THREE.Color("#000000") },
      uColorPetrol: { value: new THREE.Color("#005f73") },
      uColorTurquoise: { value: new THREE.Color("#0a9396") },
      uColorGold: { value: new THREE.Color("#d4af37") },
    }),
    [size],
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
    materialRef.current.uniforms.uMouse.value.lerp(mousePosRef.current, 0.04);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function GlobalCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pause R3F when canvas is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause R3F when tab is hidden
  useEffect(() => {
    const handler = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Compute DPR cap once — avoids cascading setState in effect
  const dprCap = useMemo<[number, number]>(() => {
    if (typeof navigator === "undefined") return [1, 1.5];
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 4) return [1, 1];
    if (typeof window !== "undefined" && window.devicePixelRatio > 2) return [1, 1];
    return [1, 1.5];
  }, []);

  const shouldRender = isVisible && isTabVisible;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-20 bg-black"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={shouldRender ? "always" : "never"}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
        }}
        dpr={dprCap}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}

