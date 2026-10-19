export type FramesConfig = {
  dir: string;
  count: number;
  width: number;
  height: number;
  ext: "webp";
};

export const DESKTOP_FRAMES: FramesConfig = {
  dir: "/frames/desktop",
  count: 110,
  width: 1152,
  height: 648,
  ext: "webp",
};

export const MOBILE_FRAMES: FramesConfig = {
  dir: "/frames/mobile",
  count: 74,
  width: 768,
  height: 432,
  ext: "webp",
};

export const POSTER = "/frames/poster.webp";
export const MOBILE_BREAKPOINT = 760;
