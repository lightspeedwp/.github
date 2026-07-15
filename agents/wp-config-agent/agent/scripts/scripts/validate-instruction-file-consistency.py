#!/usr/bin/env python3
"""Validate that instruction-referenced validation files still exist and stay aligned."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tests" / "instruction-file-consistency-source.md"
TAG_RE = re.compile(r"\{\{label:([^,}]+),id:[^,}]+,type:file\}\}")
PATH_RE = re.compile(r"([A-Za-z0-9._/-]+\.(?:md|json|sh|py|js))")
REQUIRED_PATHS = {
    "tests/README.md",
    "tests/master-qa-checklist.md",
    "tests/schema-validation-tests.md",
    "tests/pre-launch-qa-checklist.md",
    "tests/seo-launch-checklist.md",
    "tests/test-plan-gravity-forms.md",
    "scripts/validate-folder-schemas.sh",
}


def main() -> int:
    text = SOURCE.read_text(encoding="utf-8")
    failures: list[str] = []

    tagged_paths = set(TAG_RE.findall(text))
    inline_paths = set(PATH_RE.findall(text))

    for rel in sorted(tagged_paths | inline_paths):
        path = ROOT / rel
        if not path.exists():
            failures.append(f"Referenced path is missing: {rel}")

    missing_required = sorted(REQUIRED_PATHS - (tagged_paths | inline_paths))
    for rel in missing_required:
        failures.append(f"Required instruction reference is missing from source snapshot: {rel}")

    if failures:
        print("Instruction/file consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Instruction/file consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
