import { details } from "../data/details";
import "./Details.css";

export default function Details() {
  return (
    <section id="details" className="details">
      <div className="wrap details__inner">
        <header className="details__head" data-reveal>
          <span className="eyebrow">Details</span>
          <h2 className="serif details__title">Specifications.</h2>
        </header>

        <dl className="details__list">
          {details.map((row) => (
            <div className="details__row" data-reveal key={row.k}>
              <dt>{row.k}</dt>
              <dd>{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
