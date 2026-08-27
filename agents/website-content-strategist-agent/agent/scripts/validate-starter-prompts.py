#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
SPEC = ROOT / 'references' / 'chatgpt-presentation-spec.md'
EXPECTED_DESCRIPTION = 'Website strategy, drafting, QA, and validation'
errors = []

if not SPEC.exists():
    errors.append('references/chatgpt-presentation-spec.md is missing')
else:
    text = SPEC.read_text(encoding='utf-8')
    lines = text.splitlines()

    if EXPECTED_DESCRIPTION not in text:
        errors.append('short description in presentation spec is missing or changed')

    try:
        start = lines.index('## Canonical starter prompts') + 1
    except ValueError:
        errors.append('presentation spec is missing the canonical starter prompts section')
        start = None

    prompts = []
    if start is not None:
        for line in lines[start:]:
            if line.startswith('## '):
                break
            if line.startswith('- '):
                prompts.append(line[2:].strip())

        if len(prompts) != 6:
            errors.append('starter prompt count must be exactly 6 in the presentation spec')

        if len(set(prompts)) != len(prompts):
            errors.append('starter prompt titles must be unique in the presentation spec')

        vague_titles = {'help', 'start', 'review'}
        for title in prompts:
            if len(title) > 32:
                errors.append(f'starter prompt title too long: {title}')
            if title.lower() in vague_titles:
                errors.append(f'starter prompt title too vague: {title}')

if errors:
    print('Starter-prompt validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Starter-prompt validation passed.')
