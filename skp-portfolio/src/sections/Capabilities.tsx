// src/sections/Capabilities.tsx
import { capabilities, lifecycle } from "../data/portfolio";

const COLS = ["Working", "Proficient", "Lead"] as const;

export default function Capabilities() {
  return (
    <section id="capabilities">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">03</span> Capability matrix
          </div>
          <h2 className="title">Depth across the standards, the wire, and the program.</h2>
        </div>

        <div className="matrix reveal">
          <div className="mrow head">
            <div className="cell dom">Domain</div>
            {COLS.map((c) => (
              <div className="cell lvl" key={c}>
                {c}
              </div>
            ))}
          </div>

          {capabilities.map((row) => (
            <div className="mrow" key={row.domain}>
              <div className="cell dom">{row.domain}</div>
              {COLS.map((label, idx) => {
                const col = idx + 1; // 1..3
                const on = col <= row.level;
                const isPeak = col === row.level;
                const isLead = isPeak && row.level === 3;
                const cls = ["cell", "lvl"];
                if (on) cls.push("on");
                if (isLead) cls.push("lead");
                return (
                  <div className={cls.join(" ")} key={label}>
                    <span className="dot" />
                    {isPeak ? label : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 64 }}>
          <div className="eyebrow">
            <span className="num">04</span> How I run a validation
          </div>
          <h2 className="title">A repeatable, evidence-first lifecycle.</h2>
        </div>

        <div className="lifecycle stagger">
          {lifecycle.map((s) => (
            <div className="stage" key={s.n}>
              <div className="n">{s.n}</div>
              <h5>{s.title}</h5>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
