#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    'prompts/skills-routing-validation-prompt.md',
    'prompts/skills-routing-repair-prompt.md',
    'prompts/README.md',
    'tests/README.md',
    'tests/schema-validation-tests.md',
]

REQUIRED_TEXT = {
    'prompts/skills-routing-validation-prompt.md': [
        'mandatory routes',
        'If no dedicated skills directory exists',
        'skills-directory',
    ],
    'prompts/skills-routing-repair-prompt.md': [
        'Do not invent new skills',
        'skills-directory',
        'no dedicated skills directory exists',
    ],
    'prompts/README.md': [
        'skills-routing-validation-prompt.md',
        'skills-routing-repair-prompt.md',
    ],
    'tests/README.md': [
        'skills-routing check',
    ],
    'tests/schema-validation-tests.md': [
        '## Skills Routing Checks',
        'attached skill setup',
        'skills directory',
    ],
}


def main() -> int:
    issues: list[str] = []
    for rel_path in REQUIRED_FILES:
        path = ROOT / rel_path
        if not path.exists():
            issues.append(f'Missing required file: {rel_path}')
            continue
        text = path.read_text(encoding='utf-8')
        for expected in REQUIRED_TEXT.get(rel_path, []):
            if expected not in text:
                issues.append(f'{rel_path}: missing required text: {expected}')

    if issues:
        print('Skills routing issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1

    print('validate-skills-routing.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
