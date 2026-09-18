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

priority = [
    'User-provided files and explicit instructions',
    'Current agent-creator SKILL.md',
    'Approved LightSpeed references in this pack',
    'Connected internal sources explicitly authorised for the task',
    'Current public web sources when freshness is required',
    'Model knowledge for stable background only'
]
for rel in ['AGENT_BUILDER_SPEC.md','references/source-priority-guide.md','memory/source-priorities.md']:
    text = read(rel)
    for item in priority:
        if item not in text:
            fail(f"{rel} missing source priority: {item}")
schema = json.loads(read('schemas/source-priority.schema.json'))
examples = schema.get('examples', [])
if not examples or examples[0].get('priority_order') != priority:
    fail('schemas/source-priority.schema.json priority_order does not match canonical order')
finish()
