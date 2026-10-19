import sharp from "sharp";
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SRC_DIR = path.resolve(
  process.env.FRAME_SRC ||
    path.join(ROOT, "..", "image_20261016_211812_frames")
);

const OUT = path.join(ROOT, "public", "frames");
const DESKTOP_DIR = path.join(OUT, "desktop");
const MOBILE_DIR = path.join(OUT, "mobile");

const DESKTOP_W = 1280;
const MOBILE_W = 854;
const MOBILE_STRIDE = 2;

const CONCURRENCY = 8;

async function listSourceFrames() {
  const files = await readdir(SRC_DIR);
  return files
    .filter((f) => /^frame_\d+\.(jpe?g|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0], 10);
      const nb = parseInt(b.match(/\d+/)[0], 10);
      return na - nb;
    })
    .map((f) => path.join(SRC_DIR, f));
}

async function pool(items, worker, size) {
  let i = 0;
  let done = 0;
  const total = items.length;
  const runners = Array.from({ length: size }, async () => {
    while (i < total) {
      const idx = i++;
      await worker(items[idx], idx);
      done++;
      if (done % 20 === 0 || done === total) {
        process.stdout.write(`\r  converted ${done}/${total}`);
      }
    }
  });
  await Promise.all(runners);
  process.stdout.write(`\r  converted ${done}/${total}\n`);
}

const pad = (n) => String(n).padStart(3, "0");

async function main() {
  if (!existsSync(SRC_DIR)) {
    throw new Error(`Source frames not found: ${SRC_DIR}`);
  }

  const sources = await listSourceFrames();
  if (!sources.length) throw new Error(`No frame_*.jpg found in ${SRC_DIR}`);

  console.log(`Source: ${SRC_DIR}`);
  console.log(`Found ${sources.length} frames. Writing to ${path.relative(ROOT, OUT)}`);
  console.log("Note: gap-safe renumbering — output is contiguous 1..N.\n");

  await rm(OUT, { recursive: true, force: true });
  await mkdir(DESKTOP_DIR, { recursive: true });
  await mkdir(MOBILE_DIR, { recursive: true });

  const meta = await sharp(sources[0]).metadata();
  const srcW = meta.width || DESKTOP_W;
  const srcH = meta.height || Math.round((srcW * 9) / 16);
  const desktopW = Math.min(DESKTOP_W, srcW);
  const desktopH = Math.round((desktopW * srcH) / srcW);
  const mobileW = Math.min(MOBILE_W, srcW);
  const mobileH = Math.round((mobileW * srcH) / srcW);

  const mobileIndices = new Set();
  for (let i = 0; i < sources.length; i += MOBILE_STRIDE) mobileIndices.add(i);

  let mobileCount = 0;

  console.log("Desktop pass:");
  await pool(
    sources,
    async (src, idx) => {
      const name = `frame_${pad(idx + 1)}.webp`;
      await sharp(src)
        .resize({ width: desktopW, withoutEnlargement: true })
        .webp({ quality: 74, effort: 6 })
        .toFile(path.join(DESKTOP_DIR, name));
    },
    CONCURRENCY
  );

  // mobile: contiguous renumber of the strided subset
  const mobileSources = sources.filter((_, i) => mobileIndices.has(i));
  console.log("Mobile pass:");
  await pool(
    mobileSources,
    async (src, idx) => {
      const name = `frame_${pad(idx + 1)}.webp`;
      await sharp(src)
        .resize({ width: mobileW, withoutEnlargement: true })
        .webp({ quality: 66, effort: 6 })
        .toFile(path.join(MOBILE_DIR, name));
      mobileCount++;
    },
    CONCURRENCY
  );

  const poster = path.join(OUT, "poster.webp");
  await sharp(sources[0])
    .resize({ width: desktopW, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(poster);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: path.basename(SRC_DIR),
    sourceFrameCount: sources.length,
    width: desktopW,
    height: desktopH,
    aspect: +(desktopW / desktopH).toFixed(4),
    desktop: {
      dir: "frames/desktop",
      count: sources.length,
      width: desktopW,
      height: desktopH,
      ext: "webp",
      pattern: "frame_%03d.webp",
    },
    mobile: {
      dir: "frames/mobile",
      count: mobileCount,
      width: mobileW,
      height: mobileH,
      ext: "webp",
      pattern: "frame_%03d.webp",
      stride: MOBILE_STRIDE,
    },
    poster: "frames/poster.webp",
  };

  await writeFile(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\nDone. Desktop ${sources.length} frames (${desktopW}x${desktopH}), ` +
    `mobile ${mobileCount} frames (${mobileW}x${mobileH}).`);
}

main().catch((err) => {
  console.error("\nFrame build failed:", err.message);
  process.exit(1);
});
