export const commonGlsl = /* glsl */ `
vec2 getNdcUV(vec2 uv) {
    return uv * 2.0 - 1.0;
}

float roundedCornerMask(vec2 uv, float borderRadius, float aspect, float taper) {
    vec2 uv_ndc = getNdcUV(uv);
    uv_ndc = abs(uv_ndc);

    vec2 corner;
    corner.x = uv_ndc.x - (1.0 - borderRadius - taper);
    corner.y = uv_ndc.y - (1.0 - borderRadius);

    corner = max(corner, vec2(0.0, 0.0));
    corner.x *= aspect;

    float distanceFromCorner = length(corner);

    return step(distanceFromCorner, borderRadius);
}

float roundedCornerMask(vec2 uv, float borderRadius, float aspect) {
    return roundedCornerMask(uv, borderRadius, aspect, 0.0);
}

vec2 rotate(vec2 pos, float radians) {
    float cosTheta = cos(radians);
    float sinTheta = sin(radians);
    mat2 rotMat = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);
    pos.xy = rotMat * pos.xy;
    return pos;
}

vec2 rotateAroundAnchor(vec2 pos, vec2 anchor, float radians) {
    vec2 newPos = pos - anchor;
    newPos = rotate(newPos, radians);
    newPos += anchor;
    return newPos;
}

vec2 scaleAroundAnchor(vec2 pos, vec2 anchor, float scale) {
    vec2 newPos = pos - anchor;
    newPos /= scale;
    return newPos;
}
`;
