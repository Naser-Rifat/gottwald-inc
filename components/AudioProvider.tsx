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

export type SfxName = "chime" | "thud" | "whisper";

interface AudioContextValue {
  isPlaying: boolean;
  toggle: () => void;
  playSfx: (name: SfxName) => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: true,
  toggle: () => {},
  playSfx: () => {},
});

export function useAudio() {
  return useContext(AudioCtx);
}

const STORAGE_KEY = "gw-audio-pref";
const AUDIO_URL = "/assets/soul_serenity_sounds-water-noises-241049.mp3";

const SFX_URLS: Record<SfxName, string> = {
  chime: "/assets/sfx/chime.mp3",
  thud: "/assets/sfx/thud.mp3",
  whisper: "/assets/sfx/whisper.mp3",
};

// Per-sample gain. Re-tune once final audio files land — a hotter
// recording may need 0.25 instead of 0.45 to stay subtle.
const SFX_GAIN: Record<SfxName, number> = {
  chime: 0.45,
  thud: 0.35,
  whisper: 0.25,
};

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true); // User's master preference
  const pathname = usePathname();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const sfxBuffersRef = useRef<Map<SfxName, AudioBuffer>>(new Map());
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

      // Load water ambient + SFX buffers in parallel. SFX files are optional —
      // any 404/decode failure is swallowed so missing samples degrade silently.
      const waterPromise = (async () => {
        const response = await fetch(AUDIO_URL);
        const audioBuffer = await ctx.decodeAudioData(await response.arrayBuffer());
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(master);
        source.start();
        sourceNodeRef.current = source;
      })();

      const sfxPromise = Promise.all(
        (Object.entries(SFX_URLS) as [SfxName, string][]).map(async ([name, url]) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return;
            const buf = await ctx.decodeAudioData(await res.arrayBuffer());
            sfxBuffersRef.current.set(name, buf);
          } catch {
            // Missing or undecodable — playSfx will no-op for this cue.
          }
        }),
      );

      await Promise.all([waterPromise, sfxPromise]);

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

      if (!initedRef.current) {
        // Always init on first interaction so SFX buffers load even on
        // routes where the water ambient is not allowed to play. The water
        // source still starts, but masterGain stays at 0 until globalShouldPlay.
        initAudio();
      } else if (audioCtxRef.current?.state === "suspended") {
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

  const playSfx = useCallback(
    (name: SfxName) => {
      if (!isPlaying) return; // user has muted audio globally
      const ctx = audioCtxRef.current;
      const buf = sfxBuffersRef.current.get(name);
      if (!ctx || !buf) return; // not initialized yet or sample missing
      if (ctx.state === "suspended") ctx.resume();

      // Bypass masterGain so the water-ambient fade curves do not affect
      // interaction feedback. Each play gets its own gain node so overlapping
      // cues don't clip one another.
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = SFX_GAIN[name];
      src.connect(gain).connect(ctx.destination);
      src.start();
    },
    [isPlaying],
  );

  return (
    <AudioCtx.Provider value={{ isPlaying: globalShouldPlay, toggle, playSfx }}>
      {children}
    </AudioCtx.Provider>
  );
}
