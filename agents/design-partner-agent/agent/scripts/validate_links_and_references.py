#!/usr/bin/env python3
"""Validate relative Markdown links and referenced local file targets."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(".")
TARGET_DIRS = [ROOT / "references", ROOT / "templates", ROOT / "examples", ROOT / "memory", ROOT / "scripts"]
LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def iter_markdown_files() -> list[Path]:
    files: list[Path] = []
    for folder in TARGET_DIRS:
        if folder.exists():
            files.extend(sorted(p for p in folder.glob("*.md") if p.is_file()))
    return files


def main() -> int:
    issues: list[str] = []
    root_resolved = ROOT.resolve()

    for path in iter_markdown_files():
        text = path.read_text(encoding="utf-8")
        for target in LINK_RE.findall(text):
            if target.startswith(("http://", "https://", "chatkit-link://", "mailto:")):
                continue
            resolved = (path.parent / target).resolve()
            try:
                resolved.relative_to(root_resolved)
            except ValueError:
                issues.append(f"{path} contains out-of-package relative link: {target}")
                continue
            if not resolved.exists():
                issues.append(f"{path} references missing local target: {target}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nLink and reference validation failed with {len(issues)} issue(s).")
        return 1

    print("Link and reference validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
