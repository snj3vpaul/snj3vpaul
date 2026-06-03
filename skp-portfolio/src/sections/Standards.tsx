// src/sections/Standards.tsx
import { standards } from "../data/portfolio";

export default function Standards() {
  return (
    <section id="standards">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">02</span> Standards &amp; certifications
          </div>
          <h2 className="title">A documented track record against recognized frameworks.</h2>
          <p className="lead">
            Status is shown honestly: <span style={{ color: "var(--ok)" }}>●</span> validated /
            held, <span style={{ color: "var(--accent)" }}>●</span> in progress.
          </p>
        </div>

        <div className="timeline reveal">
          {standards.map((s, i) => (
            <div className={`tl-item${s.validated ? " ok" : ""}`} key={i}>
              <span className="node" />
              <div className="tl-head">
                <span className="yr">{s.year}</span>
                <h4>{s.title}</h4>
              </div>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
