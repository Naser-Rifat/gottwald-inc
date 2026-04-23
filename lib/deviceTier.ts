export type DeviceTier = "mobile" | "desktop";

export function getDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "desktop";
  const isMobile =
    /Mobi|Android/i.test(navigator.userAgent) ||
    (typeof window !== "undefined" && "ontouchstart" in window);
  const cores = navigator.hardwareConcurrency || 4;
  if (isMobile || cores <= 4) return "mobile";
  return "desktop";
}
