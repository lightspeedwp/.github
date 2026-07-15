#!/usr/bin/env python3
"""Validate business-context.md for core completeness markers."""

from __future__ import annotations

import sys
from pathlib import Path

TARGET = Path("business-context.md")
REQUIRED_SECTIONS = [
    "lightspeed",
    "wordpress",
    "design",
]


def main() -> int:
    if not TARGET.exists():
        print(f"[FAIL] missing business context file: {TARGET}")
        return 1

    text = TARGET.read_text(encoding="utf-8").lower()
    issues: list[str] = []
    if len(text.strip()) < 300:
        issues.append("business-context.md is too short to be a useful standing reference")
    for marker in REQUIRED_SECTIONS:
        if marker not in text:
            issues.append(f"business-context.md missing expected marker: {marker}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nBusiness context validation failed with {len(issues)} issue(s).")
        return 1

    print("Business context validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
