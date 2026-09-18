#!/usr/bin/env python3
from pathlib import Path
import sys
import re
import json

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
failures = []

def fail(msg):
    failures.append(msg)

def read(rel):
    p = ROOT / rel
    if not p.exists():
        fail(f"missing {rel}")
        return ""
    return p.read_text(encoding='utf-8')

def require_contains(rel, needles):
    text = read(rel)
    for needle in needles:
        if needle not in text:
            fail(f"{rel} missing required text: {needle}")

def finish():
    if failures:
        print("FAIL")
        for item in failures:
            print(f"- {item}")
        sys.exit(1)
    print("PASS")

for rel in ['schemas/agent-builder-spec.schema.json','schemas/agent-requirements.schema.json','schemas/output-template.schema.json','schemas/routing-rule.schema.json','schemas/source-priority.schema.json']:
    try:
        json.loads(read(rel))
    except Exception as exc:
        fail(f"invalid json schema {rel}: {exc}")
for rel in ['templates/agent-output-template.md','templates/decision-summary-template.md','templates/digest-template.md','templates/handoff-template.md','templates/validation-report-template.md']:
    require_contains(rel, ['Required fields','Template','Validation notes'])
require_contains('OUTPUT_TEMPLATES.md', ['Schema: `schemas/output-template.schema.json`','Schema: `schemas/agent-builder-spec.schema.json`'])
finish()
