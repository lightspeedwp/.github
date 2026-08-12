#!/usr/bin/env python3
"""Validate the current memory folder structure and memory-file hygiene."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEMORY = ROOT / "memory"
README_REQUIRED = [
    "## Purpose",
    "## Naming conventions",
    "## File inventory",
    "## Canonical location rules",
    "## Duplicate-handling rule",
]
EXPECTED = {
    "todos.md": ["## Active", "## Blocked", "## Follow-ups", "## Pending decisions", "## Done", "## Notes"],
    "user-preferences.md": ["## Client overview", "## Site defaults", "## Form standards", "## SEO priorities", "## QA and compliance", "## Notes"],
    "project-history.md": ["## Suggested entries"],
    "session-handoff.md": ["## Suggested structure"],
}
PLACEHOLDER_RE = re.compile(r"\b(?:TODO|TBD|placeholder|lorem ipsum)\b", re.IGNORECASE)
TEMPORARY_RE = re.compile(r"\b(?:temp|temporary|one-off|scratch)\b", re.IGNORECASE)
COMPLETED_RE = re.compile(r"\b(?:done|completed|resolved|shipped)\b", re.IGNORECASE)


def headings(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.startswith("## ")]


def section_body(text: str, heading: str) -> str:
    lines = text.splitlines()
    capture = False
    body: list[str] = []
    for line in lines:
        if line.strip() == heading:
            capture = True
            continue
        if capture and line.startswith("## "):
            break
        if capture:
            body.append(line)
    return "\n".join(body).strip()


def main() -> int:
    if not MEMORY.exists():
        print("Memory validation passed: memory/ is not present in the current file tree.")
        return 0

    failures: list[str] = []
    readme = MEMORY / "README.md"
    if readme.exists():
        text = readme.read_text(encoding="utf-8")
        found = headings(text)
        missing = [item for item in README_REQUIRED if item not in found]
        for item in missing:
            failures.append(f"memory/README.md [missing-heading] {item}")
    else:
        failures.append("memory/README.md [missing-file]")

    for path in sorted(MEMORY.glob("*.md")):
        if path.name == "README.md":
            continue
        text = path.read_text(encoding="utf-8")
        found = headings(text)
        if path.name in EXPECTED:
            for item in EXPECTED[path.name]:
                if item not in found:
                    failures.append(f"memory/{path.name} [missing-heading] {item}")
        if PLACEHOLDER_RE.search(text):
            failures.append(f"memory/{path.name} [placeholder-text]")
        current_body = section_body(text, "## Current")
        if "## Current" in found and not current_body:
            failures.append(f"memory/{path.name} [empty-current-section]")
        if path.name == "user-preferences.md" and TEMPORARY_RE.search(text):
            failures.append(f"memory/{path.name} [temporary-content-in-durable-file]")
        if path.name == "todos.md":
            done_body = section_body(text, "## Done")
            if re.search(r"\[[^xX]\]", done_body):
                failures.append(f"memory/{path.name} [open-checkbox-in-done-section]")
            for heading in ("## Active", "## Blocked", "## Follow-ups"):
                body = section_body(text, heading)
                if COMPLETED_RE.search(body):
                    failures.append(f"memory/{path.name} [completed-item-outside-done-section] {heading}")

    if failures:
        print("Memory validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Memory validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
