/** Verified professional content displayed on the editorial hybrid website. */
export type Status = "validated" | "in-progress" | "shipped";

export const profile = {
  name: "Sanjeev Kumar Paul",
  email: "sanjeevkumarpaul25@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/sanjeev-kumar-paul/",
    github: "https://github.com/snj3vpaul/",
    medium: "https://medium.com/@sanjeevkumarpaul25",
    cv: "/cv.pdf",
  },
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
  contribution?: string;
  snapshot?: SnapshotRow[]; // featured (flagship) right rail
  metrics?: Metric[];
  links: LinkItem[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "My First Autonomous Project Certification- Forticlient-7-0-2",
    flagship: true,
    badges: ["Cryptographic Validation", "FIPS 140-3"],
    tag: "FIPS 140-3 · FortiClient 7.0.2 workstream",
    title: "FortiClient 7.0.2 — My First Independent Certification Workstream",
    role: "Project Manager & Technical Writer",
    summary:
      "Worked on module scoping for FortiClient 7.0.2, including the VPN cryptographic boundary, key-management flows, approved-mode checks, and reproducible evidence for certification review.",
    contribution: "Investigated technical behavior, helped document findings, and coordinated evidence through the review workflow.",
    // Snapshot replaces vague metric tiles for the flagship — cleaner, factual rail.
    snapshot: [
      { k: "Standard", v: "FIPS 140-3" },
      { k: "Level", v: "Software Level 1" },
      { k: "Approach", v: "Mantis Tracking, Multi-team Coordination, FIPS 140-3 IG Review" },
      { k: "Scoping", v: "Crypto-boundary driven" },
      { k: "Scope", v: "Certification workstream; distinct from the publicly listed module certificate" },
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
  status: {
    kind: "validated",
    label: "Validated",
  },
  tag: "FIPS 140-3 · Software Level 1 · CMVP #5493",
  title: "FortiClient Crypto Module v1.0 — FIPS 140-3 Validation",
  role: "Security assurance & validation coordination",
  summary:
    "Supported the FIPS 140-3 validation of FortiClient Crypto Module v1.0 through cryptographic module scoping, VPN integration analysis, cryptographic boundary definition, key-management flow mapping, approved-mode verification, and validator-facing evidence. The module achieved FIPS 140-3 Security Level 1 validation under NIST CMVP Certificate #5493 on August 17, 2026.",
  contribution: "Worked on scoping, technical analysis, and preparation of reviewer-facing evidence within the larger certification effort.",
  metrics: [
    { value: "Validated", label: "CMVP Status" },
    { value: "#5493", label: "Certificate" },
    { value: "Level 1", label: "Security Level" },
    { value: "Aug 2026", label: "Initial validation" },
  ],
  links: [
    {
      label: "NIST CMVP Certificate #5493",
      url: "https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5493",
    },
  ],
},
{
  id: "fortiproxy-firmware-l1",
  badges: ["Cryptographic Validation", "FIPS 140-3"],
  status: {
    kind: "in-progress",
    label: "Submitted for Review",
  },
  tag: "FIPS 140-3 · Firmware · Level 1 Target",
  title: "FortiProxy Firmware — FIPS 140-3 Level 1",
  role: "Security Certification Project",
  summary:
    "FortiProxy firmware cryptographic-module validation project targeting FIPS 140-3 Security Level 1. The project has been submitted for review and is awaiting completion of the validation process. Certification has not yet been granted.",
  metrics: [
    { value: "Submitted", label: "Current Stage" },
    { value: "Level 1", label: "Target Security Level" },
  ],
  links: [],
},
{
  id: "fortiproxy-vm-l1",
  badges: ["Cryptographic Validation", "FIPS 140-3"],
  status: {
    kind: "in-progress",
    label: "Submitted for Review",
  },
  tag: "FIPS 140-3 · Virtual Machine · Level 1 Target",
  title: "FortiProxy-VM — FIPS 140-3 Level 1",
  role: "Security Certification Project",
  summary:
    "FortiProxy-VM cryptographic-module validation project targeting FIPS 140-3 Security Level 1. The project has been submitted for review and is awaiting completion of the validation process. Certification has not yet been granted.",
  metrics: [
    { value: "Submitted", label: "Current Stage" },
    { value: "Level 1", label: "Target Security Level" },
  ],
  links: [],
},

  {
    id: "canterbury",
    badges: ["Product", "React · Secure inputs", "Technical Delivery"],
    status: { kind: "shipped", label: "Shipped" },
    tag: "Production web application",
    title: "Canterbury Cricket Club — Secure Website Delivery",
    role: "Project Lead & Developer",
    summary:
      "Designed, built, and deployed the Canterbury Cricket Club website. The project includes structured React components, content updates, form input handling, and search discoverability work.",
    contribution: "Independent design, implementation, maintenance, and iteration for a real community project.",
    snapshot: [
      { k: "Stack", v: "React" },
      { k: "Work", v: "Design, deployment and ongoing updates" },
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


// ── Credentials (education + certifications + publications) ──────────────────────
export type TimelineItem = {
  year: string;
  title: string;
  body: string;
  validated?: boolean;
  url?: string;
};

export const education: TimelineItem[] = [
  { year: "2015 — 2019", title: "Bachelor’s — Information Technology", body: "Panjab Univesity Alumni. Foundation in programming, algorithms, data structures, and software engineering.", validated: true },
  { year: "2020 — 2022", title: "Master’s — Information Systems Security", body: "Concordia University Graduate completed study in computing systems, security fundamentals, and applied technical problem-solving.", validated: true },
];

export const certifications: TimelineItem[] = [
  { year: "2025", title: "CompTIA CySA+", body: "Threat detection, vulnerability management, and security operations.", validated: true },
  { year: "2025", title: "CompTIA Security+", body: "Network security, cryptography, and risk management.", validated: true },
  { year: "2024", title: "INE eJPT", body: "Penetration testing fundamentals and attack-path analysis.", validated: true },
];

export const publications: TimelineItem[] = [
  { year: "2022", title: "SoK: Is iPhone Actually Secure?", body: "Systematization of knowledge on iPhone platform security, threat models, and real-world attack surfaces.", validated: true, url: "https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf" },
];

