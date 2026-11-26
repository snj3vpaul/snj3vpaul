/*
 * Every public fact on the home page, in one place.
 * Sources: the live site as of commit 3ae0dbf, the project pages, and cv.pdf (see CONTENT-NOTES.md).
 * Nothing here is invented; anything awaiting the owner's confirmation is marked `unconfirmed`.
 */

export const profile = {
  name: 'Sanjeev K Paul',
  role: 'Compliance Analyst',
  employer: 'Fortinet',
  since: '2022',
  location: 'Ottawa, Canada',
  email: 'sanjeevkumarpaul25@gmail.com',
  url: 'https://snj3vpaul.vercel.app/',
  links: {
    linkedin: 'https://www.linkedin.com/in/sanjeev-kumar-paul/',
    github: 'https://github.com/snj3vpaul/',
    medium: 'https://medium.com/@sanjeevkumarpaul25',
    cv: 'cv.pdf',
    cricket: 'https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS',
    club: 'https://canterburycricketclub.com',
  },
  headline: { before: 'I help security products', em: 'prove', after: 'what they claim.' },
  role_line: 'I turn security standards into questions engineers can answer, and their answers into evidence a lab can certify.',
  stack: 'FIPS 140-3 · CMVP · ACVP · Common Criteria / NDcPP · TLS · SSH · KVM',
};

/** The words the hero cipher decrypts, in order. */
export const chain = ['standard', 'question', 'answer', 'evidence', 'certificate'] as const;
export const cipherKey = [0x5c, 0x1e, 0xa7, 0x39] as const;

export const greetings = [
  { word: 'Hello', lang: 'en', name: 'English', hex: '48 65 6c 6c 6f' },
  { word: 'Bonjour', lang: 'fr', name: 'French' },
  { word: 'नमस्ते', lang: 'hi', name: 'Hindi' },
  { word: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa', name: 'Punjabi' },
  { word: 'নমস্কার', lang: 'bn', name: 'Bengali' },
];

export const intro = {
  title: { before: 'Standards by trade.', em: 'Curious by default.' },
  lead: 'Most of the value is in the translation: from a requirement to a concrete engineering question, and from an answer to evidence someone else can examine.',
  text: 'I sit between engineering, QA, product teams and accredited labs, and keep everyone working from the same understanding. I came to Canada hoping to find my place in defensive security; a role in certification changed the direction of that journey, and gave me a different perspective on what makes systems trustworthy.',
};

export type Stage = { id: string; name: string; sub: string; body: string; mine: string; art: 'keys' | 'boundary' | 'evidence' | 'seal' };
export const pipeline: { title: { before: string; em: string }; lead: string; note: string; stages: Stage[] } = {
  title: { before: 'Standards are detailed. People are', em: 'complicated.' },
  lead: 'Four areas my work keeps moving between. Scroll through them, or pick one to see where I come in.',
  note: 'A way of seeing how my work connects, not a workflow every product follows. Real programmes loop back, run stages in parallel, and differ between FIPS 140-3 and Common Criteria.',
  stages: [
    { id: 'cryptography', name: 'Cryptography', sub: 'The algorithms, and the boundary around them', art: 'keys',
      body: 'Agree what is inside the module and what is not, before anyone tests anything. Then confirm which algorithms the module really supports.',
      mine: 'Scoping module boundaries; ACVP testing for AES, RSA, SHA, HMAC and ECDSA.' },
    { id: 'implementation', name: 'Implementation', sub: 'How the product actually uses them', art: 'boundary',
      body: 'Ask what we can actually demonstrate. Turn each requirement into a concrete question an engineer can answer about the shipped product.',
      mine: 'Key-management flows, approved-mode checks, and what TLS and SSH really offer on the wire, checked with Wireshark, Nmap and SSHScan.' },
    { id: 'validation', name: 'Validation', sub: 'Evidence someone else can follow', art: 'evidence',
      body: 'Leave evidence someone else can follow. Turn each answer into evidence a lab can examine without me in the room.',
      mine: 'Security Policies (NIST SP 800-140B) and certification evidence; the main contact between engineering and the accredited labs while findings are resolved.' },
    { id: 'certification', name: 'Certification', sub: 'A public record, issued to a module', art: 'seal',
      body: 'Certificates are issued to modules, not people. The public record is the end of the work, not the work itself.',
      mine: 'FIPS 140-3 through NIST CMVP, including certificate #5493; Common Criteria evaluations against NDcPP.' },
  ],
};

export type Status = 'valid' | 'pending' | 'ongoing';
export type Case = {
  id: string; kicker: string; title: string; when: string; desc: string;
  status: { kind: Status; label: string }; notes: [string, string][];
  links: { label: string; href: string; external?: boolean }[]; art: 'arches' | 'bars' | 'chip' | 'grid' | 'rows' | 'docs';
};
export const work: Case[] = [
  { id: 'work-forticlient-crypto-module', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiClient Crypto Module v1.0', when: 'Validated 17 Aug 2026 · CMVP #5493',
    desc: 'Scoped the module boundary and built the evidence NIST validated.', status: { kind: 'valid', label: 'Validated by NIST' },
    notes: [['Scope', 'Scoping · boundary · key-management flows · approved-mode checks'], ['Certificate', 'NIST CMVP #5493'], ['Level', 'Security Level 1, software']],
    links: [{ label: 'Full case', href: 'project-forticlient-crypto-module.html' }, { label: 'NIST record', href: 'https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5493', external: true }], art: 'arches' },
  { id: 'work-forticlient-7-0-2', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiClient 7.0.2', when: '2023 — 2025',
    desc: 'Led the workstream behind Fortinet’s first FIPS 140-3 VPN certification.', status: { kind: 'valid', label: 'Led the workstream' },
    notes: [['Scope', 'Boundaries · key management · approved mode · lab liaison'], ['Testing', 'ACVP: AES, RSA, SHA, HMAC, ECDSA'], ['Documents', 'Security Policy (NIST SP 800-140B)']],
    links: [{ label: 'Full case', href: 'project-forticlient-7-0-2.html' }], art: 'bars' },
  { id: 'work-fortiproxy', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiProxy firmware & VM', when: '2025 — now',
    desc: 'Coordinating two Level 1 validations, firmware and VM, through CMVP review.', status: { kind: 'pending', label: 'In review' },
    notes: [['Scope', 'Planning · evidence delivery · lab findings · KVM test environments'], ['Modules', '2 (firmware, virtual machine)'], ['Status', 'Submitted to NIST CMVP, in review']],
    links: [{ label: 'Full case', href: 'project-fortiproxy.html' }], art: 'chip' },
  { id: 'work-common-criteria', kicker: 'At Fortinet · Common Criteria', title: 'NDcPP v4 transition', when: '2025 — now · earlier EAL4 work 2022 — 2023',
    desc: 'Requirement analysis for the move to NDcPP v4, aligning products with the SSH, TLS and X.509 Functional Packages.', status: { kind: 'ongoing', label: 'Ongoing' },
    notes: [['Standards', 'Common Criteria · NDcPP v3/v4'], ['Packages', 'SSH · TLS · X.509'], ['Earlier', 'Designed and ran test scenarios for EAL4 Common Criteria evaluations']],
    links: [], art: 'grid' },
  { id: 'work-acvp', kicker: 'At Fortinet · Cryptographic validation', title: 'Algorithm testing (ACVP)', when: '2022 — 2025',
    desc: 'ACVP testing for AES, RSA, SHA, HMAC and ECDSA, and validating modules in FIPS mode across virtualised and hardware platforms.', status: { kind: 'valid', label: '5 algorithm families' },
    notes: [['Algorithms', 'AES · RSA · SHA · HMAC · ECDSA'], ['Platforms', 'Virtualised and hardware'], ['Protocol checks', 'Nmap · Wireshark · SSHScan, defects tracked to resolution']],
    links: [], art: 'rows' },
  { id: 'work-evidence', kicker: 'At Fortinet · Documentation & coordination', title: 'Evidence & lab liaison', when: '2023 — now',
    desc: 'Security Policies and certification evidence that let independent labs test in compliant environments, and the day-to-day link between engineering teams and accredited labs.', status: { kind: 'ongoing', label: 'Ongoing' },
    notes: [['Documents', 'Security Policies · certification evidence'], ['Teams', 'Engineering · QA · product · accredited labs'], ['Environments', 'KVM-based test setups for certification']],
    links: [], art: 'docs' },
];

export const record = {
  sheet: [
    ['Cryptographic modules validated by NIST that I worked on', '2'],
    ['FIPS 140-3 certification for a Fortinet VPN product, a workstream I led', '1st'],
    ['Algorithm families ACVP-tested: AES, RSA, SHA, HMAC, ECDSA', '5'],
    ['Years in security certification, FIPS 140-3 and Common Criteria', '4+'],
  ] as [string, string][],
  status: [
    { stage: 'Scoped', items: [] as { label: string; kind: Status }[] },
    { stage: 'Tested', items: [] },
    { stage: 'Submitted', items: [{ label: 'FortiProxy firmware', kind: 'pending' }, { label: 'FortiProxy VM', kind: 'pending' }] },
    { stage: 'Validated', items: [{ label: 'FortiClient 7.0.2', kind: 'valid' }, { label: 'FortiClient Crypto Module v1.0', kind: 'valid' }] },
  ],
};

export type Build = {
  id: string; tab: string; kicker: string; title: { before: string; em: string }; lead: string;
  tools: [string, string][]; spec: [string, string][];
  actions: { label: string; href: string; solid?: boolean; external?: boolean; track: string }[];
  video: { src: string; poster: string; caption: string }; unconfirmed?: boolean;
};
export const builds: Build[] = [
  { id: 'forkcast', tab: 'ForkCast', kicker: 'Built on my own time', title: { before: 'Fork', em: 'Cast.' },
    lead: 'Paste a written decision, get a flowchart back. Built with Next.js and TypeScript, with every diagram drawn as hand-built SVG.',
    tools: [['Text in, flowchart out', 'Takes anything from a one-line choice to a multi-page SOP and maps its gates, actors, loops and dead ends.'], ['Shows what’s missing', 'Draws unstated paths as dashed lines and lists every inferred step in an assumption ledger.'], ['The open question', 'Ends with the one question the source text leaves unanswered.']],
    spec: [['Stack', 'Next.js 15 · TypeScript'], ['Export', 'SVG · Mermaid'], ['Status', 'Live']],
    actions: [{ label: 'Try ForkCast ↗', href: 'https://forkcast-rose.vercel.app', solid: true, external: true, track: 'open-forkcast' }, { label: 'Project details →', href: 'project-forkcast.html', track: 'explore-forkcast' }, { label: 'Code on GitHub ↗', href: 'https://github.com/snj3vpaul/ForkCast', external: true, track: 'forkcast-github' }],
    video: { src: 'img/loops/forkcast.mp4', poster: 'img/loops/forkcast-poster.webp', caption: 'A decision, mapped' } },
  { id: 'fabric', tab: 'What-The-Fabric', kicker: 'Built on my own time', title: { before: 'What-The-', em: 'Fabric.' },
    lead: 'Decodes fabric names, compositions and care labels for people outside the trade. Designed, built and shipped solo.',
    tools: [['Fabric names', 'Explains what a fabric name actually means, in plain words.'], ['Compositions', 'Breaks down what a blend is made of and what that means for the garment.'], ['Care labels', 'Translates the symbols on a care label into what to do on wash day.']],
    spec: [['Type', 'Web app'], ['Built', 'Solo'], ['Status', 'Live']],
    actions: [{ label: 'Try What-The-Fabric ↗', href: 'https://what-the-fabric.vercel.app', solid: true, external: true, track: 'open-wtf' }, { label: 'Project details →', href: 'project-what-the-fabric.html', track: 'explore-what-the-fabric' }],
    video: { src: 'img/loops/fabric.mp4', poster: 'img/loops/fabric-poster.webp', caption: 'Cloth on the line' }, unconfirmed: true },
  { id: 'lab', tab: 'Crypto Lab Chip', kicker: 'Private tool · no public demo', title: { before: 'Crypto Lab ', em: 'Chip.' },
    lead: 'Why it exists: one toolkit for the problems I kept running into in certification work. Written in Rust, served by Actix Web.',
    tools: [['Excel → PDF, links intact', 'Exporting evidence spreadsheets to PDF kept dropping their hyperlinks. This keeps every link clickable.'], ['Firmware teardown', 'Unpacks and inspects firmware images, so I can see what’s inside before anyone makes a claim about it.'], ['TLS & SSH scan', 'Checks what a device really offers on the wire: protocol versions, ciphers and key exchanges.']],
    spec: [['Status', 'Private tool · no public demo'], ['Language', 'Rust'], ['Server', 'Actix Web']],
    actions: [], video: { src: 'img/loops/lab.mp4', poster: 'img/loops/lab-poster.webp', caption: 'Three tools, one chip' }, unconfirmed: true },
];

export const clubs = {
  lead: 'Most of what I build outside work starts with something I care about. One project maps a life onto a globe; the others are sites and leagues for the clubs I spend my weekends with.',
  canterbury: {
    title: 'Canterbury Cricket Club', kicker: 'Club website',
    text: 'The club’s public website, built and maintained end to end: requirements, architecture, build and deployment, with access control and secure-SDLC practices from the start.',
    spec: [['Stack', 'React · Vercel'], ['Status', 'Live · maintained']] as [string, string][],
    puzzle: { plain: 'SECURE FROM THE FIRST OVER', shift: 7 },
  },
  rsfc: {
    title: 'RSFC League', kicker: 'Club fantasy league', cap: 'White vs Red · every Thursday',
    text: 'RSFC’s in-house soccer league. A seeded, verifiable draw splits whoever turns up into White and Red, points come straight from the scorecard, and members play Pick 7: an FPL-style team of seven within a star budget.',
    spec: [['Stack', 'Next.js · Upstash Redis'], ['Status', 'Live · weekly']] as [string, string][],
  },
  journey: {
    title: 'The Journey', kicker: 'Independent build · Ongoing', cap: 'A life, place by place',
    text: 'An interactive 3D globe that tells a person’s life as a story of places. Where they were born, where they’ve lived, where they’ve visited: each becomes a waypoint on a personal timeline, joined by animated routes.',
    spec: [['Format', 'Interactive 3D globe'], ['Status', 'Ongoing · still being built']] as [string, string][],
    note: 'I wanted a different way of remembering where life happens. The world starts in darkness, and as the timeline moves forward, the places that shaped someone light up one by one.',
  },
};

export const journey = {
  lead: 'Each step taught me something new about the same problem: how to make complicated work reviewable.',
  steps: [
    { when: '2025 — Now', title: 'Project Management Compliance Analyst', org: 'Fortinet', line: 'Cross-functional certification projects; the NDcPP v4 transition.' },
    { when: '2023 — 2025', title: 'Junior Project Management Compliance Analyst', org: 'Fortinet', line: 'Led the workstream behind Fortinet’s first FIPS 140-3 VPN certification.' },
    { when: '2022 — 2023', title: 'Junior Compliance Analyst', org: 'Fortinet', line: 'Common Criteria test scenarios and ACVP testing.' },
    { when: '2020 — 2022', title: 'Master’s, Information Systems Security', org: 'Concordia University', line: '' },
  ],
  creds: [['CySA+', 'CompTIA · Cybersecurity Analyst'], ['Security+', 'CompTIA'], ['eJPT', 'INE Security (eLearnSecurity) · Junior Penetration Tester']] as [string, string][],
};

export const writing = [
  { meta: 'Ongoing · Medium', title: 'Notes on security, technology, and what I’m learning', href: 'https://medium.com/@sanjeevkumarpaul25' },
  { meta: '2022 · Graduate survey paper · IJAR', title: 'SoK: Is iPhone Actually Secure?', href: 'https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf' },
];

export const life = {
  lead: 'Cricket has been a constant. So have writing, learning things for no particular reason, and finding time for the people around me. I play whenever I can, and I built and still look after my club’s website.',
  interests: ['Cricket', 'Writing', 'Football', 'Community', 'Travel', 'Cooking'],
};

export const field = {
  lead: 'The game has given me more than I have given it. Still, a few seasons went well, and these are the ones the scorebook remembers. Mostly cricket, with one soccer cup in the middle.',
  reel: [
    ['Cricket · Selection', '2012', 'Punjab Summer Camp', 'Picked for the camp · 2012'],
    ['Cricket · Inter-District', '2012', 'Represented NDCA', 'Inter-District · 2012'],
    ['Cricket · University', '2018', 'Inter-Department champions', 'Represented Department IT · 22* (31) and 2 wickets in the final'],
    ['Soccer · University', '2019', 'Inter-Hostel Soccer Cup', 'Represented BH9 · Won the cup'],
    ['Cricket · Kanata CC', '75*', 'First ever T20 fifty for Kanata CC', '75 not out · 2022'],
    ['Cricket · Kanata CC', '223', 'Leading Kanata T20 run scorer', '223 runs · 2023'],
    ['MVP · Ottawa Tuskers', '2023', 'Ottawa Tuskers Tournament MVP', '1st ever · 2023'],
    ['Cricket · Canterbury', '2024', 'Leading Canterbury Challenge run scorer', 'Canterbury Challenge · 2024'],
    ['MVP · OVCC T20', '2025', 'OVCC T20 MVP', 'T20 · 2025'],
    ['Best batter · OVCC T20', '2025', 'OVCC T20 Best Batter', 'T20 · 2025'],
    ['Runs · Average 42', '1,000+', 'The 2025 season', '1,000+ runs · Average 42'],
    ['Final · Canterbury', '2026', 'Canterbury, to the final', 'Led across my full tenure · 4th in the T20 MVP race · To the final as vice-captain as well'],
  ] as [string, string, string, string][],
  carry: [
    ['Captaincy', 'Getting engineers and reviewers to the same deadline, together.'],
    ['Vice-captaincy, two finals reached', 'Stepping up, reliably, when the structure around me changes.'],
    ['Chasing under pressure', 'Staying calm while triaging a production issue.'],
    ['Averaging 42 across a season', 'Consistency and repeatability, which is what good validation evidence is made of.'],
    ['Tournament MVP', 'A good individual day that only counts if the team gets the result.'],
  ] as [string, string][],
};

export const contact = {
  lead: 'A role, a tricky validation question, a project you’re building, or cricket. Good problems, thoughtful people, good conversations.',
};

export const nav = [
  { href: '#about', label: 'About' }, { href: '#expertise', label: 'Expertise' }, { href: '#work', label: 'Work' },
  { href: '#projects', label: 'Projects' }, { href: '#journey', label: 'Journey' }, { href: '#writing', label: 'Writing' }, { href: '#life', label: 'Life' },
];
export const mobileNav = [
  { href: '#about', label: 'About' }, { href: '#expertise', label: 'Expertise' }, { href: '#work', label: 'Professional work' },
  { href: '#impact', label: 'On the record' }, { href: '#projects', label: 'Personal projects' }, { href: '#journey', label: 'Along the way' },
  { href: '#writing', label: 'Field notes' }, { href: '#life', label: 'Away from the desk' }, { href: '#field', label: 'On the field' },
];
