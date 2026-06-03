// src/sections/Work.tsx
import { caseStudies } from "../data/portfolio";
import type { CaseStudy } from "../data/portfolio";

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

function Case({ c }: { c: CaseStudy }) {
  return (
    <article className={`case reveal${c.flagship ? " flag" : ""}`}>
      <div className="case-top">
        <div className="badges">
          {c.flagship && <span className="chip flag">Flagship</span>}
          {c.badges.map((b) => (
            <span className="chip" key={b}>
              {b}
            </span>
          ))}
          {c.status && <span className="chip ok">● {c.status.label}</span>}
        </div>
        <span className="chip">{c.tag}</span>
      </div>

      <h3>{c.title}</h3>
      <div className="role">{c.role}</div>
      <p className="summary">{c.summary}</p>

      {c.metrics && (
        <div className="metrics">
          {c.metrics.map((m) => {
            const isPlaceholder = /x/i.test(m.value);
            return (
              <div className="metric" key={m.label}>
                <div className={`v${isPlaceholder ? " ph2" : ""}`}>{m.value}</div>
                <div className="k">{m.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="case-foot">
        {c.links.map((l) => (
          <a
            key={l.label}
            className="lnk"
            href={l.url}
            target={isExternal(l.url) ? "_blank" : undefined}
            rel={isExternal(l.url) ? "noreferrer noopener" : undefined}
          >
            {l.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">01</span> Selected work
          </div>
          <h2 className="title">Case studies in validation, security, and delivery.</h2>
          <p className="lead">
            Each is framed the way a reviewer reads it: context, ownership, approach,
            and measurable outcome.
          </p>
        </div>

        <div className="cases">
          {caseStudies.map((c) => (
            <Case c={c} key={c.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
