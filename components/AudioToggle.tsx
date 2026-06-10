"use client";

import { useRef, useEffect, useCallback } from "react";
import { useAudio } from "./AudioProvider";

/**
 *  audio toggle — canvas sine wave.
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
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Mute ambient sound" : "Unmute ambient sound"}
      title={isPlaying ? "Mute ambient sound" : "Unmute ambient sound"}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full
                 border transition-[background-color,border-color,box-shadow,transform] duration-300
                 cursor-pointer hover:scale-105 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                 ${
                   isPlaying
                     ? "border-white/25 bg-white/14 shadow-[0_0_24px_rgba(255,255,255,0.13)] hover:bg-white/18"
                     : "border-white/10 bg-white/8 hover:border-white/22 hover:bg-white/15"
                 }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300
                   ${
                     isPlaying
                       ? "opacity-100 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.26)]"
                       : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                   }`}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none relative z-10"
        style={{ width: 44, height: 44 }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-colors duration-300
                   ${isPlaying ? "bg-gold" : "bg-white/35"}`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-20 whitespace-nowrap rounded-sm
                   bg-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/75
                   opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200
                   group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {isPlaying ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
