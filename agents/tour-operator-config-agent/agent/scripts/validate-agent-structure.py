#!/usr/bin/env python3
"""Check that core agent folders and currently attached validation assets exist."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_PATHS = [
    "schemas/tour-operator-plugin-audit-schema.json",
    "schemas/gravity-forms-plan-schema.json",
    "schemas/yoast-seo-audit-schema.json",
    "scripts/run-master-validation.sh",
    "scripts/validate-memory-files.py",
    "tests/skill-routing-snapshot.md",
    "tests/instruction-file-consistency-source.md",
    "tests/schema-validation-tests.md",
]
OPTIONAL_PATHS = [
    "references/wordpress-tour-operator-standard.md",
    "references/tour-operator-plugin-stack-standard.md",
    "references/yoast-seo-standard.md",
    "references/file-naming-conventions.md",
]

missing = [p for p in REQUIRED_PATHS if not (ROOT / p).exists()]
optional_missing = [p for p in OPTIONAL_PATHS if not (ROOT / p).exists()]
if missing:
    print("Agent structure validation failed:")
    for item in missing:
        print(f"- missing: {item}")
    sys.exit(1)

print("Agent structure validation passed.")
if optional_missing:
    print("Optional references not currently present in the staged validation view:")
    for item in optional_missing:
        print(f"- optional: {item}")
