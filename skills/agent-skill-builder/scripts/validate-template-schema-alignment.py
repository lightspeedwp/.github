#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from validator_common import make_report, print_report, rel, should_skip

PLACEHOLDER_RE = re.compile(r'\{\{\s*(?:optional:)?([a-zA-Z0-9_-]+)\s*\}\}')


def schema_fields(schema_path: Path):
    try:
        data = json.loads(schema_path.read_text(encoding='utf-8'))
    except Exception:
        return set(), set()
    props = set((data.get('properties') or {}).keys())
    required = set(data.get('required') or [])
    return props, required


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors = []
    warnings = []
    checked = []
    schema_props = set()
    schema_required = set()
    for schema in sorted((root / 'schemas').glob('*.json')) if (root / 'schemas').exists() else []:
        props, required = schema_fields(schema)
        schema_props |= props
        schema_required |= required
    for path in sorted((root / 'templates').rglob('*')) if (root / 'templates').exists() else []:
        if not path.is_file() or should_skip(path):
            continue
        if path.suffix.lower() not in {'.md', '.template', '.yaml', '.yml'} and not path.name.endswith('.template'):
            continue
        text = path.read_text(encoding='utf-8', errors='ignore')
        placeholders = set(PLACEHOLDER_RE.findall(text))
        if not placeholders:
            continue
        checked.append(rel(root, path))
        if schema_props:
            unknown = sorted(p for p in placeholders if p not in schema_props and p not in {'skill_name','skill_description','display_name','workflow_goal','primary_reference','primary_reference_condition','output_format','short_description','file_name','purpose','load_condition','dependency','owner','validator','drift_risk','simple_workflow','repeatable_workflow','domain','output_title','summary','actions','title','evidence','decision','next_actions'})
            for item in unknown:
                warnings.append(f'{rel(root, path)} placeholder not represented in known schemas: {item}')
    if (root / 'schemas').exists() and (root / 'templates').exists() and not checked:
        warnings.append('templates and schemas exist, but no placeholders were checked')
    report = make_report('validate-template-schema-alignment', errors, warnings, checked=checked, summary=f'checked {len(checked)} template files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
