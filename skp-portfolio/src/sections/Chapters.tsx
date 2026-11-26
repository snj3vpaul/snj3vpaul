import { useEffect, useRef, useState } from 'react';
import { WORK, CASES, PROJECTS_LEAD, APPROACH, BEYOND, CONTACT, EMAIL, MAILTO, LINKS, type Case } from '@/content';
import { Art } from '@/components/Art';
import { Split, useReveal, useDraw } from '@/components/fx';
import { gsap, prefersReducedMotion, useIsoLayoutEffect, track } from '@/lib/env';

const Mark = ({ s }: { s: 'valid' | 'pending' | 'lead' }) => <span className={`mark mark-${s}`} aria-hidden="true" />;

function ChapterHead({ n, label, id, children, aside }: { n: string; label: string; id: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <header className="chapter-head">
      <p className="label chapter-label"><span className="chapter-n">{n}</span>{label}</p>
      <Split className="h-display" id={id}>{children}</Split>
      {aside && <div className="chapter-aside" data-reveal>{aside}</div>}
    </header>
  );
}

/* ================= 2 · Selected professional work ================= */
export function Work() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter work" id="work" aria-labelledby="work-title" ref={ref}>
      <span className="anchor" id="professional-work" aria-hidden="true" /><span className="anchor" id="impact" aria-hidden="true" />
      <ChapterHead n="01" label="Selected professional work · Fortinet" id="work-title" aside={<p className="lede">{WORK.lead}</p>}>
        Work that had to be <em>proven.</em>
      </ChapterHead>

      <dl className="figures" aria-label="On the record">
        {WORK.metrics.map(m => <div key={m.v} data-reveal><dt>{m.l}</dt><dd>{m.v}</dd></div>)}
      </dl>

      <ol className="ledger">
        {WORK.modules.map((m, i) => (
          <li className="ledger-row" id={m.id} key={m.id} data-reveal>
            <p className="ledger-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
            <div className="ledger-main">
              <h3>{m.title}</h3>
              <p className="ledger-status"><Mark s={m.status} />{m.statusText}</p>
            </div>
            <div className="ledger-cols">
              <div>
                <p className="label">My part</p>
                <p className="ledger-mine">{m.mine}</p>
              </div>
              <div>
                <p className="label">The module</p>
                <dl className="kv">{m.module.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </div>
            </div>
            <p className="ledger-links">{m.links.map(l => (
              <a key={l.href} className="link-arrow" href={l.href} data-track={'track' in l ? l.track : undefined} {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.text}</a>
            ))}</p>
          </li>
        ))}
      </ol>
      <p className="footnote" data-reveal>{WORK.note}</p>
    </section>
  );
}

/* ================= 3 · Independent projects: six editorial case studies ================= */
function CaseStudy({ c, i }: { c: Case; i: number }) {
  return (
    <article className={`case${i % 2 ? ' is-flip' : ''}`} id={c.id} aria-labelledby={`${c.id}-title`}>
      <figure className="case-plate" data-reveal aria-hidden="true">
        {c.visual.poster ? <img src={c.visual.poster} alt="" loading="lazy" decoding="async" width="600" height="560" /> : <Art name={c.visual.art!} />}
        <figcaption className="label">{c.visual.cap}</figcaption>
      </figure>
      <div className="case-text">
        <header className="case-head" data-reveal>
          <p className="label"><span className="chapter-n">{String(i + 1).padStart(2, '0')}</span>{c.kind}</p>
          <h3 id={`${c.id}-title`}>{c.title}</h3>
          <dl className="case-meta">
            <div><dt>Status</dt><dd>{c.status}</dd></div>
            <div><dt>Built with</dt><dd>{c.stack}</dd></div>
          </dl>
        </header>
        <dl className="case-body" data-reveal>
          <div><dt className="label">Context</dt><dd>{c.context}</dd></div>
          <div><dt className="label">Problem</dt><dd>{c.problem}</dd></div>
          <div><dt className="label">My contribution</dt><dd>{c.contribution}</dd></div>
          <div><dt className="label">Implementation</dt><dd>{c.implementation}</dd></div>
          <div><dt className="label">Outcome</dt><dd>{c.outcome}{c.quote && <q className="case-quote">{c.quote}</q>}</dd></div>
        </dl>
        {c.links.length > 0 && <p className="case-links" data-reveal>{c.links.map(l => (
          <a key={l.href} className="link-arrow" href={l.href} data-track={l.track} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.text}</a>
        ))}</p>}
      </div>
    </article>
  );
}
export function Projects() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref); useDraw(ref);
  /* plates rise a few pixels slower than the text: one quiet layer of depth, nothing more */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.utils.toArray<HTMLElement>('.case-plate', ref.current!).forEach(p => {
        gsap.fromTo(p, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="chapter projects" id="projects" aria-labelledby="projects-title" ref={ref}>
      <span className="anchor" id="personal-projects" aria-hidden="true" /><span className="anchor" id="sports" aria-hidden="true" />
      <ChapterHead n="02" label="Independent projects" id="projects-title" aside={<>
        <p className="lede">{PROJECTS_LEAD}</p>
        <nav className="case-index" aria-label="Case studies"><ol>{CASES.map((c, i) => <li key={c.id}><a href={`#${c.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{c.title}</a></li>)}</ol></nav>
      </>}>
        Things I’ve <em>built.</em>
      </ChapterHead>
      <div className="cases">{CASES.map((c, i) => <CaseStudy key={c.id} c={c} i={i} />)}</div>
    </section>
  );
}

/* ================= 4 · Approach & career journey ================= */
export function Approach() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter approach tone-dark" id="approach" aria-labelledby="approach-title" ref={ref}>
      <span className="anchor" id="practice" aria-hidden="true" />
      <div className="tone-inner">
        <ChapterHead n="03" label="Approach & journey" id="approach-title" aside={<p className="lede">{APPROACH.lead}</p>}>
          {APPROACH.title[0]}<em>{APPROACH.title[1]}</em>
        </ChapterHead>
        <ol className="principles">
          {APPROACH.principles.map((p, i) => (
            <li key={p.t} data-reveal><span className="principle-n" aria-hidden="true">{['i', 'ii', 'iii'][i]}</span><h3>{p.t}</h3><p>{p.p}</p></li>
          ))}
        </ol>
        <div className="journey" id="journey" aria-labelledby="journey-title">
          <span className="anchor" id="experience" aria-hidden="true" />
          <div className="journey-intro" data-reveal>
            <h3 className="label" id="journey-title">Along the way</h3>
            <p>{APPROACH.journeyLead}</p>
          </div>
          <ol className="timeline">
            {APPROACH.path.map(p => <li key={p.years} data-reveal><span className="tl-years">{p.years}</span><span className="tl-role">{p.role}</span><span className="tl-org">{p.org}</span></li>)}
          </ol>
          <div className="creds" data-reveal>
            <h3 className="label">Credentials</h3>
            <ul>{APPROACH.creds.map(([k, v]) => <li key={k}><strong>{k}</strong><span>{v}</span></li>)}</ul>
            <p className="creds-note">{APPROACH.credsNote} <a className="link-arrow" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-journey">Full résumé ↗</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= 5 · Beyond work ================= */
export function Beyond() {
  const ref = useRef<HTMLElement>(null);
  const [all, setAll] = useState(false);
  useReveal(ref);
  return (
    <section className="chapter beyond" id="beyond" aria-labelledby="beyond-title" ref={ref}>
      {['life', 'about', 'outside', 'hello'].map(a => <span className="anchor" id={a} key={a} aria-hidden="true" />)}
      <ChapterHead n="04" label="Beyond work" id="beyond-title" aside={<p className="lede">{BEYOND.lead}</p>}>
        A different kind of <em>field.</em>
      </ChapterHead>

      <div className="spread">
        <div className="spread-cricket" id="cricket">
          <span className="anchor" id="field" aria-hidden="true" />
          <h3 className="label" data-reveal>Cricket, mostly</h3>
          <dl className="highlights">
            {BEYOND.highlights.map(h => <div key={h.v} data-reveal><dt>{h.l}</dt><dd>{h.v}</dd></div>)}
          </dl>
          <div className="scorebook" data-reveal>
            <ol className={all ? 'is-all' : ''} id="scorebook-list">
              {BEYOND.scorebook.map(([y, t], i) => <li key={i}><span>{y}</span>{t}</li>)}
            </ol>
            <button type="button" className="text-button" aria-expanded={all} aria-controls="scorebook-list" onClick={() => setAll(a => !a)}>{all ? 'Show fewer seasons' : 'The full scorebook'}</button>
          </div>
          <p className="spread-links" data-reveal>{BEYOND.links.map(l => <a key={l.href} className="link-arrow" href={l.href} target="_blank" rel="noopener noreferrer">{l.text}</a>)}</p>
        </div>

        <aside className="spread-side">
          <blockquote className="pullquote" data-reveal>
            <p>{BEYOND.line.map((w, i) => <span key={w}>{i === 2 ? <em>{w}</em> : w} </span>)}</p>
            <footer>{BEYOND.lineNote}</footer>
          </blockquote>
          <div className="carry" data-reveal>
            <h3 className="label">What carries over</h3>
            <dl>{BEYOND.carry.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </aside>

        <div className="spread-writing" id="writing" data-reveal>
          <h3 className="label">Writing</h3>
          <ul>{BEYOND.writing.map(w => <li key={w.href}><a href={w.href} target="_blank" rel="noopener noreferrer"><span className="w-meta">{w.meta}</span><span className="w-title">{w.title}</span><span aria-hidden="true">↗</span></a></li>)}</ul>
        </div>
        <div className="spread-also" data-reveal>
          <h3 className="label">Also</h3>
          <p>{BEYOND.also.join(', ')}.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= 6 · Contact ================= */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [fb, setFb] = useState('');
  useReveal(ref);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setFb('Copied to your clipboard.'); track('contact-copy-success'); }
    catch { setFb(`Copy didn’t work here. The address is ${EMAIL}.`); }
    setTimeout(() => setFb(''), 4000);
  };
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { track('contact-section-view'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <section className="chapter contact tone-dark" id="contact" aria-labelledby="contact-title" ref={ref}>
      <div className="tone-inner">
        <p className="label chapter-label"><span className="chapter-n">05</span>{CONTACT.label}</p>
        <Split as="h2" className="h-display h-closing" id="contact-title">{CONTACT.title[0]}<em>{CONTACT.title[1]}</em></Split>
        <div className="contact-grid">
          <p className="lede" data-reveal>{CONTACT.lead}</p>
          <div className="contact-actions" data-reveal>
            <p className="contact-email"><a href={MAILTO} data-track="contact-email-text">{EMAIL}</a></p>
            <p className="contact-row">
              <a className="btn" href={MAILTO} data-track="contact-email">Write to me</a>
              <button type="button" className="btn btn-quiet" id="copy-email" data-track="contact-copy" onClick={copy}>Copy address</button>
            </p>
            <p className="copy-feedback" role="status" aria-live="polite">{fb}</p>
            <ul className="contact-links">
              <li><a className="link-arrow" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" data-track="linkedin-contact">LinkedIn ↗</a></li>
              <li><a className="link-arrow" href={LINKS.github} target="_blank" rel="noopener noreferrer" data-track="github-header">GitHub ↗</a></li>
              <li><a className="link-arrow" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-contact">Résumé (PDF) ↗</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="colophon tone-dark">
      <div className="tone-inner colophon-inner">
        <span className="colophon-mark">Sanjeev K Paul</span>
        <span>Compliance Analyst · Fortinet · Ottawa</span>
        <span>Set in Instrument Serif and Hanken Grotesk</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
