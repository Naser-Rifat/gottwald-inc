"use client";

import { useEffect, useRef } from "react";

export default function WebGLCanvas() {
  const sceneRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Three.js
    let isMounted = true;

    const initScene = async () => {
      const { default: HomeScene } = await import("@/lib/homeScene");
      if (isMounted) {
        sceneRef.current = new HomeScene();
      }
    };

    initScene();

    return () => {
      isMounted = false;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <canvas id="canvas" className="fixed inset-0 w-screen h-screen -z-10" />
  );
}
