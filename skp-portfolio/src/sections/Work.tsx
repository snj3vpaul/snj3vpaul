// src/sections/Work.tsx
import { caseStudies } from "../data/portfolio";
import type { CaseStudy } from "../data/portfolio";

const isExternal = (url: string) => /^https?:\/\//i.test(url);

function Metrics({ items }: { items: NonNullable<CaseStudy["metrics"]> }) {
  return (
    <div className="metrics">
      {items.map((m) => {
        const ph = /x/i.test(m.value);
        return (
          <div className="metric" key={m.label}>
            <div className={`v${ph ? " ph2" : ""}`}>{m.value}</div>
            <div className="k">{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Foot({ links }: { links: CaseStudy["links"] }) {
  return (
    <div className="case-foot">
      {links.map((l) => (
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
  );
}

function Badges({ c }: { c: CaseStudy }) {
  return (
    <div className="case-top">
      <div className="badges">
        {c.flagship && <span className="chip flag">Flagship</span>}
        {c.badges.map((b) => (
          <span className="chip" key={b}>{b}</span>
        ))}
        {c.status && <span className="chip ok">● {c.status.label}</span>}
      </div>
      <span className="chip">{c.tag}</span>
    </div>
  );
}

function Featured({ c }: { c: CaseStudy }) {
  return (
    <article className="case featured flag reveal">
      <div className="featured-grid">
        <div className="featured-main">
          <Badges c={c} />
          <h3>{c.title}</h3>
          <div className="role">Role: {c.role}</div>
          <p className="summary">{c.summary}</p>
          <Foot links={c.links} />
        </div>
        <aside className="featured-rail">
          {c.snapshot?.map((r) => (
            <div className="snap-row" key={r.k}>
              <span className="k">{r.k}</span>
              <span className="v">{r.v}</span>
            </div>
          ))}
          {c.metrics && <Metrics items={c.metrics} />}
        </aside>
      </div>
    </article>
  );
}

function Standard({ c }: { c: CaseStudy }) {
  return (
    <article className="case reveal">
      <Badges c={c} />
      <h3>{c.title}</h3>
      <div className="role">Role: {c.role}</div>
      <p className="summary">{c.summary}</p>
      {c.metrics && <Metrics items={c.metrics} />}
      <Foot links={c.links} />
    </article>
  );
}

export default function Work() {
  const flagship = caseStudies.find((c) => c.flagship);
  const rest = caseStudies.filter((c) => !c.flagship);

  return (
    <section id="work">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">01</span> Selected work
          </div>
          <h2 className="title">Case studies in validation, security, and delivery.</h2>
          <p className="lead">
            Framed the way a reviewer reads it: context, ownership, approach, and
            measurable outcome.
          </p>
        </div>

        <div className="cases">
          {flagship && <Featured c={flagship} />}
        </div>
        <div className="cases-rest">
          {rest.map((c) => (
            <Standard c={c} key={c.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
