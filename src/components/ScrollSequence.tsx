import { useCallback, useEffect, useRef, useState } from "react";
import { useImageSequence } from "../hooks/useImageSequence";
import { ScrollTrigger, getLenis } from "../lib/smoothScroll";
import { beats } from "../data/beats";
import { brand } from "../brand";
import "./ScrollSequence.css";

const SECTIONS_VH = 600;

function nearestBeat(p: number) {
  let best = 0;
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
  const hudFrameRef = useRef<HTMLSpanElement | null>(null);
  const hudPctRef = useRef<HTMLSpanElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);

  const onFrame = useCallback((index: number, total: number) => {
    if (hudFrameRef.current) {
      hudFrameRef.current.textContent = `${String(index + 1).padStart(3, "0")} / ${total}`;
    }
  }, []);

  const { canvasRef, render } = useImageSequence({
    fit: "auto",
    onFrame,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        render(p);
        if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;
        if (hudPctRef.current) {
          hudPctRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
        }
        setActive((prev) => {
          const n = nearestBeat(p);
          return prev === n ? prev : n;
        });
      },
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      st.kill();
      clearTimeout(refresh);
    };
  }, [render]);

  const goNext = () => {
    const lenis = getLenis();
    const next = beats[Math.min(active + 1, beats.length - 1)];
    const el = sectionRef.current;
    if (!el || !lenis) return;
    const height = el.offsetHeight - window.innerHeight;
    lenis.scrollTo(window.scrollY + (next.at - (active === 0 ? 0 : beats[active].at)) * height, {
      duration: 1.1,
    });
  };

  return (
    <section
      id="sequence"
      ref={sectionRef}
      className="seq"
      style={{ height: `${SECTIONS_VH}vh` }}
      aria-label={`${brand.product} sequence`}
    >
      <div className="seq__sticky">
        <canvas ref={canvasRef} className="seq__canvas" />
        <div className="seq__scrim" aria-hidden="true" />
        <div className="seq__scan" aria-hidden="true" />

        <div className="seq__beats">
          {beats.map((b, i) => {
            const state = i === active ? "is-active" : i < active ? "is-past" : "is-future";
            return (
              <article
                key={b.index}
                className={`seq__beat seq__beat--${b.align ?? "left"} ${state} ${
                  i === 0 ? "seq__beat--lead" : ""
                }`}
                aria-hidden={i !== active}
              >
                <div className="seq__beat-inner">
                  <header className="seq__beat-head">
                    <span className="seq__beat-index num">{b.index}</span>
                    <span className="rule seq__beat-rule" />
                    <span className="seq__beat-kicker label">{b.kicker}</span>
                  </header>
                  <h2 className="seq__beat-title disp">
                    {b.title.map((line) => (
                      <span key={line} className="mask-line">
                        <span>{line}</span>
                      </span>
                    ))}
                  </h2>
                  <p className="seq__beat-body">{b.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="seq__hud">
          <div className="seq__hud-left mono">
            <span className="seq__hud-dot" aria-hidden="true" />
            <span>FRAME</span>
            <span ref={hudFrameRef} className="num">
              001 / 220
            </span>
          </div>
          <button type="button" className="seq__hud-mid mono" onClick={goNext}>
            <span>{brand.model}</span>
            <span className="seq__hud-sep" aria-hidden="true">
              /
            </span>
            <span>SCROLL TO OPEN</span>
          </button>
          <div className="seq__hud-right mono">
            <span ref={hudPctRef} className="num">
              00%
            </span>
          </div>
        </div>

        <div className="seq__rail" aria-hidden="true">
          <span ref={railRef} className="seq__rail-fill" />
        </div>
      </div>
    </section>
  );
}
