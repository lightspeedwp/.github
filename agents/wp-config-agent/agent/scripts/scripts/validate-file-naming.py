#!/usr/bin/env python3
"""Validate naming conventions across key agent folders."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RULES = {
    "templates": re.compile(r"^[a-z0-9-]+-template\.md$"),
    "examples": re.compile(r"^example-[a-z0-9-]+\.md$"),
    "schemas": re.compile(r"^[a-z0-9-]+-schema\.json$"),
    "memory": re.compile(r"^[a-z0-9-]+\.md$"),
    "references": re.compile(r"^[a-z0-9-]+(?:-reference|-standard|-policy|-checklist|-conventions)\.md$"),
    "tests": re.compile(r"^(?:test-plan|qa-checklist|regression)-[a-z0-9-]+\.md$|^[a-z0-9-]+-(?:checklist|tests|source)\.md$"),
    "scripts": re.compile(r"^validate-[a-z0-9-]+\.(?:sh|py)$|^run-[a-z0-9-]+\.sh$|^[a-z0-9-]+(?:-(?:script|helper|validator|automation))\.(?:sh|py|js)$"),
}

SKIP = {"README.md"}


def main() -> int:
    failures: list[str] = []

    for folder, pattern in RULES.items():
        for path in sorted((ROOT / folder).iterdir()):
            if not path.is_file() or path.name in SKIP:
                continue
            if not pattern.match(path.name):
                failures.append(f"{folder}/{path.name}: does not match naming convention")

    if failures:
        print("Naming validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Naming validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
