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

          <div className="actions reveal">
            <a className="btn primary" href="#work">
              View case studies
            </a>
            <a className="btn ghost" href={profile.links.cv} download="Sanjeev_K_Paul_CV.pdf">
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

        <div className="portrait reveal">
          <img
            src="/portrait.webp"
            alt={profile.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ objectPosition: "center top" }}
          />
          <div className="scan" aria-hidden="true" />
          <span className="corner c1" />
          <span className="corner c2" />
          <span className="corner c3" />
          <span className="corner c4" />
          <span className="tag">{profile.location}</span>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="line" />
      </div>
    </section>
  );
}