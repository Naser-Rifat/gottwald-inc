"use client";

import { useRef, useEffect, useCallback } from "react";
import { useAudio } from "./AudioProvider";

/**
 * Lusion-style audio toggle — canvas sine wave.
 * Self-terminates rAF when muted, pauses on hidden tab.
 */
export default function AudioToggle() {
  const { isPlaying, toggle } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    animId: 0,
    amp: 0,
    targetAmp: isPlaying ? 1 : 0,
    running: false,
  });
  const tickRef = useRef<() => void>(() => {});

  // Update tick ref without mutating during render
  useEffect(() => {
    tickRef.current = () => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) { s.running = false; return; }
      if (document.hidden) { s.running = false; return; }

      const ctx = canvas.getContext("2d");
      if (!ctx) { s.running = false; return; }

      const dpr = window.devicePixelRatio || 1;
      const w = 44, h = 44;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
      }

      s.amp += (s.targetAmp - s.amp) * 0.08;

      if (s.targetAmp === 0 && s.amp < 0.001) {
        s.amp = 0;
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.moveTo(12, h / 2);
        ctx.lineTo(w - 12, h / 2);
        ctx.stroke();
        s.running = false;
        return;
      }

      const amp = s.amp;
      const time = performance.now() * 0.002;

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${0.6 + amp * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const pad = 12, ww = w - pad * 2, cy = h / 2, ma = 5.5;
      for (let x = 0; x <= ww; x++) {
        const t = x / ww;
        const y1 = Math.sin(t * Math.PI * 2.5 + time) * ma * amp;
        const y2 = Math.sin(t * Math.PI * 4 + time * 1.3) * ma * 0.25 * amp;
        const env = Math.sin(t * Math.PI);
        const y = cy + (y1 + y2) * env;
        if (x === 0) ctx.moveTo(pad + x, y);
        else ctx.lineTo(pad + x, y);
      }
      ctx.stroke();

      s.animId = requestAnimationFrame(() => tickRef.current());
    };
  });

  const startLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) {
      s.running = true;
      s.animId = requestAnimationFrame(() => tickRef.current());
    }
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    s.targetAmp = isPlaying ? 1 : 0;
    if (isPlaying) startLoop();
  }, [isPlaying, startLoop]);

  useEffect(() => {
    const s = stateRef.current;
    const animId = s.animId;

    const onVis = () => {
      if (!document.hidden && stateRef.current.targetAmp > 0) {
        startLoop();
      }
    };

    startLoop();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVis);
      s.running = false;
    };
  }, [startLoop]);

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Mute ambient sound" : "Unmute ambient sound"}
      className="group relative w-11 h-11 rounded-full flex items-center justify-center
                 bg-white/8 hover:bg-white/15 transition-all duration-300 cursor-pointer
                 hover:scale-105 active:scale-95"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: 44, height: 44 }}
      />
    </button>
  );
}
