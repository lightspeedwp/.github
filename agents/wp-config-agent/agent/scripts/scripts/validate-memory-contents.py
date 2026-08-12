#!/usr/bin/env python3
"""Validate WordPress memory files for structure, separation of concerns, and obvious drift."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEMORY_DIR = ROOT / "memory"
REQUIRED_FILES = {
    "user-preferences.md": [
        "## Client overview",
        "## Site defaults",
        "## Form standards",
        "## SEO priorities",
        "## QA and compliance",
        "## Notes",
    ],
    "todos.md": [
        "## Active",
        "## Blocked",
        "## Follow-ups",
        "## Pending decisions",
        "## Done",
        "## Notes",
    ],
    "project-history.md": ["## Suggested entries"],
    "session-handoff.md": ["## Suggested structure"],
}
FORBIDDEN_PATTERNS = [
    r"woocommerce",
    r"tour operator",
    r"tour-operator",
    r"booking engine",
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def headings(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.startswith("## ")]


def main() -> int:
    errors: list[str] = []

    if not MEMORY_DIR.exists():
        print("memory directory is missing")
        return 1

    for filename, required_sections in REQUIRED_FILES.items():
        path = MEMORY_DIR / filename
        if not path.exists():
            errors.append(f"memory/{filename}: missing required memory file")
            continue
        text = read(path)
        found = set(headings(text))
        for section in required_sections:
            if section not in found:
                errors.append(f"memory/{filename}: missing section {section}")
        lowered = text.lower()
        for pattern in FORBIDDEN_PATTERNS:
            if re.search(pattern, lowered):
                errors.append(f"memory/{filename}: contains off-scope reference matching '{pattern}'")

    for extra_file in MEMORY_DIR.glob("*.md"):
        if extra_file.name == "README.md":
            continue
        if extra_file.name not in REQUIRED_FILES:
            errors.append(f"memory/{extra_file.name}: no validation profile defined yet")

    if errors:
        print("Memory validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Memory validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
