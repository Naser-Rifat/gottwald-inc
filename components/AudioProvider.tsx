"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface AudioContextValue {
  isPlaying: boolean;
  toggle: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: true,
  toggle: () => {},
});

export function useAudio() {
  return useContext(AudioCtx);
}

const STORAGE_KEY = "gw-audio-pref";

/**
 * Creates a natural ambient soundscape using only the Web Audio API.
 *
 * Layers:
 *  1. Rain — filtered white noise through a bandpass at ~3kHz
 *  2. Wind — slowly modulated brown noise at very low frequencies
 *  3. Water/stream — bandpass-filtered noise with gentle LFO modulation
 *  4. Forest texture — faint high-frequency shimmer
 */
function buildNatureSoundGraph(ctx: AudioContext, master: GainNode) {
  // ── UTILITY: create a noise buffer ──
  const createNoiseBuffer = (seconds: number, type: "white" | "brown" | "pink") => {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);

    if (type === "white") {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === "brown") {
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    } else {
      // Pink noise approximation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buf;
  };

  // ── LAYER 1: Rain ──
  const rain = ctx.createBufferSource();
  rain.buffer = createNoiseBuffer(2, "white");
  rain.loop = true;

  const rainBP = ctx.createBiquadFilter();
  rainBP.type = "bandpass";
  rainBP.frequency.setValueAtTime(3200, ctx.currentTime);
  rainBP.Q.setValueAtTime(0.5, ctx.currentTime);

  const rainHP = ctx.createBiquadFilter();
  rainHP.type = "highpass";
  rainHP.frequency.setValueAtTime(1000, ctx.currentTime);

  const rainGain = ctx.createGain();
  rainGain.gain.setValueAtTime(0.06, ctx.currentTime);

  rain.connect(rainBP);
  rainBP.connect(rainHP);
  rainHP.connect(rainGain);
  rainGain.connect(master);
  rain.start();

  // ── LAYER 2: Wind ──
  const wind = ctx.createBufferSource();
  wind.buffer = createNoiseBuffer(2, "brown");
  wind.loop = true;

  const windLP = ctx.createBiquadFilter();
  windLP.type = "lowpass";
  windLP.frequency.setValueAtTime(200, ctx.currentTime);
  windLP.Q.setValueAtTime(0.3, ctx.currentTime);

  // Slow volume modulation for wind gusts
  const windLFO = ctx.createOscillator();
  windLFO.type = "sine";
  windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
  const windLFOGain = ctx.createGain();
  windLFOGain.gain.setValueAtTime(0.012, ctx.currentTime);

  const windGain = ctx.createGain();
  windGain.gain.setValueAtTime(0.03, ctx.currentTime);

  windLFO.connect(windLFOGain);
  windLFOGain.connect(windGain.gain);
  windLFO.start();

  wind.connect(windLP);
  windLP.connect(windGain);
  windGain.connect(master);
  wind.start();

  // ── LAYER 3: Water / stream ──
  const water = ctx.createBufferSource();
  water.buffer = createNoiseBuffer(2, "pink");
  water.loop = true;

  const waterBP = ctx.createBiquadFilter();
  waterBP.type = "bandpass";
  waterBP.frequency.setValueAtTime(800, ctx.currentTime);
  waterBP.Q.setValueAtTime(0.8, ctx.currentTime);

  // Gentle frequency wobble for organic feel
  const waterLFO = ctx.createOscillator();
  waterLFO.type = "sine";
  waterLFO.frequency.setValueAtTime(0.15, ctx.currentTime);
  const waterLFOGain = ctx.createGain();
  waterLFOGain.gain.setValueAtTime(150, ctx.currentTime);

  waterLFO.connect(waterLFOGain);
  waterLFOGain.connect(waterBP.frequency);
  waterLFO.start();

  const waterGain = ctx.createGain();
  waterGain.gain.setValueAtTime(0.02, ctx.currentTime);

  water.connect(waterBP);
  waterBP.connect(waterGain);
  waterGain.connect(master);
  water.start();

  // ── LAYER 4: Forest shimmer (faint high-freq texture) ──
  const shimmer = ctx.createBufferSource();
  shimmer.buffer = createNoiseBuffer(2, "white");
  shimmer.loop = true;

  const shimmerBP = ctx.createBiquadFilter();
  shimmerBP.type = "bandpass";
  shimmerBP.frequency.setValueAtTime(6000, ctx.currentTime);
  shimmerBP.Q.setValueAtTime(2, ctx.currentTime);

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(0.008, ctx.currentTime);

  shimmer.connect(shimmerBP);
  shimmerBP.connect(shimmerGain);
  shimmerGain.connect(master);
  shimmer.start();
}

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const initedRef = useRef(false);

  // Read persisted preference
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "off") setIsPlaying(false);
      } catch {}
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Build the nature ambient sound graph
  const initAudio = useCallback(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Master gain — starts at 0, fades in
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    buildNatureSoundGraph(ctx, master);

    // Smooth fade in over 3 seconds
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
  }, []);

  // Start audio on first user interaction
  useEffect(() => {
    const startOnInteraction = () => {
      if (!initedRef.current && isPlaying) {
        initAudio();
      } else if (initedRef.current && audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("scroll", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };

    window.addEventListener("click", startOnInteraction, { passive: true });
    window.addEventListener("touchstart", startOnInteraction, { passive: true });
    window.addEventListener("scroll", startOnInteraction, { passive: true });
    window.addEventListener("keydown", startOnInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("scroll", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };
  }, [initAudio, isPlaying]);

  // Fade in/out on toggle
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (isPlaying) {
      if (ctx.state === "suspended") ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    } else {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        if (!isPlaying && ctx.state === "running") ctx.suspend();
      }, 700);
    }

    try {
      localStorage.setItem(STORAGE_KEY, isPlaying ? "on" : "off");
    } catch {}
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (!initedRef.current) {
      initAudio();
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [initAudio]);

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle }}>
      {children}
    </AudioCtx.Provider>
  );
}
