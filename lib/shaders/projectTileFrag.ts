import { commonGlsl } from "./common";

export const projectTileFrag = /* glsl */ `
${commonGlsl}

uniform float aspect;
uniform float maskAmount;
uniform sampler2D map;
uniform vec2 uMouse;
uniform float uTime;

varying vec2 vUv;

void main() {
    // Distance from current pixel to mouse
    float dist = distance(vUv, uMouse);
    
    // Liquid ripple effect triggered by hover proximity
    // Increased amplitude to make it very visible
    float ripple = sin(dist * 40.0 - uTime * 10.0) * 0.03;
    
    // Only apply ripple near the mouse (radius ~0.5)
    float hoverMask = smoothstep(0.5, 0.0, dist);
    
    // Safe normalize to prevent NaN when vUv == uMouse
    vec2 safeDir = vUv - uMouse;
    if (length(safeDir) < 0.0001) safeDir = vec2(0.0001, 0.0);
    vec2 distortedUv = vUv + normalize(safeDir) * ripple * hoverMask;

    vec4 albedo = texture2D(map, distortedUv);

    // RGB Split / Chromatic Aberration near the mouse
    float splitAmount = 0.012 * hoverMask;
    float r = texture2D(map, distortedUv + vec2(splitAmount, 0.0)).r;
    float b = texture2D(map, distortedUv - vec2(splitAmount, 0.0)).b;
    albedo.r = mix(albedo.r, r, hoverMask);
    albedo.b = mix(albedo.b, b, hoverMask);

    float maskScaled = maskAmount * cos(vUv.y);
    albedo.a = roundedCornerMask(vUv, 0.1, aspect, maskScaled);
    gl_FragColor = albedo;
}
`;
