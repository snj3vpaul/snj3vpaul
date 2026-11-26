import { principles } from "../data/portfolio";

export default function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title">
      <div className="wrap">
        <div className="eyebrow">How I approach things</div>
        <h2 className="title" id="approach-title">Quietly curious. Deliberate about the details.</h2>
        <p className="lead">What I've learned from security work, teamwork, and building things outside my job.</p>
        <div className="principles-grid">
          {principles.map((item, i) => (
            <article key={item.title} className="principle-tile">
              <span className="principle-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
