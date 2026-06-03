// src/sections/Hero.tsx
import { profile, hero } from "../data/portfolio";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap hero-grid">
        <div>
          <div className="status-line reveal">
            <span className="status-dot" /> {profile.availability}
          </div>
          <h1 className="reveal">
            {hero.titleLead}
            <em>{hero.titleEm}</em>
            {hero.titleTail}
          </h1>
          <p className="sub reveal">{hero.sub}</p>

          <div className="std-row reveal">
            {profile.standards.map((s) => (
              <span className="std" key={s}>
                {s}
              </span>
            ))}
          </div>

          <div className="actions reveal">
            <a className="btn primary" href="#work">
              View case studies
            </a>
            <a
              className="btn ghost"
              href={profile.links.cv}
              download="Sanjeev_K_Paul_CV.pdf"
            >
              Download résumé
            </a>
            <a
              className="btn ghost"
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="portrait reveal" aria-label={`Portrait of ${profile.name}`}>
          {/* Replace the placeholder block below with your optimized photo:
              <img src="/portfolio.webp" alt={profile.name} loading="eager" /> */}
          <div className="scan" aria-hidden="true" />
          <span className="corner c1" />
          <span className="corner c2" />
          <span className="corner c3" />
          <span className="corner c4" />
          <div className="ph">
            <div className="glyph">{profile.name.charAt(0)}</div>
            <small>// drop your optimized portrait here (~200KB WebP)</small>
          </div>
          <span className="tag">{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
