import "./Grain.css";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23grain)'/%3E%3C/svg%3E";

export default function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <div
        className="grain__noise"
        style={{ backgroundImage: `url("${NOISE}")` }}
      />
      <div className="grain__vignette" />
    </div>
  );
}
