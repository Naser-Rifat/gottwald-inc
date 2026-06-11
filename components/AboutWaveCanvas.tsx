"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── THE GOTT WALD MATRIX (COMPLEXITY INTO INEVITABILITY) ────────────────────
const GRID_SIZE = 150;
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;
const SPREAD = 0.6;
const OFFSET = (GRID_SIZE * SPREAD) / 2;

const POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  let i = 0;
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      pos[i * 3]     = x * SPREAD - OFFSET;
      pos[i * 3 + 1] = y * SPREAD - OFFSET;
      pos[i * 3 + 2] = 0;
      i++;
    }
  }
  return pos;
})();

const ManifestoMatrixFlow = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  
  // Interactive Mouse State
  const mouseTarget  = useRef(new THREE.Vector2(0, 0));
  const mouseSmooth  = useRef(new THREE.Vector2(0, 0));
  const mouseStrength = useRef(0);
  const { viewport, size } = useThree();

  const uniforms = useMemo(() => ({
    uTime:          { value: 0 },
    uMouse:         { value: new THREE.Vector2(0, 0) },
    uMouseStrength: { value: 0 },
    uColorPetrol:   { value: new THREE.Color("#006d84") },
    uColorSignal:   { value: new THREE.Color("#12a8ac") },
    uColorSilver:   { value: new THREE.Color("#b8c0cc") },
  }), []);

  // Track mouse movement to create the interactive ripples
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTarget.current.set(
        ((e.clientX / size.width)  * 2 - 1) * (viewport.width  * 2),
       -((e.clientY / size.height) * 2 - 1) * (viewport.height * 2)
      );
      mouseStrength.current = 1.0;
    };
    const onLeave = () => { mouseStrength.current = 0; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [viewport, size]);

  useFrame((state) => {
    // Update uniforms — increased speed for a more dynamic, flowing data feel
    uniforms.uTime.value = state.clock.elapsedTime * 0.95;
    
    // Smooth mouse interpolation
    mouseSmooth.current.lerp(mouseTarget.current, 0.05);
    uniforms.uMouse.value.copy(mouseSmooth.current);
    mouseStrength.current *= 0.95; // Decay
    uniforms.uMouseStrength.value = mouseStrength.current;

    const tilt = Math.sin(state.clock.elapsedTime * 0.2) * 0.05; // Slightly faster tilt
    
    if (pointsRef.current) {
      pointsRef.current.rotation.z = tilt;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.z = tilt;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseStrength;
    
    varying float vHeight;
    varying vec2  vPositionXY;
    varying float vDepth;

    // ─── GOTT WALD MANIFESTO FREQUENCIES ────────────────────────────────
    float bWave(vec2 p, float freq, float spd, float amp, vec2 dir) {
      return sin(dot(normalize(dir), p) * freq + uTime * spd) * amp;
    }

    void main() {
      vec3 pos = position;
      vec2 p = pos.xy;
      vPositionXY = p; 
      
      // The exact mathematical coherence of the Gott Wald brand
      float z  = bWave(p, 0.030, 0.13, 4.2, vec2( 0.94,  0.34));
      z += bWave(p, 0.078, 0.24, 1.8, vec2( 0.52,  0.85));
      z += bWave(p, 0.155, 0.46, 0.55, vec2(-0.36,  0.93));
      z += bWave(p, 0.044, 0.10, 2.4, vec2(-0.80,  0.60));
      z += bWave(p, 0.112, 0.32, 0.75, vec2( 0.70, -0.72));
      
      // Interactive Mouse Ripple
      vec2 md = p - uMouse;
      float mDist = length(md);
      z += sin(mDist * 0.5 - uTime * 6.0) * exp(-mDist * 0.08) * uMouseStrength * 5.0;

      pos.z = z;
      vHeight = pos.z;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      vDepth = -mvPosition.z;
      gl_PointSize = max(1.5, 60.0 / vDepth);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorPetrol;
    uniform vec3 uColorSignal;
    uniform vec3 uColorSilver;
    
    varying float vHeight;
    varying vec2  vPositionXY;
    varying float vDepth;
    
    void main() {
      // Keep points perfectly circular and sharp
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      // Simulated Cinematic Depth of Field
      // Points further away get softer edges
      float blur = smoothstep(20.0, 60.0, vDepth);
      float edgeFade = mix(0.4, 0.1, blur);
      float dotAlpha = smoothstep(0.5, edgeFade, dist);
      
      // Map colors cleanly based on data height
      float t1 = smoothstep(-4.0, 2.0, vHeight);
      float t2 = smoothstep(1.0, 5.0, vHeight);
      
      vec3 color = mix(uColorPetrol, uColorSignal, t1);
      color = mix(color, uColorSilver, t2);
      
      // Boost color intensity for a high-end glowing screen effect
      color *= 1.4;
      
      // Radial Vignette
      float centerDist = length(vPositionXY) / 45.0;
      float gridAlpha = smoothstep(1.0, 0.3, centerDist);
      
      gl_FragColor = vec4(color, dotAlpha * gridAlpha * 0.85);
    }
  `;

  const wireframeFragmentShader = `
    uniform vec3 uColorPetrol;
    uniform vec3 uColorSignal;
    
    varying float vHeight;
    varying vec2  vPositionXY;
    varying float vDepth;
    
    void main() {
      float t1 = smoothstep(-4.0, 4.0, vHeight);
      vec3 color = mix(uColorPetrol, uColorSignal, t1) * 1.2;
      
      // Aggressive radial fade for wireframe so it doesn't look messy
      float centerDist = length(vPositionXY) / 35.0;
      float gridAlpha = smoothstep(1.0, 0.2, centerDist);
      
      // Extremely subtle opacity
      gl_FragColor = vec4(color, gridAlpha * 0.15);
    }
  `;

  return (
    <group rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -5]}>
      
      {/* LAYER 1: The Subtle Quantum Net (Wireframe Mesh) */}
      <mesh ref={wireframeRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[GRID_SIZE * SPREAD, GRID_SIZE * SPREAD, 60, 60]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent={true}
          wireframe={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={wireframeFragmentShader}
        />
      </mesh>

      {/* LAYER 2: The Razor Sharp Data Matrix (Points) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>

    </group>
  );
};

// ─── Export ────────────────────────────────────────────────────────────────────
export default function AboutWaveCanvas() {
  return (
    <div className="hero-bg-image absolute inset-0 z-0 pointer-events-none bg-[#020509]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <fog attach="fog" args={["#020509", 5, 35]} />
        <ManifestoMatrixFlow />
      </Canvas>
    </div>
  );
}
