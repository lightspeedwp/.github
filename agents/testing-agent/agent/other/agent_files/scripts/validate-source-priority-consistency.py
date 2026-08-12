#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPECTED = [
    "1. User’s explicit instruction in the current chat",
    "2. PRD and approved acceptance criteria",
    "3. Approved Figma design, prototype, and design-system evidence",
    "4. Repository evidence",
    "5. Staging or live-site browser evidence",
    "6. Existing Playwright tests and QA fixtures",
    "7. BugHerd tickets and comments",
    "8. Business context and memory",
    "9. General documentation and public best practices",
]
TARGETS = [
    'business-context.md',
    'references/source-priority.md',
    'memory/user-preferences.md',
    'README.md',
    'references/CONNECTORS.md',
]
OPTIONAL_INSTRUCTION_FILES = [
    'agent-system-instructions.md',
    'agent-instructions.md',
]


def find_positions(text: str) -> list[int]:
    return [text.find(item) for item in EXPECTED]


def validate_text(label: str, text: str, issues: list[str]) -> None:
    positions = find_positions(text)
    missing = [item for item, pos in zip(EXPECTED, positions) if pos == -1]
    if missing:
        for item in missing:
            issues.append(f'{label}: missing source priority item: {item}')
        return
    if positions != sorted(positions):
        issues.append(f'{label}: source priority items are out of order')


def main() -> int:
    issues: list[str] = []
    checked_any = False
    for rel in TARGETS:
        path = ROOT / rel
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        if 'source priority' in text.lower():
            checked_any = True
            validate_text(rel, text, issues)
    for rel in OPTIONAL_INSTRUCTION_FILES:
        path = ROOT / rel
        if path.exists():
            checked_any = True
            validate_text(rel, path.read_text(encoding='utf-8'), issues)
    if not checked_any:
        print('validate-source-priority-consistency.py: skipped (no current file-based source-priority reference is present)')
        return 0
    if issues:
        print('Source priority consistency issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-source-priority-consistency.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
