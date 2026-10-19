import { specs } from "../data/specs";
import "./Specs.css";

export default function Specs() {
  return (
    <section id="specs" className="specs">
      <div className="wrap specs__inner">
        <header className="specs__head" data-reveal>
          <h2 className="disp specs__title">SPEC</h2>
          <span className="mono specs__tag">TECHNICAL / BVLT-04</span>
        </header>

        <div className="hazard specs__hazard" aria-hidden="true" />

        <div className="specs__grid">
          {specs.map((row, i) => (
            <div className="specs__row" data-reveal key={row.k}>
              <span className="num specs__index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mono specs__key">{row.k}</span>
              <span className="mono specs__val">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
