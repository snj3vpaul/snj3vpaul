// src/sections/ProjectsSection.tsx
"use client";

import { useMemo, useState } from "react";
import "./ProjectsSection.css";

/* =========================
   Types
========================= */
type ImpactType = "project" | "publication" | "achievement";

type LinkItem = { label: string; url: string };

type ImpactItem = {
  id: string;
  type: ImpactType;
  title: string;
  subtitle?: string;
  summary: string;
  highlights?: string[];
  tags?: string[];
  links?: LinkItem[];
  featured?: boolean;
};

const TYPE_LABEL: Record<ImpactType, string> = {
  project: "Project",
  publication: "Publication",
  achievement: "Achievement",
};

const FILTERS: Array<{ key: "all" | ImpactType; label: string }> = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "publication", label: "Publications" },
  { key: "achievement", label: "Achievements" },
];

/* =========================
   Data (edit here)
========================= */
const ITEMS: ImpactItem[] = [
  {
    id: "canterbury-club-site",
    type: "project",
    featured: true,
    title: "Canterbury Cricket Club Website — React Build",
    subtitle: "AI-assisted development • Secure data handling",
    summary:
      "Built and shipped a modern club website using React with reusable components, structured content/data models, and defensive input handling for public-facing forms.",
    highlights: [
      "Component-driven UI with scalable data structure",
      "Hardened contact form patterns (validation + safe rendering)",
      "Performance-minded build (lean assets, clean layout)",
    ],
    tags: ["React", "Security", "Data Handling", "UI Components"],
    links: [{ label: "Live Site", url: "https://canterburycricketclub.com" }],
  },
  {
    id: "sok-iphone-secure",
    type: "publication",
    title: "SoK: Is iPhone Actually Secure?",
    subtitle: "Systematization of Knowledge (SoK)",
    summary:
      "A structured analysis of iPhone security posture—threat models, platform controls, practical limitations, and actionable takeaways for defenders.",
    highlights: [
      "Threat-model driven security assessment",
      "Mapped controls to real-world attack surfaces",
      "Clear takeaways for users and defenders",
    ],
    tags: ["Mobile Security", "Threat Modeling", "SoK", "iOS"],
    links: [{ label: "Read Publication", url: "#" }],
  },

  // Add more items here as you go
];

/* =========================
   UI Bits (same file)
========================= */
function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`psChip ${active ? "isActive" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Badge({ type }: { type: ImpactType }) {
  return <span className={`psBadge psBadge--${type}`}>{TYPE_LABEL[type]}</span>;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <a
      className="psLink"
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
    >
      {children}
      <span className="psLinkArrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function ImpactCard({
  item,
  onOpen,
}: {
  item: ImpactItem;
  onOpen: (item: ImpactItem) => void;
}) {
  return (
    <article className={`psCard ${item.featured ? "isFeatured" : ""}`}>
      <div className="psCardTop">
        <Badge type={item.type} />
        {item.featured ? <span className="psFeatured">Featured</span> : null}
      </div>

      <h3 className="psTitle">{item.title}</h3>
      {item.subtitle ? <div className="psSubtitle">{item.subtitle}</div> : null}

      <p className="psSummary">{item.summary}</p>

      {item.tags?.length ? (
        <div className="psTags" aria-label="Tags">
          {item.tags.map((t) => (
            <span key={t} className="psTag">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="psCardFooter">
        <button className="psDetailsBtn" type="button" onClick={() => onOpen(item)}>
          Details
        </button>

        {item.links?.[0] ? (
          <ExternalLink href={item.links[0].url}>{item.links[0].label}</ExternalLink>
        ) : (
          <span className="psLink psLink--muted">No link</span>
        )}
      </div>
    </article>
  );
}

function Modal({
  open,
  item,
  onClose,
}: {
  open: boolean;
  item: ImpactItem | null;
  onClose: () => void;
}) {
  if (!open || !item) return null;

  return (
    <div className="psModalOverlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div
        className="psModal"
        onMouseDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="psModalHeader">
          <div className="psModalHeaderLeft">
            <Badge type={item.type} />
            {item.featured ? <span className="psFeatured">Featured</span> : null}
          </div>
          <button className="psModalClose" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <h3 className="psModalTitle">{item.title}</h3>
        {item.subtitle ? <div className="psSubtitle">{item.subtitle}</div> : null}

        <p className="psSummary">{item.summary}</p>

        {item.highlights?.length ? (
          <div className="psHighlights">
            <div className="psHighlightsTitle">Highlights</div>
            <ul>
              {item.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.tags?.length ? (
          <div className="psTags" aria-label="Tags">
            {item.tags.map((t) => (
              <span key={t} className="psTag">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {item.links?.length ? (
          <div className="psLinksBlock">
            {item.links.map((l) => (
              <ExternalLink key={l.url} href={l.url}>
                {l.label}
              </ExternalLink>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   Main Section
========================= */
export default function ProjectsSection() {
  const [filter, setFilter] = useState<"all" | ImpactType>("all");
  const [openItem, setOpenItem] = useState<ImpactItem | null>(null);

  const visible = useMemo(() => {
    const base = filter === "all" ? ITEMS : ITEMS.filter((i) => i.type === filter);
    // Featured first (then title)
    return [...base].sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return a.title.localeCompare(b.title);
    });
  }, [filter]);

  return (
    <section id="projects" className="psSection">
      <header className="psHeader">
        <div className="psKicker">Portfolio</div>
        <h2 className="psH2">Selected Work & Achievements</h2>
        <p className="psSub">
          A focused set of projects and publications that reflect secure delivery,
          clean engineering, and real outcomes.
        </p>

        <div className="psFilters" role="tablist" aria-label="Project filters">
          {FILTERS.map((f) => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </header>

      <div className="psGrid">
        {visible.map((item) => (
          <ImpactCard key={item.id} item={item} onOpen={setOpenItem} />
        ))}
      </div>

      <Modal open={!!openItem} item={openItem} onClose={() => setOpenItem(null)} />
    </section>
  );
}
