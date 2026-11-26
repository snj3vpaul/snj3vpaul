#!/usr/bin/env python3
"""Apply additive portfolio redesign to the existing skp-portfolio directory.
Run from any location: python apply.py /path/to/snj3vpaul/skp-portfolio
Checks anchors before writing, backs up changed originals in .redesign-backup.
"""
import sys, shutil, re
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
SOURCE = Path(__file__).resolve().parent / "files"
if not (ROOT / "src/data/portfolio.ts").exists() or not (ROOT / "src/pages/LandingPage.tsx").exists():
    raise SystemExit("Pass the skp-portfolio directory containing src/data/portfolio.ts")

changes = {}
def edit(path, fn):
    filename = ROOT / path
    old = filename.read_text(encoding="utf-8")
    new = fn(old)
    if new == old:
        raise RuntimeError(f"No changes in {path}; repo may already be patched or anchors changed")
    changes[path] = new

def replace(source, old, new):
    if old not in source:
        raise RuntimeError(f"Missing expected anchor: {old[:95]!r}")
    return source.replace(old, new, 1)

def data_update(s):
    s = replace(s, 'tagline: "Cryptographic Validation · Compliance",', 'tagline: "Cybersecurity · FIPS 140-3 · Security assurance",')
    s = replace(s, 'location: "Ottawa, Canada · UTC−5",', 'location: "Ottawa, Canada",')
    s = replace(s, 'availability: "Open to: Technical Project Management · Security Certification programs",', 'availability: "Security assurance · Technical analysis · Project management",')
    start = s.index('export const hero = {')
    end = s.index('// ── Case studies', start)
    s = s[:start] + '''export const hero = {
  titleLead: "Hello, I'm Sanjeev. I make complex security work ",
  titleEm: "clearer",
  titleTail: ".",
  sub: "I work at the intersection of cryptographic validation, security assurance, and technical coordination — connecting engineering decisions to the evidence needed to stand behind them.",
};

export const personalStory = {
  paragraphs: [
    "I grew up in a tier-three city, in an education system that felt worlds apart from the one I would later navigate in Canada. The path here was neither obvious nor neatly planned.",
    "I came to Canada with ambitions of working in defensive security. Then Fortinet called. Certification and cryptographic validation weren't quite the path I'd pictured, but becoming part of that world changed the direction of my life.",
    "That experience has made me appreciate the distance between knowing a standard and making it real — the questions, people, technical decisions, and careful work that live in between.",
    "I'm generally low-profile, but I have plenty of thoughts. Writing gives me a way to explore them, and projects outside work give me room to try new ideas without having to turn everything into a career milestone.",
  ],
  signoff: "Still learning. Still building. Still figuring out the next chapter.",
};

export const principles = [
  { title: "Start with the right question", body: "Before jumping to a solution, I want to understand the actual problem and the assumptions behind it." },
  { title: "Make evidence do the talking", body: "In security validation, a convincing claim is one you can trace, test, and explain." },
  { title: "Work across boundaries", body: "Technical work becomes more effective when engineers, reviewers, and project stakeholders understand one another." },
  { title: "Keep room for curiosity", body: "Side projects, sport, and writing remind me that learning doesn't have to stay inside a job description." },
];

''' + s[end:]
    s = replace(s, 'export const navItems = [\n  { href: "#work", label: "Work" },\n  { href: "#experience", label: "Experience" },\n  { href: "#capabilities", label: "Capabilities" },\n  { href: "#credentials", label: "Credentials" },\n];', '''export const navItems = [
  { href: "#story", label: "My story" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#beyond", label: "Outside work" },
  { href: "#writing", label: "Writing" },
];''')
    s = replace(s, '"More than', '"More than') if False else s
    # Additional personal interests are based on the user's direct answers.
    needle = 'export const navItems = ['
    assert needle in s
    s = s.replace(needle, '''// Personal notes are not performance claims; keep this section genuinely human.
export const otherInterests = [
  { title: "Travel", body: "I enjoy discovering unfamiliar places and noticing how people live differently." },
  { title: "Kettlebells & movement", body: "Functional mobility matters to me more than chasing gym numbers." },
  { title: "Cooking experiments", body: "A simple protein-focused meal can still be an experiment in marinades and flavor." },
];

''' + needle, 1)
    return s
edit("src/data/portfolio.ts", data_update)

def page_update(s):
    s = replace(s, 'import Lifecycle from "../sections/LifeCycle";', 'import MyStory from "../sections/MyStory";\nimport Approach from "../sections/Approach";\nimport Writing from "../sections/Writing";')
    s = replace(s, 'import Capabilities from "../sections/Capabilities";\n', '')
    s = replace(s, '''        <TrustStrip />
        <Work />
        <Lifecycle />
        <Experience />
        <Capabilities />
        <Credentials />
        <BeyondWork />
        <Contact />''', '''        <MyStory />
        <Work />
        <Approach />
        <Experience />
        <BeyondWork />
        <Writing />
        <Credentials />
        <Contact />''')
    s = replace(s, 'Built secure · No client-side secrets · FIPS 140-3 · NDcPP · EUCC', 'A little work, a little curiosity, and everything in between.')
    return s
edit("src/pages/LandingPage.tsx", page_update)

def navbar_update(s):
    s = replace(s, 'import { profile, navItems } from "../../data/portfolio";', 'import { profile, navItems } from "../../data/portfolio";\nimport ThemeToggle from "../ThemeToggle";')
    s = replace(s, '        <button\n          className={`menu-btn', '        <ThemeToggle />\n        <button\n          className={`menu-btn')
    return s
edit("src/components/Navbar/Navbar.tsx", navbar_update)

def hero_update(s):
    s = replace(s, '<p className="sub reveal">{hero.sub}</p>', '<p className="sub reveal">{hero.sub}</p>\n          <p className="hero-personal reveal">Away from the desk: cricket, football, community, travel, writing, and building for fun.</p>')
    return s
edit("src/sections/Hero.tsx", hero_update)

def beyond_update(s):
    s = replace(s, 'import { beyond } from "../data/portfolio";', 'import { beyond, otherInterests } from "../data/portfolio";')
    s = replace(s, 'More than the work — the habits that shape how I deliver.', "The things that make life interesting.")
    s = replace(s, '''        <div className="beyond stagger">''', '''        <p className="lead">Sport, community, movement, good food, and the occasional detour. Not everything needs to turn into a productivity lesson.</p>
        <div className="beyond stagger">''')
    s = replace(s, '''        </div>
      </div>
    </section>''', '''        </div>
        <div className="principles-grid" aria-label="Other interests">
          {otherInterests.map((item) => (
            <article className="principle-tile" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>''')
    return s
edit("src/sections/BeyondWork.tsx", beyond_update)

def main_update(s):
    s = replace(s, 'import "./styles/theme-warm.css";', 'import "./styles/theme-warm.css";\nimport "./styles/redesign.css";')
    return s
edit("src/main.tsx", main_update)

def index_update(s):
    s = replace(s, '<link rel="icon" type="image/svg+xml" href="/vite.svg" />', '<meta name="theme-color" content="#100E0C" />\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />')
    s = replace(s, '<title>skp-portfolio</title>', '''<title>Sanjeev Kumar Paul | Security Assurance, Work & Life</title>
    <meta name="description" content="Meet Sanjeev Kumar Paul, a cybersecurity and FIPS 140-3 professional in Ottawa. Explore security validation work, independent projects, writing, and life outside work." />
    <meta name="author" content="Sanjeev Kumar Paul" />
    <link rel="canonical" href="https://snj3vpaul.vercel.app/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Sanjeev Kumar Paul | Work & Life" />
    <meta property="og:description" content="Security assurance, curious projects, considered writing, and life outside work." />
    <meta property="og:url" content="https://snj3vpaul.vercel.app/" />
    <meta name="twitter:card" content="summary" />''')
    return s
edit("index.html", index_update)

# Validate all anchors BEFORE writing, to avoid partial changes.
backup = ROOT / ".redesign-backup"
backup.mkdir(exist_ok=True)
for relative, updated in changes.items():
    src = ROOT / relative
    dest = backup / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
for relative, updated in changes.items():
    (ROOT / relative).write_text(updated, encoding="utf-8")
for src in (SOURCE / "src").rglob("*"):
    if src.is_file():
        dest = ROOT / src.relative_to(SOURCE)
        if dest.exists():
            raise RuntimeError(f"New file already exists, will not overwrite: {dest}")
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)

favicon = ROOT / "public/favicon.svg"
if not favicon.exists():
    favicon.parent.mkdir(exist_ok=True)
    favicon.write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#100e0c"/><text x="32" y="40" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="25" fill="#d8c7ac">SKP</text></svg>''', encoding="utf-8")
print(f"Applied redesign to {ROOT}. Backups: {backup}")
print("Next: npm install && npm run lint && npm run build && npm run dev")
