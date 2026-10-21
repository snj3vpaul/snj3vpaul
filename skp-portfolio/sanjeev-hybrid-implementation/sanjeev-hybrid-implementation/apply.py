#!/usr/bin/env python3
"""Install the approved editorial hybrid UI into a local skp-portfolio checkout.

Usage: python apply.py "D:/VS_Code/snj3vpaul/skp-portfolio"
This does not touch case studies, certifications, links, contact form, or dependencies.
"""
from pathlib import Path
import shutil
import sys
from datetime import datetime

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
HERE = Path(__file__).resolve().parent
FILES = HERE / 'files'
required = [ROOT / 'src/data/portfolio.ts', ROOT / 'src/pages/LandingPage.tsx', ROOT / 'src/components/Navbar/Navbar.tsx', ROOT / 'src/main.tsx', ROOT / 'src/sections/Contact.tsx']
missing = [str(x.relative_to(ROOT)) for x in required if not x.is_file()]
if missing:
    raise SystemExit('Not the skp-portfolio root, missing: ' + ', '.join(missing))

main_path = ROOT / 'src/main.tsx'
main_text = main_path.read_text(encoding='utf-8')
if 'theme-hybrid.css' in main_text:
    raise SystemExit('Hybrid theme is already imported. No files were changed.')

styles = main_text.splitlines(keepends=True)
style_positions = [i for i, line in enumerate(styles) if line.strip().startswith('import ') and '.css' in line]
if not style_positions:
    raise SystemExit('src/main.tsx has no CSS imports. Inspect the entrypoint manually; nothing changed.')
styles.insert(style_positions[-1] + 1, 'import "./styles/theme-hybrid.css";\n')
new_main = ''.join(styles)

resume_ready = (ROOT / 'public/cv.pdf').is_file()
content = (FILES / 'src/data/hybridContent.ts').read_text(encoding='utf-8').replace('resumeEnabled: false,', 'resumeEnabled: true,' if resume_ready else 'resumeEnabled: false,')
changes = {
    Path('src/main.tsx'): new_main.encode('utf-8'),
    Path('src/data/hybridContent.ts'): content.encode('utf-8'),
}
for relative in ['src/pages/LandingPage.tsx', 'src/components/Navbar/Navbar.tsx', 'src/styles/theme-hybrid.css']:
    changes[Path(relative)] = (FILES / relative).read_bytes()
for relative in ['public/hybrid/ground.svg', 'public/hybrid/travel-window.svg', 'public/hybrid/notebook.svg']:
    changes[Path(relative)] = (FILES / relative).read_bytes()

backup = ROOT / '.hybrid-backup' / datetime.now().strftime('%Y%m%d-%H%M%S')
for relative, data in changes.items():
    target = ROOT / relative
    if target.exists():
        destination = backup / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(target, destination)

for relative, data in changes.items():
    target = ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)

print(f'Hybrid editorial theme installed in: {ROOT}')
print(f'Existing files backed up in: {backup}')
print(f'Résumé link: {"enabled" if resume_ready else "hidden until public/cv.pdf is added and resumeEnabled changed to true"}')
print('Photos: public/portrait.webp for hero; update diary[].image in src/data/hybridContent.ts for your own images.')
print('No project statuses or case-study facts were modified.')
print('Next: npm run lint && npm run build && npm run dev')
