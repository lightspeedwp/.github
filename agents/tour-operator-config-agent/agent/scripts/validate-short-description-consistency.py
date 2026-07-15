#!/usr/bin/env python3
"""Validate that the short description stays aligned with the agent's current role."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tests" / "short-description-consistency-source.md"
HEADING_RE = re.compile(r"^##\s+(.+)$", re.MULTILINE)
CODE_TICK_RE = re.compile(r"^`(.+)`$")


def parse_sections(text: str) -> dict[str, str]:
    matches = list(HEADING_RE.finditer(text))
    sections: dict[str, str] = {}
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        sections[match.group(1).strip()] = text[start:end].strip()
    return sections


def parse_bullets(section_text: str) -> list[str]:
    items: list[str] = []
    for line in section_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            value = stripped[2:].strip()
            code_match = CODE_TICK_RE.match(value)
            items.append(code_match.group(1) if code_match else value)
    return items


def main() -> int:
    if not SOURCE.exists():
        print(f"Short-description consistency validation failed:\n- Source snapshot is missing: {SOURCE.relative_to(ROOT)}")
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    sections = parse_sections(text)
    failures: list[str] = []

    current_description = sections.get("Current short description", "").strip()
    code_match = CODE_TICK_RE.match(current_description)
    description = code_match.group(1) if code_match else current_description

    required_themes = parse_bullets(sections.get("Required description themes", ""))
    forbidden_themes = parse_bullets(sections.get("Forbidden description themes", ""))

    if not description:
        failures.append("Current short description is empty")
    elif len(description) > 64:
        failures.append("Current short description exceeds 64 characters")

    for theme in required_themes:
        if theme.lower() not in description.lower():
            failures.append(f"Required short-description theme is missing: {theme}")

    for theme in forbidden_themes:
        if theme.lower() in description.lower():
            failures.append(f"Forbidden short-description theme is present: {theme}")

    if failures:
        print("Short-description consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Short-description consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
