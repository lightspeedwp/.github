from pathlib import Path

REQUIRED = [
    'business-context.md',
    'templates/agent-investigation-template.md',
    'templates/agent-customer-reply-template.md',
    'templates/agent-escalation-template.md',
    'templates/agent-backlog-report-template.md',
    'templates/agent-handoff-template.md',
    'templates/agent-triage-summary-template.md',
    'examples/templates/agent-investigation.example.md',
    'examples/templates/agent-customer-reply.example.md',
    'examples/templates/agent-escalation.example.md',
    'examples/templates/agent-backlog-report.example.md',
    'examples/templates/agent-handoff.example.md',
    'examples/templates/agent-triage-summary.example.md',
    'examples/memory/user-preferences.example.md',
    'examples/memory/report-defaults.example.yaml',
    'examples/memory/drafting-preferences.example.md',
    'examples/memory/todos.example.md',
    'schemas/report-defaults.schema.json',
    'schemas/user-preferences.schema.json',
    'schemas/drafting-preferences.schema.json',
    'memory/user-preferences.md',
    'memory/report-defaults.yaml',
    'memory/drafting-preferences.md',
    'memory/todos.md',
    'scripts/validate_templates.py',
    'scripts/validate_memory.py',
    'scripts/validate_schema_files.py',
    'scripts/validate-folder-schemas.sh',
    'tests/schema-validation-smoke-tests.md',
    'tests/schema-validation-tests.md',
]

root = Path('.')
missing = [p for p in REQUIRED if not (root / p).exists()]
if missing:
    raise SystemExit('Missing required files: ' + ', '.join(missing))
print('All core agent files are present.')
