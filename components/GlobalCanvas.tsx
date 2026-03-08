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

// Fractal Brownian Motion
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    // Loop of octaves
    for (int i = 0; i < 6; i++) {
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
    float fold = fbm(st * 4.0 + r * 2.0);
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
  const { size, viewport } = useThree();
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0.5, 0.5));

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

  // Update mouse position (normalized 0 to 1, flipped Y for WebGL)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos(
        new THREE.Vector2(
          e.clientX / window.innerWidth,
          1.0 - e.clientY / window.innerHeight,
        ),
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate mouse uniform
      materialRef.current.uniforms.uMouse.value.lerp(mousePos, 0.05);
    }
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
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none -z-20 bg-black">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
        }}
        dpr={[1, 2]}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
