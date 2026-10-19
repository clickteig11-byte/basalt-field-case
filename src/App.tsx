import { useEffect } from "react";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Grain from "./components/Grain";
import ScrollSequence from "./components/ScrollSequence";
import Marquee from "./components/Marquee";
import Specs from "./components/Specs";
import CTA from "./components/CTA";
import { getLenis, ScrollTrigger } from "./lib/smoothScroll";

export default function App() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      if (href === "#") {
        e.preventDefault();
        return;
      }
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0 });
      else (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      document.removeEventListener("click", onClick);
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Preloader />
      <Nav />
      <Grain />
      <main id="top">
        <ScrollSequence />
        <Marquee />
        <Specs />
        <CTA />
      </main>
    </>
  );
}
