#!/usr/bin/env python3
"""Validate file-path references in markdown docs."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOC_FILES = [
    ROOT / "tests" / "README.md",
    ROOT / "scripts" / "README.md",
    ROOT / "tests" / "master-qa-checklist.md",
    ROOT / "tests" / "schema-validation-tests.md",
]
PATH_RE = re.compile(r"((?:tests|scripts|templates|examples|schemas|memory|references)/[A-Za-z0-9._/-]+\.(?:md|json|sh|py|js))")


def main() -> int:
    failures: list[str] = []

    for doc in DOC_FILES:
        text = doc.read_text(encoding="utf-8")
        for match in PATH_RE.finditer(text):
            rel = match.group(1)
            path = ROOT / rel
            if not path.exists():
                failures.append(f"{doc.relative_to(ROOT)} references missing path: {rel}")

    if failures:
        print("Reference-link validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Reference-link validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
