#!/usr/bin/env python3
from pathlib import Path
import sys
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

required = ['memory/README.md','memory/agent-defaults.md','memory/user-preferences.md','memory/routing-decisions.md','memory/source-priorities.md','memory/decisions.md','memory/todos.md','memory/open-questions.md','memory/schemas/memory-entry.schema.json','memory/schemas/decision-entry.schema.json','memory/schemas/todo-entry.schema.json']
for rel in required:
    if not (ROOT / rel).is_file():
        fail(f"memory file missing: {rel}")
require_contains('memory/README.md', ['What can be stored permanently','What must never be stored','Durable defaults versus one-off notes','Stale decisions','Todo retirement','Routing decisions','Interaction with business context','Validator coverage'])
for rel in ['memory/agent-defaults.md','memory/user-preferences.md']:
    require_contains(rel, ['Do not'])
for rel in ['memory/schemas/memory-entry.schema.json','memory/schemas/decision-entry.schema.json','memory/schemas/todo-entry.schema.json']:
    try:
        json.loads(read(rel))
    except Exception as exc:
        fail(f"invalid memory schema {rel}: {exc}")
finish()
