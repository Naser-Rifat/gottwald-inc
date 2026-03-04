import { commonGlsl } from "./common";

export const videoPanelVert = /* glsl */ `
#define PI 3.14159265358979

${commonGlsl}

uniform float animateProgress;
uniform vec4 startRect;
uniform vec4 endRect;

varying vec2 vUv;

vec2 rotateLocal(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

vec2 getRectPos(vec4 rect, vec2 uv) {
    vec2 pos;
    pos.x = mix(rect.x, rect.x + rect.w, uv.x);
    pos.y = mix(rect.y - rect.z, rect.y, uv.y);
    return pos;
}

void main() {
    float transitionWeight = 1. - (pow(uv.x * uv.x, 0.75) + pow(uv.y, 1.5)) / 2.;
    
    float localProgress = smoothstep(transitionWeight * 0.3, 0.7 + transitionWeight * 0.3, animateProgress);

    vec2 videoPanelStartPos = getRectPos(startRect, uv);
    vec2 videoPanelEndPos = getRectPos(endRect, uv);
    vec2 posXY = mix(videoPanelStartPos, videoPanelEndPos, localProgress);

    float width = mix(startRect.w, endRect.w, localProgress);
    posXY.x += mix(width, 0., cos(localProgress * PI * 2.) * 0.5 + 0.5) * 0.1;

    float rot = (smoothstep(0., 1., localProgress) - localProgress) * -0.5;
    
    posXY = rotateLocal(posXY, rot);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(posXY, 0.0, 1.0);

    vUv = uv;
}
`;
