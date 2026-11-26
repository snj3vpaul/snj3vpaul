// src/sections/TrustStrip.tsx
import { profile, trustLabel } from "../data/portfolio";

export default function TrustStrip() {
  const marks = profile.standards;
  // duplicated once so the marquee loops seamlessly (translateX -50%)
  const loop = [...marks, ...marks];
  return (
    <div className="trust-band" aria-label={trustLabel}>
      <div className="trust-label">{trustLabel}</div>
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((m, i) => (
            <span className="mark" key={i} aria-hidden={i >= marks.length}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}