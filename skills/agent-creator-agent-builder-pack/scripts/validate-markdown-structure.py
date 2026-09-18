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

required_files = [
    'README.md','AGENT_BUILDER_SPEC.md','PHASED_BUILD_PLAN.md','AGENT_REQUIREMENTS.md','AGENT_SYSTEM_PROMPT.md',
    'TOOL_AND_PERMISSION_MATRIX.md','ROUTING_AND_HANDOFF.md','OUTPUT_TEMPLATES.md','QUALITY_CHECKLIST.md','FILE_MANIFEST.md','BUILDER_IMPORT_PROMPT.md','business-context.md'
]
required_dirs = ['references','templates','schemas','memory','validation','scripts','tests','fixtures','examples','rollout','assets']
for rel in required_files:
    if not (ROOT / rel).is_file():
        fail(f"required file missing: {rel}")
for rel in required_dirs:
    if not (ROOT / rel).is_dir():
        fail(f"required directory missing: {rel}")
require_contains('AGENT_BUILDER_SPEC.md', ['Agent name','Agent purpose','Builder goal','Core behaviour','Explicit non-goals','Human approval gates','Acceptance checklist'])
require_contains('PHASED_BUILD_PLAN.md', ['Phase 0','Phase 1','Phase 2','Phase 3','Phase 4','Phase 5'])
require_contains('QUALITY_CHECKLIST.md', ['Agent Builder readiness','Memory','Validation','Safety'])
finish()
