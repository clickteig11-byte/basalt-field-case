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
  const drawn = useRef(-1);
  const progressRef = useRef(0);
  const onFrameRef = useRef(opts.onFrame);
  const fit = opts.fit ?? "auto";

  useEffect(() => {
    onFrameRef.current = opts.onFrame;
  });

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = getFrameLoader().image(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = canvas.getContext("2d", { alpha: false });
        ctxRef.current = ctx;
      }
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const cw = Math.max(1, Math.round(rect.width));
      const ch = Math.max(1, Math.round(rect.height));
      const cap = cw > 1600 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const bw = Math.round(cw * dpr);
      const bh = Math.round(ch * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cover = fit === "cover" ? true : fit === "contain" ? false : bw / bh >= 1.25;
      const scale = cover ? Math.max(bw / iw, bh / ih) : Math.min(bw / iw, bh / ih);
      const dw = iw * scale;
      const dh = ih * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#0b0b0c";
      ctx.fillRect(0, 0, bw, bh);
      const dx = (bw - dw) / 2;
      const dy = !cover && bh > bw ? Math.round(bh * 0.31) : (bh - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      drawn.current = index;
      onFrameRef.current?.(index, getFrameLoader().cfg.count);
    },
    [fit]
  );

  const render = useCallback(
    (progress: number) => {
      progressRef.current = progress;
      const loader = getFrameLoader();
      const total = loader.cfg.count;
      if (!total) return;
      let idx = Math.round(progress * (total - 1));
      if (idx < 0) idx = 0;
      else if (idx > total - 1) idx = total - 1;
      const near = loader.nearestLoaded(idx);
      if (near === null) return;
      if (near !== drawn.current) draw(near);
    },
    [draw]
  );

  useEffect(() => {
    const loader = getFrameLoader();
    let raf = 0;
    const unsub = loader.subscribe((s) => {
      if (s.loaded === 0) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => render(progressRef.current));
    });

    const ro = new ResizeObserver(() => {
      drawn.current = -1;
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
