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
    "Open to: Security Compliance · Cryptographic Validation · Technical PM",
  standards: ["FIPS 140-3", "CMVP", "NDcPP", "EUCC", "NIST 800-53"],
  links: {
    linkedin: "https://www.linkedin.com/in/sanjeev-kumar-paul/",
    github: "https://github.com/snj3vpaul/",
    medium: "https://medium.com/@sanjeevkumarpaul25",
    cv: "/cv.pdf", // file lives in public/cv.pdf
  },
};

export const hero = {
  // The hero <h1> is split so one word can be italic-accented.
  titleLead: "Turning complex security standards into ",
  titleEm: "validated",
  titleTail: " products.",
  sub:
    "I lead and execute cryptographic validation and security-compliance work — verifying real cryptographic behavior against the standard, then producing the audit-ready evidence that stands up under review.",
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
    id: "fips-vpn",
    flagship: true,
    badges: ["Cryptographic Validation"],
    status: { kind: "validated", label: "Validated" },
    tag: "FIPS 140-3 · Software Level 1",
    title: "VPN Client — FIPS 140-3 Cryptographic Validation",
    role: "Role: Validator & technical coordinator",
    summary:
      "Drove a VPN client toward FIPS 140-3 Software Level 1 expectations: mapped the cryptographic boundary and key-management flows, verified approved-mode behavior on the wire rather than relying on documentation, and produced reproducible, validator-facing evidence that reduced review cycles.",
    metrics: [
      { value: "XX", label: "Findings closed" },
      { value: "XX%", label: "Fewer review cycles" },
      { value: "XX", label: "Pages of evidence" },
      { value: "XX", label: "Stakeholders aligned" },
    ],
    links: [
      { label: "Validation summary", url: "#" },
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
      "A structured security assessment of the iPhone platform — threat models, platform controls, and practical limitations — mapped to real-world attack surfaces, with clear takeaways for users and defenders.",
    links: [
      {
        label: "Read publication",
        url: "https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf",
      },
    ],
  },
  {
    id: "canterbury",
    badges: ["Product", "React · Secure inputs"],
    status: { kind: "shipped", label: "Shipped" },
    tag: "Public-facing web app",
    title: "Canterbury Cricket Club — Website Build",
    role: "Role: Builder & maintainer",
    summary:
      "Designed and shipped a public club website with a component-driven architecture, a structured content model, and hardened, validated form handling with safe rendering — built to a performance budget.",
    metrics: [
      { value: "XX", label: "Lighthouse perf" },
      { value: "XXs", label: "Load time" },
      { value: "XX", label: "Reusable components" },
      { value: "100%", label: "Validated forms" },
    ],
    links: [{ label: "Live site", url: "https://canterburycricketclub.com" }],
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
  { domain: "Security testing & evidence (sanity / functional)", level: 2 },
  { domain: "Network security (on-the-wire analysis)", level: 2 },
  { domain: "Compliance docs & audit readiness", level: 3 },
  { domain: "Technical project / program management", level: 2 },
];

export type Stage = { n: string; title: string; body: string };
export const lifecycle: Stage[] = [
  { n: "01", title: "Scope", body: "Define the module boundary & applicable requirements." },
  { n: "02", title: "Threat model", body: "Map attack surface, assets, and approved modes." },
  { n: "03", title: "Test", body: "Sanity + functional, on-the-wire verification." },
  { n: "04", title: "Evidence", body: "Reproducible steps and validator-facing records." },
  { n: "05", title: "Review", body: "Coordinate with lab/dev; close findings." },
  { n: "06", title: "Validated", body: "Audit-ready package, standard met." },
];

export type Experience = { when: string; title: string; org: string; body: string };
export const experience: Experience[] = [
  {
    when: "2024 — Present",
    title: "Project Manager — FIPS-CC domain",
    org: "[ Company ]",
    body: "Coordinate cryptographic validation efforts across development, QA, and lab stakeholders; own documentation-heavy, regulated workflows and keep them audit-ready.",
  },
  {
    when: "[ dates ]",
    title: "[ Prior role — e.g. Security Engineer / Analyst ]",
    org: "[ Company ]",
    body: "[ One or two lines of scope and a measurable outcome. ]",
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
