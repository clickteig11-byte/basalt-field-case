import { useEffect, useState } from "react";
import { brand } from "../brand";
import "./Nav.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav__inner wrap">
        <a className="nav__mark disp" href="#top">
          {brand.studio}
        </a>
        <nav className="nav__links" aria-label="Primary">
          {brand.nav.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              className="nav__link mono"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <span className="nav__model mono">{brand.model}</span>
      </div>
    </header>
  );
}
