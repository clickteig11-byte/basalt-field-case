import { useEffect, useRef, useState } from "react";
import { getFrameLoader } from "../lib/frameLoader";
import { startScroll, stopScroll, ScrollTrigger } from "../lib/smoothScroll";
import { brand } from "../brand";
import "./Preloader.css";

const MIN_MS = 1600;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const startedAt = useRef(0);
  const fired = useRef(false);

  useEffect(() => {
    startedAt.current = performance.now();
    stopScroll();
    window.scrollTo(0, 0);
    const loader = getFrameLoader();
    const unsub = loader.subscribe((s) => {
      setProgress((prev) => {
        if (s.progress >= 1) return 1;
        if (Math.round(prev * 100) === Math.round(s.progress * 100)) return prev;
        return s.progress;
      });
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (progress < 1 || fired.current) return;
    fired.current = true;
    const wait = Math.max(0, MIN_MS - (performance.now() - startedAt.current));
    const t = window.setTimeout(() => {
      setExiting(true);
      startScroll();
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      window.setTimeout(() => setGone(true), 1000);
    }, wait);
    return () => clearTimeout(t);
  }, [progress]);

  if (gone) return null;

  const pct = Math.round(progress * 100);

  return (
    <div className={`pre${exiting ? " pre--exit" : ""}`} role="status" aria-live="polite">
      <span className="pre__tick pre__tick--tl" aria-hidden="true" />
      <span className="pre__tick pre__tick--tr" aria-hidden="true" />
      <span className="pre__tick pre__tick--bl" aria-hidden="true" />
      <span className="pre__tick pre__tick--br" aria-hidden="true" />

      <div className="pre__hazard hazard" aria-hidden="true" />

      <div className="pre__center">
        <span className="pre__label mono">{brand.studio}</span>
        <h1 className="pre__word disp">{brand.name}</h1>
        <span className="pre__sub mono">
          {brand.product} <span className="pre__sub-sep">/</span> {brand.model}
        </span>
      </div>

      <div className="pre__foot">
        <div className="pre__row mono">
          <span className="pre__status">SEALING VAULT</span>
          <span className="pre__pct num">{String(pct).padStart(3, "0")}%</span>
        </div>
        <div className="pre__bar">
          <span className="pre__bar-fill hazard" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
