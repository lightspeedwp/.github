#!/usr/bin/env python3
"""Validate that app-related instruction guidance stays aligned with attached apps."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tests" / "app-usage-consistency-source.md"

SECTION_RE = re.compile(r"^##\s+(.+)$", re.MULTILINE)
CODE_TICK_RE = re.compile(r"^`(.+)`$")

ALIASES = {
    "Google Drive": ["Google Drive", "Google Drive usage"],
    "LS Agency LIVE MCP": [
        "LS Agency LIVE MCP",
        "WordPress MCP app",
        "WordPress tool usage",
        "connected WordPress MCP app",
    ],
    "Slack": ["Slack", "Slack usage"],
    "Gmail": ["Gmail"],
    "Google Calendar": ["Google Calendar"],
    "GitHub": ["GitHub"],
}


def parse_sections(text: str) -> dict[str, str]:
    matches = list(SECTION_RE.finditer(text))
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
        print(f"App-usage consistency validation failed:\n- Source snapshot is missing: {SOURCE.relative_to(ROOT)}")
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    sections = parse_sections(text)
    failures: list[str] = []

    attached_apps = parse_bullets(sections.get("Attached apps snapshot", ""))
    required_markers = parse_bullets(sections.get("Required instruction markers", ""))
    forbidden_refs = parse_bullets(sections.get("Forbidden app references", ""))
    instruction_excerpt = sections.get("Instruction excerpt", "")

    if not attached_apps:
        failures.append("Attached apps snapshot is empty")
    if not instruction_excerpt:
        failures.append("Instruction excerpt is empty")

    for marker in required_markers:
        if marker not in instruction_excerpt:
            failures.append(f"Required instruction marker is missing: {marker}")

    for ref in forbidden_refs:
        if ref in instruction_excerpt:
            failures.append(f"Forbidden app reference is still present: {ref}")

    allowed_aliases: set[str] = set()
    for app in attached_apps:
        aliases = ALIASES.get(app, [app])
        allowed_aliases.update(aliases)
        if not any(alias in instruction_excerpt for alias in aliases):
            failures.append(f"Attached app is not represented in the instruction excerpt: {app}")

    for app, aliases in ALIASES.items():
        if app in attached_apps:
            continue
        for alias in aliases:
            if alias in instruction_excerpt:
                failures.append(
                    f"Instruction excerpt references an app that is not in the attached-app snapshot: {alias}"
                )
                break

    if failures:
        print("App-usage consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("App-usage consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
