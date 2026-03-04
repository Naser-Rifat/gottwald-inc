export function animate(
  duration: number,
  onAnimationFrame: (percent: number) => void,
  onDone?: () => void,
): void {
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const percent = Math.min(elapsed / duration, 1);

    onAnimationFrame(percent);

    if (percent < 1) {
      requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  }

  requestAnimationFrame(step);
}

export function animateAsync(
  duration: number,
  onAnimationFrame: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    animate(duration, onAnimationFrame, resolve);
  });
}

export function waitAsync(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomSign(): number {
  return Math.random() < 0.5 ? -1 : 1;
}
