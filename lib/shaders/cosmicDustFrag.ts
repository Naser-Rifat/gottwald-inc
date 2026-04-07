// export const cosmicDustFragShader = /* glsl */ `
// varying float vAlpha;
// varying float vMouseProximity;
// varying float vDepth;

// void main() {
//   // Soft gaussian-like falloff for smoke puffs
//   float dist = distance(gl_PointCoord, vec2(0.5));

//   // Discard outside circle
//   if (dist > 0.5) discard;

//   // Very smooth wide gaussian falloff — eliminates grainy edges
//   float alpha = exp(-dist * dist * 5.0);
//   alpha *= vAlpha;

//   // Warm white/grey smoke color
//   vec3 smokeColor = vec3(0.75, 0.75, 0.78);

//   // Near mouse: subtle warm glow
//   vec3 glowColor = vec3(0.9, 0.92, 1.0);
//   vec3 finalColor = mix(smokeColor, glowColor, vMouseProximity * 0.5);

//   // Slight brightness boost near mouse
//   finalColor += vMouseProximity * vec3(0.1, 0.1, 0.15);

//   gl_FragColor = vec4(finalColor, alpha);
// }
// `;
