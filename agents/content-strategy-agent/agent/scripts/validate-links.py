#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
CHECK_DIRS = ['references', 'templates', 'examples', 'tests', 'prompts']
LINK_RE = re.compile(r'`([^`]+\.(?:md|json|yaml|yml|sh|py))`')
errors = []

for folder in CHECK_DIRS:
    directory = ROOT / folder
    if not directory.exists():
        continue
    for path in directory.rglob('*.md'):
        text = path.read_text(encoding='utf-8')
        for match in LINK_RE.findall(text):
            if '<' in match or '>' in match:
                continue
            if match.startswith('-') or match.startswith('*'):
                continue
            target = (path.parent / match).resolve() if not match.startswith('/') else Path(match)
            if not target.exists():
                fallback = (ROOT / match).resolve()
                if fallback.exists():
                    continue
                errors.append(f'{path}: missing referenced file {match}')

if errors:
    print('Link validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Link validation passed.')
