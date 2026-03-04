// Debug GUI - only loaded in development
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let debugGui: any = null;

export function getDebugGui() {
  return debugGui;
}

export async function initDebugGui() {
  if (typeof window === "undefined") return null;

  if (process.env.NODE_ENV === "development") {
    const GUI = (await import("lil-gui")).default;
    debugGui = new GUI();
    debugGui.close();
    return debugGui;
  }

  // Return a no-op proxy in production
  debugGui = {
    addFolder: () => debugGui,
    add: () => debugGui,
    addColor: () => debugGui,
    onChange: () => debugGui,
    name: () => debugGui,
    close: () => debugGui,
    hide: () => debugGui,
  };
  return debugGui;
}
