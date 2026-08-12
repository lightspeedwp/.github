#!/usr/bin/env python3
"""Validate that the instruction source snapshot matches the current documented asset structure."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tests" / "instruction-file-consistency-source.md"
FILE_TAG_RE = re.compile(r"\{\{label:([^,}]+),id:[^,}]+,type:file\}\}")
PATH_RE = re.compile(r"((?:tests|scripts|examples|schemas|memory|references)/[A-Za-z0-9._/-]+\.(?:md|json|sh|py|js))")
REQUIRED_REFERENCES = {
    "tests/README.md",
    "scripts/README.md",
    "schemas/README.md",
    "references/README.md",
    "examples/README.md",
    "references/CONNECTORS.md",
    "references/audit-docs-validation-workflow.md",
    "scripts/run-master-validation.sh",
    "scripts/validate-reference-links.py",
    "scripts/validate-memory-files.py",
    "scripts/validate-markdown-structure.py",
    "scripts/validate-source-priority-consistency.py",
}
FORBIDDEN_TOKENS = {
    "templates/",
    "memory/defaults/",
    "intake/",
}


def main() -> int:
    if not SOURCE.exists():
        print(f"Instruction/file consistency validation failed:\n- Missing source snapshot: {SOURCE.relative_to(ROOT)}")
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    failures: list[str] = []

    referenced_paths = set(PATH_RE.findall(text))
    referenced_paths.update(label for label in FILE_TAG_RE.findall(text) if "/" in label)

    for rel in sorted(referenced_paths):
        if not (ROOT / rel).exists():
            failures.append(f"[missing-path] {rel}")

    for rel in sorted(REQUIRED_REFERENCES):
        if rel not in referenced_paths:
            failures.append(f"[missing-required-reference] {rel}")

    for token in sorted(FORBIDDEN_TOKENS):
        if token in text:
            failures.append(f"[stale-structure-reference] {token}")

    if failures:
        print("Instruction/file consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Instruction/file consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
