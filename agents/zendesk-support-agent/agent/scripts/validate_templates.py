from pathlib import Path

required = [
    Path('templates/agent-investigation-template.md'),
    Path('templates/agent-customer-reply-template.md'),
    Path('templates/agent-escalation-template.md'),
    Path('templates/agent-backlog-report-template.md'),
]
for path in required:
    if not path.exists():
        raise SystemExit(f'Missing template: {path}')
    text = path.read_text(encoding='utf-8').strip()
    if not text.startswith('#'):
        raise SystemExit(f'Template should begin with a heading: {path}')
print('Templates look valid.')
