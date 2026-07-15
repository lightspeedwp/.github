#!/usr/bin/env python3
"""Validate file-path, file-tag, and entity-tag references across maintained docs."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOC_FILES = [
    ROOT / "tests" / "README.md",
    ROOT / "tests" / "validation-readme.md",
    ROOT / "tests" / "master-qa-checklist.md",
    ROOT / "tests" / "schema-validation-tests.md",
    ROOT / "tests" / "instruction-file-consistency-source.md",
    ROOT / "scripts" / "README.md",
    ROOT / "schemas" / "README.md",
    ROOT / "references" / "README.md",
    ROOT / "references" / "CONNECTORS.md",
    ROOT / "references" / "audit-docs-validation-workflow.md",
    ROOT / "examples" / "README.md",
]
PATH_RE = re.compile(r"((?:tests|scripts|templates|examples|schemas|memory|references)/[A-Za-z0-9._/-]+\.(?:md|json|sh|py|js))")
ENTITY_TAG_RE = re.compile(r"\{\{label:([^,}]+),id:([^,}]+),type:([^,}]+)\}\}")


def main() -> int:
    failures: list[str] = []

    for doc in DOC_FILES:
        if not doc.exists():
            failures.append(f"missing required document for validation scan: {doc.relative_to(ROOT)}")
            continue

        text = doc.read_text(encoding="utf-8")
        for match in PATH_RE.finditer(text):
            rel = match.group(1)
            path = ROOT / rel
            if not path.exists():
                failures.append(f"{doc.relative_to(ROOT)} [missing-path] {rel}")

        for label, tag_id, tag_type in ENTITY_TAG_RE.findall(text):
            if tag_type == "file" and "/" in label:
                path = ROOT / label
                if not path.exists():
                    failures.append(f"{doc.relative_to(ROOT)} [broken-file-tag-label] {label}")
            if tag_type == "file" and "/" in tag_id:
                failures.append(f"{doc.relative_to(ROOT)} [malformed-file-tag-id] {tag_id}")
            if tag_type not in {"file", "app", "skill", "slack_channel", "web_search", "file_persistence", "image_generation"}:
                failures.append(f"{doc.relative_to(ROOT)} [unsupported-entity-tag-type] {tag_type}")

    required_paths = {
        "references/CONNECTORS.md",
        "references/audit-docs-validation-workflow.md",
        "tests/validation-readme.md",
        "tests/schema-validation-tests.md",
        "scripts/run-master-validation.sh",
        "scripts/validate-reference-links.py",
        "scripts/validate-memory-files.py",
        "scripts/validate-markdown-structure.py",
        "scripts/validate-source-priority-consistency.py",
        "scripts/validate-template-schema-alignment.py",
    }
    for rel in sorted(required_paths):
        if not (ROOT / rel).exists():
            failures.append(f"required validation asset is missing: {rel}")

    if failures:
        print("Reference-link validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Reference-link validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
