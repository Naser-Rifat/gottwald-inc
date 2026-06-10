"use client";

import { useEffect, useRef, useState } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

/**
 * LivingNetworkMap
 *
 * A 3D-like interactive canvas network visualization inspired by the Hubtown map,
 * adapted to the GOTT WALD aesthetic (turquoise wireframe, glowing nodes).
 *
 * It generates a field of nodes that slowly drift and rotate in 3D space,
 * connecting to their nearest neighbors with faint scan-line style wireframes.
 * It responds subtly to mouse movement for a parallax effect.
 */
export default function LivingNetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-DPI canvas resolution
    const dpr = window.devicePixelRatio || 1;
    let cw = container.clientWidth;
    let ch = container.clientHeight;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.scale(dpr, dpr);

    // Configuration
    const PARTICLE_COUNT = Math.min(Math.floor((cw * ch) / 6000), 180); // density
    const CONNECTION_DISTANCE = 140;
    const BASE_COLOR = { r: 18, g: 168, b: 172 }; // #12a8ac turquoise
    
    // Mouse tracking for parallax
    let mouseX = cw / 2;
    let mouseY = ch / 2;
    let targetMouseX = cw / 2;
    let targetMouseY = ch / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    container.addEventListener("mousemove", handleMouseMove);

    class Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      phase: number;

      constructor() {
        this.x = (Math.random() - 0.5) * cw * 1.5;
        this.y = (Math.random() - 0.5) * ch * 1.5;
        this.z = Math.random() * 800 + 100; // Depth
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.vz = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.phase += 0.02;

        // Subtle rotation around center
        const angle = 0.0005;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const nx = this.x * cosA - this.z * sinA;
        const nz = this.z * cosA + this.x * sinA;
        this.x = nx;
        this.z = nz;

        // Wrap around bounds
        if (this.x < -cw) this.x = cw;
        if (this.x > cw) this.x = -cw;
        if (this.y < -ch) this.y = ch;
        if (this.y > ch) this.y = -ch;
        if (this.z < 100) this.z = 900;
        if (this.z > 900) this.z = 100;
      }

      draw(ctx: CanvasRenderingContext2D, dx: number, dy: number) {
        // 3D Projection
        const fov = 400;
        const scale = fov / (fov + this.z);
        const px = this.x * scale + cw / 2 + dx * scale * 0.5;
        const py = this.y * scale + ch / 2 + dy * scale * 0.5;

        // Only draw if within screen bounds
        if (px < -50 || px > cw + 50 || py < -50 || py > ch + 50) return { px, py, scale, visible: false };

        const currentSize = this.size * scale;
        const pulse = (Math.sin(this.phase) + 1) * 0.5; // 0 to 1
        const alpha = Math.min(Math.max((900 - this.z) / 800, 0.1), 0.9) * (0.6 + pulse * 0.4);

        ctx.beginPath();
        ctx.arc(px, py, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${alpha})`;
        ctx.fill();
        
        // Add glow to larger particles closer to camera
        if (scale > 0.7) {
            ctx.shadowBlur = 15 * scale;
            ctx.shadowColor = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${alpha})`;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        return { px, py, scale, visible: true, alpha };
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const render = () => {
      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Parallax offset relative to center
      const dx = (cw / 2 - mouseX) * 0.5;
      const dy = (ch / 2 - mouseY) * 0.5;

      ctx.clearRect(0, 0, cw, ch);

      // Pre-calculate projected positions
      const projected = particles.map(p => {
        p.update();
        return { p, ...p.draw(ctx, dx, dy) };
      });

      // Draw connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (!p1.visible) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (!p2.visible) continue;

          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          
          if (dist < CONNECTION_DISTANCE) {
            // Lines are brighter if nodes are closer and closer to camera
            const avgScale = (p1.scale + p2.scale) * 0.5;
            const distanceAlpha = 1 - dist / CONNECTION_DISTANCE;
            const depthAlpha = Math.min((p1.alpha! + p2.alpha!) * 0.5, 0.6);
            const alpha = distanceAlpha * depthAlpha * 0.8;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{
        background: "radial-gradient(ellipse at center, rgba(7, 12, 20, 0.4) 0%, rgba(7, 12, 20, 0.9) 100%)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />
    </div>
  );
}
