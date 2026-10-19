# Field Case

A scroll-driven product page. Scrolling scrubs a pre-rendered image sequence that
opens a hard case: lid, trays, tools. Four captions sync to the scroll.

Built with Vite, React, TypeScript, and Lenis.

## Stack

- Vite 8 + React 19 + TypeScript
- Lenis for smooth scrolling
- sharp for the build-time frame pipeline

## Getting started

```bash
npm install
npm run dev        # http://localhost:7713
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server on port 7713 |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |
| `npm run build:frames` | Regenerate `public/frames` from source JPGs |
| `npm run lint` | Oxlint |

## Frame pipeline

`scripts/build-frames.mjs` turns a folder of numbered JPGs into renumbered WebP
for two breakpoints, plus a poster and manifest:

- `public/frames/desktop/` - 1152x648, every 2nd frame (110)
- `public/frames/mobile/` - 768x432, every 3rd frame (74)
- `public/frames/manifest.json`, `public/frames/poster.webp`

Point it at a source folder with `FRAME_SRC`:

```bash
FRAME_SRC=/path/to/frames npm run build:frames
```

Defaults to `../image_20261016_211812_frames` relative to the project root.

## How the sequence loads

`lib/frameLoader.ts` fetches frames coarse to fine (strides 16, 8, 4, 2, 1), so a
usable sequence appears after a handful of requests and sharpens in place. The
renderer always draws the nearest loaded frame, so scrolling never stalls on a
missing image. A poster covers the first paint.

## Structure

```
scripts/build-frames.mjs     frame pipeline
public/frames/               generated webp sequences
src/
  brand.ts                   name, copy, nav, price
  data/beats.ts              scroll-synced captions
  data/details.ts            spec rows
  data/frames.ts             frame counts and dimensions
  lib/frameLoader.ts         coarse-to-fine preload singleton
  lib/smoothScroll.ts        Lenis setup and anchor scrolling
  hooks/useImageSequence.ts  canvas renderer
  components/                ScrollSequence, Nav, Details, Buy, Grain
```

## Editing

- Copy, nav, and price live in `src/brand.ts` and `src/data/`.
- Colors and type tokens live in `src/index.css`.
- Section timing is the `500vh` height in `ScrollSequence.tsx`.
