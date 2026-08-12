from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('.')
MEMORY_DIR = ROOT / 'memory'

PREFERENCE_FILES = [
    MEMORY_DIR / 'user-preferences.md',
    MEMORY_DIR / 'drafting-preferences.md',
]
TODOS_FILE = MEMORY_DIR / 'todos.md'
REPORT_DEFAULTS_FILE = MEMORY_DIR / 'report-defaults.yaml'

APPROVED_REPORT_DEFAULT_KEYS = {
    'timeframe_days',
    'default_scope',
    'include_sections',
    'grouping_priority',
    'next_actions_count',
    'comparison_window',
    'include_comparison',
    'example_ticket_count',
    'example_ticket_rule',
    'redact_customer_details',
}

SUSPICIOUS_PATTERNS = [
    (re.compile(r'https?://', re.IGNORECASE), 'contains a URL-like string'),
    (re.compile(r'\bticket\s*#?\d{3,}\b', re.IGNORECASE), 'contains a likely ticket reference'),
    (re.compile(r'\b(Customer|Agent|Merchant):', re.IGNORECASE), 'looks like copied transcript content'),
    (re.compile(r'\bZendesk\b.*\b(id|url|ticket)\b', re.IGNORECASE), 'looks case-specific instead of durable'),
]


class ValidationError(Exception):
    pass


def read_text(path: Path) -> str:
    if not path.exists():
        raise ValidationError(f'Missing file: {path}')
    return path.read_text(encoding='utf-8')


def find_duplicate_preference_keys(text: str) -> list[str]:
    keys: list[str] = []
    duplicates: set[str] = set()
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line.startswith('- ') or ':' not in line:
            continue
        key = line[2:].split(':', 1)[0].strip().lower()
        if key in keys:
            duplicates.add(key)
        keys.append(key)
    return sorted(duplicates)


def validate_preference_file(path: Path) -> None:
    text = read_text(path)
    duplicates = find_duplicate_preference_keys(text)
    if duplicates:
        raise ValidationError(f'{path} contains duplicate preference keys: {", ".join(duplicates)}')

    for pattern, reason in SUSPICIOUS_PATTERNS:
        match = pattern.search(text)
        if match:
            raise ValidationError(f'{path} {reason}: {match.group(0)!r}')


def validate_todos(path: Path) -> None:
    text = read_text(path)
    lines = [line.rstrip() for line in text.splitlines()]

    active_item_lines = []
    in_active_items = False
    for line in lines:
        stripped = line.strip()
        if stripped == '## Active items':
            in_active_items = True
            continue
        if in_active_items and stripped.startswith('## '):
            break
        if in_active_items:
            active_item_lines.append(stripped)

    meaningful = [line for line in active_item_lines if line and not line.startswith('_None currently.')]
    for line in meaningful:
        if not line.startswith('- '):
            raise ValidationError(f'{path} active items should be bullet lines: {line!r}')
        if len(line) > 220:
            raise ValidationError(f'{path} active item looks too long and may contain copied case detail: {line!r}')

    seen = set()
    for line in meaningful:
        if line in seen:
            raise ValidationError(f'{path} contains duplicate todo item: {line!r}')
        seen.add(line)

    for pattern, reason in SUSPICIOUS_PATTERNS:
        match = pattern.search('\n'.join(meaningful))
        if match:
            raise ValidationError(f'{path} {reason}: {match.group(0)!r}')


def validate_report_defaults(path: Path) -> None:
    text = read_text(path)
    keys = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith('#') or line.startswith('  - '):
            continue
        if ':' not in line:
            raise ValidationError(f'{path} contains unsupported YAML line: {line!r}')
        key = line.split(':', 1)[0].strip()
        keys.append(key)

    extra = sorted(set(keys) - APPROVED_REPORT_DEFAULT_KEYS)
    if extra:
        raise ValidationError(f'{path} contains unapproved keys: {", ".join(extra)}')

    duplicates = sorted({key for key in keys if keys.count(key) > 1})
    if duplicates:
        raise ValidationError(f'{path} contains duplicate keys: {", ".join(duplicates)}')


def main() -> None:
    for path in PREFERENCE_FILES:
        validate_preference_file(path)
    validate_todos(TODOS_FILE)
    validate_report_defaults(REPORT_DEFAULTS_FILE)
    print('Memory content validation passed.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
