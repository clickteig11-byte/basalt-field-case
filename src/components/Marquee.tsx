import { brand } from "../brand";
import "./Marquee.css";

export default function Marquee({
  items,
  speed = 26,
}: {
  items?: string[];
  speed?: number;
}) {
  const list = items ?? [...brand.marquee];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__stripe hazard" />
      <div className="marquee__viewport">
        <div
          className="marquee__track"
          style={{ animationDuration: `${speed}s` }}
        >
          {[0, 1].map((pass) => (
            <div className="marquee__group" key={pass}>
              {list.map((item, index) => (
                <span className="marquee__item" key={`${pass}-${index}`}>
                  <span className="dot marquee__dot" />
                  <span className="disp marquee__text">{item}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
