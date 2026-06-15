'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial, MeshDistortMaterial, Sparkles, Sphere, Icosahedron, Octahedron, Torus, Box, Stars } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = [
  '#12a8ac', // Decision: Turquoise
  '#94a3b8', // Execution: Silver
  '#fbbf24', // Visibility: Gold
  '#06b6d4', // Digital: Cyan
  '#ea580c', // Leadership: Copper
];

// 0. Decision Gridlock Dissolves (Boxes drifting apart from a glowing core)
function DecisionVisual({ color, active }: { color: string, active: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || !active) return;
    group.current.rotation.x += delta * 0.1;
    group.current.rotation.y += delta * 0.2;
    // Dissolve animation: children drift outwards
    const t = (Math.sin(state.clock.elapsedTime * 1.5) * 0.5 + 0.5); // 0 to 1
    group.current.children.forEach((child, i) => {
      if (i > 0) { // skip the core
        const start = child.userData.startPos as THREE.Vector3;
        if (start) {
          child.position.lerp(start.clone().multiplyScalar(1 + t * 0.6), 0.1);
          child.rotation.x += delta * (i % 2 === 0 ? 0.5 : -0.5);
        }
      }
    });
  });

  return (
    <group ref={group} visible={active}>
      {/* Glowing Core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.1} />
      </Sphere>
      {/* 8 boxes forming a gridlock */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = (i % 2 === 0 ? 1 : -1) * 0.45;
        const y = (i % 4 < 2 ? 1 : -1) * 0.45;
        const z = (i < 4 ? 1 : -1) * 0.45;
        const pos = new THREE.Vector3(x, y, z);
        return (
          <Box key={i} args={[0.7, 0.7, 0.7]} position={pos} userData={{ startPos: pos }}>
            <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} transparent opacity={0.6} wireframe />
          </Box>
        );
      })}
    </group>
  );
}

// 1. Execution becomes predictable (Swiss Watch / Gyroscope)
function ExecutionVisual({ color, active }: { color: string, active: boolean }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active) return;
    if (ring1.current) ring1.current.rotation.x += delta * 0.5;
    if (ring2.current) ring2.current.rotation.y += delta * 1.0;
    if (ring3.current) ring3.current.rotation.z += delta * 1.5;
  });

  return (
    <group visible={active}>
      <Torus ref={ring1} args={[1.5, 0.02, 32, 100]}>
        <meshPhysicalMaterial color={color} metalness={1} roughness={0.1} emissive={color} emissiveIntensity={1} />
      </Torus>
      <Torus ref={ring2} args={[1.2, 0.04, 32, 100]} rotation={[Math.PI/2, 0, 0]}>
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.2} />
      </Torus>
      <Torus ref={ring3} args={[0.9, 0.02, 32, 100]} rotation={[0, Math.PI/2, 0]}>
        <meshPhysicalMaterial color={color} metalness={1} roughness={0.1} emissive={color} emissiveIntensity={2} />
      </Torus>
      <Octahedron args={[0.5, 0]}>
        <meshPhysicalMaterial color="#0f172a" metalness={1} roughness={0.1} />
      </Octahedron>
    </group>
  );
}

// 2. Visibility becomes plan-able (Dual Radar Ping)
function VisibilityVisual({ color, active }: { color: string, active: boolean }) {
  const radar1 = useRef<THREE.Mesh>(null);
  const radar2 = useRef<THREE.Mesh>(null);
  const mat1 = useRef<THREE.MeshPhysicalMaterial>(null);
  const mat2 = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state, delta) => {
    if (!active || !radar1.current || !radar2.current || !mat1.current || !mat2.current) return;
    
    // Ping 1
    let s1 = radar1.current.scale.x + delta * 0.5;
    if (s1 > 3) s1 = 0.1;
    radar1.current.scale.set(s1, s1, s1);
    mat1.current.opacity = Math.max(0, 1 - (s1 / 3));

    // Ping 2 (offset)
    let s2 = radar2.current.scale.x + delta * 0.5;
    if (s2 > 3) s2 = 0.1;
    radar2.current.scale.set(s2, s2, s2);
    mat2.current.opacity = Math.max(0, 1 - (s2 / 3));
  });

  return (
    <group visible={active}>
      {/* The solid plan/core */}
      <Sphere args={[0.4, 32, 32]}>
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0} />
      </Sphere>
      <Sphere ref={radar1} args={[1, 32, 32]}>
        <meshPhysicalMaterial ref={mat1} color={color} emissive={color} emissiveIntensity={2} wireframe transparent />
      </Sphere>
      {/* Start radar 2 already expanded so they are offset */}
      <Sphere ref={radar2} args={[1, 32, 32]} scale={1.5}>
        <meshPhysicalMaterial ref={mat2} color={color} emissive={color} emissiveIntensity={1} wireframe transparent />
      </Sphere>
    </group>
  );
}

// 3. Digital presence powerful (Pulsating Plasma Core)
function DigitalVisual({ color, active }: { color: string, active: boolean }) {
  const sphere = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!active || !sphere.current) return;
    sphere.current.rotation.y += delta * 0.2;
    sphere.current.rotation.x += delta * 0.1;
  });
  return (
    <group visible={active}>
      <Sphere ref={sphere} args={[1.2, 128, 128]}>
        <MeshDistortMaterial color="#000000" emissive={color} emissiveIntensity={1.5} distort={0.5} speed={3} roughness={0.1} metalness={1} clearcoat={1} clearcoatRoughness={0.1} />
      </Sphere>
      <Sphere args={[1.35, 32, 32]}>
        <meshPhysicalMaterial color={color} wireframe transparent opacity={0.15} />
      </Sphere>
    </group>
  );
}

// 4. Leadership stabilizes (Calm Monolith & Halos)
function LeadershipVisual({ color, active }: { color: string, active: boolean }) {
  const monolith = useRef<THREE.Mesh>(null);
  const ringGroup = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!active) return;
    if (monolith.current) {
      monolith.current.rotation.y += delta * 0.05; // very slow, stable
      monolith.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringGroup.current) {
      ringGroup.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group visible={active}>
      <Box ref={monolith} args={[0.8, 1.8, 0.8]}>
        <meshPhysicalMaterial color="#020408" metalness={1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.2} />
      </Box>
      <group ref={ringGroup} rotation={[Math.PI/2.5, 0, 0]}>
        <Torus args={[1.6, 0.01, 16, 100]}>
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={3} />
        </Torus>
        <Torus args={[1.8, 0.005, 16, 100]}>
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1} />
        </Torus>
      </group>
    </group>
  );
}

function SceneManager({ activeIndex }: { activeIndex: number }) {
  const targetColor = useMemo(() => new THREE.Color(COLORS[activeIndex]), [activeIndex]);
  
  // We can render all 5, but only the active one handles complex frame updates and visibility
  return (
    <group>
      {/* Spherical Stars for edgeless infinite space */}
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      
      {/* Exaggerated Floating Effect */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
        <group scale={0.35}>
          <DecisionVisual color={COLORS[0]} active={activeIndex === 0} />
          <ExecutionVisual color={COLORS[1]} active={activeIndex === 1} />
          <VisibilityVisual color={COLORS[2]} active={activeIndex === 2} />
          <DigitalVisual color={COLORS[3]} active={activeIndex === 3} />
          <LeadershipVisual color={COLORS[4]} active={activeIndex === 4} />
        </group>
      </Float>
    </group>
  );
}

export default function ShiftCanvas({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="absolute -inset-[25%] w-[150%] h-[150%] pointer-events-none mix-blend-screen">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={['#070c14', 3, 12]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
        
        {/* Soft local environment for reflections without HDR fetching */}
        <Environment resolution={256} background={false}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 5, -9]} scale={[10, 10, 1]}>
              <planeGeometry />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-5, 1, -1]} scale={[10, 2, 1]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[5, 1, -1]} scale={[10, 2, 1]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </Environment>

        <SceneManager activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}
