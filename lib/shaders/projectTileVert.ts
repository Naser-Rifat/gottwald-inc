export const projectTileVert = /* glsl */ `
uniform float stretchAmount;

varying vec2 vUv;

void main() {
    vec3 newPosition = position;

    float ndcUvY = uv.y * 2.0 - 1.0;

    // Horizontal stretch
    newPosition.x *= 1. + (ndcUvY * stretchAmount * 0.1);
    
    // Vertical rubber-bend (curve based on X)
    float curve = sin(uv.x * 3.14159) * stretchAmount * 0.8;
    newPosition.y += curve;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}
`;
