from __future__ import annotations

from pathlib import Path

ROOT = Path('.')

PAIRS = [
    {
        'name': 'investigation',
        'template': ROOT / 'templates' / 'agent-investigation-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-investigation.example.md',
    },
    {
        'name': 'customer_reply',
        'template': ROOT / 'templates' / 'agent-customer-reply-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-customer-reply.example.md',
    },
    {
        'name': 'escalation',
        'template': ROOT / 'templates' / 'agent-escalation-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-escalation.example.md',
    },
    {
        'name': 'backlog_report',
        'template': ROOT / 'templates' / 'agent-backlog-report-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-backlog-report.example.md',
    },
    {
        'name': 'handoff',
        'template': ROOT / 'templates' / 'agent-handoff-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-handoff.example.md',
    },
    {
        'name': 'triage_summary',
        'template': ROOT / 'templates' / 'agent-triage-summary-template.md',
        'example': ROOT / 'examples' / 'templates' / 'agent-triage-summary.example.md',
    },
]

CUSTOMER_REPLY_TEMPLATE_LINES = [
    'Hi {{customer_name}},',
    '{{reply_body}}',
    'Best,',
    '{{agent_or_team_name}}',
]

CUSTOMER_REPLY_EXAMPLE_MARKERS = [
    'Hi ',
    'Best,',
]


class ValidationError(Exception):
    pass


def read_text(path: Path) -> str:
    if not path.exists():
        raise ValidationError(f'Missing file: {path}')
    text = path.read_text(encoding='utf-8').strip()
    if not text:
        raise ValidationError(f'File is empty: {path}')
    return text


def extract_h1(text: str) -> str:
    for line in text.splitlines():
        if line.startswith('# '):
            return line.strip()
    raise ValidationError('Missing H1 heading')


def extract_h2s(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.startswith('## ')]


def ensure_contains(text: str, required: list[str], path: Path) -> None:
    for item in required:
        if item not in text:
            raise ValidationError(f'{path} is missing required content {item!r}')


def validate_pair(name: str, template_path: Path, example_path: Path) -> None:
    template_text = read_text(template_path)
    example_text = read_text(example_path)

    template_h1 = extract_h1(template_text)
    example_h1 = extract_h1(example_text)
    if template_h1 != example_h1:
        raise ValidationError(
            f'{name}: template/example H1 mismatch: {template_h1!r} != {example_h1!r}'
        )

    if name == 'customer_reply':
        ensure_contains(template_text, CUSTOMER_REPLY_TEMPLATE_LINES, template_path)
        ensure_contains(example_text, CUSTOMER_REPLY_EXAMPLE_MARKERS, example_path)
        if '{{' in example_text or '}}' in example_text:
            raise ValidationError(f'{example_path} should not contain unresolved template placeholders')
        return

    template_h2s = extract_h2s(template_text)
    example_h2s = extract_h2s(example_text)
    if template_h2s != example_h2s:
        raise ValidationError(
            f'{name}: template/example H2 sections differ: {template_h2s!r} != {example_h2s!r}'
        )

    for heading in template_h2s:
        if heading not in example_text:
            raise ValidationError(f'{example_path} is missing section {heading!r}')


def main() -> None:
    for pair in PAIRS:
        validate_pair(pair['name'], pair['template'], pair['example'])
    print('Template/example parity validation passed.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
