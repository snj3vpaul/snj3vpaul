// src/sections/About/AboutSection.tsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { container, item, fadeUp, fade } from "../animations/motionPresets";
import "./AboutSection.css";

type AboutSectionProps = {
  id?: string;
  name?: string;
  title?: string;
  highlight?: {
    label: string;
    title: string;
    description: string;
  };
};

type Skill = {
  key: string;
  label: string;
  vibe: "writing" | "testing" | "crypto" | "network" | "security";
  why: string;
};

type AccKey = "work" | "highlight";

const DEFAULT_SKILLS: Skill[] = [
  {
    key: "tech-writing",
    label: "Technical Writing",
    vibe: "writing",
    why: "Turns complex systems into audit-ready, engineer-friendly clarity.",
  },
  {
    key: "sanity-testing",
    label: "Sanity Testing",
    vibe: "testing",
    why: "Fast confidence checks before deep dives — keeps releases safe and sane.",
  },
  {
    key: "functional-testing",
    label: "Functional Testing",
    vibe: "testing",
    why: "Proves real user flows work end-to-end, not just in theory.",
  },
  {
    key: "cryptography",
    label: "Cryptography",
    vibe: "crypto",
    why: "Understands crypto boundaries, approved modes, and where mistakes hide.",
  },
  {
    key: "network-security",
    label: "Network Security",
    vibe: "network",
    why: "Packet-level thinking: what actually happens on the wire matters.",
  },
  {
    key: "firewall",
    label: "Firewall",
    vibe: "security",
    why: "Policy, segmentation, and posture — security that’s enforceable, not aspirational.",
  },
];

const VIBE_LABEL: Record<Skill["vibe"], string> = {
  writing: "Clarity",
  testing: "Validation",
  crypto: "Crypto",
  network: "Network",
  security: "Security",
};

export default function AboutSection({
  id = "about",
  name = "Sanjeev",
  title = "Cybersecurity & Compliance | Secure Delivery",
  highlight = {
    label: "Professional Highlight",
    title: "FIPS 140-3 (Software Level 1) Validation — VPN Client Solution",
    description:
      "Helped drive a VPN client through strict cryptographic and compliance expectations—verifying behavior in the real world (not just on paper), tightening security posture, and producing audit-ready clarity.",
  },
}: AboutSectionProps) {
  const accordionItems = useMemo(
    () => [
      {
        key: "work" as const,
        kicker: "How I work",
        title: "Test-driven, security-first, audit-clear.",
        body: (
          <>
            <p className="sectionSub aboutWorkCopy">
              I like living in the details: packet flows, edge cases, and the “why” behind security
              requirements. I validate the happy path, chase the weird failures, and document
              systems so engineering and audit stay aligned — without slowing delivery.
            </p>

            <div className="aboutPills" aria-label="Working style">
              <span className="aboutPill">Practical compliance</span>
              <span className="aboutPill">Crisp documentation</span>
              <span className="aboutPill">Reliable validation</span>
            </div>
          </>
        ),
      },
      {
        key: "highlight" as const,
        kicker: highlight.label,
        title: highlight.title,
        body: <p className="sectionSub aboutHighlightDesc">{highlight.description}</p>,
      },
    ],
    [highlight.label, highlight.title, highlight.description]
  );

  const [openKey, setOpenKey] = useState<AccKey>("highlight");

  // Skills playground state
  const [query, setQuery] = useState("");
  const [activeVibe, setActiveVibe] = useState<Skill["vibe"] | "all">("all");
  const [pinned, setPinned] = useState<string[]>(["cryptography", "network-security"]);

  const skills = DEFAULT_SKILLS;

  const filteredSkills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      const matchQ = !q || s.label.toLowerCase().includes(q) || s.why.toLowerCase().includes(q);
      const matchV = activeVibe === "all" ? true : s.vibe === activeVibe;
      return matchQ && matchV;
    });
  }, [skills, query, activeVibe]);

  const pinnedSkills = useMemo(
    () => pinned.map((k) => skills.find((s) => s.key === k)).filter(Boolean) as Skill[],
    [pinned, skills]
  );

  const togglePin = (key: string) => {
    setPinned((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [key, ...prev].slice(0, 4)));
  };

  return (
    <section id={id} className="about" aria-label="About">
      <motion.div
        className="card cardPad aboutCard"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="aboutGlow" aria-hidden="true" />

        <motion.header className="aboutHeader" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12% 0px -12% 0px" }}>
          <motion.p className="sectionSub aboutKicker" variants={item}>
            About
          </motion.p>

          <motion.h2 className="aboutTitle" variants={item}>
            I build secure systems — and I actually enjoy the details.
          </motion.h2>

          <motion.p className="sectionSub aboutIntro" variants={item}>
            I’m {name}. I sit at the intersection of security engineering, testing, and clarity —
            turning complex requirements into secure, shippable outcomes.{" "}
            <span className="aboutMeta">{title}.</span>
          </motion.p>
        </motion.header>

        {/* impact strip */}
        <motion.div
          className="aboutImpact"
          aria-label="Impact summary"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        >
          <motion.div className="aboutImpactItem" variants={item}>
            <span className="aboutImpactTop">Validation</span>
            <span className="aboutImpactBottom">FIPS 140-3 mindset</span>
          </motion.div>
          <motion.div className="aboutImpactItem" variants={item}>
            <span className="aboutImpactTop">Security</span>
            <span className="aboutImpactBottom">VPN + network posture</span>
          </motion.div>
          <motion.div className="aboutImpactItem" variants={item}>
            <span className="aboutImpactTop">Delivery</span>
            <span className="aboutImpactBottom">Docs, tests, clarity</span>
          </motion.div>
        </motion.div>

        {/* main grid: accordion + skills playground */}
        <div className="aboutMainGrid">
          {/* Accordion */}
          <motion.div
            className="aboutAccordion"
            role="list"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          >
            {accordionItems.map((it) => {
              const isOpen = openKey === it.key;
              const btnId = `about-acc-btn-${it.key}`;
              const panelId = `about-acc-panel-${it.key}`;

              return (
                <motion.div
                  key={it.key}
                  className={`aboutAccItem ${isOpen ? "isOpen" : ""}`}
                  role="listitem"
                  variants={item}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    id={btnId}
                    className="aboutAccButton"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(it.key)}
                  >
                    <span className="aboutAccKicker">{it.kicker}</span>
                    <span className="aboutAccTitle">{it.title}</span>
                    <span className={`aboutAccIcon ${isOpen ? "rot" : ""}`} aria-hidden="true">
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="aboutAccPanel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                      >
                        <div className="aboutAccInner">{it.body}</div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Skills Playground */}
          <motion.aside
            className="card aboutSkillsPlay"
            aria-label="Skills playground"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="aboutSkillsTop">
              <div>
                <p className="aboutSkillsKicker">Core skills</p>
                <h3 className="aboutSkillsTitle">Pick a few — I’ll show the “why”.</h3>
              </div>

              <div className="aboutSkillsHint">
                <span className="aboutHintDot" aria-hidden="true" />
                Click chips to pin (max 4)
              </div>
            </div>

            <div className="aboutSkillsControls">
              <div className="aboutSearchWrap">
                <input
                  className="aboutSearch"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills… (e.g. crypto, docs, testing)"
                  aria-label="Search skills"
                />
                {query ? (
                  <button className="aboutClear" type="button" onClick={() => setQuery("")} aria-label="Clear search">
                    ✕
                  </button>
                ) : null}
              </div>

              <div className="aboutVibes" aria-label="Skill filters">
                <button
                  type="button"
                  className={`aboutVibe ${activeVibe === "all" ? "isActive" : ""}`}
                  onClick={() => setActiveVibe("all")}
                >
                  All
                </button>
                {(["writing", "testing", "crypto", "network", "security"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`aboutVibe ${activeVibe === v ? "isActive" : ""}`}
                    onClick={() => setActiveVibe(v)}
                  >
                    {VIBE_LABEL[v]}
                  </button>
                ))}
              </div>
            </div>

            <div className="aboutChips aboutChipsFun" aria-label="Skills">
              {filteredSkills.map((s) => {
                const isPinned = pinned.includes(s.key);
                return (
                  <motion.button
                    key={s.key}
                    type="button"
                    className={`aboutChip aboutChipBtn vibe-${s.vibe} ${isPinned ? "isPinned" : ""}`}
                    onClick={() => togglePin(s.key)}
                    aria-pressed={isPinned}
                    title={isPinned ? "Pinned — click to unpin" : "Click to pin"}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="aboutChipLabel">{s.label}</span>
                    <span className="aboutChipTag" aria-hidden="true">
                      {VIBE_LABEL[s.vibe]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* pinned cards */}
            <div className="aboutPinned">
              <div className="aboutPinnedHead">
                <h4 className="aboutPinnedTitle">Pinned</h4>
                <p className="aboutPinnedSub">Your “skill stack” at a glance.</p>
              </div>

              <AnimatePresence initial={false}>
                {pinnedSkills.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="aboutPinnedEmpty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    Pin a couple skills above — this section will come alive ✨
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    className="aboutPinnedGrid"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                  >
                    {pinnedSkills.map((s) => (
                      <motion.div
                        key={s.key}
                        className={`aboutPinnedCard vibe-${s.vibe}`}
                        variants={item}
                        layout
                      >
                        <div className="aboutPinnedCardTop">
                          <span className="aboutPinnedName">{s.label}</span>
                          <button
                            type="button"
                            className="aboutPinnedX"
                            onClick={() => togglePin(s.key)}
                            aria-label={`Unpin ${s.label}`}
                          >
                            ✕
                          </button>
                        </div>
                        <p className="aboutPinnedWhy">{s.why}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="sectionSub aboutSkillsNote">
              If it touches secure communications, testing discipline, or audit clarity — I’m in.
            </p>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
