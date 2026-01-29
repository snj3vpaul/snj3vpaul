// src/sections/ProjectsSection.tsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { container, item, fadeUp, fade } from "../animations/motionPresets";
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
    links: [{ label: "Read Publication", url: "https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf" }],
  },
];

/* =========================
   UI Bits
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
  item: impact,
  onOpen,
}: {
  item: ImpactItem;
  onOpen: (item: ImpactItem) => void;
}) {
  return (
    <motion.article
      className={`psCard ${impact.featured ? "isFeatured" : ""}`}
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <div className="psCardTop">
        <Badge type={impact.type} />
        {impact.featured ? <span className="psFeatured">Featured</span> : null}
      </div>

      <h3 className="psTitle">{impact.title}</h3>
      {impact.subtitle ? <div className="psSubtitle">{impact.subtitle}</div> : null}

      <p className="psSummary">{impact.summary}</p>

      {impact.tags?.length ? (
        <div className="psTags" aria-label="Tags">
          {impact.tags.map((t) => (
            <span key={t} className="psTag">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="psCardFooter">
        <button className="psDetailsBtn" type="button" onClick={() => onOpen(impact)}>
          Details
        </button>

        {impact.links?.[0] ? (
          <ExternalLink href={impact.links[0].url}>{impact.links[0].label}</ExternalLink>
        ) : (
          <span className="psLink psLink--muted">No link</span>
        )}
      </div>
    </motion.article>
  );
}

function Modal({
  open,
  item: modalItem,
  onClose,
}: {
  open: boolean;
  item: ImpactItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && modalItem ? (
        <motion.div
          className="psModalOverlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="psModal"
            onMouseDown={(e) => e.stopPropagation()}
            role="document"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="psModalHeader">
              <div className="psModalHeaderLeft">
                <Badge type={modalItem.type} />
                {modalItem.featured ? <span className="psFeatured">Featured</span> : null}
              </div>
              <button className="psModalClose" type="button" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <h3 className="psModalTitle">{modalItem.title}</h3>
            {modalItem.subtitle ? <div className="psSubtitle">{modalItem.subtitle}</div> : null}

            <p className="psSummary">{modalItem.summary}</p>

            {modalItem.highlights?.length ? (
              <div className="psHighlights">
                <div className="psHighlightsTitle">Highlights</div>
                <ul>
                  {modalItem.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {modalItem.tags?.length ? (
              <div className="psTags" aria-label="Tags">
                {modalItem.tags.map((t) => (
                  <span key={t} className="psTag">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {modalItem.links?.length ? (
              <div className="psLinksBlock">
                {modalItem.links.map((l) => (
                  <ExternalLink key={l.url} href={l.url}>
                    {l.label}
                  </ExternalLink>
                ))}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
    return [...base].sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return a.title.localeCompare(b.title);
    });
  }, [filter]);

  return (
    <section id="projects" className="psSection">
      <motion.header
        className="psHeader"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
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
      </motion.header>

      <motion.div
        className="psGrid"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      >
        {visible.map((it) => (
          <ImpactCard key={it.id} item={it} onOpen={setOpenItem} />
        ))}
      </motion.div>

      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Modal open={!!openItem} item={openItem} onClose={() => setOpenItem(null)} />
      </motion.div>
    </section>
  );
}
