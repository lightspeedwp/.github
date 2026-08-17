#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_HEADINGS = [
    '# Business Context',
    '## LightSpeed Context',
    '## WordPress And WooCommerce Focus',
    '## PRD To Playwright QA Workflow',
    '## Source Priority',
    '## Tooling Context',
    '## Approval Gates',
    '## Out Of Scope',
]
REQUIRED_PHRASES = [
    'WordPress',
    'WooCommerce',
    'PRD',
    'approval',
    'source priority',
    'build-time context only',
]
PLACEHOLDERS = ['TODO', 'TBD', 'FIXME', 'coming soon', 'lorem ipsum']


def main() -> int:
    path = ROOT / 'business-context.md'
    issues: list[str] = []
    if not path.exists():
        print('validate-business-context.py: skipped (business-context.md is not present in the current tree)')
        return 0

    text = path.read_text(encoding='utf-8')
    for heading in REQUIRED_HEADINGS:
        if heading not in text:
            issues.append(f'Missing heading: {heading}')
    for phrase in REQUIRED_PHRASES:
        if phrase.lower() not in text.lower():
            issues.append(f'Missing required phrase or concept: {phrase}')
    for token in PLACEHOLDERS:
        if token.lower() in text.lower():
            issues.append(f'Placeholder content found: {token}')
    if issues:
        print('Business context issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-business-context.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
