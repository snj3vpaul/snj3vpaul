import { profile, publications } from "../data/portfolio";

export default function Writing() {
  const linked = publications.filter((item) => item.url);
  return (
    <section id="writing" aria-labelledby="writing-title">
      <div className="wrap">
        <div className="eyebrow">Field notes & research</div>
        <h2 className="title" id="writing-title">More comfortable thinking than shouting. Still, some ideas are worth sharing.</h2>
        <p className="lead">Occasional writing about security, technical questions, and what I learn along the way.</p>
        <div className="writing-grid">
          {linked.map((item) => (
            <a className="writing-card" key={item.title} href={item.url} target="_blank" rel="noopener noreferrer">
              <span className="writing-kicker">{item.year} / Research</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="writing-link">Read publication ↗</span>
            </a>
          ))}
          <a className="writing-card" href={profile.links.medium} target="_blank" rel="noopener noreferrer">
            <span className="writing-kicker">Ongoing / Articles</span>
            <h3>Notes from the security world.</h3>
            <p>Explanations and perspectives on security topics, collected on Medium.</p>
            <span className="writing-link">Explore writing ↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
