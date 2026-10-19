import { useEffect, useState } from "react";
import { brand } from "../brand";
import "./Nav.css";

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${solid ? " nav--solid" : ""}`}>
      <div className="nav__inner wrap">
        <a className="nav__brand serif" href="#top">
          {brand.name}
        </a>
        <nav className="nav__links" aria-label="Primary">
          {brand.nav.map((item) => (
            <a className="nav__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
