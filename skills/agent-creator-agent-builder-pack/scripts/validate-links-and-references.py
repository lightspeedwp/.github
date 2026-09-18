#!/usr/bin/env python3
from pathlib import Path
import sys
import re
import json

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
failures = []

def fail(msg):
    failures.append(msg)

def read(rel):
    p = ROOT / rel
    if not p.exists():
        fail(f"missing {rel}")
        return ""
    return p.read_text(encoding='utf-8')

def require_contains(rel, needles):
    text = read(rel)
    for needle in needles:
        if needle not in text:
            fail(f"{rel} missing required text: {needle}")

def finish():
    if failures:
        print("FAIL")
        for item in failures:
            print(f"- {item}")
        sys.exit(1)
    print("PASS")

required = json.loads(read('validation/required-reference-map.json')).get('required_references', [])
for rel in required:
    if not (ROOT / rel).is_file():
        fail(f"required reference missing: {rel}")
# Local markdown links only: [text](relative/path.md)
for md in ROOT.rglob('*.md'):
    text = md.read_text(encoding='utf-8')
    for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
        if link.startswith(('http://','https://','mailto:','#')):
            continue
        target = (md.parent / link).resolve()
        if not target.exists():
            fail(f"broken local link in {md.relative_to(ROOT)}: {link}")
finish()
