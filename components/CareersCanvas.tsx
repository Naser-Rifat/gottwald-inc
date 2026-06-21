"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── GLOBAL FAMILY CONSTELLATION ─────────────────────────────────────────────────
const PARTICLE_COUNT = 3500;
const RADIUS = 45;

const POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Golden ratio spiral distribution on a PERFECT sphere (no messy randomness)
    const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    const r = RADIUS; // Perfect mathematical structure

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
})();

const GlobalFamilySphere = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Interactive Mouse State
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouseSmooth = useRef(new THREE.Vector2(0, 0));
  const { viewport, size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorSilver: { value: new THREE.Color("#b8c0cc") },
    // Brighter, more luminous Copper for WebGL Additive Blending (avoids the muddy rust look)
    uColorCopper: { value: new THREE.Color("#e69b65") }, 
    uColorBase: { value: new THREE.Color("#0c1320") },
  }), []);

  // Track mouse movement
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTarget.current.set(
        ((e.clientX / size.width) * 2 - 1) * viewport.width,
        (-(e.clientY / size.height) * 2 + 1) * viewport.height
      );
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [viewport, size]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    mouseSmooth.current.lerp(mouseTarget.current, 0.05);

    // Three.js uniforms are mutable WebGL state handles — mutating their
    // .value inside useFrame is the canonical r3f pattern. React 19's
    // immutability rule doesn't accommodate this idiom.
    /* eslint-disable react-hooks/immutability */
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.copy(mouseSmooth.current);
    /* eslint-enable react-hooks/immutability */

    // Elegant, slow cinematic rotation
    pointsRef.current.rotation.y += delta * 0.06;
    pointsRef.current.rotation.x += delta * 0.025;
    pointsRef.current.rotation.z += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[POSITIONS, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          
          varying float vIntensity;
          varying vec3 vWorldPosition;
          
          void main() {
            vec3 pos = position;
            
            // Mouse interaction: push points away elegantly
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            float distToMouse = distance(worldPos.xy, uMouse * 0.4); 
            float repulse = max(0.0, 20.0 - distToMouse);
            
            // Gentle, fluid breathing wave across the mathematical sphere
            float noise = sin(pos.x * 0.08 + uTime * 0.6) * cos(pos.y * 0.08 + uTime * 0.4) * 2.5;
            vec3 dir = normalize(pos);
            
            pos += dir * noise;
            pos += dir * (repulse * 0.4);
            
            // Intensity based on depth (z) for a strong 3D volume feel
            vIntensity = (pos.z + 45.0) / 90.0; 
            vWorldPosition = pos;

            vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
            
            // Dynamic particle size based on depth + wave
            gl_PointSize = (450.0 / -mvPosition.z) * (0.8 + vIntensity * 0.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorSilver;
          uniform vec3 uColorCopper;
          uniform float uTime;
          
          varying float vIntensity;
          varying vec3 vWorldPosition;
          
          void main() {
            // Perfect soft circular glow
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Smooth bell-curve alpha for premium bokeh effect
            float alpha = smoothstep(0.5, 0.1, dist);
            
            // Dynamic color shimmering: Copper and Silver constantly orbit each other
            float shimmer = sin(vWorldPosition.x * 0.05 + uTime) * cos(vWorldPosition.y * 0.05 + uTime);
            float mixFactor = smoothstep(-45.0, 45.0, vWorldPosition.y + vWorldPosition.z * shimmer * 2.0);
            
            vec3 finalColor = mix(uColorSilver, uColorCopper, mixFactor);
            
            // Deep fade at the back of the sphere for massive 3D volume
            float depthFade = smoothstep(0.05, 0.85, vIntensity);
            
            gl_FragColor = vec4(finalColor, alpha * depthFade * 0.95);
          }
        `}
      />
    </points>
  );
};

export default function CareersCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 45 }}
      dpr={[1, 2]} // sharp rendering
      gl={{ 
        antialias: false,
        powerPreference: "high-performance",
        alpha: true 
      }}
      className="absolute inset-0 w-full h-full"
    >
      <GlobalFamilySphere />
    </Canvas>
  );
}
