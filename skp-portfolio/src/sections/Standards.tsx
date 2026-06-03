// src/sections/Standards.tsx
import {
  certifications,
  education,
  publications,
} from "../data/portfolio";

export default function Standards() {
  return (
    <section id="standards">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">02</span> Credentials
          </div>

          <h2 className="title">
            Certifications, education, and published security work.
          </h2>

          <p className="lead">
            A structured view of verified credentials, academic foundation, and
            research contributions.
          </p>
        </div>

        {/* Certifications */}
        <div className="subsection reveal">
          <h3 className="subhead">Certifications</h3>

          <div className="timeline">
            {certifications.map((c, i) => (
              <div className={`tl-item${c.validated ? " ok" : ""}`} key={`c-${i}`}>
                <span className="node" />
                <div className="tl-head">
                  <span className="yr">{c.year}</span>
                  <h4>{c.title}</h4>
                </div>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="subsection reveal">
          <h3 className="subhead">Education</h3>

          <div className="timeline">
            {education.map((e, i) => (
              <div className={`tl-item${e.validated ? " ok" : ""}`} key={`e-${i}`}>
                <span className="node" />
                <div className="tl-head">
                  <span className="yr">{e.year}</span>
                  <h4>{e.title}</h4>
                </div>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div className="subsection reveal">
          <h3 className="subhead">Publications</h3>

          <div className="timeline">
            {publications.map((p, i) => (
              <div className={`tl-item${p.validated ? " ok" : ""}`} key={`p-${i}`}>
                <span className="node" />
                <div className="tl-head">
                  <span className="yr">{p.year}</span>
                  <h4>{p.title}</h4>
                </div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}