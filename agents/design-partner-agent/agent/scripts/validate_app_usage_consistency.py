#!/usr/bin/env python3
"""Check that instruction text only references currently attached apps.

This validator compares app entity-tag labels in an instructions text file against
an explicit allowlist of currently attached app labels.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ENTITY_TAG_RE = re.compile(r"\{\{label:(?P<label>.*?),id:(?P<id>.*?),type:(?P<type>.*?)\}\}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate app usage consistency in instructions")
    parser.add_argument("instruction_file", help="Path to a text file containing instruction text")
    parser.add_argument(
        "--allowed-app",
        action="append",
        default=[],
        help="Allowed attached app label. Repeat for each attached app.",
    )
    args = parser.parse_args()

    instruction_path = Path(args.instruction_file)
    if not instruction_path.exists():
        print(f"[FAIL] instruction file not found: {instruction_path}")
        return 1

    allowed = set(args.allowed_app)
    text = instruction_path.read_text(encoding="utf-8")

    issues: list[str] = []
    seen_labels: set[str] = set()
    for match in ENTITY_TAG_RE.finditer(text):
        if match.group("type") != "app":
            continue
        label = match.group("label")
        seen_labels.add(label)
        if label not in allowed:
            issues.append(f"instruction references app not in current attached-app allowlist: {label}")

    if not seen_labels:
        print("[WARN] no app entity tags found in the instruction file")
        return 0

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nApp usage consistency validation failed with {len(issues)} issue(s).")
        return 1

    print("All app usage references are consistent with the current attached apps.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
