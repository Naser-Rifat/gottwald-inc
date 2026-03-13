"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

// -------------------------------------------------------------
// The "Dark Fluid" / Ink Shader
// -------------------------------------------------------------
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Make plane cover the full screen
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
// Classic Perlin/Simplex Noise (Ashima Arts)
// ----------------------------------------------------------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  // Gradients
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

// Fractal Brownian Motion — 3 octaves (was 6, saves ~50% GPU per pixel)
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 3; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Slow organic time
    float t = uTime * 0.15;
    
    // Mouse Interaction: distance from mouse distorts the fluid
    float mouseDist = distance(st, uMouse * vec2(uResolution.x/uResolution.y, 1.0));
    float mouseForce = exp(-mouseDist * 3.0); 

    // Domain Warping / Ink effect
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*t );
    q.y = fbm( st + vec2(1.0) );

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*t );
    
    // Distort space heavily near mouse
    r += mouseForce * 0.5;

    float f = fbm(st + r);

    // Mix colors based on noise patterns
    // Base is black/deep petrol
    vec3 color = mix(uColorBase, uColorPetrol, clamp((f*f)*4.0, 0.0, 1.0));
    
    // Add Turquoise veins
    color = mix(color, uColorTurquoise, clamp(length(q), 0.0, 1.0) * clamp(length(r), 0.0, 1.0) * 0.5);
    
    // Add delicate Gold dust/highlights where the ink folds
    float fold = fbm(st * 3.0 + r * 2.0);
    float highlight = smoothstep(0.4, 0.5, fold) * smoothstep(0.6, 0.5, fold);
    color += uColorGold * highlight * 0.3;

    // Vignette for depth
    float mask = smoothstep(0.8, 0.1, distance(vUv, vec2(0.5)));
    color *= mask + 0.2; // Keep it very dark at edges, slightly lighter center

    gl_FragColor = vec4(color, 1.0);
}
`;

const FluidPlane = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  // Store raw mouse in a ref — avoids triggering React re-renders on every mousemove
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

  // Update ref on mousemove — zero React re-renders, zero GC pressure
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

  useFrame(() => {
    if (!materialRef.current) return;
    
    // ======================================================================
    // ANIMATION STOPPED PER USER REQUEST
    // The background is currently frozen. To re-enable the fluid movement 
    // and mouse-hover interactions, uncomment the three lines below:
    // ======================================================================
    
    // materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    // materialRef.current.uniforms.uMouse.value.lerp(mousePosRef.current, 0.05);
    // invalidate();
  });

  return (
    <mesh>
      {/* Full screen plane, geometry doesn't matter since vertex shader overrides position to clip space */}
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

  // Pause the entire R3F loop when the canvas is fully covered by opaque sections
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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none -z-20 bg-black"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={isVisible ? "always" : "never"}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
        }}
        dpr={[1, 1.5]}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
