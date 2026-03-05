export const cosmicDustVertShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandom;

varying float vAlpha;
varying float vMouseProximity;
varying float vDepth;

//
// 3D Simplex noise
//
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;

  // Multi-layered slow noise for drifting smoke
  float t = uTime * 0.05;
  float noiseScale1 = 0.25;
  float noiseScale2 = 0.5;

  // Primary slow cosmic drift
  float n1x = snoise(vec3(pos.x * noiseScale1 + aRandom.x * 10.0, pos.y * noiseScale1, t + aRandom.z));
  float n1y = snoise(vec3(pos.y * noiseScale1, pos.z * noiseScale1 + aRandom.y * 10.0, t * 0.6));
  float n1z = snoise(vec3(pos.z * noiseScale1 + aRandom.z * 10.0, pos.x * noiseScale1, t * 0.4));

  // Secondary turbulence
  float n2x = snoise(vec3(pos.x * noiseScale2 + 100.0, pos.y * noiseScale2, t * 1.2 + aRandom.x));
  float n2y = snoise(vec3(pos.y * noiseScale2 + 100.0, pos.z * noiseScale2, t * 1.0 + aRandom.y));

  pos.x += n1x * 1.5 + n2x * 0.4;
  pos.y += n1y * 1.5 + n2y * 0.4;
  pos.z += n1z * 0.6;

  // Mouse repulsion — push particles away from cursor in world space
  vec4 tempModel = modelMatrix * vec4(pos, 1.0);
  vec4 tempView = viewMatrix * tempModel;
  vec4 tempProj = projectionMatrix * tempView;
  vec2 tempScreen = tempProj.xy / tempProj.w;
  float mouseDistWorld = distance(tempScreen, uMouse);
  float repulsion = smoothstep(0.5, 0.0, mouseDistWorld) * 2.5;
  vec2 pushDir = normalize(tempScreen - uMouse + vec2(0.001));
  pos.x += pushDir.x * repulsion;
  pos.y += pushDir.y * repulsion;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Mouse proximity (in NDC space) — wide radius
  vec2 screenPos = projectedPosition.xy / projectedPosition.w;
  float mouseDist = distance(screenPos, uMouse);
  vMouseProximity = smoothstep(0.8, 0.0, mouseDist);

  // Large point sizes for overlapping soft smoke
  float sizeVariation = 0.6 + aScale * 0.4;
  float depthScale = 1.0 / (-viewPosition.z * 0.08 + 1.0);
  gl_PointSize = uSize * uPixelRatio * sizeVariation * depthScale;
  gl_PointSize = max(gl_PointSize, 1.0);

  vDepth = -viewPosition.z;

  // Alpha — very low per-particle for smooth overlap
  float baseAlpha = 0.008 + aScale * 0.015;
  float noiseAlpha = smoothstep(-0.6, 0.3, snoise(vec3(pos.xy * 0.2, t * 0.3)));
  vAlpha = baseAlpha * noiseAlpha;

  // Glow near mouse
  vAlpha += vMouseProximity * 0.03;
}
`;
