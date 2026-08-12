#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
TARGET = ROOT / 'business-context.md'
PLACEHOLDERS = ['TODO', 'TBD', 'FIXME', '<placeholder>', '[insert ']
REQUIRED_HEADINGS = [
    '# Business context',
    '## Core purpose',
    '## Primary users',
    '## Source priority',
    '## Output expectations',
]

errors = []

if not TARGET.exists():
    errors.append('business-context.md is missing')
else:
    text = TARGET.read_text(encoding='utf-8')
    lines = text.splitlines()

    for heading in REQUIRED_HEADINGS:
        if heading not in lines:
            errors.append(f'business-context.md: missing heading {heading}')

    positions = [lines.index(h) for h in REQUIRED_HEADINGS if h in lines]
    if positions != sorted(positions):
        errors.append('business-context.md: required headings are out of order')

    for marker in PLACEHOLDERS:
        if marker in text:
            errors.append(f'business-context.md: unresolved placeholder marker {marker}')

    weak_markers = [
        'no content yet',
        'add details',
        'to be completed',
        'none yet',
    ]
    lowered = text.lower()
    for marker in weak_markers:
        if marker in lowered:
            errors.append(f'business-context.md: incomplete content marker {marker}')

    source_priority_items = [
        '1. Approved project files and briefs',
        '2. Attached reference files',
        '3. Approved memory entries',
        '4. Read-only app sources',
        '5. Public web research when needed',
    ]
    if not any(item in text for item in source_priority_items):
        errors.append('business-context.md: source priority list is missing or too weak')

if errors:
    print('Business-context validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Business-context validation passed.')
