"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Frequency Engine — manifesto-faithful ambient sound layer.
 *
 * The page is described as a "consciously created frequency space." Sound
 * is literally frequency. This component generates a soft drone via Web
 * Audio API (no audio file required) — three sine waves tuned to A1 / E2 /
 * A2 with a very slow LFO modulating master gain. Volume caps at 0.05 so
 * it sits as room tone, not music.
 *
 * Defaults OFF. A discrete editorial toggle in the bottom-right corner
 * activates it. Browser autoplay policies require user gesture before
 * AudioContext starts — so the toggle button doubles as the unlock.
 *
 * Cleaned up on unmount or disable. Skipped entirely on prefers-reduced-motion.
 */
export default function FrequencyEngine() {
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Array<OscillatorNode>>([]);

  // Respect user's reduced-motion preference as a proxy for "wants less stimulus"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAvailable(!mq.matches);
    const handler = () => setAvailable(!mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled) {
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain) {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.5);
        window.setTimeout(() => {
          nodesRef.current.forEach((n) => {
            try {
              n.stop();
            } catch {}
            try {
              n.disconnect();
            } catch {}
          });
          nodesRef.current = [];
          try {
            gain.disconnect();
          } catch {}
          gainRef.current = null;
          ctx.close().catch(() => {});
          ctxRef.current = null;
        }, 1700);
      }
      return;
    }

    // Build the drone
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Fundamentals — A1 (55Hz) + E2 (82.4Hz) + A2 (110Hz). Open fifth.
    // Three layers stacked = room tone, not melody.
    const fundamentals = [55, 82.4, 110];
    const oscs: OscillatorNode[] = fundamentals.map((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.4 / fundamentals.length;

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      return osc;
    });

    // Very slow LFO breathing the master gain — felt, not heard.
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08; // ~12.5 seconds per cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;

    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();

    nodesRef.current = [...oscs, lfo];

    // Fade in to ambient level — never above 0.05
    masterGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5);
  }, [enabled]);

  // Cleanup on unmount in case enabled was true
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
      ctx?.close().catch(() => {});
    };
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => setEnabled((e) => !e)}
      aria-pressed={enabled}
      aria-label={
        enabled ? "Mute ambient frequency" : "Activate ambient frequency"
      }
      className="fixed bottom-5 right-5 lg:bottom-7 lg:right-7 z-[45] flex items-center gap-3 px-3 py-2 text-[10px] tracking-[0.32em] uppercase font-light text-silver/50 hover:text-silver/95 transition-colors duration-500 group cursor-pointer pointer-events-auto"
    >
      <span className="relative flex items-center justify-center w-2 h-2 rounded-full border border-current">
        {enabled && (
          <span className="block w-1 h-1 rounded-full bg-turquoise frequency-toggle-dot-active" />
        )}
      </span>
      <span className="hidden md:inline">
        {enabled ? "Frequency" : "Silence"}
      </span>
    </button>
  );
}
