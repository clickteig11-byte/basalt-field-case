import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initSmoothScroll } from "./lib/smoothScroll";
import App from "./App";

initSmoothScroll();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
