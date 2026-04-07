// import * as THREE from "three";
// import { cosmicDustVertShader } from "./shaders/cosmicDustVert";
// import { cosmicDustFragShader } from "./shaders/cosmicDustFrag";

// // Fewer, larger, softer particles = smooth smoke instead of grainy noise
// const PARTICLE_COUNT = 20000;
// const SPREAD_X = 14;
// const SPREAD_Y = 10;
// const SPREAD_Z = 4;
// const PARTICLE_SIZE = 80.0; // Very large so particles fully overlap into smooth clouds

// export default class CosmicDust extends THREE.Group {
//   points!: THREE.Points;
//   material!: THREE.ShaderMaterial;
//   mouse = new THREE.Vector2(0, 0);
//   private mouseMoveHandler: (e: MouseEvent) => void;

//   constructor() {
//     super();

//     this.mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
//     window.addEventListener("mousemove", this.mouseMoveHandler);

//     this.createParticles();
//   }

//   private createParticles() {
//     const geometry = new THREE.BufferGeometry();

//     const positions = new Float32Array(PARTICLE_COUNT * 3);
//     const randoms = new Float32Array(PARTICLE_COUNT * 3);
//     const scales = new Float32Array(PARTICLE_COUNT);

//     // Cloud cluster centers — spread across the viewport
//     const clusters = [
//       { x: -2, y: 3, z: -1, weight: 0.15 }, // upper left cloud
//       { x: 3, y: 2, z: 0, weight: 0.12 }, // upper right cloud
//       { x: -4, y: -2, z: -1, weight: 0.1 }, // left cloud
//       { x: 5, y: -1, z: -1, weight: 0.1 }, // right cloud
//       { x: 0, y: -3, z: -2, weight: 0.08 }, // bottom center
//       { x: -1, y: 0, z: -1, weight: 0.12 }, // center cloud
//       { x: 6, y: -3, z: 0, weight: 0.08 }, // bottom right
//       { x: -5, y: 1, z: 1, weight: 0.07 }, // far left
//       { x: 2, y: 4, z: -0.5, weight: 0.06 }, // top
//       { x: -3, y: -4, z: 0, weight: 0.05 }, // bottom left
//     ];

//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       const i3 = i * 3;

//       const isCluster = Math.random() < 0.75; // 75% in clouds

//       if (isCluster) {
//         // Pick a weighted random cluster
//         const cluster = clusters[Math.floor(Math.random() * clusters.length)];
//         const spread = 2.5 + Math.random() * 3.0;

//         // Gaussian distribution around cluster center
//         const gx =
//           (Math.random() + Math.random() + Math.random() + Math.random()) /
//             4.0 -
//           0.5;
//         const gy =
//           (Math.random() + Math.random() + Math.random() + Math.random()) /
//             4.0 -
//           0.5;
//         const gz =
//           (Math.random() + Math.random() + Math.random() + Math.random()) /
//             4.0 -
//           0.5;

//         positions[i3] = cluster.x + gx * spread;
//         positions[i3 + 1] = cluster.y + gy * spread;
//         positions[i3 + 2] = cluster.z + gz * SPREAD_Z - 2;
//       } else {
//         // Scattered fill
//         positions[i3] = (Math.random() - 0.5) * SPREAD_X * 2;
//         positions[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y * 2;
//         positions[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z - 3;
//       }

//       // Random seeds
//       randoms[i3] = Math.random();
//       randoms[i3 + 1] = Math.random();
//       randoms[i3 + 2] = Math.random();

//       scales[i] = Math.random();
//     }

//     geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
//     geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

//     this.material = new THREE.ShaderMaterial({
//       vertexShader: cosmicDustVertShader,
//       fragmentShader: cosmicDustFragShader,
//       uniforms: {
//         uTime: { value: 0 },
//         uMouse: { value: new THREE.Vector2(0, 0) },
//         uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
//         uSize: { value: PARTICLE_SIZE },
//       },
//       transparent: true,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//       depthTest: false,
//     });

//     this.points = new THREE.Points(geometry, this.material);
//     this.points.frustumCulled = false;
//     this.add(this.points);
//   }

//   private onMouseMove(event: MouseEvent) {
//     // Convert mouse to NDC (-1 to 1)
//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   resize() {
//     if (this.material) {
//       this.material.uniforms.uPixelRatio.value = Math.min(
//         window.devicePixelRatio,
//         2,
//       );
//     }
//   }

//   update(dt: number) {
//     if (!this.material) return;
//     this.material.uniforms.uTime.value += dt;

//     // Smooth mouse following
//     const mouseUniform = this.material.uniforms.uMouse.value as THREE.Vector2;
//     mouseUniform.lerp(this.mouse, dt * 4);
//   }

//   dispose() {
//     window.removeEventListener("mousemove", this.mouseMoveHandler);
//     this.points.geometry.dispose();
//     this.material.dispose();
//   }
// }
