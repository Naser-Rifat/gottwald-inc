"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// -------------------------------------------------------------
// Ocean Shader (Imported from AboutWaveCanvas logic)
// -------------------------------------------------------------
const AnimatedWave = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color("#020712") }, // Deepest dark blue
      uColorHighlight: { value: new THREE.Color("#0a1f42") }, // Mid blue
      uColorCrest: { value: new THREE.Color("#6db4d6") }, // Bright icy cyan for ripples
      uLightPos: { value: new THREE.Vector3(0, 5, -20) }, 
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.15; // Slow fluid motion
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, 0]}>
      <planeGeometry args={[80, 80, 512, 512]} /> {/* High poly count for micro ripples */}
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;

          // Simplex 2D noise
          vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
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

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Hashgraph style: Dense, small micro-ripples
            float noiseFreq1 = 0.4;
            float noiseAmp1 = 0.25;
            vec2 noisePos1 = vec2(pos.x * noiseFreq1 + uTime * 0.5, pos.y * noiseFreq1 - uTime * 0.8);
            
            float noiseFreq2 = 1.2;
            float noiseAmp2 = 0.08;
            vec2 noisePos2 = vec2(pos.x * noiseFreq2 - uTime * 1.0, pos.y * noiseFreq2 - uTime * 0.5);
            
            float d1 = snoise(noisePos1) * noiseAmp1;
            float d2 = snoise(noisePos2) * noiseAmp2;
            pos.z += d1 + d2;
            
            float eps = 0.02;
            vec3 posDx = position + vec3(eps, 0.0, 0.0);
            float d1Dx = snoise(vec2(posDx.x * noiseFreq1 + uTime * 0.5, posDx.y * noiseFreq1 - uTime * 0.8)) * noiseAmp1;
            float d2Dx = snoise(vec2(posDx.x * noiseFreq2 - uTime * 1.0, posDx.y * noiseFreq2 - uTime * 0.5)) * noiseAmp2;
            posDx.z += d1Dx + d2Dx;
            
            vec3 posDy = position + vec3(0.0, eps, 0.0);
            float d1Dy = snoise(vec2(posDy.x * noiseFreq1 + uTime * 0.5, posDy.y * noiseFreq1 - uTime * 0.8)) * noiseAmp1;
            float d2Dy = snoise(vec2(posDy.x * noiseFreq2 - uTime * 1.0, posDy.y * noiseFreq2 - uTime * 0.5)) * noiseAmp2;
            posDy.z += d1Dy + d2Dy;
            
            vec3 tangentX = normalize(posDx - pos);
            vec3 tangentY = normalize(posDy - pos);
            vec3 localNormal = normalize(cross(tangentX, tangentY));
            
            vNormal = normalize((modelMatrix * vec4(localNormal, 0.0)).xyz);
            vPosition = pos;
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorBase;
          uniform vec3 uColorHighlight;
          uniform vec3 uColorCrest;
          uniform vec3 uLightPos;
          
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;

          vec4 sRGB(vec4 linearColor) {
            vec3 srgb = pow(linearColor.rgb, vec3(1.0 / 2.2));
            return vec4(srgb, linearColor.a);
          }

          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            vec3 lightDir = normalize(uLightPos - vWorldPosition);
            
            vec3 color = uColorBase;
            
            // Mix highlight color smoothly based on ripple height
            float heightMix = smoothstep(-0.2, 0.3, vPosition.z);
            color = mix(color, uColorHighlight, heightMix);
            
            float diff = max(dot(vNormal, lightDir), 0.0);
            color += uColorHighlight * diff * 0.8;
            
            // High specularity for liquid oil look
            vec3 halfDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(vNormal, halfDir), 0.0), 80.0);
            color += uColorCrest * spec * 2.5;
            
            // Fresnel for reflective grazing angles
            float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 5.0);
            color += mix(uColorHighlight, uColorCrest, 0.5) * fresnel * 1.0;
            
            // Smooth fog blending into the sky color
            float dist = length(cameraPosition - vWorldPosition);
            float fogFactor = smoothstep(10.0, 40.0, dist);
            // Deep misty blue sky color
            vec3 fogColor = vec3(0.03, 0.08, 0.18); 
            
            color = mix(color, fogColor, fogFactor);
            
            gl_FragColor = sRGB(vec4(color, 1.0));
          }
        `}
      />
    </mesh>
  );
};


// -------------------------------------------------------------
// Interactive Shattered Stone 
// -------------------------------------------------------------

const seedRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const NUM_PIECES = 24;
const PIECES = Array.from({ length: NUM_PIECES }).map((_, i) => {
  const phi = Math.acos(-1 + (2 * i) / NUM_PIECES);
  const theta = Math.sqrt(NUM_PIECES * Math.PI) * phi;
  
  const direction = new THREE.Vector3(
    Math.cos(theta) * Math.sin(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(phi)
  );

  const scale = new THREE.Vector3(
    0.4 + seedRandom(i * 1) * 0.6,
    0.4 + seedRandom(i * 2) * 0.6,
    0.4 + seedRandom(i * 3) * 0.6
  );

  const rotation = new THREE.Euler(
    seedRandom(i * 4) * Math.PI,
    seedRandom(i * 5) * Math.PI,
    seedRandom(i * 6) * Math.PI
  );

  return { direction, scale, rotation, id: i };
});

const ShatteredStone = () => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const coreLightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very slow natural rotation
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.z += delta * 0.02;
    }

    const targetDistance = hovered ? 1.4 : 0.3;
    
    meshesRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const piece = PIECES[index];
      
      const targetPos = piece.direction.clone().multiplyScalar(targetDistance);
      // Faster, smoother lerp for snappy explosion
      mesh.position.lerp(targetPos, delta * 6);
      
      if (hovered) {
        mesh.rotation.x += delta * (seedRandom(index) - 0.5) * 0.2;
        mesh.rotation.y += delta * (seedRandom(index+1) - 0.5) * 0.2;
      } else {
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, piece.rotation.x, delta * 6);
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, piece.rotation.y, delta * 6);
        mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, piece.rotation.z, delta * 6);
      }
    });
    
    if (coreLightRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      const targetIntensity = hovered ? (25 + pulse * 5) : (5 + pulse * 2);
      coreLightRef.current.intensity = THREE.MathUtils.lerp(coreLightRef.current.intensity, targetIntensity, delta * 6);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.8}>
      <group 
        position={[0, 1.2, 0]} 
        scale={1.3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        
        {/* Core Glowing Light */}
        <pointLight ref={coreLightRef} color="#d1f8ff" distance={15} intensity={5} />
        
        {/* HITBOX SPHERE: Fills the gaps between rocks so the group never loses hover state */}
        <mesh visible={false}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        <group ref={groupRef}>
          {PIECES.map((piece, i) => (
            <mesh 
              key={piece.id}
              ref={(el) => { meshesRef.current[i] = el; }}
              scale={piece.scale}
              rotation={piece.rotation}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial 
                color="#0a1221" 
                roughness={0.7}
                metalness={0.5}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};


// -------------------------------------------------------------
// Main Canvas Component
// -------------------------------------------------------------
export default function HomeHeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto bg-[#071121]">
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 50 }}
        // Opaque background fixes post-processing alpha glitches
        gl={{ antialias: false, alpha: false }} 
      >
        <color attach="background" args={["#071121"]} />
        <fog attach="fog" args={["#071121", 10, 40]} />

        <ambientLight intensity={0.6} color="#4878a8" />
        <directionalLight position={[10, 15, -10]} intensity={1.5} color="#e0f4ff" />
        <directionalLight position={[-10, 10, 10]} intensity={0.8} color="#1c3c63" />

        <AnimatedWave />
        <ShatteredStone />

        <EffectComposer>
          <Bloom 
            luminanceThreshold={1.5} // Only core light glows
            mipmapBlur 
            intensity={2.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
