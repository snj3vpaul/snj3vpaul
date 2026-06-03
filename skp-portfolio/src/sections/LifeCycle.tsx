// src/sections/Lifecycle.tsx
import { lifecycle } from "../data/portfolio";

export default function Lifecycle() {
  return (
    <section id="lifecycle">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">02</span> How I work
          </div>
          <h2 className="title">A repeatable, evidence-first validation lifecycle.</h2>
          <p className="lead">
            The same disciplined path behind the work above — scoped, tested on the wire,
            and documented so it stands up under review.
          </p>
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
