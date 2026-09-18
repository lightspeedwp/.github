#!/usr/bin/env python3
from pathlib import Path
import sys

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

require_contains('BUILDER_IMPORT_PROMPT.md', ['agent-creator-agent-builder-pack.zip','AGENT_BUILDER_SPEC.md','PHASED_BUILD_PLAN.md','FILE_MANIFEST.md','Do not try to process the whole pack at once','Stop for human review'])
require_contains('references/starter-prompt-guide.md', ['Prompt-size rule','Required Builder import prompt','Human-review language','Phase-by-phase instruction'])
finish()
