import { useCallback, useEffect, useRef, useState } from "react";
import { useImageSequence } from "../hooks/useImageSequence";
import { getLenis } from "../lib/smoothScroll";
import { beats } from "../data/beats";
import { brand } from "../brand";
import { POSTER } from "../data/frames";
import "./ScrollSequence.css";

const SECTION_VH = 500;

function nearestBeat(p: number) {
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < beats.length; i++) {
    const d = Math.abs(beats[i].at - p);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export default function ScrollSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLSpanElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);

  const onFrame = useCallback(() => {
    setReady(true);
  }, []);

  const { canvasRef, render } = useImageSequence({ onFrame });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let last = -1;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      render(p);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (hintRef.current) hintRef.current.style.opacity = p > 0.015 ? "0" : "1";
      setActive((prev) => {
        const n = p < 0.1 ? -1 : nearestBeat(p);
        return prev === n ? prev : n;
      });
    };

    const lenis = getLenis();
    update();
    window.addEventListener("resize", update);
    if (lenis) lenis.on("scroll", update);
    else window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      lenis?.off("scroll", update);
    };
  }, [render]);

  return (
    <section
      id="sequence"
      ref={sectionRef}
      className="seq"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label={brand.name}
    >
      <div className={`seq__stage${ready ? " is-ready" : ""}`}>
        <img
          ref={posterRef}
          className="seq__poster"
          src={POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <canvas ref={canvasRef} className="seq__canvas" />
        <div className="seq__shade" aria-hidden="true" />

        <div className="seq__hero" data-hidden={active >= 0}>
          <span className="eyebrow">{brand.hero.eyebrow}</span>
          <h1 className="serif seq__hero-title">{brand.tagline}</h1>
        </div>

        <div className="seq__captions">
          {beats.map((b, i) => (
            <figure
              className="seq__caption"
              data-state={i === active ? "on" : i < active ? "past" : "next"}
              aria-hidden={i !== active}
              key={b.statement}
            >
              <span className="eyebrow seq__caption-i">
                {String(i + 1).padStart(2, "0")}
              </span>
              <figcaption>
                <p className="serif seq__statement">{b.statement}</p>
                <p className="seq__line">{b.line}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <span ref={hintRef} className="eyebrow seq__hint">
          Scroll
        </span>

        <div className="seq__track" aria-hidden="true">
          <span ref={barRef} className="seq__track-fill" />
        </div>
      </div>
    </section>
  );
}
