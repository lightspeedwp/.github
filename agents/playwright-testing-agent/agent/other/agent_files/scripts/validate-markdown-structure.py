#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACEHOLDERS = [r'\bTODO\b', r'\bTBD\b', r'lorem ipsum', r'\bFIXME\b', r'insert here', r'coming soon']
TARGETS = [
    ROOT / 'README.md',
    ROOT / 'examples',
    ROOT / 'schemas',
    ROOT / 'fixtures',
    ROOT / 'profiles',
    ROOT / 'prompts',
    ROOT / 'scripts',
    ROOT / 'tests',
]
REQUIRED_HEADINGS = {
    'README.md': ['# Playwright Testing Agent Asset Pack', '## Purpose', '## Folder map', '## Recommended maintenance workflow', '## Canonical location rules', '## Duplicate handling rule', '## Validation entry points'],
    'examples/README.md': ['# examples', '## Purpose', '## Naming conventions', '## Current file inventory', '## Maintenance rules'],
    'schemas/README.md': ['# schemas', '## Purpose', '## Naming conventions', '## Current file inventory', '## Maintenance rules'],
    'fixtures/README.md': ['# fixtures', '## Purpose', '## Naming conventions', '## Current file inventory', '## Maintenance rules'],
    'profiles/README.md': ['# profiles', '## Purpose', '## Naming conventions', '## Current file inventory', '## Maintenance rules'],
    'prompts/README.md': ['# Prompts', '## Purpose', '## Current Prompts', '## Prompt Library', '## Authoring Rules', '## Recommended Usage'],
    'scripts/README.md': ['# scripts', '## Purpose', '## Current file inventory', '## Recommended usage', '## Validator notes'],
    'tests/README.md': ['# tests', '## Purpose', '## Naming conventions', '## Current file inventory', '## Maintenance rules'],
    'tests/schema-validation-tests.md': ['# Schema Validation Tests', '## Purpose', '## Folder Coverage', '## README Coverage', '## Link And Reference Checks', '## Starter Prompt Checks', '## How To Run', '## Expected Pass Criteria'],
    'business-context.md': ['# Business Context', '## LightSpeed Context', '## WordPress And WooCommerce Focus', '## PRD To Playwright QA Workflow', '## Source Priority', '## Tooling Context', '## Approval Gates', '## Out Of Scope'],
    'memory/todos.md': ['# Todos', '## Current', '## Waiting', '## Done', '## Parking Lot'],
    'memory/user-preferences.md': ['# User Preferences', '## Stable Preferences', '## LightSpeed Workflow Preferences', '## Tooling Preferences', '## Validation Preferences', '## Do Not Store'],
}


def iter_markdown_files():
    for target in TARGETS:
        if target.is_file():
            yield target
        elif target.is_dir():
            yield from target.rglob('*.md')
    for optional in [ROOT / 'business-context.md', ROOT / 'memory']:
        if optional.is_file():
            yield optional
        elif optional.is_dir():
            yield from optional.rglob('*.md')


def extract_headings(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.startswith('#')]


def main() -> int:
    issues: list[str] = []
    for path in iter_markdown_files():
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding='utf-8')
        headings = extract_headings(text)
        if len(headings) != len(set(headings)):
            issues.append(f'{rel}: duplicate headings detected')
        for placeholder in PLACEHOLDERS:
            if re.search(placeholder, text, flags=re.IGNORECASE):
                issues.append(f'{rel}: placeholder text detected ({placeholder})')
        expected = REQUIRED_HEADINGS.get(rel)
        if expected:
            positions = []
            for heading in expected:
                try:
                    positions.append(headings.index(heading))
                except ValueError:
                    issues.append(f'{rel}: missing required heading {heading}')
            if positions and positions != sorted(positions):
                issues.append(f'{rel}: required headings are out of order')
        for heading_match in re.finditer(r'^(#+ .+)$', text, flags=re.MULTILINE):
            heading = heading_match.group(1)
            if heading.startswith('# ') and not heading.startswith('## '):
                continue
            start = heading_match.end()
            next_heading = re.search(r'^#+ ', text[start:], flags=re.MULTILINE)
            body = text[start:start + next_heading.start()] if next_heading else text[start:]
            if not body.strip():
                issues.append(f'{rel}: empty section under {heading}')
    if issues:
        print('Markdown structure issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-markdown-structure.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
