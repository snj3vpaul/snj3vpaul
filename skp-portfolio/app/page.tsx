import Art from '@/components/Art';
import CipherField from '@/components/CipherField';
import CipherWheel from '@/components/CipherWheel';
import Enhancements from '@/components/Enhancements';
import Magnetic from '@/components/Magnetic';
import PersonalBand from '@/components/PersonalBand';
import Pipeline from '@/components/Pipeline';
import ProjectTabs from '@/components/ProjectTabs';
import Providers from '@/components/Providers';
import Reel from '@/components/Reel';
import SiteChrome from '@/components/SiteChrome';
import WorkRail from '@/components/WorkRail';
import { chain, cipherKey, clubs, contact, field, greetings, intro, journey, life, pipeline, profile, record, writing } from '@/lib/content';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const hex = (n: number) => n.toString(16).padStart(2, '0');
const Label = ({ n, children }: { n?: string; children: React.ReactNode }) => <p className="sec-label">{n && <span className="sec-n" aria-hidden="true">{n}</span>}{children}</p>;
const words = (s: string, from: number) => s.split(' ').map((w, i) => <span key={i}><span className="w" style={{ '--i': from + i } as React.CSSProperties}>{w}</span>{' '}</span>);

/* the elliptic curve from the earlier hero: the still image under the shader, and the whole visual without WebGL */
const CURVE = 'M129.5 114.3 C124 104 118 94 108 86.2 C98 84 92 92 86 96.6 C80 99.4 74 99.6 70 97.5 C64 93 60 84 58.6 72 L57.8 60 L58.6 48 C60 36 64 27 70 22.5 C74 20.5 80 20.6 86 23.4 C92 28 98 36 108 33.8 C118 26 124 16 129.5 5.7';

export default function Page() {
  const h = profile.headline;
  const nBefore = h.before.split(' ').length;
  return (
    <Providers>
      <SiteChrome />
      <main id="main">
        {/* Hero */}
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-field" aria-hidden="true">
            <svg className="hero-curve" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
              <path className="hc-ax" d="M0 60H200M92 0V120" />
              <path className="hc-cv" d={CURVE} />
              <path className="hc-ch" d="M50 37 L135 15.6" /><path className="hc-ch hc-dash" d="M123 18.7V101.3" />
              <circle className="hc-pt" cx="62" cy="34" r="1.6" /><circle className="hc-pt" cx="92" cy="26.5" r="1.6" /><circle className="hc-pt hc-hot" cx="123" cy="101.3" r="2" />
            </svg>
            <CipherField />
          </div>
          <div className="hero-copy">
            <p className="who"><span>{profile.role}</span><span>{profile.employer}, since {profile.since}</span><span>{profile.location}</span></p>
            <h1 id="hero-title" className="headline">{words(h.before, 0)}<em className="w" style={{ '--i': nBefore } as React.CSSProperties}>{h.em}</em>{' '}{words(h.after, nBefore + 1)}</h1>
            <p className="role">{profile.role_line}</p>
            <div className="actions">
              <a className="btn btn-solid" href="#work" data-track="hero-cta-work">View professional work <span aria-hidden="true">→</span></a>
              <a className="btn btn-line" href="#contact" data-track="contact-hero">Get in touch</a>
              <ul className="profile-links">
                <li><a className="icon-link" href={profile.links.linkedin} {...ext} aria-label="Sanjeev K Paul on LinkedIn" data-track="linkedin-header"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a></li>
                <li><a className="icon-link" href={profile.links.github} {...ext} aria-label="Sanjeev K Paul on GitHub" data-track="github-header"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></a></li>
                <li><a className="quiet" href="cv.pdf" {...ext} data-track="resume-header">Résumé ↗</a></li>
              </ul>
            </div>
            <p className="hero-stack">{profile.stack}</p>
          </div>
          <figure className="field-cap">
            <figcaption>Behind this page, a message XORed with the key <code>{cipherKey.map(hex).join(' ')}</code>. Move a pointer across it, or tap, to decrypt.</figcaption>
            <p className="field-plain">{chain.map((w, i) => <span key={w}>{i > 0 && <span className="arrow" aria-hidden="true"> → </span>}{w}</span>)}</p>
          </figure>
        </section>

        <section className="proof-strip" aria-label="On the record">
          <article className="ppanel" aria-labelledby="pp1"><h2 id="pp1"><span className="mark mark-valid" aria-hidden="true" />Validated by NIST</h2><p className="num">2<small>modules</small></p><a className="more" href="#work-forticlient-crypto-module" data-track="proof-validated-modules">2 NIST-validated modules ↓</a></article>
          <article className="ppanel" aria-labelledby="pp2"><h2 id="pp2"><span className="mark mark-valid" aria-hidden="true" />FortiClient 7.0.2</h2><p className="statement">Fortinet’s first FIPS 140-3 VPN certification</p><a className="more" href="#work-forticlient-7-0-2" data-track="proof-first-vpn-certification">Led the workstream ↓</a></article>
          <article className="ppanel ppanel-wide" aria-labelledby="pp3"><h2 id="pp3">Ottawa, now</h2><p className="live" data-clock>Eastern Time</p><div className="light" aria-hidden="true"><i data-day /><b data-now /></div><p className="light-row"><span data-rise>Sunrise</span><span data-set>Sunset</span></p></article>
        </section>

        <div className="editorial">
          {/* Introduction */}
          <span className="anchor" id="hello" aria-hidden="true" />
          <section className="sec intro" id="about" data-chapter-name="About" aria-labelledby="about-title">
            <ul className="greetings" aria-label="Hello, in five languages">
              {greetings.map((g, i) => (
                <li key={g.lang} lang={g.lang} data-reveal style={{ '--x': ['4%', '68%', '78%', '6%', '52%'][i], '--y': ['6%', '0%', '58%', '82%', '90%'][i] } as React.CSSProperties}>
                  <span className="g-word">{g.word}</span><span className="g-meta">{g.name}{g.hex ? ` · ${g.hex}` : ''}</span>
                </li>
              ))}
            </ul>
            <div className="intro-body">
              <Label n="01">About</Label>
              <h2 id="about-title" data-reveal>{intro.title.before} <em>{intro.title.em}</em></h2>
              <p className="intro-lead" data-reveal>{intro.lead}</p>
              <p className="intro-text" data-reveal>{intro.text}</p>
            </div>
          </section>

          {/* Expertise */}
          <span className="anchor" id="approach" aria-hidden="true" /><span className="anchor" id="practice" aria-hidden="true" />
          <section className="sec expertise" id="expertise" data-chapter-name="Expertise" aria-labelledby="expertise-title">
            <header className="sec-head">
              <Label n="02">Expertise</Label>
              <h2 id="expertise-title" data-reveal>{pipeline.title.before} <em>{pipeline.title.em}</em></h2>
              <p className="sec-lead" data-reveal>{pipeline.lead}</p>
            </header>
            <Pipeline />
          </section>

          {/* Professional work */}
          <span className="anchor" id="professional-work" aria-hidden="true" />
          <section className="sec works" id="work" data-chapter-name="Work" aria-labelledby="work-title">
            <header className="sec-head">
              <Label n="03">Professional work · Fortinet</Label>
              <h2 id="work-title" data-reveal>Selected <em>Work</em></h2>
              <p className="legend"><span className="mark mark-valid" aria-hidden="true" />Validated by NIST <span className="mark mark-pending" aria-hidden="true" />In review <span className="mark mark-ongoing" aria-hidden="true" />Ongoing</p>
            </header>
            <WorkRail />
            <p className="endnote">Certificates are issued to modules, not people. Each project says what my part was.</p>
          </section>

          {/* On the record */}
          <section className="sec" id="impact" data-chapter-name="On the record" aria-labelledby="impact-title">
            <header className="sec-head">
              <Label n="04">From my work at Fortinet</Label>
              <h2 id="impact-title" data-reveal>On the <em>record.</em></h2>
              <a className="quiet sec-side" href="cv.pdf" {...ext} data-track="resume-impact">Full résumé ↗</a>
            </header>
            <dl className="sheet">{record.sheet.map(([k, v]) => <div key={k} data-reveal><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <div className="status" role="group" aria-label="Where each module stands">
              <p className="sub-label">Where each module stands</p>
              <ol>{record.status.map(s => <li key={s.stage}><b>{s.stage}</b>{s.items.map(it => <em key={it.label}><i className={`mark mark-${it.kind}`} aria-hidden="true" />{it.label}</em>)}</li>)}</ol>
            </div>
          </section>
        </div>

        {/* Personal projects */}
        <PersonalBand>
          <span className="anchor" id="personal-projects" aria-hidden="true" />
          <section className="sec lab projects" id="projects" data-chapter-name="Projects" aria-labelledby="projects-title">
            <header className="sec-head">
              <Label n="05">Personal projects · on my own time</Label>
              <h2 id="projects-title" data-reveal>Things I’ve <em>built.</em></h2>
            </header>
            <ProjectTabs />
          </section>

          <span className="anchor" id="canterbury-cricket-club" aria-hidden="true" />
          <section className="sec sports" id="sports" data-chapter-name="Clubs & community" aria-labelledby="sports-title">
            <header className="sec-head">
              <Label>Clubs &amp; community</Label>
              <h2 id="sports-title" data-reveal>Side <em>projects.</em></h2>
              <p className="sec-lead" data-reveal>{clubs.lead}</p>
            </header>
            <article className="sport sport--feature" aria-labelledby="sport-canterbury">
              <div className="sport-copy">
                <p className="case-kicker">{clubs.canterbury.kicker}</p>
                <h3 id="sport-canterbury">{clubs.canterbury.title}</h3>
                <p className="sport-text">{clubs.canterbury.text}</p>
                <dl className="spec">{clubs.canterbury.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <p className="lab-actions"><a className="btn btn-line" href={profile.links.club} {...ext} data-track="open-canterbury">Visit the site ↗</a><a className="quiet" href="project-canterbury-cricket-club.html" data-track="explore-canterbury-cricket-club">Project details →</a></p>
              </div>
              <div className="puzzle"><CipherWheel plain={clubs.canterbury.puzzle.plain} shift={clubs.canterbury.puzzle.shift} /></div>
            </article>
            <div className="sports-grid">
              <article className="sport" aria-labelledby="sport-rsfc">
                <div className="case-art" aria-hidden="true"><Art kind="pitch" /><span className="case-cap">{clubs.rsfc.cap}</span></div>
                <p className="case-kicker">{clubs.rsfc.kicker}</p><h3 id="sport-rsfc">{clubs.rsfc.title}</h3><p className="sport-text">{clubs.rsfc.text}</p>
                <dl className="spec">{clubs.rsfc.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <p className="lab-actions"><a className="btn btn-line" href="https://s3v-xi.vercel.app" {...ext} data-track="open-rsfc-league">Open RSFC League ↗</a><a className="quiet" href="https://github.com/snj3vpaul/s3v-xi" {...ext} data-track="rsfc-league-github">Code on GitHub ↗</a></p>
              </article>
              <article className="sport" aria-labelledby="sport-journey">
                <div className="case-art" aria-hidden="true"><Art kind="globe" /><span className="case-cap">{clubs.journey.cap}</span></div>
                <p className="case-kicker">{clubs.journey.kicker}</p><h3 id="sport-journey">{clubs.journey.title}</h3><p className="sport-text">{clubs.journey.text}</p>
                <dl className="spec">{clubs.journey.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <blockquote className="sport-note"><p>{clubs.journey.note}</p></blockquote>
                <p className="sport-pending">In progress — case study coming</p>
              </article>
            </div>
          </section>
        </PersonalBand>

        <div className="editorial">
          {/* Journey */}
          <span className="anchor" id="experience" aria-hidden="true" />
          <section className="sec" id="journey" data-chapter-name="Journey" aria-labelledby="journey-title">
            <header className="sec-head">
              <Label n="06">Along the way</Label>
              <h2 id="journey-title" data-reveal>Not quite a <em>straight line.</em></h2>
              <p className="sec-lead" data-reveal>{journey.lead}</p>
            </header>
            <ol className="timeline" data-timeline>
              {journey.steps.map(s => <li key={s.when} data-reveal><p className="tl-when">{s.when}</p><div><h3>{s.title}</h3><p className="tl-org">{s.org}</p>{s.line && <p>{s.line}</p>}</div></li>)}
            </ol>
            <div className="creds">
              <p className="sub-label">Credentials</p>
              <dl className="spec spec-lg">{journey.creds.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <p className="creds-foot">Credentials are useful. Curiosity matters more. <a className="quiet" href="cv.pdf" {...ext} data-track="resume-journey">Full résumé ↗</a></p>
            </div>
          </section>

          {/* Writing */}
          <section className="sec" id="writing" data-chapter-name="Writing" aria-labelledby="writing-title">
            <header className="sec-head">
              <Label n="07">Field notes</Label>
              <h2 id="writing-title" data-reveal>Thinking <em>out loud.</em></h2>
              <a className="quiet sec-side" href={profile.links.medium} {...ext}>All writing ↗</a>
            </header>
            <ul className="entries">{writing.map(w => <li key={w.href}><a href={w.href} {...ext}><small>{w.meta}</small><strong>{w.title} ↗</strong></a></li>)}</ul>
          </section>

          {/* Life */}
          <span className="anchor" id="outside" aria-hidden="true" />
          <section className="sec outside" id="life" data-chapter-name="Life" aria-labelledby="life-title">
            <header className="sec-head"><Label n="08">Away from the desk</Label><h2 id="life-title" data-reveal>A different kind of <em>field.</em></h2></header>
            <div className="life">
              <p className="lead" data-reveal>{life.lead}</p>
              <figure className="field-card" data-reveal><figcaption className="sub-label">What the game gives back</figcaption><p className="field-words">Patience. Timing. <em>Perspective.</em></p><p className="muted">Team sport, community, and a different kind of field awareness.</p></figure>
              <p className="link-row"><a className="quiet" href={profile.links.cricket} {...ext}>A little cricket proof ↗</a><a className="quiet" href={profile.links.club} {...ext}>The club website ↗</a></p>
            </div>
            <p className="interests" aria-label="Interests">{life.interests.map(i => <span key={i}>{i}</span>)}</p>
          </section>

          {/* On the field */}
          <section className="sec onfield" id="field" data-chapter-name="On the field" aria-labelledby="field-title">
            <header className="sec-head"><Label>On the field</Label><h2 id="field-title" data-reveal>A few good <em>seasons.</em></h2><p className="sec-lead" data-reveal>{field.lead}</p></header>
            <Reel />
            <div className="carry"><p className="sub-label">What carries over</p><dl className="spec spec-lg">{field.carry.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
          </section>
        </div>

        {/* Contact */}
        <section className="sec contact" id="contact" data-chapter-name="Let’s talk" aria-labelledby="contact-title">
          <p className="sec-label">Have something in mind?</p>
          <h2 id="contact-title" data-reveal>Let’s make it <em>provable.</em></h2>
          <p className="lead" data-reveal>{contact.lead}</p>
          <p className="contact-email">{profile.email}</p>
          <div className="contact-actions">
            <Magnetic href={`mailto:${profile.email}?subject=Hello%20Sanjeev`} track="contact-email">Email me</Magnetic>
            <button type="button" className="btn btn-line btn-lg" id="copy-email" data-email={profile.email} data-track="contact-copy" hidden>Copy email</button>
            <a className="quiet" href={profile.links.linkedin} {...ext} data-track="linkedin-contact">LinkedIn ↗</a>
            <a className="quiet" href={profile.links.github} {...ext}>GitHub ↗</a>
          </div>
          <p className="copy-feedback" id="copy-feedback" role="status" aria-live="polite" />
        </section>
      </main>

      <footer className="site-footer">
        <span className="foot-mark">sanjeev.</span>
        <span>Compliance Analyst · Fortinet · Ottawa</span>
        <span className="footer-time" data-js-only hidden>Ottawa local time <span data-clock /></span>
        <span className="footer-links"><a href={profile.links.linkedin} {...ext}>LinkedIn ↗</a><a href={profile.links.github} {...ext}>GitHub ↗</a><a href={profile.links.medium} {...ext}>Writing ↗</a></span>
        <span>© 2026 Sanjeev K Paul</span>
      </footer>
      <Enhancements />
    </Providers>
  );
}
