export type FramesConfig = {
  dir: string;
  count: number;
  width: number;
  height: number;
  ext: "webp";
};

export const DESKTOP_FRAMES: FramesConfig = {
  dir: "/frames/desktop",
  count: 220,
  width: 1280,
  height: 720,
  ext: "webp",
};

export const MOBILE_FRAMES: FramesConfig = {
  dir: "/frames/mobile",
  count: 110,
  width: 854,
  height: 480,
  ext: "webp",
};

export const POSTER = "/frames/poster.webp";
export const MOBILE_BREAKPOINT = 760;
