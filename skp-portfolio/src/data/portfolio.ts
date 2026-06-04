// src/data/portfolio.ts
// ────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH FOR ALL CONTENT.
// Edit this file to update the site — you never need to touch the components.
// ────────────────────────────────────────────────────────────────────────────

export type Status = "validated" | "in-progress" | "shipped";

export const profile = {
  name: "Sanjeev Kumar Paul",
  shortName: "SKP",
  tagline: "Cryptographic Validation · Compliance",
  location: "Ottawa, Canada · UTC−5",
  email: "sanjeevkumarpaul25@gmail.com",
  availability: "Open to: Technical Project Management · Security Certification programs",
  // Drives the moving trust strip below the hero.
  standards: ["FIPS 140-3", "CMVP", "NDcPP", "EUCC", "Common Criteria", "IPv6 / USGv6"],
  links: {
    linkedin: "https://www.linkedin.com/in/sanjeev-kumar-paul/",
    github: "https://github.com/snj3vpaul/",
    medium: "https://medium.com/@sanjeevkumarpaul25",
    cv: "/cv.pdf",
  },
};

export const trustLabel = "Operating standards & frameworks";

export const hero = {
  titleLead: "Turning complex security standards into ",
  titleEm: "validated",
  titleTail: " products.",
  sub:
    "Cybersecurity professional focused on cryptographic validation, compliance execution, and audit-ready technical delivery — bridging engineering, testing, and regulatory requirements across FIPS and Common Criteria environments.",
};

// ── Case studies (proof of work) ───────────────────────────────────────────────
export type Metric = { value: string; label: string };
export type LinkItem = { label: string; url: string };
export type SnapshotRow = { k: string; v: string };

export type CaseStudy = {
  id: string;
  flagship?: boolean;
  badges: string[];
  status?: { kind: Status; label: string };
  tag: string;
  title: string;
  role: string;
  summary: string;
  snapshot?: SnapshotRow[]; // featured (flagship) right rail
  metrics?: Metric[];
  links: LinkItem[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "forticlient-7-0-2",
    flagship: true,
    badges: ["Cryptographic Validation", "FIPS 140-3"],
    status: { kind: "validated", label: "Validated" },
    tag: "FIPS 140-3 · Software Level 1",
    title: "FortiClient 7.0.2 — FIPS 140-3 Validation",
    role: "Validator & technical coordinator",
    summary:
      "Completed FIPS 140-3 validation for FortiClient 7.0.2 by correctly scoping the cryptographic module to the VPN’s cryptographic boundary rather than the full application. Mapped key-management flows, verified approved-mode behavior on the wire instead of relying on documentation, and produced reproducible, validator-facing evidence supporting successful assessment closure.",
    // Snapshot replaces vague metric tiles for the flagship — cleaner, factual rail.
    snapshot: [
      { k: "Standard", v: "FIPS 140-3" },
      { k: "Level", v: "Software Level 1" },
      { k: "Approach", v: "On-wire verification" },
      { k: "Scoping", v: "Crypto-boundary driven" },
      { k: "Status", v: "Validated" },
    ],
    links: [
      {
        label: "NIST CMVP reference",
        url: "https://csrc.nist.gov/projects/cryptographic-module-validation-program",
      },
    ],
  },
  {
    id: "forticlient-crypto-module-v1",
    badges: ["Cryptographic Validation", "FIPS 140-3"],
    status: { kind: "in-progress", label: "In Review" },
    tag: "FIPS 140-3 · Crypto Module",
    title: "FortiClient Crypto Module v1.0 — FIPS 140-3 (In Review)",
    role: "Validator & technical coordinator (autonomous execution)",
    summary:
      "Driving FIPS 140-3 validation for a standalone cryptographic module with autonomous ownership of module scoping, VPN integration analysis, and cryptographic boundary definition. Aligning VPN architecture with standalone crypto-module requirements, mapping key-management flows, verifying approved-mode behavior on the wire, and producing validator-ready evidence under active review cycles.",
    metrics: [
      { value: "In Review", label: "Certification stage" },
      { value: "Autonomous", label: "Execution ownership" },
      { value: "Cross-team", label: "Coordination scope" },
      { value: "Iterative", label: "Validation cycles" },
    ],
    links: [
      {
        label: "NIST CMVP reference",
        url: "https://csrc.nist.gov/projects/cryptographic-module-validation-program",
      },
    ],
  },
  // NOTE: "SoK: Is iPhone Actually Secure?" was removed from here — it now lives
  // once, in the Publications column of the Credentials section (see below).
  {
    id: "canterbury",
    badges: ["Product", "React · Secure inputs", "Technical Delivery"],
    status: { kind: "shipped", label: "Shipped" },
    tag: "Production web application",
    title: "Canterbury Cricket Club — Secure Website Delivery",
    role: "Builder, maintainer & project lead",
    summary:
      "Led end-to-end design, development, and deployment of a production website for Canterbury Cricket Club. Built a React-based system with structured content modeling, secure input validation, SEO optimization, automation workflows, and hardened form handling to mitigate malformed input and injection risks.",
    metrics: [
      { value: "Live", label: "Production system" },
      { value: "Secure", label: "Validated input handling" },
      { value: "Automated", label: "Content workflows" },
      { value: "Scalable", label: "Component architecture" },
    ],
    links: [{ label: "Live site", url: "https://canterburycricketclub.com" }],
  },
];

// ── Lifecycle (how I work) ──────────────────────────────────────────────────────
export type Stage = { n: string; title: string; body: string };
export const lifecycle: Stage[] = [
  { n: "01", title: "Scope & Requirements", body: "Define the certification target, cryptographic boundary, deployment assumptions, and applicable FIPS 140-3 / NDcPP requirements with engineering, product, and compliance stakeholders." },
  { n: "02", title: "Architecture & Gap Review", body: "Review implementation, security architecture, approved algorithms, and platform behavior to surface compliance gaps, documentation issues, and testing dependencies early." },
  { n: "03", title: "Cross-Team Coordination", body: "Coordinate across development, QA, release engineering, product, and external validation labs to align deliverables, timelines, environments, and certification expectations." },
  { n: "04", title: "Testing & Validation", body: "Execute sanity, functional, and standards-driven validation — approved-mode verification, operational behavior analysis, traffic inspection, and reproducible test execution." },
  { n: "05", title: "Findings & Tracking", body: "Log compliance findings and defects; track remediation with developers and QA while managing iterative reviewer feedback and retest cycles." },
  { n: "06", title: "Evidence & Delivery", body: "Produce audit-ready evidence packages, reviewer-facing documentation, and certification artifacts for submission to validation labs and regulatory programs." },
];

// ── Experience ──────────────────────────────────────────────────────────────────
export type Experience = { when: string; title: string; org: string; body: string };
export const experience: Experience[] = [
  { when: "2025 — Present", title: "Project Management Compliance Analyst", org: "Fortinet", body: "Promoted into a project-management role supporting cryptographic validation and security-compliance programs. Coordinate engineering, QA, and validation stakeholders across documentation-heavy regulated workflows, evidence production, review management, and audit-ready delivery in FIPS 140-3 and Common Criteria environments." },
  { when: "2023 — 2025", title: "Junior Project Management Compliance Analyst", org: "Fortinet", body: "Supported cryptographic-module validation by coordinating testing activities, reviewer-facing documentation, approved-mode verification, and technical evidence collection for regulated security programs." },
  { when: "2022 — 2023", title: "Junior Compliance Analyst", org: "Fortinet", body: "Worked within security-compliance and validation workflows supporting FIPS / Common Criteria processes, technical documentation, evidence preparation, and cross-functional coordination across engineering and QA." },
  { when: "2024 — Present", title: "Digital Media Manager", org: "Canterbury Cricket Club", body: "Led digital growth, website delivery, and engagement strategy — scaling interactions beyond 125K+ while building and maintaining the club’s production website and media pipeline." },
  { when: "2022 — Present", title: "Cybersecurity Writer & Contributor", org: "Medium", body: "Publish educational cybersecurity content on certifications, security fundamentals, cryptographic compliance, and practical guidance for newcomers to the field." },
];

// ── Capability matrix ─────────────────────────────────────────────────────────
// level: 1 = Working, 2 = Proficient, 3 = Lead (the highest column reached)
export type CapabilityRow = { domain: string; level: 1 | 2 | 3 };
export const capabilities: CapabilityRow[] = [
  { domain: "Cryptographic validation (FIPS 140-3 / CMVP)", level: 3 },
  { domain: "Security compliance & audit readiness", level: 3 },
  { domain: "Evidence production & technical documentation", level: 3 },
  { domain: "Cross-functional stakeholder coordination", level: 3 },
  { domain: "Network security & traffic analysis", level: 2 },
  { domain: "Threat modeling & platform security", level: 2 },
  { domain: "Technical project / program management", level: 2 },
  { domain: "Vulnerability analysis & security assessment", level: 2 },
  { domain: "Secure web application delivery", level: 2 },
  { domain: "Programming & scripting (Python · JavaScript · Bash)", level: 1 },
];

// ── Credentials (education + certifications + publications) ──────────────────────
export type TimelineItem = {
  year: string;
  title: string;
  body: string;
  validated?: boolean;
  url?: string;
};

export const education: TimelineItem[] = [
  { year: "2015 — 2019", title: "Bachelor’s — Information Technology", body: "Foundation in programming, algorithms, data structures, and software engineering.", validated: true },
  { year: "2020 — 2022", title: "Master’s — Concordia University", body: "Graduate study in computing systems, security fundamentals, and applied technical problem-solving.", validated: true },
];

export const certifications: TimelineItem[] = [
  { year: "2025", title: "CompTIA CySA+", body: "Threat detection, vulnerability management, and security operations.", validated: true },
  { year: "2025", title: "CompTIA Security+", body: "Network security, cryptography, and risk management.", validated: true },
  { year: "2024", title: "INE eJPT", body: "Penetration testing fundamentals and attack-path analysis.", validated: true },
];

export const publications: TimelineItem[] = [
  { year: "2022", title: "SoK: Is iPhone Actually Secure?", body: "Systematization of knowledge on iPhone platform security, threat models, and real-world attack surfaces.", validated: true, url: "https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf" },
];

// ── Beyond work (human layer) ───────────────────────────────────────────────────
export type BeyondStat = { value: string; label: string };
export type BeyondMedia = { type: "youtube" | "file"; src: string; poster?: string };
export type BeyondItem = {
  kind: string;        // monospace kicker, e.g. "// sport"
  title: string;
  blurb: string;
  featured?: boolean;  // one item renders as the large media panel
  stats?: BeyondStat[];
  image?: string;      // optional photo — public path like "/beyond/cricket.webp"
  video?: BeyondMedia; // optional clip — see commented examples below
};

export const beyond: BeyondItem[] = [
  {
    kind: "// sport",
    title: "Cricket",
    featured: true,
    blurb:
      "From a Punjab Under-16 district camp to competitive club cricket with Canterbury CC — the game taught me preparation, patience, and performing under pressure.",
    stats: [
      { value: "Punjab U16", label: "District camp" },
      { value: "Canterbury CC", label: "Club cricket" },
      { value: "Left-Hand", label: "Player" },
    ],
    // Add a photo:  image: "/beyond/cricket.webp",
    // Or a clip:    video: { type: "youtube", src: "YOUTUBE_ID", poster: "/beyond/cricket.webp" },
    //               video: { type: "file", src: "/beyond/cricket.mp4", poster: "/beyond/cricket.webp" },
  },
  {
    kind: "// sport",
    title: "Football",
    blurb:
      "University-level left back, now playing CDM — defensive reads, transitions, and work rate that carry straight into how I deliver.",
    stats: [
      { value: "LB → CDM", label: "Position" },
      { value: "University", label: "Level" },
    ],
  },
  {
    kind: "// community",
    title: "Volunteering",
    blurb:
      "Humanitarian relief with Khalsa Aid, and judging a Montessori school science exhibition — staying useful to people beyond a screen.",
    stats: [
      { value: "Khalsa Aid", label: "Relief work" },
      { value: "Science fair", label: "Judge" },
    ],
  },
  {
    kind: "// media",
    title: "Digital & Writing",
    blurb:
      "Built and grew Canterbury CC's digital presence, and write cybersecurity explainers on Medium for newcomers to the field.",
    stats: [
      { value: "125K+", label: "Interactions scaled" },
      { value: "Medium", label: "Security writing" },
    ],
  },
];

export const navItems = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#credentials", label: "Credentials" },
];