import {
  DESKTOP_FRAMES,
  MOBILE_FRAMES,
  MOBILE_BREAKPOINT,
  type FramesConfig,
} from "../data/frames";

export type LoadState = {
  loaded: number;
  total: number;
  progress: number;
  done: boolean;
};

function buildOrder(n: number): number[] {
  const order: number[] = [];
  const seen = new Uint8Array(n);
  for (let s = 16; s >= 1; s >>= 1) {
    for (let i = 0; i < n; i += s) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  return order;
}

class FrameLoader {
  readonly cfg: FramesConfig;
  private images: (HTMLImageElement | undefined)[];
  private order: number[];
  private loaded = 0;
  private subs = new Set<(s: LoadState) => void>();
  private started = false;

  constructor(cfg: FramesConfig) {
    this.cfg = cfg;
    this.images = new Array(cfg.count);
    this.order = buildOrder(cfg.count);
  }

  url(i: number) {
    return `${this.cfg.dir}/frame_${String(i + 1).padStart(3, "0")}.${this.cfg.ext}`;
  }

  image(i: number) {
    return this.images[i];
  }

  state(): LoadState {
    const total = this.cfg.count;
    return {
      loaded: this.loaded,
      total,
      progress: total ? this.loaded / total : 1,
      done: this.loaded >= total,
    };
  }

  subscribe(cb: (s: LoadState) => void) {
    this.subs.add(cb);
    cb(this.state());
    return () => {
      this.subs.delete(cb);
    };
  }

  private emit() {
    const s = this.state();
    this.subs.forEach((cb) => cb(s));
  }

  private has(i: number) {
    const img = this.images[i];
    return !!img && img.complete && img.naturalWidth > 0;
  }

  nearestLoaded(index: number): number | null {
    const n = this.cfg.count;
    for (let d = 0; d < n; d++) {
      const a = index - d;
      const b = index + d;
      if (a < 0 && b >= n) break;
      if (a >= 0 && this.has(a)) return a;
      if (b < n && this.has(b)) return b;
    }
    return null;
  }

  start() {
    if (this.started) return;
    this.started = true;
    const { order } = this;
    let next = 0;
    const pull = () => {
      const slot = next++;
      if (slot >= order.length) return;
      const i = order[slot];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.loaded++;
        this.emit();
        pull();
      };
      img.onerror = () => {
        this.loaded++;
        this.emit();
        pull();
      };
      this.images[i] = img;
      img.src = this.url(i);
    };
    for (let k = 0; k < Math.min(6, order.length); k++) pull();
  }
}

let singleton: FrameLoader | null = null;

function pickConfig(): FramesConfig {
  if (typeof window === "undefined") return DESKTOP_FRAMES;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
    ? MOBILE_FRAMES
    : DESKTOP_FRAMES;
}

export function getFrameLoader(): FrameLoader {
  if (!singleton) {
    singleton = new FrameLoader(pickConfig());
    singleton.start();
  }
  return singleton;
}

export type { FrameLoader };
