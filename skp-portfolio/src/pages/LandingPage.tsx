import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { caseStudies, certifications, education, experience, profile, publications } from '../data/portfolio';
import type { CaseStudy } from '../data/portfolio';
import { hybridContent } from '../data/hybridContent';
import ClosingNote from "../sections/ClosingNote";
const isExternal = (value: string) => /^https?:\/\//i.test(value);

function SectionHeading({ index, label, title, text, headingId }: { index: string; label: string; title: string; text?: string; headingId: string }) {
  return <div className="hyb-section-head reveal">
    <span className="hyb-kicker">{index} / {label}</span>
    <div><h2 id={headingId}>{title}</h2>{text && <p>{text}</p>}</div>
  </div>;
}

function HeroImage() {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <figure className="hyb-hero-art">
      <div className="hyb-portrait-frame">
        {!imageFailed ? (
          <img src="/portrait.webp" alt="Sanjeev, photographed in Ottawa" onError={() => setImageFailed(true)} fetchPriority="high" />
        ) : (
          <div className="hyb-photo-empty">Portrait unavailable</div>
        )}
      </div>
      <figcaption className="hyb-portrait-caption">
        <span>01 — OFF THE RÉSUMÉ</span>
        <p>You'll often find me around a cricket ground. The score matters; the people and the stories stay longer.</p>
        <a href="https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS" target="_blank" rel="noopener noreferrer">My cricket record ↗</a>
      </figcaption>
    </figure>
  );
}

function Hero() {
  return <section className="hyb-hero" id="home" aria-labelledby="hyb-home-heading">
    <div className="hyb-container hyb-hero-grid">
      <div className="hyb-hero-copy">
        <div className="hyb-kicker">{hybridContent.strapline}</div>
        <p className="hyb-greeting">{hybridContent.greeting}</p>
        <h1 id="hyb-home-heading"><span>Sanjeev</span><span><em>Paul.</em></span></h1>
        <p className="hyb-hero-statement">{hybridContent.intro}</p>
        <p className="hyb-hero-aside">{hybridContent.introAside}</p>
        <div className="hyb-hero-actions">
          <a className="hyb-button" href="#work">Explore my work <span aria-hidden="true">↗</span></a>
          <a className="hyb-text-link" href="#story">A little about me →</a>
        </div>

      </div>
      <HeroImage />
    </div>
  </section>;
}

function ProjectCard({ project, index }: { project: CaseStudy; index: number }) {
  const independent = project.badges.includes('Product');
  return (
    <article className={`hyb-project${index === 0 ? ' hyb-project-featured' : ''}`}>
      <div className="hyb-project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="hyb-project-main">
        <p className="hyb-project-category">{independent ? 'Independent work' : 'Security assurance'} · {project.role}</p>
        <h3>{project.title}</h3>
        <p className="hyb-project-tag">{project.tag}</p>
        <details className="hyb-disclosure">
          <summary><span>What I worked on</span><span className="hyb-detail-indicator" aria-hidden="true">+</span></summary>
          <div className="hyb-disclosure-body">
            <p>{project.summary}</p>
            {project.contribution && <p className="hyb-project-contribution"><strong>My contribution</strong> {project.contribution}</p>}
            {!!project.snapshot?.length && <dl className="hyb-facts">{project.snapshot.map(f => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}</dl>}
            {!!project.metrics?.length && <dl className="hyb-facts">{project.metrics.map(m => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl>}
            {!!project.links.length && <div className="hyb-case-links">{project.links.map(link => <a key={link.url} href={link.url} target={isExternal(link.url) ? '_blank' : undefined} rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}>{link.label} ↗</a>)}</div>}
          </div>
        </details>
      </div>
      <div className="hyb-project-outcome">
        {project.status ? <span className={`hyb-status hyb-status--${project.status.kind}`}>{project.status.label}</span> : <span>Project work</span>}
      </div>
    </article>
  );
}

type WorkFilter = 'all' | 'security' | 'independent';
const projectIsIndependent = (project: CaseStudy) => project.badges.includes('Product');

function SelectedWork() {
  const [filter, setFilter] = useState<WorkFilter>('all');
  // Keep all original data and statuses; filtering affects presentation only.
  const visible = caseStudies.filter(project => filter === 'all' ||
    (filter === 'independent' ? projectIsIndependent(project) : !projectIsIndependent(project)));
  const categories: { key: WorkFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All work', count: caseStudies.length },
    { key: 'security', label: 'Security & validation', count: caseStudies.filter(project => !projectIsIndependent(project)).length },
    { key: 'independent', label: 'Independent builds', count: caseStudies.filter(projectIsIndependent).length },
  ];
  return <section className="hyb-section hyb-work" id="work" aria-labelledby="hyb-work-heading">
    <div className="hyb-container">
      <SectionHeading headingId="hyb-work-heading" index="01" label="SELECTED WORK" title="A record of the work." text={hybridContent.workIntro}/>
      <div className="hyb-filter-bar" role="group" aria-label="Filter project case studies">
        {categories.map(category => <button key={category.key} type="button"
          aria-pressed={filter === category.key}
          className={`hyb-filter${filter === category.key ? ' is-active' : ''}`}
          onClick={() => setFilter(category.key)}>
          {category.label} <span>{category.count}</span>
        </button>)}
      </div>
      <div className="hyb-project-grid" aria-live="polite" aria-relevant="additions removals">
        {visible.map(project => <ProjectCard key={project.id} project={project} index={caseStudies.indexOf(project)} />)}
      </div>
    </div>
  </section>;
}

function MyStory() {
  return <section className="hyb-section hyb-story" id="story" aria-labelledby="hyb-story-heading">
    <div className="hyb-container hyb-story-grid">
      <div><span className="hyb-kicker">02 / FROM THERE TO HERE</span><h2 id="hyb-story-heading">{hybridContent.journeyTitle}</h2></div>
      <div className="hyb-story-body">{hybridContent.journey.map(text => <p key={text}>{text}</p>)}</div>
    </div>
  </section>;
}

function Experience() {
  return <section className="hyb-section" id="experience" aria-labelledby="hyb-experience-heading">
    <div className="hyb-container"><SectionHeading headingId="hyb-experience-heading" index="03" label="EXPERIENCE" title="What changed along the way." text="Career progression and contributions that shaped how I approach security and technical work."/>
      <div className="hyb-experience-list">
        {experience.map((job, index) => <article className="hyb-experience-row" key={`${job.org}-${job.title}-${index}`}>
          <span className="hyb-kicker">{job.when}</span><div><h3>{job.title}</h3><span>{job.org}</span><p>{job.body}</p></div>
        </article>)}
      </div>
    </div>
  </section>;
}

function Practice() {
  return <section className="hyb-section hyb-practice" id="practice" aria-labelledby="hyb-practice-heading">
    <div className="hyb-container">
      <SectionHeading headingId="hyb-practice-heading" index="04" label="WORKING METHODS" title={hybridContent.practiceTitle} text={hybridContent.practiceIntro} />
      <div className="hyb-capability-index">
        {hybridContent.practice.map((group, i) => (
          <div className="hyb-capability" key={group.title}>
            <span className="hyb-capability-number">{String(i + 1).padStart(2, '0')}</span>
            <div><h3>{group.title}</h3><p>{group.description}</p></div>
            <div className="hyb-capability-skills">{group.skills.join(' / ')}</div>
          </div>
        ))}
      </div>
    </div>
  </section>;
}

type DiaryItem = (typeof hybridContent.diary)[number];
function DiaryTile({ item, onOpen }: { item: DiaryItem; onOpen: (item: DiaryItem) => void }) {
  const [failed, setFailed] = useState(false);
  return <figure className={`hyb-diary-tile hyb-diary-${item.size}`}>
    <button type="button" className="hyb-diary-image hyb-diary-open" onClick={() => onOpen(item)}
      aria-label={`Open ${item.title} journal note`}>
      {!failed && !item.illustration && item.image ? (
        <img src={item.image} loading="lazy" alt={item.title} onError={() => setFailed(true)} />
      ) : (
        <span className="hyb-diary-empty"><small>{item.eyebrow}</small>{item.title}<em>A note from life away from work.</em></span>
      )}
      <span className="hyb-diary-view" aria-hidden="true">Open note ↗</span>
    </button>
    <figcaption><span className="hyb-kicker">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.body}</p>{'href' in item && item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">My CricHeroes profile ↗</a>}</figcaption>
  </figure>;
}

function Diary() {
  const [selected, setSelected] = useState<DiaryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  return <section className="hyb-section hyb-life" id="life" aria-labelledby="hyb-life-heading">
    <div className="hyb-container">
      <SectionHeading headingId="hyb-life-heading" index="05" label="THE OTHER HALF" title={hybridContent.diaryTitle} text={hybridContent.diaryIntro}/>
      <div className="hyb-diary-grid">{hybridContent.diary.map(item => <DiaryTile item={item} key={item.id} onOpen={setSelected}/>)}</div>
      <div className="hyb-notes"><span className="hyb-kicker">AND ALSO…</span><div>{hybridContent.smallNotes.map(note => <span key={note}>{note}</span>)}</div></div>
      <details className="hyb-kitchen-note">
        <summary><span className="hyb-kicker">FROM THE KITCHEN</span><strong>{hybridContent.kitchenTitle}</strong><span aria-hidden="true">+</span></summary>
        <p>{hybridContent.kitchenText}</p>
      </details>
    </div>
    <dialog ref={dialogRef} className="hyb-diary-dialog" onClose={() => setSelected(null)}
      aria-labelledby="hyb-dialog-title" onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      {selected && <div className="hyb-diary-dialog-inner">
        <button type="button" className="hyb-dialog-close" onClick={() => dialogRef.current?.close()} aria-label="Close journal note">Close ×</button>
        {!selected.illustration && selected.image && <div className="hyb-dialog-picture"><img src={selected.image} alt={selected.title} /></div>}
        <div className="hyb-dialog-copy"><span className="hyb-kicker">{selected.eyebrow}</span>
          <h3 id="hyb-dialog-title">{selected.title}</h3><p>{selected.body}</p>
          {'href' in selected && selected.href && <a href={selected.href} target="_blank" rel="noopener noreferrer">See my CricHeroes profile ↗</a>}
        </div>
      </div>}
    </dialog>
  </section>;
}

function Writing() {
  return <section className="hyb-section hyb-writing-section" id="writing" aria-labelledby="hyb-writing-heading"><div className="hyb-container">
    <SectionHeading headingId="hyb-writing-heading" index="06" label="READING & WRITING" title="Things I've put into words." text={hybridContent.writingIntro}/>
    <div className="hyb-writing-index">
      {publications.filter(p => !!p.url).map(p => <a className="hyb-writing-entry" key={p.title} href={p.url} target="_blank" rel="noopener noreferrer">
        <span className="hyb-writing-meta">{p.year} / Research</span><span className="hyb-writing-title">{p.title}</span><span className="hyb-writing-arrow" aria-hidden="true">↗</span>
      </a>)}
      <a className="hyb-writing-entry" href={profile.links.medium} target="_blank" rel="noopener noreferrer">
        <span className="hyb-writing-meta">Ongoing / Notes</span><span className="hyb-writing-title">Security questions and other things I've been writing about.</span><span className="hyb-writing-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  </div></section>;
}

function Credentials() {
  return <section className="hyb-section hyb-credentials" id="credentials" aria-label="Education and professional certifications"><div className="hyb-container">
    <div className="hyb-credential-grid">
      <div><span className="hyb-kicker">07 / EDUCATION</span>{education.map(item => <div className="hyb-credential-item" key={item.title}><strong>{item.title}</strong><span>{item.year}</span></div>)}</div>
      <div><span className="hyb-kicker">CERTIFICATIONS</span>{certifications.map(item => <div className="hyb-credential-item" key={item.title}><strong>{item.title}</strong><span>{item.year}</span></div>)}</div>
    </div>
  </div></section>;
}

export default function LandingPage() {
  useReveal();

  return (
    <div className="hyb">
      <main>
        <Hero />
        <SelectedWork />
        <MyStory />
        <Experience />
        <Practice />
        <Diary />
        <Writing />
        <Credentials />
        <ClosingNote />
      </main>

      <footer className="hyb-footer">
        <div className="hyb-container">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            Work, life, and everything in between.
          </span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
