import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis {
  if (lenis) return lenis;

  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    lerp: 0.09,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}

export function scrollToTarget(target: HTMLElement | string, offset = 0) {
  lenis?.scrollTo(target, { offset });
}

export { ScrollTrigger };
