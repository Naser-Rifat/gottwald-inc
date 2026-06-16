"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  Grid, 
  MeshTransmissionMaterial, 
  Trail, 
  Sphere,
  TorusKnot,
  Octahedron,
  Box,
  Edges,
  Cone
} from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const COLORS = {
  cyan: "#22d3ee",
  cyanDeep: "#0891b2",
  gold: "#facc15",
  goldDim: "#ca8a04",
  white: "#ffffff",
  dark: "#0f172a",
};

// ----------------------------------------------------
// 0. INTEGRITY: A perfect, unbreakable lattice/grid.
// ----------------------------------------------------
function IntegrityVisual() {
  const monolithRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (monolithRef.current) {
      // Much faster rotation so it's obvious it's animated
      monolithRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      monolithRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      <Grid 
        infiniteGrid 
        fadeDistance={10} 
        sectionColor={COLORS.cyanDeep} 
        cellColor={COLORS.cyan} 
        position={[0, -2, 0]} 
        cellSize={0.5}
        sectionSize={2.5}
      />
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0}>
        <Box ref={monolithRef} args={[1.5, 3, 1.5]}>
          <meshBasicMaterial color="#020406" transparent opacity={0.9} />
          <Edges scale={1.01} threshold={15} color={COLORS.cyan} />
          <Box args={[1.4, 2.9, 1.4]}>
            <Edges scale={1.0} threshold={15} color={COLORS.goldDim} />
          </Box>
        </Box>
      </Float>
      <rectAreaLight width={5} height={5} color={COLORS.cyan} intensity={2} position={[0, 2, -2]} lookAt={[0, 0, 0] as any} />
    </group>
  );
}

// ----------------------------------------------------
// 1. DELIVERY PROOF: Fast data trails hitting a target.
// ----------------------------------------------------
function ProofVisual() {
  const targetRef = useRef<THREE.Mesh>(null);
  
  // Create refs for the trailing meshes so we can move them manually
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (targetRef.current) {
      targetRef.current.rotation.y = t * 0.8;
      targetRef.current.rotation.x = t * 0.4;
    }
    
    // Move the meshes in orbits to trigger the trails
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const speed = 1.5 + (i * 0.2);
        const radius = 2.5;
        const offset = i * (Math.PI * 2) / 6;
        
        // Complex orbit paths
        mesh.position.x = Math.sin(t * speed + offset) * radius;
        mesh.position.y = Math.cos(t * speed + offset) * radius * Math.sin(t * 0.5);
        mesh.position.z = Math.cos(t * speed + offset) * radius * Math.cos(t * 0.5);
      }
    });
  });

  return (
    <group position={[0, 0.5, 0]}>
      <Float speed={2}>
        <Octahedron ref={targetRef} args={[1, 0]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          <Edges scale={1.01} color={COLORS.gold} />
        </Octahedron>
        
        <group>
          {[...Array(6)].map((_, i) => (
            <Trail
              key={i}
              width={2}
              length={8}
              color={i % 2 === 0 ? COLORS.cyan : COLORS.white}
              attenuation={(t) => t * t}
            >
              <mesh ref={(el) => { meshRefs.current[i] = el; }}>
                <sphereGeometry args={[0.04]} />
                <meshBasicMaterial color={COLORS.white} />
              </mesh>
            </Trail>
          ))}
        </group>
      </Float>
    </group>
  );
}

// ----------------------------------------------------
// 2. SYSTEMS THINKING: Intricate, interlocking mechanics
// ----------------------------------------------------
function SystemsVisual() {
  const knotRef1 = useRef<THREE.Mesh>(null);
  const knotRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (knotRef1.current) {
      knotRef1.current.rotation.x = t * 0.2;
      knotRef1.current.rotation.y = t * 0.3;
    }
    if (knotRef2.current) {
      knotRef2.current.rotation.x = -t * 0.2;
      knotRef2.current.rotation.y = -t * 0.1;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      <Float speed={1.5}>
        <TorusKnot ref={knotRef1} args={[1.2, 0.2, 128, 16]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.5} />
          <Edges scale={1.01} threshold={20} color={COLORS.cyan} />
        </TorusKnot>
        <TorusKnot ref={knotRef2} args={[0.8, 0.15, 128, 8]} rotation={[0, Math.PI/2, 0]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.5} />
          <Edges scale={1.01} threshold={20} color={COLORS.gold} />
        </TorusKnot>
      </Float>
    </group>
  );
}

// ----------------------------------------------------
// 3. DISCRETION: Pure stealth. Bending light.
// ----------------------------------------------------
function DiscretionVisual() {
  return (
    <group position={[0, 0.5, 0]}>
      <Grid 
        infiniteGrid 
        fadeDistance={8} 
        sectionColor="#ffffff" 
        cellColor="#ffffff" 
        position={[0, 0, -3]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Float speed={0.5} floatIntensity={0.2}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial 
            transmission={1} 
            thickness={2} 
            roughness={0} 
            chromaticAberration={0.05} 
            ior={1.5}
            distortion={0.5}
            distortionScale={0.2}
            clearcoat={1}
          />
        </Sphere>
      </Float>
      <Sparkles count={20} scale={4} size={0.3} color={COLORS.cyan} opacity={0.2} speed={0.1} />
    </group>
  );
}

// ----------------------------------------------------
// 4. QUALITY UNDER PRESSURE: Intense core absorbing chaotic energy
// ----------------------------------------------------
function PressureVisual() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  const particlesCount = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for(let i=0; i<particlesCount*3; i++) {
      pos[i] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);
  
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1;
      const pulse = 1 + Math.sin(t * 8) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<particlesCount; i++) {
        const i3 = i * 3;
        // Accelerate towards center
        posArray[i3] -= posArray[i3] * 0.03;
        posArray[i3+1] -= (posArray[i3+1] - 0.5) * 0.03; // Pull towards center Y offset
        posArray[i3+2] -= posArray[i3+2] * 0.03;
        
        if (Math.abs(posArray[i3]) < 0.1 && Math.abs(posArray[i3+1] - 0.5) < 0.1) {
          posArray[i3] = (Math.random() - 0.5) * 8;
          posArray[i3+1] = (Math.random() - 0.5) * 8 + 0.5;
          posArray[i3+2] = (Math.random() - 0.5) * 8;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      <Float speed={3}>
        <Octahedron ref={coreRef} args={[1, 0]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          <Edges scale={1.01} color={COLORS.cyan} />
        </Octahedron>
        <Sphere args={[0.8, 32, 32]}>
           <meshBasicMaterial color={COLORS.cyanDeep} transparent opacity={0.15} />
        </Sphere>
      </Float>
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color={COLORS.gold} transparent opacity={0.8} />
      </points>
    </group>
  );
}

// ----------------------------------------------------
// 5. VALUES COMPATIBILITY: Two distinct forms harmonizing
// ----------------------------------------------------
function ValuesVisual() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.3;
      group.current.position.y = Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      <Float speed={1}>
        <group ref={group}>
          <Cone args={[1, 1.5, 4]} position={[0, 0.85, 0]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            <Edges scale={1.01} color={COLORS.cyan} />
          </Cone>
          <Cone args={[1, 1.5, 4]} position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            <Edges scale={1.01} color={COLORS.gold} />
          </Cone>
          <Octahedron args={[0.2, 0]}>
            <meshBasicMaterial color={COLORS.white} />
          </Octahedron>
        </group>
        <Sparkles count={40} scale={4} size={0.5} speed={0.5} color={COLORS.white} opacity={0.3} />
      </Float>
    </group>
  );
}

// ----------------------------------------------------
// MAIN CANVAS COMPONENT
// ----------------------------------------------------
export default function StandardCanvas({ index }: { index: number }) {
  const visuals = [
    <IntegrityVisual key="0" />,
    <ProofVisual key="1" />,
    <SystemsVisual key="2" />,
    <DiscretionVisual key="3" />,
    <PressureVisual key="4" />,
    <ValuesVisual key="5" />
  ];

  return (
    <Canvas 
      camera={{ position: [0, 0, 6], fov: 45 }} 
      dpr={[1, 2]} 
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      
      {visuals[index % visuals.length]}
    </Canvas>
  );
}
