#!/usr/bin/env python3
"""Validate that reference files have headings and enough routing content."""
from __future__ import annotations

import sys
from pathlib import Path


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    refs = sorted((root / "references").glob("*.md"))
    if not refs:
        print("No reference files found.")
        return 1
    failures = []
    for ref in refs:
        text = ref.read_text(errors="ignore")
        if not text.lstrip().startswith("#"):
            failures.append(f"{ref.name}: missing top-level heading")
        if len(text.split()) < 20:
            failures.append(f"{ref.name}: too short")
    if failures:
        print("Reference validation failed:")
        for item in failures:
            print(f"- {item}")
        return 1
    print(f"Reference validation passed for {len(refs)} files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
