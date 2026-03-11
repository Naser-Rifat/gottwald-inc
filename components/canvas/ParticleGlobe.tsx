"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function ParticleGlobe() {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate an abstract spherical point cloud with size variation
  const { positions, colors, sizes } = useMemo(() => {
    // Deterministic PRNG seeded by index — avoids impure Math.random() during render
    const seededRandom = (seed: number): number => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const numPoints = 5000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    const sizes = new Float32Array(numPoints);
    const radius = 2;

    const colorDim = new THREE.Color("#444455");
    const colorGold = new THREE.Color("#d4af37");
    const colorPetrol = new THREE.Color("#0a9396");

    for (let i = 0; i < numPoints; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - (2 * i) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color distribution: 75% dim, 15% petrol, 10% gold
      const roll = seededRandom(i);
      const pointColor =
        roll > 0.9 ? colorGold : roll > 0.75 ? colorPetrol : colorDim;
      colors[i * 3] = pointColor.r;
      colors[i * 3 + 1] = pointColor.g;
      colors[i * 3 + 2] = pointColor.b;

      // Size variation: most are tiny specks, some are bright nodes
      sizes[i] = roll > 0.9 ? 0.03 : roll > 0.75 ? 0.02 : 0.012;
    }

    return { positions, colors, sizes };
  }, []);

  // Set initial tilt once via ref callback, animate rotation in useFrame
  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <group rotation={[0, 0, 0.1]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Markers */}
      {/* Tbilisi (Control Node): LAT 41.7151, LON 44.8271 */}
      <GlobeMarker lat={41.7151} lon={44.8271} radius={2} isControlNode />

      {/* DACH Hubs */}
      <GlobeMarker lat={48.1351} lon={11.582} radius={2} />
      <GlobeMarker lat={48.2082} lon={16.3738} radius={2} />
      <GlobeMarker lat={47.3769} lon={8.5417} radius={2} />
    </group>
  );
}

function GlobeMarker({
  lat,
  lon,
  radius,
  isControlNode = false,
}: {
  lat: number;
  lon: number;
  radius: number;
  isControlNode?: boolean;
}) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!isControlNode || !ringRef.current) return;
    const time = clock.getElapsedTime();
    const scale = 1 + (time % 2);
    ringRef.current.scale.set(scale, scale, scale);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
      0,
      1 - (time % 2),
    );
  });

  return (
    <group position={[x, y, z]}>
      {/* Solid center node — 8 segments is plenty for a 0.02 radius dot */}
      <mesh>
        <sphereGeometry args={[isControlNode ? 0.04 : 0.02, 8, 8]} />
        <meshBasicMaterial color="#d4af37" />
      </mesh>

      {/* Pulsing broadcast ring (only for Control Node) */}
      {isControlNode && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.045, 0.055, 24]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
