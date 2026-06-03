// src/sections/Experience.tsx
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">05</span> Experience
          </div>
          <h2 className="title">Where I've delivered.</h2>
        </div>

        <div className="xp">
          {experience.map((x, i) => (
            <div className="xp-row reveal" key={i}>
              <div className="when">{x.when}</div>
              <div>
                <h4>{x.title}</h4>
                <div className="org">{x.org}</div>
                <p>{x.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
