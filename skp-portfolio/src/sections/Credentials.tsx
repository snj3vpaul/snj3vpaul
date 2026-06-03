// src/sections/Credentials.tsx
import { education, certifications, publications } from "../data/portfolio";
import type { TimelineItem } from "../data/portfolio";

function Item({ it }: { it: TimelineItem }) {
  const head = (
    <>
      <span className={`st${it.validated ? " ok" : ""}`} />
      {it.title}
      {it.url ? " ↗" : ""}
    </>
  );
  return (
    <div className="cred-item">
      {it.url ? (
        <a className="name" href={it.url} target="_blank" rel="noreferrer noopener">
          {head}
        </a>
      ) : (
        <div className="name">{head}</div>
      )}
      <div className="meta">{it.year}</div>
      {it.body && <p className="desc">{it.body}</p>}
    </div>
  );
}

function Column({ title, items }: { title: string; items: TimelineItem[] }) {
  return (
    <div className="cred-col">
      <h3>{title}</h3>
      {items.map((it, i) => (
        <Item it={it} key={i} />
      ))}
    </div>
  );
}

export default function Credentials() {
  return (
    <section id="credentials">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">05</span> Credentials
          </div>
          <h2 className="title">Education, certifications, and published research.</h2>
        </div>

        <div className="creds reveal">
          <Column title="Education" items={education} />
          <Column title="Certifications" items={certifications} />
          <Column title="Publications" items={publications} />
        </div>
      </div>
    </section>
  );
}