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
import { usePathname } from "next/navigation";

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
const AUDIO_URL = "/assets/soul_serenity_sounds-water-noises-241049.mp3";

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true); // User's master preference
  const pathname = usePathname();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const initedRef = useRef(false);

  // 1. Determine if current route is allowed to play audio
  const isAllowedRoute = pathname === "/" || pathname === "/partnerships";
  
  // 2. The actual global play state is combination of user's pref + route allowance
  const globalShouldPlay = isPlaying && isAllowedRoute;

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

  const initAudio = useCallback(async () => {
    if (initedRef.current) return;
    initedRef.current = true;

    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Master gain — starts at 0, fades in
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Fetch and decode MP3 directly into Web Audio API for perfect seamless looping
      const response = await fetch(AUDIO_URL);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(master);
      source.start();
      
      sourceNodeRef.current = source;

      // Smooth fade in over 3 seconds if we're supposed to play
      if (globalShouldPlay) {
        master.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
      }
    } catch (err) {
      console.error("Failed to initialize background audio:", err);
      initedRef.current = false; // Allow retry
    }
  }, [globalShouldPlay]);

  // Attempt immediate autoplay on mount (or when route changes to allowed)
  useEffect(() => {
    if (!initedRef.current && globalShouldPlay) {
      initAudio();
    }
  }, [initAudio, globalShouldPlay]);

  // Fallback: Start or resume audio on first user interaction if browser blocked autoplay
  useEffect(() => {
    const startOnInteraction = () => {
      // Remove listeners so this only fires once
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("scroll", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);

      if (!initedRef.current && globalShouldPlay) {
        initAudio();
      } else if (initedRef.current && audioCtxRef.current?.state === "suspended") {
        if (globalShouldPlay) {
          audioCtxRef.current.resume();
        } else {
          // Silent unlock: resume then immediately suspend
          audioCtxRef.current.resume().then(() => {
            audioCtxRef.current?.suspend();
          });
        }
      }
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
  }, [initAudio, globalShouldPlay]);

  // Fade in/out strictly based on combined globalShouldPlay state
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (globalShouldPlay) {
      if (ctx.state === "suspended") ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
    } else {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        if (!globalShouldPlay && ctx.state === "running") ctx.suspend();
      }, 700);
    }

    // Still persist the user's manual preference to local storage
    try {
      localStorage.setItem(STORAGE_KEY, isPlaying ? "on" : "off");
    } catch {}
  }, [globalShouldPlay, isPlaying]);

  const toggle = useCallback(() => {
    if (!initedRef.current) {
      setIsPlaying(true);
      initAudio();
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [initAudio]);

  return (
    <AudioCtx.Provider value={{ isPlaying: globalShouldPlay, toggle }}>
      {children}
    </AudioCtx.Provider>
  );
}
