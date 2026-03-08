"use client";

import { useEffect, useRef } from "react";

export default function WebGLCanvas() {
  const sceneRef = useRef<{ dispose: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      // Synchronously dispose the Three.js renderer BEFORE React unmounts.
      // This stops the animation loop and releases the WebGL context,
      // preventing the "removeChild" crash caused by React trying to
      // detach a <canvas> node whose internals Three.js still references.
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} suppressHydrationWarning>
      <canvas id="canvas" className="fixed inset-0 w-screen h-screen -z-10" />
    </div>
  );
}
