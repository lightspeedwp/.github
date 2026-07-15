#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMPLE_SCHEMA_PAIRINGS = {
    'examples/prd-to-test-cases-example.md': 'schemas/test-case.schema.json',
    'examples/playwright-spec-example.md': 'schemas/agent-file.schema.json',
    'examples/bugherd-failure-example.md': 'schemas/bugherd-failure.schema.json',
    'examples/repo-analysis-example.md': 'schemas/repo-analysis.schema.json',
    'examples/figma-context-example.md': 'schemas/figma-context.schema.json',
    'examples/requirements-traceability-example.md': 'schemas/requirements-traceability.schema.json',
}
SCHEMA_ONLY_ALLOWED = {
    'schemas/test-suite-plan.schema.json': 'Current pack has no dedicated test-suite-plan example.',
    'schemas/memory-file.schema.json': 'Memory validation is optional and only applies when memory/ exists.',
}


def main() -> int:
    issues: list[str] = []
    templates_dir = ROOT / 'templates'
    templates_present = templates_dir.exists()

    for example_rel, schema_rel in EXAMPLE_SCHEMA_PAIRINGS.items():
        example = ROOT / example_rel
        schema = ROOT / schema_rel
        if not example.exists():
            issues.append(f'Missing example: {example_rel}')
            continue
        if not schema.exists():
            issues.append(f'Missing schema: {schema_rel}')
            continue
        text = example.read_text(encoding='utf-8')
        if f'`{schema_rel}`' not in text:
            issues.append(f'{example_rel}: missing related schema reference to `{schema_rel}`')
        if not templates_present and 'templates/' in text:
            issues.append(f'{example_rel}: stale template reference remains while templates/ is absent')

    for schema_path in (ROOT / 'schemas').glob('*.schema.json'):
        schema_rel = schema_path.relative_to(ROOT).as_posix()
        if schema_rel in EXAMPLE_SCHEMA_PAIRINGS.values():
            continue
        if schema_rel in SCHEMA_ONLY_ALLOWED:
            continue
        issues.append(f'{schema_rel}: missing example pairing or explicit exemption')

    if issues:
        print('Example/schema alignment issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-template-schema-alignment.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
