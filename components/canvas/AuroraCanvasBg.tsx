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

  // 2D Value Noise
  float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0;
    return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
  }

  // Rotation matrix to break up grid alignment in noise
  const mat2 m = mat2(0.8, 0.6, -0.6, 0.8);

  // Fractional Brownian Motion (fBm) with rotation for organic shapes
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 4; i++) {
      f += w * noise(p);
      p = m * p * 2.0;
      w *= 0.5;
    }
    return f;
  }

  // Star generation (Sparse and faint)
  float getStars(vec2 uv) {
    vec2 p = uv * 400.0;
    float n = noise(p + u_time * 0.001);
    return smoothstep(0.99, 1.0, n);
  }

  uniform vec3 u_themeColor;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv;
    p.x *= u_resolution.x / u_resolution.y;
    
    // Dynamic sky color: deep dark night sky, very slight tint from the theme color
    vec3 skyDark = vec3(0.01, 0.01, 0.015);
    vec3 skyLight = vec3(0.015, 0.02, 0.03) + u_themeColor * 0.05;
    vec3 skyColor = mix(skyLight, skyDark, uv.y);

    float auroraIntensity = 0.0;

    // 2.5D Aurora Volume Generation
    // Iterate over 'z' to create multiple layers with 3D perspective and parallax
    for(float i = 1.0; i < 6.0; i += 1.0) {
      float z = i * 0.25; // Depth: 0.25, 0.50, 0.75, 1.00, 1.25
      float t = u_time * 0.04 + z * 5.0; // Time offset per layer
      
      // Perspective scaling: farther layers are stretched wider and move differently
      float x = p.x * (1.0 + z) + t;
      
      // Massive sweeping arcs crossing the sky
      float curve = sin(x * 1.5) * 0.15 + sin(x * 0.5 - t * 0.5) * 0.2;
      curve += fbm(vec2(x * 0.8, t * 0.2)) * 0.15;
      
      // Spread the layers vertically so they aren't all on one line.
      // Closer layers (low z) are lower on the screen, farther layers (high z) are higher.
      float baseHeight = z * 0.35 + curve;

      // Soft vertical striations (rays) flowing upwards
      float rays = fbm(vec2(x * 2.0, p.y * 0.3 - t * 0.2));
      rays *= fbm(vec2(x * 3.5 + t, p.y * 0.1));
      rays = smoothstep(0.1, 0.9, rays); // Contrast boost

      // Distance from the base height
      float dist = uv.y - baseHeight;

      // Realistic aurora physics: sharp bottom edge, beautiful tall exponential fade upwards
      float bottomFade = smoothstep(-0.06, 0.02, dist);
      float topFade = exp(-max(dist, 0.0) * 4.0); 

      // Cluster mask to break into distinct patches
      float clusterMask = smoothstep(0.3, 0.8, noise(vec2(x * 1.2, z * 10.0)));

      float intensity = bottomFade * topFade * rays * clusterMask;
      
      // Accumulate intensity, simulating atmospheric perspective (farther = dimmer)
      auroraIntensity += intensity * (1.0 - z * 0.2) * 1.5;
    }

    // Strictly limit the intensity to prevent blowout.
    // By keeping it within 0.0 to 1.5, we ensure it never turns pure white.
    float safeIntensity = clamp(auroraIntensity, 0.0, 1.5);

    // Colorize strictly with the exact theme color. No white mixing, no HDR tone mapping distortion.
    // This guarantees the user sees EXACTLY the vibrant real color of the theme.
    vec3 auroraGlow = u_themeColor * safeIntensity * 1.4;

    // Composite the aurora over the dynamic sky
    vec3 finalColor = skyColor + auroraGlow;

    // Add faint stars, hiding them where the aurora is very bright
    float stars = getStars(uv);
    finalColor += vec3(stars * 0.3) * (1.0 - smoothstep(0.1, 0.6, auroraIntensity));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const hexToRgb = (hex: string): [number, number, number] => {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return [
    isNaN(r) ? 0.0 : r / 255,
    isNaN(g) ? 0.5 : g / 255,
    isNaN(b) ? 0.5 : b / 255,
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

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);
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
      resizeObserver.disconnect();
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
