import { brand } from "../brand";
import "./Buy.css";

export default function Buy() {
  const { buy } = brand;

  return (
    <section id="buy" className="buy">
      <div className="wrap buy__inner">
        <div className="buy__main" data-reveal>
          <span className="eyebrow">{buy.eyebrow}</span>
          <h2 className="serif buy__title">{buy.title}</h2>
          <p className="buy__note">{buy.note}</p>
        </div>

        <div className="buy__side" data-reveal>
          <span className="serif buy__price">{buy.price}</span>
          <div className="buy__actions">
            <button type="button" className="btn">
              {buy.cta}
            </button>
            <a href="#details" className="btn btn--ghost">
              {buy.secondary}
            </a>
          </div>
        </div>
      </div>

      <footer className="buy__footer">
        <div className="wrap buy__footer-inner">
          <span className="serif buy__mark">{brand.name}</span>
          <nav className="buy__footer-links" aria-label="Footer">
            <a href="#sequence">Overview</a>
            <a href="#details">Details</a>
            <a href="#buy">Buy</a>
          </nav>
          <span className="buy__copy">© 2026</span>
        </div>
      </footer>
    </section>
  );
}
