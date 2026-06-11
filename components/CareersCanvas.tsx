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
    // Golden ratio spiral distribution on a sphere
    const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    // Add a little randomness for an organic look
    const r = RADIUS + (Math.random() - 0.5) * 5;

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
    uColorCopper: { value: new THREE.Color("#c07840") },
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
    
    // Smooth mouse interpolation
    mouseSmooth.current.lerp(mouseTarget.current, 0.05);
    
    // Update uniforms
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.copy(mouseSmooth.current);
    
    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
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
            
            // Mouse interaction: push points away slightly based on distance to mouse
            // We approximate mouse impact by mapping mouse to world space
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            float distToMouse = distance(worldPos.xy, uMouse * 0.5); // scaled down mouse reach
            float repulse = max(0.0, 15.0 - distToMouse);
            
            // Add a subtle wave to the sphere surface
            float noise = sin(pos.x * 0.1 + uTime * 0.5) * sin(pos.y * 0.1 + uTime * 0.5) * 2.0;
            vec3 dir = normalize(pos);
            
            pos += dir * noise;
            pos += dir * repulse * 0.5;
            
            // Calculate a global intensity based on z-depth and vertical position
            vIntensity = (pos.z + 45.0) / 90.0; 
            vWorldPosition = pos;

            vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
            gl_PointSize = (400.0 / -mvPosition.z) * (1.0 + vIntensity);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorSilver;
          uniform vec3 uColorCopper;
          uniform vec3 uColorBase;
          
          varying float vIntensity;
          varying vec3 vWorldPosition;
          
          void main() {
            // Soft circle particle
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Radial gradient inside the particle
            float alpha = 1.0 - (dist * 2.0);
            alpha = pow(alpha, 1.5);
            
            // Color mix: copper at the top/front, silver at the back/bottom
            float mixFactor = smoothstep(-45.0, 45.0, vWorldPosition.y + vWorldPosition.z);
            vec3 finalColor = mix(uColorSilver, uColorCopper, mixFactor);
            
            // Fade out the back of the sphere for depth
            float depthFade = smoothstep(0.1, 0.8, vIntensity);
            
            gl_FragColor = vec4(finalColor, alpha * depthFade * 1.0);
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
