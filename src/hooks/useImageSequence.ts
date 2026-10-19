import { useCallback, useEffect, useRef } from "react";
import { getFrameLoader } from "../lib/frameLoader";

type Fit = "cover" | "contain" | "auto";

type Options = {
  fit?: Fit;
  onFrame?: (index: number, total: number) => void;
};

export function useImageSequence(opts: Options = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastIndex = useRef(-1);
  const progressRef = useRef(0);
  const onFrameRef = useRef(opts.onFrame);
  const fit = opts.fit ?? "auto";

  useEffect(() => {
    onFrameRef.current = opts.onFrame;
  });

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const loader = getFrameLoader();
      if (!canvas) return;
      const img = loader.image(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = canvas.getContext("2d", { alpha: false });
        ctxRef.current = ctx;
      }
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cover = fit === "cover" ? true : fit === "contain" ? false : cw / ch >= 1.25;
      const scale = cover ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#0b0a08";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      lastIndex.current = index;
      onFrameRef.current?.(index, loader.cfg.count);
    },
    [fit]
  );

  const render = useCallback(
    (progress: number) => {
      progressRef.current = progress;
      const loader = getFrameLoader();
      const total = loader.cfg.count;
      if (!total) return;
      const maxIdx = loader.highestLoaded >= 0 ? loader.highestLoaded : 0;
      let idx = Math.round(progress * (total - 1));
      if (idx > maxIdx) idx = maxIdx;
      if (idx < 0) idx = 0;
      if (idx !== lastIndex.current) draw(idx);
    },
    [draw]
  );

  useEffect(() => {
    const loader = getFrameLoader();
    let raf = 0;
    const unsub = loader.subscribe((s) => {
      if (s.loaded > 0) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => render(progressRef.current));
      }
    });

    const ro = new ResizeObserver(() => {
      lastIndex.current = -1;
      render(progressRef.current);
    });
    if (canvasRef.current) ro.observe(canvasRef.current);

    render(progressRef.current);

    return () => {
      unsub();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [render]);

  return { canvasRef, render, progressRef };
}
