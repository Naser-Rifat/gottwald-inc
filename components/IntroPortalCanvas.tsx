"use client";

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const PortalMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uZoom: { value: 1.0 },
      uOffsetZ: { value: 0.0 },
    }),
    []
  );

  useEffect(() => {
    const handlePortalStart = () => {
      if (!materialRef.current) return;
      
      // Wormhole zoom and speed acceleration
      gsap.to(materialRef.current.uniforms.uZoom, {
        value: 0.05, // Zoom way into the center
        duration: 1.5,
        ease: "power3.in"
      });
      
      gsap.to(materialRef.current.uniforms.uOffsetZ, {
        value: 5.0, // Fly forward rapidly
        duration: 1.5,
        ease: "power3.in"
      });
    };

    window.addEventListener("portal-start", handlePortalStart);
    return () => window.removeEventListener("portal-start", handlePortalStart);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(
        state.size.width * state.viewport.dpr,
        state.size.height * state.viewport.dpr
      );
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uZoom;
    uniform float uOffsetZ;
    varying vec2 vUv;

    // Simplex 3D Noise by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Normalize UV to [-1, 1] accounting for aspect ratio
      vec2 p = (vUv - 0.5) * 2.0;
      p.x *= uResolution.x / uResolution.y;

      // Wormhole Zoom effect
      p *= uZoom;

      // Polar coordinates
      float r = length(p);
      float a = atan(p.y, p.x);

      // Slower, thicker flow for heavy liquid
      float tunnelZ = 1.0 / (r + 0.1) + uTime * 0.1 + uOffsetZ;
      float cylR = 1.2; 
      vec3 baseCyl = vec3(cos(a) * cylR, sin(a) * cylR, tunnelZ);

      // RECURSIVE DOMAIN WARPING (Awwwards-level Fluid Dynamics)
      // First layer of warping (Q)
      vec3 q = vec3(
        snoise(baseCyl * 1.2 + vec3(0.0, uTime * 0.08, 0.0)),
        snoise(baseCyl * 1.2 + vec3(uTime * 0.08, 0.0, 0.0)),
        snoise(baseCyl * 1.2 - vec3(0.0, 0.0, uTime * 0.08))
      );

      // Second layer of warping (R) - Warping the warp creates natural folding liquids
      vec3 rWarp = vec3(
        snoise((baseCyl + q * 1.5) * 1.8 - vec3(0.0, uTime * 0.12, 0.0)),
        snoise((baseCyl + q * 1.5) * 1.8 + vec3(uTime * 0.12, 0.0, 0.0)),
        snoise((baseCyl + q * 1.5) * 1.8 + vec3(0.0, 0.0, uTime * 0.12))
      );
      
      // Final warped coordinates
      vec3 cylPos = baseCyl + rWarp * 0.6;

      // Extract multi-layered noise from the heavily folded coordinates
      float n1 = snoise(cylPos * 1.5 - vec3(0.0, 0.0, uTime * 0.1));
      float n2 = snoise(cylPos * 3.0 + vec3(0.0, 0.0, uTime * 0.15));
      float noise = (n1 * 0.7 + n2 * 0.3) * 0.5 + 0.5;

      // Create distinct liquid properties
      float fluidBody = smoothstep(0.2, 0.7, noise);         // Thick base liquid
      float fluidInner = smoothstep(0.5, 0.9, noise);        // Bright inner depth
      float specular = pow(smoothstep(0.75, 1.0, noise), 3.0); // Wet glassy/caustic highlights

      // Eye core (black hole in the center)
      float core = smoothstep(0.05, 0.7, r);
      
      // Slow pulsing organic breath
      float pulse = sin(uTime * 0.5) * 0.05 + 0.95;

      // Colors matching GOTT WALD aesthetic
      vec3 bgColor = vec3(0.01, 0.02, 0.06); // Deep space / dark navy
      vec3 petrol = vec3(0.0, 0.25, 0.35); // Viscous Petrol
      vec3 turquoise = vec3(0.07, 0.66, 0.67); // Glowing Turquoise
      vec3 silverHighlight = vec3(0.85, 0.95, 1.0); // Liquid metal reflection

      // Mix colors organically
      vec3 color = mix(bgColor, petrol, fluidBody * core * pulse);
      color = mix(color, turquoise, fluidInner * core * 0.85);
      
      // Add sharp glassy highlights (The secret to Awwwards premium liquid)
      color += silverHighlight * specular * core * 1.5;

      // Edge vignette (soft depth)
      color *= smoothstep(2.5, 0.3, r);

      // Deep dark core with a tiny turquoise reflection
      color += turquoise * smoothstep(0.3, 0.0, r) * 0.2 * noise;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function IntroPortalCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        dpr={[1, 2]}
      >
        <PortalMaterial />
      </Canvas>
    </div>
  );
}
