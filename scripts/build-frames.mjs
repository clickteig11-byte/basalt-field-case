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

const DESKTOP = { width: 1152, stride: 2, quality: 58 };
const MOBILE = { width: 768, stride: 3, quality: 55 };
const CONCURRENCY = 8;

async function listSourceFrames() {
  const files = await readdir(SRC_DIR);
  return files
    .filter((f) => /^frame_\d+\.(jpe?g|png)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10))
    .map((f) => path.join(SRC_DIR, f));
}

async function pool(items, worker, size) {
  let i = 0;
  let done = 0;
  const total = items.length;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < total) {
        const idx = i++;
        await worker(items[idx], idx);
        done++;
        if (done % 20 === 0 || done === total) {
          process.stdout.write(`\r  encoded ${done}/${total}`);
        }
      }
    })
  );
  process.stdout.write(`\r  encoded ${done}/${total}\n`);
}

const pad = (n) => String(n).padStart(3, "0");
const take = (arr, stride) => arr.filter((_, i) => i % stride === 0);

async function main() {
  if (!existsSync(SRC_DIR)) throw new Error(`Source frames not found: ${SRC_DIR}`);
  const sources = await listSourceFrames();
  if (!sources.length) throw new Error(`No frame_*.jpg found in ${SRC_DIR}`);

  console.log(`Source: ${SRC_DIR}`);
  console.log(`Found ${sources.length} frames -> ${path.relative(ROOT, OUT)}\n`);

  await rm(OUT, { recursive: true, force: true });
  await mkdir(DESKTOP_DIR, { recursive: true });
  await mkdir(MOBILE_DIR, { recursive: true });

  const meta = await sharp(sources[0]).metadata();
  const srcW = meta.width || 1152;
  const srcH = meta.height || Math.round((srcW * 9) / 16);

  const dims = (w) => {
    const width = Math.min(w, srcW);
    return { width, height: Math.round((width * srcH) / srcW) };
  };

  const desktopList = take(sources, DESKTOP.stride);
  const mobileList = take(sources, MOBILE.stride);
  const d = dims(DESKTOP.width);
  const m = dims(MOBILE.width);

  const encode = (src, dir, idx, dim, quality) =>
    sharp(src)
      .resize({ width: dim.width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(path.join(dir, `frame_${pad(idx + 1)}.webp`));

  console.log(`Desktop  ${desktopList.length} x ${d.width}x${d.height}`);
  await pool(desktopList, (src, i) => encode(src, DESKTOP_DIR, i, d, DESKTOP.quality), CONCURRENCY);

  console.log(`Mobile   ${mobileList.length} x ${m.width}x${m.height}`);
  await pool(mobileList, (src, i) => encode(src, MOBILE_DIR, i, m, MOBILE.quality), CONCURRENCY);

  await sharp(sources[0])
    .resize({ width: d.width, withoutEnlargement: true })
    .webp({ quality: 62, effort: 6 })
    .toFile(path.join(OUT, "poster.webp"));

  const manifest = {
    generatedAt: new Date().toISOString(),
    aspect: +(d.width / d.height).toFixed(4),
    poster: "frames/poster.webp",
    desktop: { dir: "frames/desktop", count: desktopList.length, ...d, stride: DESKTOP.stride },
    mobile: { dir: "frames/mobile", count: mobileList.length, ...m, stride: MOBILE.stride },
  };

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. desktop=${desktopList.length} mobile=${mobileList.length}`);
}

main().catch((err) => {
  console.error("\nFrame build failed:", err.message);
  process.exit(1);
});
