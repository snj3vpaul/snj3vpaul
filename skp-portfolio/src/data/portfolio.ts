// src/data/portfolio.ts
// ────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH FOR ALL CONTENT.
// Edit this file to update the site — you never need to touch the components.
// Placeholders are marked with [ brackets ] or "XX". Replace before publishing.
// ────────────────────────────────────────────────────────────────────────────

export type Status = "validated" | "in-progress" | "shipped";

export const profile = {
  name: "Sanjeev Kumar Paul",
  shortName: "SKP",
  tagline: "Cryptographic Validation · Compliance",
  location: "Ottawa, Canada · UTC−5",
  email: "sanjeevkumarpaul25@gmail.com", // ← replace with your preferred contact address
  availability:
    "Technical Project Management, Security Certifications",
  standards: ["FIPS 140-3", , "NDcPP", "EUCC", "IPv6/USGv6"],
  links: {
    linkedin: "https://www.linkedin.com/in/sanjeev-kumar-paul/",
    github: "https://github.com/snj3vpaul/",
    medium: "https://medium.com/@sanjeevkumarpaul25",
    cv: "/cv.pdf", // file lives in public/cv.pdf
  },
};

export const hero = {
  titleLead: "Turning complex security standards into ",
  titleEm: "validated",
  titleTail: " products.",
  sub:
    "Cybersecurity professional focused on cryptographic validation, compliance execution, and audit-ready technical delivery — bridging engineering, testing, and regulatory requirements across FIPS and Common Criteria environments.",
};

export type Metric = { value: string; label: string };
export type LinkItem = { label: string; url: string };

export type CaseStudy = {
  id: string;
  flagship?: boolean;
  badges: string[];
  status?: { kind: Status; label: string };
  tag: string;
  title: string;
  role: string;
  summary: string;
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
    title: "FortiClient 7.0.2 — FIPS 140-3 Validation (Completed)",
    role: "Role: Validator & technical coordinator",
    summary:
      "Completed FIPS 140-3 validation for FortiClient 7.0.2 by correctly scoping the cryptographic module to the VPN’s cryptographic boundary rather than the full application. Mapped key-management flows, verified approved-mode behavior on the wire instead of relying on documentation, and produced reproducible, validator-facing evidence supporting successful assessment closure.",
    metrics: [
      { value: "Validated", label: "Certification status achieved" },
      { value: "On-wire", label: "Behavior verification approach" },
      { value: "Boundary-driven", label: "Crypto module scoping model" },
      { value: "Reduced", label: "Review iteration cycles" },
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
    title: "FortiClient Crypto Module v1.0 — FIPS 140-3 Validation (In Review)",
    role: "Role: Validator & technical coordinator (autonomous execution)",
    summary:
      "Driving FIPS 140-3 validation efforts for FortiClient Crypto Module v1.0 with autonomous ownership of module scoping, VPN integration analysis, and cryptographic boundary definition. Ensuring alignment between VPN architecture and standalone crypto module requirements, while mapping key-management flows and verifying approved-mode behavior on the wire. Producing validator-ready evidence under active review cycles with iterative feedback from stakeholders and labs.",
    metrics: [
      { value: "In Review", label: "Certification stage" },
      { value: "Autonomous", label: "Execution ownership level" },
      { value: "Cross-team", label: "Coordination scope" },
      { value: "Iterative", label: "Validation cycles ongoing" },
    ],
    links: [
      {
        label: "NIST CMVP reference",
        url: "https://csrc.nist.gov/projects/cryptographic-module-validation-program",
      },
    ],
  },

  {
    id: "sok-iphone",
    badges: ["Publication", "Mobile Security · Threat Modeling"],
    tag: "Systematization of Knowledge",
    title: "SoK: Is iPhone Actually Secure?",
    role: "Role: Author",
    summary:
      "Structured security analysis of the iPhone platform, covering threat models, platform security controls, and practical limitations mapped to real-world attack surfaces, with clear implications for users and defenders.",
    links: [
      {
        label: "Read publication",
        url: "https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf",
      },
    ],
  },

  {
    id: "canterbury",
    badges: ["Product", "React · Secure inputs", "Technical Delivery"],
    status: { kind: "shipped", label: "Shipped" },
    tag: "Production web application",
    title: "Canterbury Cricket Club — Secure Website Delivery",
    role: "Role: Builder, maintainer & project lead",
    summary:
      "Led end-to-end design, development, and deployment of a production website for Canterbury Cricket Club. Built a React-based system with structured content modeling, secure input validation, SEO optimization, automation workflows, and hardened form handling to mitigate malformed input and injection risks.",
    metrics: [
      { value: "Live", label: "Production system" },
      { value: "Secure", label: "Validated input handling" },
      { value: "Automated", label: "Content workflows" },
      { value: "Scalable", label: "Component architecture" },
    ],
    links: [
      { label: "Live site", url: "https://canterburycricketclub.com" },
    ],
  },
];

export type TimelineItem = {
  year: string;
  title: string;
  body: string;
  validated?: boolean;
};

export const standards: TimelineItem[] = [
  {
    year: "2024 — present",
    title: "FIPS 140-3 cryptographic module validation (CMVP domain)",
    body: "Hands-on validation and program coordination in the FIPS-CC space: approved-mode verification, evidence production, and reviewer-facing documentation.",
    validated: true,
  },
  {
    year: "In progress",
    title: "[ Certification — e.g. Security+, CySA+, or CISSP Associate ]",
    body: "Add the credentials you hold or are pursuing. Name the issuing body and date — recruiters and ATS search for these exact terms.",
    validated: false,
  },
  {
    year: "2022",
    title: "Published security research — SoK: iPhone platform security",
    body: "Peer-shared systematization of knowledge on mobile platform security and threat modeling.",
    validated: true,
  },
  {
    year: "Graduated",
    title: "Concordia University — [ degree, field ]",
    body: "Add your program and any security/cryptography focus areas.",
    validated: true,
  },
];

// level: 1 = Working, 2 = Proficient, 3 = Lead (the highest column reached)
export type CapabilityRow = { domain: string; level: 1 | 2 | 3 };

export const capabilities: CapabilityRow[] = [
  { domain: "Cryptographic validation (FIPS 140-3 / CMVP)", level: 3 },
  { domain: "Security compliance & audit readiness", level: 3 },
  { domain: "Evidence production & technical documentation", level: 3 },
  { domain: "Technical communication & compliance reporting", level: 3 },
  { domain: "Cross-functional stakeholder coordination", level: 3 },

  { domain: "Network security & traffic analysis", level: 2 },
  { domain: "Threat modeling & platform security", level: 2 },
  { domain: "Technical project / program management", level: 2 },
  { domain: "Vulnerability analysis & security assessment", level: 2 },
  { domain: "Secure SDLC & release coordination", level: 2 },
  { domain: "AI prompt engineering & workflow optimization", level: 2 },
  { domain: "Secure web application delivery", level: 2 },
  { domain: "Cloud deployment & Vercel production workflows", level: 2 },

  { domain: "Programming & scripting (Python · JavaScript · Bash/PowerShell)", level: 1 },
];

export type Stage = { n: string; title: string; body: string };
export const lifecycle: Stage[] = [
  {
    n: "01",
    title: "Scope & Requirements",
    body:
      "Define the certification target, cryptographic boundary, deployment assumptions, and applicable FIPS 140-3 / NDcPP requirements with engineering, product, and compliance stakeholders.",
  },
  {
    n: "02",
    title: "Architecture & Gap Review",
    body:
      "Review implementation details, security architecture, approved algorithms, and platform behavior to identify compliance gaps, documentation issues, and testing dependencies early.",
  },
  {
    n: "03",
    title: "Cross-Team Coordination",
    body:
      "Coordinate continuously across development, QA, release engineering, product management, and external validation labs to align deliverables, timelines, environment setup, and certification expectations.",
  },
  {
    n: "04",
    title: "Testing & Validation",
    body:
      "Execute sanity, functional, and standards-driven validation activities including approved-mode verification, operational behavior analysis, traffic inspection, and reproducible test execution.",
  },
  {
    n: "05",
    title: "Findings & Bug Tracking",
    body:
      "Log compliance findings, documentation defects, and technical issues; track remediation with developers and QA teams while managing iterative reviewer feedback and retest cycles.",
  },
  {
    n: "06",
    title: "Evidence & Certification Delivery",
    body:
      "Produce audit-ready evidence packages, reviewer-facing documentation, test records, and certification artifacts for submission to validation labs and regulatory programs.",
  },
];

export type Experience = { when: string; title: string; org: string; body: string };
export const experience: Experience[] = [
  {
    when: "2025 — Present",
    title: "Project Management Compliance Analyst",
    org: "Fortinet",
    body:
      "Promoted into a project-management role supporting cryptographic validation and security-compliance programs. Coordinate engineering, QA, and validation stakeholders across documentation-heavy regulated workflows, evidence production, review management, and audit-ready delivery in FIPS 140-3 and Common Criteria environments.",
  },
  {
    when: "2023 — 2025",
    title: "Junior Project Management Compliance Analyst",
    org: "Fortinet",
    body:
      "Supported cryptographic-module validation initiatives by coordinating testing activities, reviewer-facing documentation, approved-mode verification efforts, and technical evidence collection for regulated security programs.",
  },
  {
    when: "2022-2023",
    title: "Junior Compliance Analyst",
    org: "Fortinet",
    body:
      "Worked within security-compliance and validation workflows supporting FIPS/Common Criteria processes, technical documentation, evidence preparation, and cross-functional coordination across engineering and QA teams.",
  },
  {
    when: "2024 — Present",
    title: "Digital Media Manager",
    org: "Canterbury Cricket Club",
    body:
      "Led digital growth initiatives, website delivery, and online engagement strategy. Helped scale interactions beyond 125K+ while building and maintaining the club’s production website and media pipeline.",
  },
  {
    when: "2022 — Present",
    title: "Cybersecurity Writer & Contributor",
    org: "Medium",
    body:
      "Publish educational cybersecurity content focused on certifications, security fundamentals, cryptographic compliance, and practical guidance for learners entering the field.",
  },
];

export type Beyond = { kind: string; title: string; body: string };
export const beyond: Beyond[] = [
  {
    kind: "// sport",
    title: "Cricket",
    body: "Punjab Under-16 district camp, reignited through competitive club cricket with Canterbury CC — consistent training and match prep.",
  },
  {
    kind: "// sport",
    title: "Football",
    body: "University-level left back, now playing CDM — defensive reads, transitions, and work rate that translate to disciplined delivery.",
  },
  {
    kind: "// community",
    title: "Volunteering",
    body: "Contributor to Khalsa Aid humanitarian relief, and a judge at a Montessori school science exhibition — practical, people-focused giving back.",
  },
];

export const navItems = [
  { href: "#work", label: "Work" },
  { href: "#standards", label: "Standards" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#experience", label: "Experience" },
];
