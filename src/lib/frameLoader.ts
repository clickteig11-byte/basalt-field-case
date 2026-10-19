import {
  DESKTOP_FRAMES,
  MOBILE_FRAMES,
  MOBILE_BREAKPOINT,
  type FramesConfig,
} from "../data/frames";

export type LoadSnapshot = {
  loaded: number;
  total: number;
  progress: number;
  done: boolean;
};

type Sub = (s: LoadSnapshot) => void;

class FrameLoader {
  readonly cfg: FramesConfig;
  private images: (HTMLImageElement | undefined)[];
  private loaded = 0;
  private highest = -1;
  private subs = new Set<Sub>();
  private started = false;

  constructor(cfg: FramesConfig) {
    this.cfg = cfg;
    this.images = new Array(cfg.count);
  }

  url(i: number) {
    const n = String(i + 1).padStart(3, "0");
    return `${this.cfg.dir}/frame_${n}.${this.cfg.ext}`;
  }

  image(i: number) {
    return this.images[i];
  }

  get highestLoaded() {
    return this.highest;
  }

  snapshot(): LoadSnapshot {
    const total = this.cfg.count;
    const progress = total ? Math.min(1, this.loaded / total) : 1;
    return { loaded: this.loaded, total, progress, done: this.loaded >= total };
  }

  subscribe(cb: Sub) {
    this.subs.add(cb);
    cb(this.snapshot());
    return () => {
      this.subs.delete(cb);
    };
  }

  private emit() {
    const s = this.snapshot();
    this.subs.forEach((cb) => cb(s));
  }

  start() {
    if (this.started) return;
    this.started = true;
    const total = this.cfg.count;
    if (total === 0) {
      this.emit();
      return;
    }
    let next = 0;
    const pull = () => {
      const i = next++;
      if (i >= total) return;
      const img = new Image();
      img.decoding = "async";
      this.images[i] = img;
      const done = () => {
        this.loaded++;
        if (i > this.highest) this.highest = i;
        this.emit();
        pull();
      };
      img.onload = done;
      img.onerror = done;
      img.src = this.url(i);
    };
    const pool = Math.min(6, total);
    for (let k = 0; k < pool; k++) pull();
  }
}

let singleton: FrameLoader | null = null;

function pickConfig(): FramesConfig {
  if (typeof window === "undefined") return DESKTOP_FRAMES;
  const isSmall =
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
    (window.innerWidth <= MOBILE_BREAKPOINT && window.innerWidth < window.innerHeight);
  return isSmall ? MOBILE_FRAMES : DESKTOP_FRAMES;
}

export function getFrameLoader(): FrameLoader {
  if (!singleton) {
    singleton = new FrameLoader(pickConfig());
    singleton.start();
  }
  return singleton;
}

export type { FrameLoader };
