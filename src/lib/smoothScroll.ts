import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;
let reduced = false;
let started = false;

export function initSmoothScroll(): Lenis | null {
  if (started) return lenis;
  started = true;
  if (typeof window === "undefined") return null;

  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (reduced) return null;

  lenis = new Lenis({
    duration: 1.05,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTarget(target: HTMLElement, offset = 0) {
  if (lenis) lenis.scrollTo(target, { offset });
  else target.scrollIntoView({ block: "start" });
}
