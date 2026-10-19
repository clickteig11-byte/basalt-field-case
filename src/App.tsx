import { useEffect } from "react";
import Nav from "./components/Nav";
import Grain from "./components/Grain";
import ScrollSequence from "./components/ScrollSequence";
import Details from "./components/Details";
import Buy from "./components/Buy";
import { scrollToTarget } from "./lib/smoothScroll";

export default function App() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      const node = href && href.length > 1 ? document.querySelector(href) : null;
      event.preventDefault();
      if (node instanceof HTMLElement) scrollToTarget(node);
    };
    document.addEventListener("click", onClick);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((node) => io.observe(node));

    return () => {
      document.removeEventListener("click", onClick);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />
      <Grain />
      <main id="top">
        <ScrollSequence />
        <Details />
        <Buy />
      </main>
    </>
  );
}
