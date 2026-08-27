#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
PLACEHOLDERS = ['TODO', 'TBD', 'FIXME', '<placeholder>', '[insert ']
CANONICAL_FOLDERS = ['prompts', 'references', 'templates', 'examples', 'tests', 'memory', 'questionnaires']

REQUIRED_BY_PATH = {
    'business-context.md': [
        '# Business context',
        '## Core purpose',
        '## Primary users',
        '## Source priority',
        '## Output expectations',
    ],
    'prompts/README.md': ['# Prompts folder', '## Purpose', '## Naming conventions', '## File outline'],
    'references/README.md': ['# References folder', '## Purpose', '## Naming conventions', '## File outline'],
    'schemas/README.md': ['# Schemas folder', '## Purpose', '## Naming conventions', '## File outline'],
    'templates/README.md': ['# Templates folder', '## Purpose', '## Naming conventions', '## File outline'],
    'examples/README.md': ['# Examples folder', '## Purpose', '## Naming conventions', '## File outline'],
    'scripts/README.md': ['# Scripts folder', '## Purpose', '## Naming conventions', '## File outline'],
    'tests/README.md': ['# Tests folder', '## Purpose', '## Naming conventions', '## File outline'],
    'memory/README.md': ['# Memory folder', '## Purpose', '## Naming conventions', '## File outline'],
    'questionnaires/README.md': ['# Questionnaires folder', '## Purpose', '## Naming conventions', '## File outline'],
}

REQUIRED_BY_FOLDER = {
    'templates': [
        '# Template name',
        '## Purpose',
        '## Required inputs',
        '## Required sections',
        '## Output rules',
        '## Validation notes',
    ],
    'examples': [
        '# Example name',
        '## Purpose',
        '## Matched template',
        '## Example output',
        '## Validation notes',
    ],
}

errors = []


def read_lines(path: Path):
    text = path.read_text(encoding='utf-8')
    return text, text.splitlines()


def strip_code(text: str):
    text = re.sub(r'```.*?```', '', text, flags=re.S)
    text = re.sub(r'`[^`\n]+`', '', text)
    return text


def check_heading_order(relative_path: str, lines, headings):
    positions = []
    for heading in headings:
        try:
            idx = lines.index(heading)
        except ValueError:
            errors.append(f'{relative_path}: missing heading {heading}')
            idx = None
        positions.append(idx)
    filtered = [p for p in positions if p is not None]
    if filtered != sorted(filtered):
        errors.append(f'{relative_path}: required headings are out of order')


def check_duplicate_headings(relative_path: str, lines):
    seen = set()
    for line in lines:
        if line.startswith('#'):
            if line in seen:
                errors.append(f'{relative_path}: duplicate heading {line}')
            seen.add(line)


for relative_path, headings in REQUIRED_BY_PATH.items():
    path = ROOT / relative_path
    if not path.exists():
        errors.append(f'{relative_path}: required file is missing')
        continue
    text, lines = read_lines(path)
    clean_text = strip_code(text)
    check_heading_order(relative_path, lines, headings)
    check_duplicate_headings(relative_path, lines)
    for marker in PLACEHOLDERS:
        if marker in clean_text:
            errors.append(f'{relative_path}: unresolved placeholder marker {marker}')

for folder, headings in REQUIRED_BY_FOLDER.items():
    directory = ROOT / folder
    if not directory.exists():
        errors.append(f'{folder}/: required folder is missing')
        continue
    for path in sorted(directory.glob('*.md')):
        if path.name == 'README.md':
            continue
        relative_path = path.relative_to(ROOT).as_posix()
        text, lines = read_lines(path)
        clean_text = strip_code(text)
        check_heading_order(relative_path, lines, headings)
        check_duplicate_headings(relative_path, lines)
        for marker in PLACEHOLDERS:
            if marker in clean_text:
                errors.append(f'{relative_path}: unresolved placeholder marker {marker}')

for folder in CANONICAL_FOLDERS:
    directory = ROOT / folder
    if not directory.exists():
        continue
    for path in sorted(directory.rglob('*.md')):
        relative_path = path.relative_to(ROOT).as_posix()
        text, lines = read_lines(path)
        clean_text = strip_code(text)
        check_duplicate_headings(relative_path, lines)
        for marker in PLACEHOLDERS:
            if marker in clean_text:
                errors.append(f'{relative_path}: unresolved placeholder marker {marker}')

if errors:
    print('Markdown structure validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Markdown structure validation passed.')
