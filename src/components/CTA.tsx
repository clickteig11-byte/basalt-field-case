import { brand } from "../brand";
import "./CTA.css";

const footerLinks = ["CASE", "KIT", "SPEC", "ORDER", "INSTAGRAM"];

export default function CTA() {
  return (
    <section id="order" className="cta">
      <div className="cta__band">
        <div className="wrap cta__inner">
          <div className="cta__main">
            <span className="mono cta__kicker">{brand.order.kicker}</span>
            <h2 className="disp cta__headline" data-reveal>
              {brand.order.headline.map((line) => (
                <span className="mask-line cta__line" key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </h2>
            <p className="cta__note">{brand.order.note}</p>
          </div>

          <aside className="cta__buy" data-reveal>
            <span className="mono cta__price-label">PRICE</span>
            <span className="disp num cta__price">{brand.order.price}</span>
            <button type="button" className="btn btn--solid cta__cta">
              {brand.order.cta}
            </button>
            <button type="button" className="btn btn--ghost cta__cta2">
              {brand.order.ctaSecondary}
            </button>
          </aside>
        </div>
      </div>

      <footer className="cta__footer">
        <div className="hazard cta__hazard" aria-hidden="true" />
        <div className="wrap cta__foot-row">
          <span className="mono cta__studio">{brand.studio}</span>
          <nav className="cta__links" aria-label="Footer">
            {footerLinks.map((label) => (
              <a href="#" className="mono cta__link" key={label}>
                {label}
              </a>
            ))}
          </nav>
          <span className="mono cta__legal">© 2026 · {brand.model}</span>
        </div>
      </footer>
    </section>
  );
}
