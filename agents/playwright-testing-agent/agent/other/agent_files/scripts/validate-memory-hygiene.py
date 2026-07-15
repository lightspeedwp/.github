#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECRETS = [r'api[_-]?key', r'secret', r'token', r'password', r'client[_-]?secret']
REQUIRED = {
    'memory/todos.md': ['# Todos', '## Current', '## Waiting', '## Done', '## Parking Lot'],
    'memory/user-preferences.md': ['# User Preferences', '## Stable Preferences', '## LightSpeed Workflow Preferences', '## Tooling Preferences', '## Validation Preferences', '## Do Not Store']
}


def main() -> int:
    memory_root = ROOT / 'memory'
    if not memory_root.exists():
        print('validate-memory-hygiene.py: skipped (memory/ is not present in the current tree)')
        return 0

    issues: list[str] = []
    for rel, headings in REQUIRED.items():
        path = ROOT / rel
        if not path.exists():
            issues.append(f'Missing memory file: {rel}')
            continue
        text = path.read_text(encoding='utf-8')
        for heading in headings:
            if heading not in text:
                issues.append(f'{rel}: missing heading {heading}')
        for pattern in SECRETS:
            if re.search(pattern, text, flags=re.IGNORECASE):
                issues.append(f'{rel}: possible secret-like content detected ({pattern})')
        if rel == 'memory/user-preferences.md':
            forbidden = ['temporary project', 'private client', 'raw copied prd', 'full research dump']
            for item in forbidden:
                if item in text.lower() and 'do not store' not in text.lower():
                    issues.append(f'{rel}: may contain one-off or forbidden content')
        if rel == 'memory/todos.md' and '## Current' in text and 'Done' in text:
            current_section = text.split('## Current', 1)[1].split('## Waiting', 1)[0]
            if 'completed' in current_section.lower():
                issues.append(f'{rel}: stale completed item found in Current section')
        for heading in headings[1:]:
            section = text.split(heading, 1)[1] if heading in text else ''
            next_sections = [h for h in headings if h != heading and h in section]
            if next_sections:
                section = section.split(next_sections[0], 1)[0]
            if not section.strip():
                issues.append(f'{rel}: empty required section under {heading}')
    if issues:
        print('Memory hygiene issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-memory-hygiene.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
