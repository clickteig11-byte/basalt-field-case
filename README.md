# BASALT — Field Case 04

A bold-brutalist, scroll-driven product site. Scrolling scrubs a 220-frame image
sequence that opens a rugged hard case — lid, trays, fully loaded — with pinned
caption beats synced to the scroll.

Built with Vite + React + TypeScript, GSAP ScrollTrigger, and Lenis.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **GSAP ScrollTrigger** — scrubbed scroll progress
- **Lenis** — inertial smooth scroll
- **sharp** — build-time frame pipeline

## Getting started

```bash
npm install
npm run dev        # http://localhost:7713
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server on port 7713 |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run build:frames` | Regenerate `public/frames` from source JPGs |
| `npm run lint` | Oxlint |

## Frame pipeline

`scripts/build-frames.mjs` converts a source folder of numbered JPGs into
gap-safe, renumbered WebP for two breakpoints plus a manifest and poster:

- `public/frames/desktop/` — 1280×720, every frame
- `public/frames/mobile/` — 854×480, every 2nd frame
- `public/frames/manifest.json`, `public/frames/poster.webp`

Point it at a source folder with `FRAME_SRC`:

```bash
FRAME_SRC=/path/to/frames npm run build:frames
```

Defaults to `../image_20261016_211812_frames` relative to the project root.

## Structure

```
scripts/build-frames.mjs     frame pipeline
public/frames/               generated webp sequences
src/
  brand.ts                   single source for name, palette, copy
  data/beats.ts              scroll-synced caption beats
  data/specs.ts              spec table rows
  lib/frameLoader.ts         progressive preload singleton
  lib/smoothScroll.ts        Lenis + ScrollTrigger wiring
  hooks/useImageSequence.ts  DPR-aware canvas sequence renderer
  components/                Preloader, ScrollSequence, Nav, Marquee,
                             Specs, CTA, Grain
```

## Customizing

- Brand, copy, nav, and price live in `src/brand.ts`.
- Scroll copy and timing live in `src/data/beats.ts`.
- Design tokens (colors, type, edges) live in `src/index.css`.
