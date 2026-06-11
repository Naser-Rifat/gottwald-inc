"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── THE GOTT WALD MATRIX (COMPLEXITY INTO INEVITABILITY) ────────────────────
// Floating random dust is for crypto startups. 
// A multi-billion dollar holding company requires structure, permanence, and precision.
// This is a perfect mathematical grid of 22,500 data points that undulates 
// using the exact Gott Wald Manifesto Frequencies (Nature, Signal, Human).

const GRID_SIZE = 150;
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;

const POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const spread = 0.6; // Distance between each point
  const offset = (GRID_SIZE * spread) / 2;
  
  let i = 0;
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      // Create a perfectly precise 2D flat grid
      pos[i * 3]     = x * spread - offset;
      pos[i * 3 + 1] = y * spread - offset;
      pos[i * 3 + 2] = 0;
      i++;
    }
  }
  return pos;
})();

const UNIFORMS = {
  uTime:        { value: 0 },
  uColorPetrol: { value: new THREE.Color("#006d84") },
  uColorSignal: { value: new THREE.Color("#12a8ac") },
  uColorSilver: { value: new THREE.Color("#b8c0cc") },
};

const ManifestoMatrixFlow = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      // Slightly faster time for fluid, confident motion
      material.uniforms.uTime.value = state.clock.elapsedTime * 0.4;
      
      // Extremely subtle, majestic tilt to show the depth of the grid
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    // Tilt the grid back so it looks like a deep, infinite ocean of data
    <points ref={pointsRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -5]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[POSITIONS, 3]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={UNIFORMS}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          varying float vHeight;
          varying vec2  vPositionXY;

          // ─── GOTT WALD MANIFESTO FREQUENCIES ────────────────────────────────
          // Axis I  — Nature:  deep, slow, majestic swell
          // Axis II — Signal:  mid-range directional wave
          // Axis III— Human:   fine surface texture
          float bWave(vec2 p, float freq, float spd, float amp, vec2 dir) {
            return sin(dot(normalize(dir), p) * freq + uTime * spd) * amp;
          }

          void main() {
            vec3 pos = position;
            vec2 p = pos.xy;
            vPositionXY = p; // Pass the original flat position for radial fading
            
            // The exact mathematical coherence of the Gott Wald brand
            float z  = bWave(p, 0.030, 0.13, 4.2, vec2( 0.94,  0.34));
            z += bWave(p, 0.078, 0.24, 1.8, vec2( 0.52,  0.85));
            z += bWave(p, 0.155, 0.46, 0.55, vec2(-0.36,  0.93));
            z += bWave(p, 0.044, 0.10, 2.4, vec2(-0.80,  0.60));
            z += bWave(p, 0.112, 0.32, 0.75, vec2( 0.70, -0.72));
            
            pos.z = z;
            vHeight = pos.z;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Razor sharp, engineered data points
            gl_PointSize = max(1.5, 60.0 / -mvPosition.z);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorPetrol;
          uniform vec3 uColorSignal;
          uniform vec3 uColorSilver;
          
          varying float vHeight;
          varying vec2  vPositionXY;
          
          void main() {
            // Keep points perfectly circular and sharp
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float dotAlpha = smoothstep(0.5, 0.4, dist);
            
            // Map colors cleanly based on data height
            float t1 = smoothstep(-4.0, 2.0, vHeight);
            float t2 = smoothstep(1.0, 5.0, vHeight);
            
            vec3 color = mix(uColorPetrol, uColorSignal, t1);
            color = mix(color, uColorSilver, t2);
            
            // Boost color intensity for a high-end glowing screen effect
            color *= 1.4;
            
            // Radial Vignette: The grid must fade perfectly into the black void at the edges
            // so it doesn't look like a cut-off square.
            float centerDist = length(vPositionXY) / 45.0; // 45.0 is the radius of visibility
            float gridAlpha = smoothstep(1.0, 0.3, centerDist);
            
            // Overall opacity kept slightly restrained so the Typography remains the king
            gl_FragColor = vec4(color, dotAlpha * gridAlpha * 0.75);
          }
        `}
      />
    </points>
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
