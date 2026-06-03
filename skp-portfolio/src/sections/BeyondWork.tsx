// src/sections/BeyondWork.tsx
import { beyond } from "../data/portfolio";

export default function BeyondWork() {
  return (
    <section id="beyond">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">06</span> Beyond work
          </div>
          <h2 className="title">Discipline, consistency, and giving back.</h2>
        </div>

        <div className="beyond stagger">
          {beyond.map((b) => (
            <div className="bcard" key={b.title}>
              <div className="ic">{b.kind}</div>
              <h4>{b.title}</h4>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
