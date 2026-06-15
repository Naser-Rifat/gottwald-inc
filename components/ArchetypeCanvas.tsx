"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  Grid, 
  MeshTransmissionMaterial, 
  Sphere,
  Torus,
  Icosahedron,
  Box,
  Edges,
  MeshDistortMaterial
} from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const COLORS = {
  petrol: "#006d84",
  turquoise: "#12a8ac",
  gold: "#d4af37",
  silver: "#b8c0cc",
  copper: "#c07840",
};

// 1. STRATEGIC PARTNERSHIPS: Interlocking Torus rings
function StrategicVisual() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current && ring2.current) {
      ring1.current.rotation.x = t * 0.4;
      ring1.current.rotation.y = t * 0.3;
      ring2.current.rotation.x = -t * 0.3;
      ring2.current.rotation.z = t * 0.5;
    }
  });

  return (
    <Float speed={2} floatIntensity={1} rotationIntensity={0}>
      <Torus ref={ring1} args={[1.6, 0.04, 16, 100]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.8} wireframe />
      </Torus>
      <Torus ref={ring2} args={[1.2, 0.08, 16, 100]} rotation={[0, Math.PI/2, 0]}>
        <MeshTransmissionMaterial backside color={COLORS.turquoise} clearcoat={1} thickness={0.5} transmission={0.9} />
      </Torus>
      <Sparkles count={50} scale={5} size={3} speed={0.4} color={COLORS.silver} />
    </Float>
  );
}

// 2. DELIVERY PARTNERSHIPS: High speed data/moving particles
function DeliveryVisual() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Loop z position to create endless forward motion
      group.current.position.z = (state.clock.elapsedTime * 6) % 6;
    }
  });

  return (
    <group>
      <group ref={group}>
        {Array.from({ length: 60 }).map((_, i) => (
          <Box 
            key={i} 
            args={[0.06, 0.06, 2.5]} 
            position={[
              (Math.random() - 0.5) * 6, 
              (Math.random() - 0.5) * 6, 
              (Math.random() - 0.5) * 12 - 6
            ]}
          >
            <meshBasicMaterial color={Math.random() > 0.5 ? COLORS.turquoise : COLORS.silver} transparent opacity={0.9} />
          </Box>
        ))}
      </group>
      <Grid infiniteGrid fadeDistance={15} sectionColor={COLORS.turquoise} cellColor={COLORS.petrol} position={[0, -2, 0]} />
    </group>
  );
}

// 3. TECHNOLOGY PARTNERSHIPS: High-tech wireframe Icosahedron
function TechVisual() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current && inner.current) {
      outer.current.rotation.y = t * 0.2;
      outer.current.rotation.x = t * 0.1;
      inner.current.rotation.y = -t * 0.4;
      inner.current.rotation.z = t * 0.2;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Icosahedron ref={outer} args={[2.2, 1]}>
        <meshBasicMaterial color={COLORS.turquoise} wireframe transparent opacity={0.4} />
      </Icosahedron>
      <Icosahedron ref={inner} args={[1.3, 0]}>
        <Edges scale={1.0} threshold={15} color={COLORS.gold} />
        <meshStandardMaterial color="#0a1218" emissive="#050a0f" />
      </Icosahedron>
      <Sparkles count={100} scale={4} size={2.5} color={COLORS.turquoise} speed={0.2} />
    </Float>
  );
}

// 4. CREATIVE & MEDIA PARTNERSHIPS: Fluid morphing blob
function CreativeVisual() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial 
          color={COLORS.turquoise} 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0} 
          metalness={0.9} 
          roughness={0.1} 
          distort={0.5} 
          speed={3} 
        />
      </Sphere>
      <Sparkles count={60} scale={5} size={3.5} color={COLORS.gold} />
    </Float>
  );
}

// 5. LOCAL OPERATIONS PARTNERSHIPS: Node cluster network
function LocalVisual() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.15;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  const nodes = useMemo(() => {
    const pos = [];
    for(let i=0; i<14; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5
      ));
    }
    return pos;
  }, []);

  return (
    <Float speed={1} floatIntensity={0.5}>
      <group ref={group}>
        {nodes.map((p, i) => (
          <Sphere key={i} args={[0.15, 16, 16]} position={p}>
            <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.8} />
          </Sphere>
        ))}
        {/* Draw lines between close nodes */}
        {nodes.map((p1, i) => 
          nodes.map((p2, j) => {
            if (i < j && p1.distanceTo(p2) < 3.5) {
              const points = [p1, p2];
              const curve = new THREE.CatmullRomCurve3(points);
              return (
                <mesh key={`${i}-${j}`}>
                  <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
                  <meshBasicMaterial color={COLORS.turquoise} transparent opacity={0.6} />
                </mesh>
              );
            }
            return null;
          })
        )}
      </group>
      <Sparkles count={60} scale={6} size={2} color={COLORS.turquoise} />
    </Float>
  );
}

export default function ArchetypeCanvas({ index }: { index: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color={COLORS.turquoise} />
      <directionalLight position={[-5, -5, -5]} intensity={2} color={COLORS.gold} />
      <pointLight position={[0, 0, 5]} intensity={2} color={COLORS.silver} />
      
      {index === 0 && <StrategicVisual />}
      {index === 1 && <DeliveryVisual />}
      {index === 2 && <TechVisual />}
      {index === 3 && <CreativeVisual />}
      {index === 4 && <LocalVisual />}
    </Canvas>
  );
}
