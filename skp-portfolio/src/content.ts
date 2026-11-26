/* Every word on the home page lives here, carried over verbatim from the previous site. */

export const EMAIL = 'sanjeevkumarpaul25@gmail.com';
export const MAILTO = `mailto:${EMAIL}?subject=Hello%20Sanjeev`;
export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/sanjeev-kumar-paul/',
  github: 'https://github.com/snj3vpaul/',
  medium: 'https://medium.com/@sanjeevkumarpaul25',
  cv: '/cv.pdf',
};

export const NAV = [
  { href: '#work', label: 'Work' }, { href: '#projects', label: 'Projects' }, { href: '#sports', label: 'Sports' },
  { href: '#approach', label: 'Approach' }, { href: '#journey', label: 'Journey' }, { href: '#writing', label: 'Writing' }, { href: '#life', label: 'Life' },
];
export const MOBILE_NAV = [
  { href: '#work', label: 'Selected work' }, { href: '#projects', label: 'Projects' }, { href: '#sports', label: 'Sports projects' },
  { href: '#impact', label: 'On the record' }, { href: '#approach', label: 'The approach' }, { href: '#journey', label: 'Along the way' },
  { href: '#writing', label: 'Field notes' }, { href: '#life', label: 'Away from the desk' }, { href: '#field', label: 'On the field' },
];

export const HERO = {
  hello: 'Hello — I’m Sanjeev Kumar Paul',
  where: 'Ottawa, Canada · 45.42° N',
  lead: 'I’m a Compliance Analyst at Fortinet, a cricketer most weekends, and someone who keeps building small, useful things in between: tools, leagues and websites for the people around me.',
  stack: ['FIPS 140-3', 'CMVP', 'ACVP', 'Common Criteria / NDcPP', 'TLS', 'SSH', 'KVM'],
  tagline: 'Standards by trade. Curious by default.',
};

export type Status = 'valid' | 'pending' | 'lead';
export const WORK = [
  { id: 'work-forticlient-crypto-module', hid: 'proj-1', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiClient Crypto Module v1.0', desc: 'Scoped the module boundary and built the evidence NIST validated.', status: 'valid' as Status, statusText: 'Validated by NIST', href: '/project-forticlient-crypto-module.html', track: 'explore-forticlient-crypto-module', art: 'arch', cap: '#5493 · public validation record' },
  { id: 'work-forticlient-7-0-2', hid: 'proj-2', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiClient 7.0.2', desc: 'Led the workstream behind Fortinet’s first FIPS 140-3 VPN certification.', status: 'lead' as Status, statusText: 'Led the workstream', href: '/project-forticlient-7-0-2.html', track: 'explore-forticlient-7-0-2', art: 'bars', cap: 'First FIPS 140-3 VPN certification' },
  { id: 'work-fortiproxy', hid: 'proj-3', kicker: 'At Fortinet · FIPS 140-3', title: 'FortiProxy firmware & VM', desc: 'Coordinating two Level 1 validations, firmware and VM, through CMVP review.', status: 'pending' as Status, statusText: 'In review', href: '/project-fortiproxy.html', track: 'explore-fortiproxy', art: 'chip', cap: 'Two modules · Level 1 targets' },
];
export const WORK_LEAD = 'By day, I help security products prove what they claim. I turn security standards into questions engineers can answer, and their answers into evidence a lab can certify.';
export const WORK_NOTE = 'Certificates are issued to modules, not people. Each project says what my part was.';

export const RECORD = [
  { value: 2, suffix: '', label: 'Cryptographic modules validated by NIST that I worked on', link: { href: '#work-forticlient-crypto-module', text: '2 NIST-validated modules ↑', track: 'proof-validated-modules' } },
  { value: 1, suffix: 'st', label: 'FIPS 140-3 certification for a Fortinet VPN product, a workstream I led', link: { href: '#work-forticlient-7-0-2', text: 'Led the workstream ↑', track: 'proof-first-vpn-certification' } },
  { value: 5, suffix: '', label: 'Algorithm families ACVP-tested: AES, RSA, SHA, HMAC, ECDSA' },
  { value: 4, suffix: '+', label: 'Years in security certification, FIPS 140-3 and Common Criteria' },
];
export const PIPELINE = [
  { stage: 'Scoped', items: [] as { s: Status; t: string }[] },
  { stage: 'Tested', items: [] as { s: Status; t: string }[] },
  { stage: 'Submitted', items: [{ s: 'pending' as Status, t: 'FortiProxy firmware' }, { s: 'pending' as Status, t: 'FortiProxy VM' }] },
  { stage: 'Validated', items: [{ s: 'valid' as Status, t: 'FortiClient 7.0.2' }, { s: 'valid' as Status, t: 'FortiClient Crypto Module v1.0' }] },
];

export const PROJECTS = [
  {
    id: 'forkcast', kicker: 'Built on my own time', title: ['Fork', 'Cast.'], video: 'forkcast', caption: 'A decision, mapped',
    lead: 'Paste a written decision, get a flowchart back. Built with Next.js and TypeScript, with every diagram drawn as hand-built SVG.',
    tools: [['Text in, flowchart out', 'Takes anything from a one-line choice to a multi-page SOP and maps its gates, actors, loops and dead ends.'], ['Shows what’s missing', 'Draws unstated paths as dashed lines and lists every inferred step in an assumption ledger.'], ['The open question', 'Ends with the one question the source text leaves unanswered.']],
    spec: [['Stack', 'Next.js 15 · TypeScript'], ['Export', 'SVG · Mermaid'], ['Status', 'Live']],
    links: [{ href: 'https://forkcast-rose.vercel.app', text: 'Try ForkCast ↗', track: 'open-forkcast', primary: true, external: true }, { href: '/project-forkcast.html', text: 'Project details →', track: 'explore-forkcast' }, { href: 'https://github.com/snj3vpaul/ForkCast', text: 'Code on GitHub ↗', track: 'forkcast-github', external: true }],
  },
  {
    id: 'fabric', kicker: 'Built on my own time', title: ['What-The-', 'Fabric.'], video: 'fabric', caption: 'Cloth on the line',
    lead: 'Decodes fabric names, compositions and care labels for people outside the trade. Designed, built and shipped solo.',
    // CHECK: the three descriptions below are expanded from your one-line summary; correct any detail that's off, and add the stack.
    tools: [['Fabric names', 'Explains what a fabric name actually means, in plain words.'], ['Compositions', 'Breaks down what a blend is made of and what that means for the garment.'], ['Care labels', 'Translates the symbols on a care label into what to do on wash day.']],
    spec: [['Type', 'Web app'], ['Built', 'Solo'], ['Status', 'Live']],
    links: [{ href: 'https://what-the-fabric.vercel.app', text: 'Try What-The-Fabric ↗', track: 'open-wtf', primary: true, external: true }, { href: '/project-what-the-fabric.html', text: 'Project details →', track: 'explore-what-the-fabric' }],
  },
  {
    id: 'lab', kicker: 'Private tool · no public demo', title: ['Crypto Lab ', 'Chip.'], video: 'lab', caption: 'Three tools, one chip',
    lead: 'Why it exists: one toolkit for the problems I kept running into in certification work. Written in Rust, served by Actix Web.',
    // CHECK: the three descriptions below are written from your one-line brief; correct any detail that's off.
    tools: [['Excel → PDF, links intact', 'Exporting evidence spreadsheets to PDF kept dropping their hyperlinks. This keeps every link clickable.'], ['Firmware teardown', 'Unpacks and inspects firmware images, so I can see what’s inside before anyone makes a claim about it.'], ['TLS & SSH scan', 'Checks what a device really offers on the wire: protocol versions, ciphers and key exchanges.']],
    spec: [['Status', 'Private tool · no public demo'], ['Language', 'Rust'], ['Server', 'Actix Web']],
    links: [] as { href: string; text: string; track: string; primary?: boolean; external?: boolean }[],
  },
];

export const SIDE = {
  lead: 'Most of what I build outside work starts with something I care about. One project maps a life onto a globe; the others are sites and leagues for the clubs I spend my weekends with.',
  items: [
    { id: 'sport-1', kicker: 'Club fantasy league', title: 'RSFC League', art: 'pitch', cap: 'White vs Red · every Thursday', text: 'RSFC’s in-house soccer league. A seeded, verifiable draw splits whoever turns up into White and Red, points come straight from the scorecard, and members play Pick 7: an FPL-style team of seven within a star budget.', spec: [['Stack', 'Next.js · Upstash Redis'], ['Status', 'Live · weekly']], links: [{ href: 'https://s3v-xi.vercel.app', text: 'Open RSFC League ↗', track: 'open-rsfc-league', primary: true, external: true }, { href: 'https://github.com/snj3vpaul/s3v-xi', text: 'Code on GitHub ↗', track: 'rsfc-league-github', external: true }] },
    { id: 'sport-2', kicker: 'Club website', title: 'Canterbury Cricket Club', art: 'ball', cap: 'Live community website', text: 'The club’s public website, built and maintained end to end: requirements, architecture, build and deployment, with access control and secure-SDLC practices from the start.', spec: [['Stack', 'React · Vercel'], ['Status', 'Live · maintained']], links: [{ href: 'https://canterburycricketclub.com', text: 'Visit the site ↗', track: 'open-canterbury', primary: true, external: true }, { href: '/project-canterbury-cricket-club.html', text: 'Project details →', track: 'explore-canterbury-cricket-club' }] },
    { id: 'sport-3', kicker: 'Independent build · Ongoing', title: 'The Journey', art: 'globe', cap: 'A life, place by place', text: 'An interactive 3D globe that tells a person’s life as a story of places. Where they were born, where they’ve lived, where they’ve visited: each becomes a waypoint on a personal timeline, joined by animated routes.', spec: [['Format', 'Interactive 3D globe'], ['Status', 'Ongoing · still being built']], pending: 'In progress — case study coming', quote: 'I wanted a different way of remembering where life happens. The world starts in darkness, and as the timeline moves forward, the places that shaped someone light up one by one. It’s a picture of how our world grows with what we’ve lived.', links: [] as { href: string; text: string; track: string; primary?: boolean; external?: boolean }[] },
  ],
};

export const APPROACH = {
  lead: 'Most of the value is in the translation: from a requirement to a concrete engineering question, and from an answer to evidence someone else can examine. I sit between engineering, QA, product teams and accredited labs, and keep everyone working from the same understanding.',
  principles: [
    { k: 'Principle · Scope', h: ['Define the ', 'boundary.'], p: 'Agree what is inside the module and what is not, before anyone tests anything.', art: 'scope' },
    { k: 'Principle · Questions', h: ['Ask what we can actually ', 'demonstrate.'], p: 'Turn each requirement into a concrete question an engineer can answer.', art: 'questions' },
    { k: 'Principle · Evidence', h: ['Leave evidence someone else can ', 'follow.'], p: 'Turn each answer into evidence a lab can examine without me in the room.', art: 'evidence' },
  ],
};

export const JOURNEY = {
  lead: 'I came to Canada hoping to find my place in defensive security. A role in certification changed the direction of that journey, and gave me a different perspective on what makes systems trustworthy. Each step taught me something new about the same problem: how to make complicated work reviewable.',
  path: [
    { years: '2025 — Now', role: 'Project Management Compliance Analyst', org: 'Fortinet' },
    { years: '2023 — 2025', role: 'Junior Project Management Compliance Analyst', org: 'Fortinet' },
    { years: '2022 — 2023', role: 'Junior Compliance Analyst', org: 'Fortinet' },
    { years: '2020 — 2022', role: 'Master’s, Information Systems Security', org: 'Concordia University' },
  ],
  // ADD: link each credential to its verification page (Credly / CompTIA / INE) once you have the URLs.
  creds: [['CySA+', 'CompTIA · Cybersecurity Analyst'], ['Security+', 'CompTIA'], ['eJPT', 'INE Security (eLearnSecurity) · Junior Penetration Tester']],
  credsFoot: 'Credentials are useful. Curiosity matters more.',
};

export const WRITING = [
  // DATED ENTRIES: add one object per article, newest first: { href, meta: 'Nov 2026 · Medium', title }
  { href: 'https://medium.com/@sanjeevkumarpaul25', meta: 'Ongoing · Medium', title: 'Notes on security, technology, and what I’m learning' },
  { href: 'https://www.journalijar.com/uploads/2022/04/6276555b2375a_IJAR-39401.pdf', meta: '2022 · Graduate survey paper · IJAR', title: 'SoK: Is iPhone Actually Secure?' },
];

export const LIFE = {
  lead: 'Cricket has been a constant. So have writing, learning things for no particular reason, and finding time for the people around me. I play whenever I can, and I built and still look after my club’s website.',
  links: [{ href: 'https://cricheroes.com/player-profile/21592804/Sanjeev-K-Paul/matches#STATS', text: 'A little cricket proof ↗' }, { href: 'https://canterburycricketclub.com', text: 'The club website ↗' }],
  greetings: [['Hello', 'English'], ['Bonjour', 'French'], ['नमस्ते', 'Hindi'], ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Punjabi'], ['নমস্কার', 'Bengali']] as [string, string][],
  interests: ['Cricket', 'Writing', 'Football', 'Community', 'Travel', 'Cooking'],
  gives: { label: 'What the game gives back', words: ['Patience.', 'Timing.', 'Perspective.'], note: 'Team sport, community, and a different kind of field awareness.' },
};

export const FIELD = {
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
  ],
  carry: [
    ['Captaincy', 'Getting engineers and reviewers to the same deadline, together.'],
    ['Vice-captaincy, two finals reached', 'Stepping up, reliably, when the structure around me changes.'],
    ['Chasing under pressure', 'Staying calm while triaging a production issue.'],
    ['Averaging 42 across a season', 'Consistency and repeatability, which is what good validation evidence is made of.'],
    ['Tournament MVP', 'A good individual day that only counts if the team gets the result.'],
  ],
};

export const CONTACT = {
  label: 'Have something in mind?',
  lead: 'A role, a tricky validation question, a project you’re building, or cricket. Good problems, thoughtful people, good conversations.',
};
