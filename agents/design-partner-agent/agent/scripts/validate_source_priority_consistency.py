#!/usr/bin/env python3
"""Validate source-priority wording across key package assets."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(".")
REQUIRED_PHRASES = [
    "current request",
    "attached reference files",
    "attached apps",
    "memory",
    "web",
]
TARGETS = [
    Path("agent_instructions.txt"),
    Path("business-context.md"),
    Path("references/CONNECTORS.md"),
]


def main() -> int:
    issues: list[str] = []
    for path in TARGETS:
        if not path.exists():
            issues.append(f"missing required source-priority file: {path}")
            continue
        text = path.read_text(encoding="utf-8").lower()
        for phrase in REQUIRED_PHRASES:
            if phrase not in text:
                issues.append(f"{path} missing source-priority phrase: {phrase}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nSource-priority consistency validation failed with {len(issues)} issue(s).")
        return 1

    print("Source-priority consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
