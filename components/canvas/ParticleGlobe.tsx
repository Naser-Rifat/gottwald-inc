"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function ParticleGlobe() {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate an abstract spherical point cloud
  const { positions, colors } = useMemo(() => {
    const numPoints = 8000;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    const radius = 2; // base radius

    const color1 = new THREE.Color("#444455"); // dim base points
    const color2 = new THREE.Color("#d4af37"); // subtle gold for noise

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

      // Randomly assign some nodes slightly brighter colors
      const isBrighter = Math.random() > 0.8;
      const pointColor = isBrighter ? color2 : color1;
      colors[i * 3] = pointColor.r;
      colors[i * 3 + 1] = pointColor.g;
      colors[i * 3 + 2] = pointColor.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001; // slow rotate
      pointsRef.current.rotation.z = 0.1; // slight tilt
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Markers */}
      {/* Tbilisi (Control Node): LAT 41.7151, LON 44.8271 */}
      <GlobeMarker lat={41.7151} lon={44.8271} radius={2} isControlNode />

      {/* DACH Hubs: Munich 48.1351, 11.5820 | Vienna 48.2082, 16.3738 | Zurich 47.3769, 8.5417 */}
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
  // Convert Lat/Lon to 3D Cartesian spherical coordinates
  // Note: Three.js right-handed coordinate system
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  const markerRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (isControlNode && ringRef.current) {
      const time = clock.getElapsedTime();
      // Pulse animation: scale expands, opacity fades
      const scale = 1 + (time % 2);
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        1 - (time % 2),
      );
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* The solid center node */}
      <mesh>
        <sphereGeometry args={[isControlNode ? 0.04 : 0.02, 16, 16]} />
        <meshBasicMaterial color="#d4af37" />
      </mesh>

      {/* The pulsing broadcast ring (only for Control Node) */}
      {isControlNode && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.045, 0.055, 32]} />
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
