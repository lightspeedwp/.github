#!/usr/bin/env python3
"""Validate business-context completeness, domain coverage, and placeholder drift."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUSINESS_CONTEXT = ROOT / "business-context.md"
REQUIRED_HEADINGS = [
    "# Business Context",
    "## Overview",
    "## Primary outcomes",
    "## Core standards",
    "## Notes",
]
PLACEHOLDER_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\btbd\b",
        r"\bplaceholder\b",
        r"lorem ipsum",
        r"add .* here",
    ]
]
REQUIRED_DOMAIN_TERMS = ["WordPress", "Gravity Forms", "Yoast SEO"]
RAW_NOTES_PLACEHOLDER = (
    "Add business-specific goals, constraints, service offerings, content requirements, and brand positioning here as the agent evolves."
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def section_after(text: str, heading: str) -> str:
    start = text.find(heading)
    if start == -1:
        return ""
    start = text.find("\n", start)
    if start == -1:
        return ""
    next_heading = text.find("\n## ", start + 1)
    return text[start: next_heading if next_heading != -1 else len(text)].strip()


def count_bullets(section_text: str) -> int:
    return sum(1 for line in section_text.splitlines() if line.strip().startswith("- "))


def main() -> int:
    failures: list[str] = []

    if not BUSINESS_CONTEXT.exists():
        print("Business-context validation failed:\n- business-context.md is missing")
        return 1

    text = read(BUSINESS_CONTEXT)

    for heading in REQUIRED_HEADINGS:
        if heading not in text:
            failures.append(f"business-context.md: missing required heading {heading}")

    for pattern in PLACEHOLDER_PATTERNS:
        if pattern.search(text):
            failures.append(
                f"business-context.md: contains placeholder text matching '{pattern.pattern}'"
            )

    for term in REQUIRED_DOMAIN_TERMS:
        if term not in text:
            failures.append(f"business-context.md: missing core domain term '{term}'")

    primary_outcomes = section_after(text, "## Primary outcomes")
    core_standards = section_after(text, "## Core standards")
    if count_bullets(primary_outcomes) < 3:
        failures.append("business-context.md: Primary outcomes section is too thin for maintenance validation")
    if count_bullets(core_standards) < 3:
        failures.append("business-context.md: Core standards section is too thin for maintenance validation")

    if RAW_NOTES_PLACEHOLDER in text:
        failures.append("business-context.md: Notes section still contains a raw future-placeholder sentence")

    if failures:
        print("Business-context validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Business-context validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
