"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  // Hash function for noise
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // 2D Noise
  float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0;
    return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
  }

  // Fractional Brownian Motion (fBm) - using fewer octaves for softer shapes
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 3; i++) {
      f += w * noise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  // Domain Warping for the extremely smooth, fluid, foggy aurora
  float pattern(in vec2 p, out vec2 q, out vec2 r) {
    q.x = fbm(p + vec2(0.0, 0.0) + u_time * 0.02);
    q.y = fbm(p + vec2(5.2, 1.3) - u_time * 0.015);

    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + u_time * 0.03);
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) - u_time * 0.02);

    return fbm(p + 2.0 * r);
  }

  // Star generation (Extremely subtle, faint)
  float getStars(vec2 uv) {
    vec2 p = uv * 400.0;
    float n = noise(p + u_time * 0.001);
    return smoothstep(0.995, 1.0, n);
  }

  uniform vec3 u_themeColor;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv;
    p.x *= u_resolution.x / u_resolution.y;
    
    // Scale down coordinates so the aurora clouds are massive and soft
    p *= 1.5;

    vec2 q, r;
    float n = pattern(p, q, r);

    // Deep dark background derived from theme
    vec3 bgBase = u_themeColor * 0.05; 
    
    // Soft Aurora Colors derived from theme
    vec3 col1 = u_themeColor * 0.5;
    vec3 col2 = u_themeColor * 1.5;

    // Mix the aurora colors softly
    vec3 auroraColor = mix(col1, col2, clamp(r.y * 1.5, 0.0, 1.0));
    
    // Shape the foggy clouds: Lower threshold so it's wider and visible, but keep it soft
    float cloudMask = smoothstep(0.25, 0.9, n);

    // Fade the edges slightly
    float edgeFade = smoothstep(-0.2, 0.3, uv.y) * smoothstep(1.2, 0.5, uv.y);
    
    // Composite: Additive blending of soft glowing fog
    vec3 finalColor = bgBase + (auroraColor * cloudMask * edgeFade * 0.9);

    // Add very faint stars 
    float stars = getStars(uv);
    finalColor += vec3(stars * 0.15); 

    // Heavy vignette for premium moody look
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    finalColor *= clamp(pow(vignette * 15.0, 0.35), 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const hexToRgb = (hex: string): [number, number, number] => {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  return [
    (parseInt(c.substring(0, 2), 16) / 255) || 0.0,
    (parseInt(c.substring(2, 4), 16) / 255) || 0.5,
    (parseInt(c.substring(4, 6), 16) / 255) || 0.5,
  ];
};

export default function AuroraCanvasBg({ colorHex = "#023c3c" }: { colorHex?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRGB = useRef<[number, number, number]>(hexToRgb(colorHex));
  const currentRGB = useRef<[number, number, number]>(hexToRgb(colorHex));

  useEffect(() => {
    targetRGB.current = hexToRgb(colorHex);
  }, [colorHex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, "u_time");
    const uResLocation = gl.getUniformLocation(program, "u_resolution");
    const uThemeColorLocation = gl.getUniformLocation(program, "u_themeColor");

    let animationFrameId = 0;
    const startTime = performance.now();
    let isVisible = true;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const applyResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResLocation, w, h);
    };

    // Debounced resize — rapid resize storms (rotate, devtools, etc.)
    // would otherwise recalculate dpr+viewport on every event.
    const resize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyResize, 120);
    };

    window.addEventListener("resize", resize, { passive: true });
    applyResize();

    const render = (time: number) => {
      const uTime = (time - startTime) * 0.001;
      gl.uniform1f(uTimeLocation, uTime);

      // Smooth color interpolation
      currentRGB.current[0] += (targetRGB.current[0] - currentRGB.current[0]) * 0.03;
      currentRGB.current[1] += (targetRGB.current[1] - currentRGB.current[1]) * 0.03;
      currentRGB.current[2] += (targetRGB.current[2] - currentRGB.current[2]) * 0.03;

      gl.uniform3f(
        uThemeColorLocation,
        currentRGB.current[0],
        currentRGB.current[1],
        currentRGB.current[2]
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(render);
    };
    const stopLoop = () => {
      if (!animationFrameId) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    // Pause the loop when the canvas is off-screen or the tab is hidden.
    // The shader is fragment-heavy; not rendering when nobody can see it
    // frees the GPU for the section actually in view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && document.visibilityState === "visible") startLoop();
        else stopLoop();
      },
      { rootMargin: "200px" },
    );
    observer.observe(canvas);

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      stopLoop();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#020607] z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-1000 mix-blend-screen"
      />
      {/* Heavy dark gradient at the edges to make it feel deep and premium */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,7,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#020607] to-transparent pointer-events-none" />
      
      {/* Soft border inner glow */}
      <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none mix-blend-overlay" />
    </div>
  );
}
