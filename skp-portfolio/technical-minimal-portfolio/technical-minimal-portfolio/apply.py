#!/usr/bin/env python3
"""Install the Technical/Minimal stylesheet and two small JSX corrections.

Usage: python apply.py path/to/skp-portfolio
Preserves original source via .technical-theme-backup and prints changed files.
Does not touch portfolio content, certificates, or photos.
"""
from pathlib import Path
import hashlib
import json
import re
import shutil
import sys

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
MAIN = ROOT / "src/main.tsx"
WORK = ROOT / "src/sections/Work.tsx"
TARGET = ROOT / "src/styles/theme-technical.css"
SOURCE = Path(__file__).resolve().parent / "files/src/styles/theme-technical.css"
BACKUP = ROOT / ".technical-theme-backup"
MANIFEST = BACKUP / "manifest.json"

if not MAIN.is_file() or not WORK.is_file():
    raise SystemExit("Pass the skp-portfolio folder that contains src/main.tsx and src/sections/Work.tsx")
if MANIFEST.exists() or TARGET.exists():
    raise SystemExit("Theme already present (or backup exists). Review git diff; no files modified.")

original_main = MAIN.read_text(encoding="utf-8")
original_work = WORK.read_text(encoding="utf-8")

# Append this stylesheet after all existing stylesheets, so earlier warm overrides
# cannot undo the technical design or two-column metric fix.
pattern = r'(?m)^import\s+["\']\./styles/[\w-]+\.css["\'];\s*$'
css_imports = list(re.finditer(pattern, original_main))
if not css_imports:
    raise SystemExit('No CSS imports found in src/main.tsx; inspect manually (nothing modified).')
last = css_imports[-1]
new_main = (original_main[:last.end()] + '\nimport "./styles/theme-technical.css";' + original_main[last.end():])

# Correct legacy presentation logic in Work.tsx: the old /x/ check accidentally
# assigned a special class based on arbitrary letters in a metric's value.
new_work = original_work
new_work = new_work.replace('const ph = /x/i.test(m.value);', '')
new_work = new_work.replace('className={`v${ph ? " ph2" : ""}`}', 'className="v"')

# Actual status state now controls badges. Submitted projects must never share
# the green "validated" badge (as in the original generic chip.ok class).
new_work = new_work.replace(
    '<span className="chip ok">● {c.status.label}</span>',
    '<span className={`chip status-chip status-${c.status.kind}`}>● {c.status.label}</span>',
)

# Validate essential post-conditions BEFORE modifying files.
if 'import "./styles/theme-technical.css";' not in new_main:
    raise SystemExit('Could not insert technical stylesheet')
if 'const ph = /x/i.test(m.value);' in new_work:
    raise SystemExit('Could not remove legacy metric heuristic')
if '<span className="chip ok">● {c.status.label}</span>' in new_work:
    raise SystemExit('Could not improve status badges')

backup_items = [(MAIN, original_main), (WORK, original_work)]
BACKUP.mkdir(parents=True, exist_ok=False)
for src, body in backup_items:
    backup_dest = BACKUP / src.relative_to(ROOT)
    backup_dest.parent.mkdir(parents=True, exist_ok=True)
    backup_dest.write_text(body, encoding="utf-8")
MAIN.write_text(new_main, encoding="utf-8")
WORK.write_text(new_work, encoding="utf-8")
TARGET.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(SOURCE, TARGET)

manifest = {
    'updated_sha256': {
        str(MAIN.relative_to(ROOT)): hashlib.sha256(new_main.encode()).hexdigest(),
        str(WORK.relative_to(ROOT)): hashlib.sha256(new_work.encode()).hexdigest(),
        str(TARGET.relative_to(ROOT)): hashlib.sha256(TARGET.read_bytes()).hexdigest(),
    }
}
MANIFEST.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('Technical/minimal theme installed:')
for f in [MAIN, WORK, TARGET]:
    print(' -', f.relative_to(ROOT))
print('Backups saved in', BACKUP)
print('Next: npm run lint && npm run build && npm run dev')
