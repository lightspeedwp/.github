#!/usr/bin/env python3
"""Validate README inventory sections against the current attached file tree."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INVENTORY_FOLDERS = [
    "memory",
    "templates",
    "examples",
    "references",
    "schemas",
    "profiles",
    "fixtures",
    "scripts",
    "prompts",
]
SECTION_RE = re.compile(
    r"^##\s+Current file inventory\s*$\n(?P<body>.*?)(?=^##\s+|\Z)",
    re.MULTILINE | re.DOTALL,
)
INVENTORY_LINE_RE = re.compile(r"^-\s+`([^`]+)`\s+—\s+.+$")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_inventory_entries(readme_path: Path) -> list[str]:
    text = read(readme_path)
    match = SECTION_RE.search(text)
    if not match:
        raise ValueError("missing 'Current file inventory' section")

    entries: list[str] = []
    for raw_line in match.group("body").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        line_match = INVENTORY_LINE_RE.match(line)
        if not line_match:
            continue
        entries.append(line_match.group(1))
    return entries


def actual_files(folder_path: Path) -> list[str]:
    return sorted(path.name for path in folder_path.iterdir() if path.is_file())


def main() -> int:
    failures: list[str] = []

    for folder_name in INVENTORY_FOLDERS:
        folder_path = ROOT / folder_name
        readme_path = folder_path / "README.md"

        if not folder_path.exists():
            failures.append(f"{folder_name}/: folder is missing")
            continue
        if not readme_path.exists():
            failures.append(f"{folder_name}/README.md: file is missing")
            continue

        try:
            documented = sorted(parse_inventory_entries(readme_path))
        except ValueError as exc:
            failures.append(f"{folder_name}/README.md: {exc}")
            continue

        actual = actual_files(folder_path)

        missing_from_inventory = sorted(set(actual) - set(documented))
        stale_in_inventory = sorted(set(documented) - set(actual))

        if missing_from_inventory:
            failures.append(
                f"{folder_name}/README.md: missing inventory entries for {', '.join(missing_from_inventory)}"
            )
        if stale_in_inventory:
            failures.append(
                f"{folder_name}/README.md: stale inventory entries for {', '.join(stale_in_inventory)}"
            )

    if failures:
        print("Inventory consistency validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Inventory consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
