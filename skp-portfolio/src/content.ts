/* All copy for the home page. Every fact here comes from the previous site or its project pages.
   Lines marked CHECK are reworded from shorter notes; confirm or correct them. */

export const EMAIL = 'sanjeevkumarpaul25@gmail.com';
export const MAILTO = `mailto:${EMAIL}?subject=Hello%20Sanjeev`;
export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/sanjeev-kumar-paul/',
  github: 'https://github.com/snj3vpaul/',
  medium: 'https://medium.com/@sanjeevkumarpaul25',
  cv: '/cv.pdf',
  nist5493: 'https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5493',
};

export const NAV = [
  { href: '#work', label: 'Work', n: '01' },
  { href: '#projects', label: 'Projects', n: '02' },
  { href: '#approach', label: 'Approach', n: '03' },
  { href: '#beyond', label: 'Beyond work', n: '04' },
  { href: '#contact', label: 'Contact', n: '05' },
];

/* ---------- 1 · Hero ---------- */
export const HERO = {
  name: 'Sanjeev Kumar Paul',
  statement: ['I help security products ', 'prove', ' what they claim.'],
  intro: 'I turn security standards into questions engineers can answer, and their answers into evidence a lab can certify. Outside work I build small, useful things, and play a lot of cricket.',
  facts: [
    ['Role', 'Compliance Analyst, Fortinet'],
    ['Based', 'Ottawa, Canada'],
    ['Practice', 'FIPS 140-3 · CMVP · ACVP · Common Criteria'],
  ],
  tagline: 'Standards by trade. Curious by default.',
};

/* ---------- 2 · Selected professional work ---------- */
export const WORK = {
  lead: 'Four years in security certification. Below is the module work I can point to, with my part stated separately from what the module achieved.',
  note: 'Certificates are issued to modules, not people. Each entry says what my part was.',
  metrics: [
    { v: '2', l: 'NIST-validated modules I worked on' },
    { v: '1st', l: 'FIPS 140-3 certification for a Fortinet VPN product' },
    { v: '5', l: 'Algorithm families ACVP-tested: AES, RSA, SHA, HMAC, ECDSA' },
    { v: '4+', l: 'Years in FIPS 140-3 and Common Criteria' },
  ],
  modules: [
    {
      id: 'work-forticlient-crypto-module', title: 'FortiClient Crypto Module v1.0', status: 'valid' as const, statusText: 'Validated by NIST',
      mine: 'Scoped the module boundary, the key-management flows and the approved-mode checks, and built the evidence NIST validated.',
      module: [['Certificate', 'NIST CMVP #5493'], ['Level', 'Security Level 1, software'], ['Validated', '17 Aug 2026']],
      links: [{ href: LINKS.nist5493, text: 'NIST record ↗', external: true }, { href: '/project-forticlient-crypto-module.html', text: 'Project notes', track: 'explore-forticlient-crypto-module' }],
    },
    {
      id: 'work-forticlient-7-0-2', title: 'FortiClient 7.0.2', status: 'lead' as const, statusText: 'Workstream lead',
      mine: 'Led the workstream: boundaries, key management, approved mode and lab liaison, through to the Security Policy (NIST SP 800-140B).',
      module: [['Outcome', 'Fortinet’s first FIPS 140-3 VPN certification'], ['ACVP', 'AES · RSA · SHA · HMAC · ECDSA']],
      links: [{ href: '/project-forticlient-7-0-2.html', text: 'Project notes', track: 'explore-forticlient-7-0-2' }],
    },
    {
      id: 'work-fortiproxy', title: 'FortiProxy firmware & VM', status: 'pending' as const, statusText: 'In review',
      mine: 'Coordinating planning, evidence delivery, lab findings and the KVM test environments for two validations.',
      module: [['Modules', '2 — firmware and virtual machine'], ['Level', 'Security Level 1 targets'], ['Status', 'Submitted to NIST CMVP, in review']],
      links: [{ href: '/project-fortiproxy.html', text: 'Project notes', track: 'explore-fortiproxy' }],
    },
  ],
};

/* ---------- 3 · Independent projects ---------- */
export type Link = { href: string; text: string; track?: string; external?: boolean };
export type Case = {
  id: string; title: string; kind: string; status: string; visual: { poster?: string; art?: string; cap: string };
  context: string; problem: string; contribution: string; implementation: string; outcome: string;
  stack: string; links: Link[]; quote?: string;
};
export const PROJECTS_LEAD = 'Most of what I build outside work starts with something I care about: a process that hides its gaps, a label nobody can read, a club that needs a home.';
export const CASES: Case[] = [
  {
    id: 'forkcast', title: 'ForkCast', kind: 'Web app', status: 'Live', visual: { poster: '/img/loops/forkcast-poster.webp', cap: 'A decision, mapped' },
    context: 'Decisions and procedures are usually written as prose, from a one-line choice to a multi-page SOP.',
    problem: 'Prose hides structure: the gates, actors, loops and dead ends, and the paths nobody wrote down.',
    contribution: 'Designed and built it end to end.', // CHECK
    implementation: 'Next.js 15 and TypeScript, no backend. Every diagram is drawn as hand-built SVG and exports to SVG or Mermaid.',
    outcome: 'Paste a decision, get a parse report, an interactive flowchart, an assumption ledger with unstated paths drawn dashed, and the one question the text leaves open.',
    stack: 'Next.js 15 · TypeScript · SVG',
    links: [{ href: 'https://forkcast-rose.vercel.app', text: 'Open ForkCast ↗', track: 'open-forkcast', external: true }, { href: 'https://github.com/snj3vpaul/ForkCast', text: 'GitHub ↗', track: 'forkcast-github', external: true }, { href: '/project-forkcast.html', text: 'Notes', track: 'explore-forkcast' }],
  },
  {
    id: 'fabric', title: 'What-The-Fabric', kind: 'Web app', status: 'Live', visual: { poster: '/img/loops/fabric-poster.webp', cap: 'Cloth on the line' },
    context: 'Fabric names, blends and care symbols are written for people in the trade.',
    problem: 'Everyone else is left guessing what a fabric name means, what a blend does to a garment, and what a care label is asking for.', // CHECK
    contribution: 'Designed, built and shipped solo.',
    implementation: 'A web app with three decoders: fabric names, compositions and care labels.', // CHECK: add the stack
    outcome: 'Plain-language answers to all three, for people outside the trade.',
    stack: 'Web app',
    links: [{ href: 'https://what-the-fabric.vercel.app', text: 'Open What-The-Fabric ↗', track: 'open-wtf', external: true }, { href: '/project-what-the-fabric.html', text: 'Notes', track: 'explore-what-the-fabric' }],
  },
  {
    id: 'lab', title: 'Crypto Lab Chip', kind: 'Private toolkit', status: 'Private · no public demo', visual: { poster: '/img/loops/lab-poster.webp', cap: 'Three tools, one chip' },
    context: 'Certification work kept producing the same small, stubborn problems.',
    problem: 'Evidence spreadsheets lost their hyperlinks when exported to PDF; firmware needed inspecting before anyone made a claim about it; and what a device really offers on the wire had to be checked, not assumed.',
    contribution: 'Built it for my own certification work.', // CHECK
    implementation: 'Rust, served by Actix Web: an Excel-to-PDF exporter that keeps links, a firmware teardown, and a TLS and SSH scan of protocol versions, ciphers and key exchanges.',
    outcome: 'One toolkit for the problems I kept running into.',
    stack: 'Rust · Actix Web',
    links: [],
  },
  {
    id: 'rsfc', title: 'RSFC League', kind: 'Club league', status: 'Live · weekly', visual: { art: 'pitch', cap: 'White vs Red · every Thursday' },
    context: 'RSFC plays an in-house soccer league every Thursday.',
    problem: 'Split whoever turns up into two fair sides, score it straight from the match, and give members a reason to follow along.', // CHECK
    contribution: 'Built and run it.', // CHECK
    implementation: 'Next.js with Upstash Redis. A seeded, verifiable draw splits players into White and Red; points come straight from the scorecard.',
    outcome: 'A weekly league with Pick 7: an FPL-style team of seven, picked within a star budget.',
    stack: 'Next.js · Upstash Redis',
    links: [{ href: 'https://s3v-xi.vercel.app', text: 'Open RSFC League ↗', track: 'open-rsfc-league', external: true }, { href: 'https://github.com/snj3vpaul/s3v-xi', text: 'GitHub ↗', track: 'rsfc-league-github', external: true }],
  },
  {
    id: 'canterbury-cricket-club', title: 'Canterbury Cricket Club', kind: 'Club website', status: 'Live · maintained', visual: { art: 'ball', cap: 'Live community website' },
    context: 'My cricket club needed a public home that members use every season.',
    problem: 'A volunteer-run site has to stay reliable and secure without a team behind it.', // CHECK
    contribution: 'Built and maintain it end to end: requirements, architecture, build and deployment.',
    implementation: 'React on Vercel, with access control and secure-SDLC practices from the start.',
    outcome: 'The club’s live website, used by members every season.',
    stack: 'React · Vercel',
    links: [{ href: 'https://canterburycricketclub.com', text: 'Visit the site ↗', track: 'open-canterbury', external: true }, { href: '/project-canterbury-cricket-club.html', text: 'Notes', track: 'explore-canterbury-cricket-club' }],
  },
  {
    id: 'journey-globe', title: 'The Journey', kind: 'Interactive 3D globe', status: 'Ongoing · case study coming', visual: { art: 'globe', cap: 'A life, place by place' },
    context: 'An independent build about how we remember where life happens.',
    problem: 'A list of places says nothing about the order they shaped someone in.', // CHECK
    contribution: 'Independent build, still in progress.',
    implementation: 'A 3D globe where birthplace, homes and visits become waypoints on a personal timeline, joined by animated routes.',
    outcome: 'The world starts in darkness; as the timeline moves forward, the places that shaped someone light up one by one.',
    stack: 'Interactive 3D',
    quote: 'It’s a picture of how our world grows with what we’ve lived.',
    links: [],
  },
];

/* ---------- 4 · Approach & journey ---------- */
export const APPROACH = {
  title: ['Standards are detailed. People are ', 'complicated.'],
  lead: 'Most of the value is in the translation: from a requirement to a concrete engineering question, and from an answer to evidence someone else can examine. I sit between engineering, QA, product teams and accredited labs, and keep everyone working from the same understanding.',
  principles: [
    { t: 'Define the boundary.', p: 'Agree what is inside the module and what is not, before anyone tests anything.' },
    { t: 'Ask what we can demonstrate.', p: 'Turn each requirement into a concrete question an engineer can answer.' },
    { t: 'Leave evidence others can follow.', p: 'Turn each answer into evidence a lab can examine without me in the room.' },
  ],
  journeyLead: 'I came to Canada hoping to find my place in defensive security. A role in certification changed the direction, and gave me a different view of what makes systems trustworthy.',
  path: [
    { years: '2025 — now', role: 'Project Management Compliance Analyst', org: 'Fortinet' },
    { years: '2023 — 2025', role: 'Junior Project Management Compliance Analyst', org: 'Fortinet' },
    { years: '2022 — 2023', role: 'Junior Compliance Analyst', org: 'Fortinet' },
    { years: '2020 — 2022', role: 'Master’s, Information Systems Security', org: 'Concordia University' },
  ],
  // ADD: verification links (Credly / CompTIA / INE) when you have them.
  creds: [['CySA+', 'CompTIA Cybersecurity Analyst'], ['Security+', 'CompTIA'], ['eJPT', 'INE Security · Junior Penetration Tester']],
  credsNote: 'Credentials are useful. Curiosity matters more.',
};

/* ---------- 5 · Beyond work ---------- */
export const BEYOND = {
  lead: 'Cricket has been a constant. So have writing, learning things for no particular reason, and making time for the people around me.',
  line: ['Patience.', 'Timing.', 'Perspective.'],
  lineNote: 'What the game gives back: team sport, community, and a different kind of field awareness.',
  highlights: [
    { v: '1,000+', l: 'Runs in the 2025 season, averaging 42' },
    { v: 'MVP', l: 'OVCC T20, 2025 — and the tournament’s Best Batter' },
    { v: 'Final', l: 'Canterbury, 2026 — vice-captain, 4th in the T20 MVP race' },
  ],
  scorebook: [
    ['2012', 'Punjab Summer Camp — selected'],
    ['2012', 'Represented NDCA, Inter-District'],
    ['2018', 'Inter-Department champions — 22* (31) and 2 wickets in the final'],
    ['2019', 'Inter-Hostel Soccer Cup — won, representing BH9'],
    ['2022', 'First-ever T20 fifty for Kanata CC — 75*'],
    ['2023', 'Leading Kanata T20 run scorer — 223 runs'],
    ['2023', 'Ottawa Tuskers Tournament MVP — the first'],
    ['2024', 'Leading run scorer, Canterbury Challenge'],
    ['2025', 'OVCC T20 MVP and Best Batter'],
    ['2025', '1,000+ runs at an average of 42'],
    ['2026', 'Canterbury, to the final — led across my full tenure'],
  ],
  carry: [
    ['Captaincy', 'Getting engineers and reviewers to the same deadline, together.'],
    ['Vice-captaincy, two finals', 'Stepping up when the structure around me changes.'],
    ['Chasing under pressure', 'Staying calm while triaging a production issue.'],
    ['Averaging 42', 'Consistency and repeatability — what good evidence is made of.'],
    ['Tournament MVP', 'A good individual day only counts if the team gets the result.'],
  ],
  writing: [
    { href: 'https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf', meta: '2022 · Graduate survey paper · IJAR', title: 'SoK: Is iPhone Actually Secure?' },
    { href: 'https://medium.com/@sanjeevkumarpaul25', meta: 'Ongoing · Medium', title: 'Notes on security, technology, and what I’m learning' },
  ],
  also: ['Football', 'Travel', 'Cooking', 'Writing', 'Community'],
  links: [
    { href: 'https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS', text: 'Cricket stats on CricHeroes ↗' },
    { href: 'https://canterburycricketclub.com', text: 'The club website ↗' },
  ],
};

/* ---------- 6 · Contact ---------- */
export const CONTACT = {
  label: 'Have something in mind?',
  title: ['Let’s make it ', 'provable.'],
  lead: 'A role, a tricky validation question, a project you’re building, or cricket. Good problems, thoughtful people, good conversations.',
};
