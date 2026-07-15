#!/usr/bin/env python3
"""Validate markdown structure, exact section order, duplicate top-level headings, empty sections, and placeholder text."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.MULTILINE)
PLACEHOLDER_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\btbd\b",
        r"\bplaceholder\b",
        r"lorem ipsum",
        r"add .* here",
    ]
]

MARKDOWN_RULES: dict[str, dict[str, object]] = {
    "README.md": {
        "required_order": [
            "WordPress Configuration Agent File Map",
            "Structure overview",
            "How the folders fit together",
            "Recommended maintenance flow",
            "Documentation rules",
        ],
    },
    "memory/user-preferences.md": {
        "required_order": [
            "User Preferences",
            "Client overview",
            "Site defaults",
            "Form standards",
            "SEO priorities",
            "QA and compliance",
            "Notes",
        ],
    },
    "memory/todos.md": {
        "required_order": [
            "Todos",
            "Active",
            "Blocked",
            "Follow-ups",
            "Pending decisions",
            "Done",
            "Notes",
        ],
        "allow_empty_sections": {"Done"},
    },
    "memory/project-history.md": {
        "required_order": ["Project History", "Suggested entries"],
    },
    "memory/session-handoff.md": {
        "required_order": ["Session Handoff", "Suggested structure"],
    },
    "memory/README.md": {
        "required_order": [
            "Memory",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Duplicate-handling rule",
            "Maintenance notes",
        ],
    },
    "schemas/README.md": {
        "required_order": [
            "Schemas",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Validation notes",
            "Maintenance notes",
        ],
    },
    "templates/README.md": {
        "required_order": [
            "Templates",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "examples/README.md": {
        "required_order": [
            "Examples",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "references/README.md": {
        "required_order": [
            "References",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "profiles/README.md": {
        "required_order": [
            "Profiles",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "fixtures/README.md": {
        "required_order": [
            "Fixtures",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "scripts/README.md": {
        "required_order": [
            "Scripts",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Current file inventory",
            "Naming conventions",
            "Recommended usage order",
            "Maintenance notes",
        ],
    },
    "prompts/README.md": {
        "required_order": [
            "Prompts",
            "Folder purpose",
            "How this folder relates to the rest of the structure",
            "Prompt library",
            "Current file inventory",
            "Naming conventions",
            "Maintenance notes",
        ],
    },
    "references/CONNECTORS.md": {
        "required_order": [
            "Connectors and Runtime Tools",
            "WordPress website connection",
            "Google Drive",
            "GitHub",
            "Linear",
            "Bugherd",
            "Web search",
        ],
    },
    "references/audit-docs-validation-workflow.md": {
        "required_order": [
            "Audit, Docs, and Validation Workflow",
            "Prompt 1 — Audit, compare, and document the file structure",
            "Prompt 2 — Update instructions and all README files",
            "Prompt 3 — Expand the validation pack",
            "Prompt 4 — Add validation documentation and coverage scenarios",
            "Recommended order",
        ],
    },
    "business-context.md": {
        "required_order": [
            "Business Context",
            "Overview",
            "Primary outcomes",
            "Core standards",
            "Notes",
        ],
        "allow_empty_sections": {"Notes"},
    },
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_headings(text: str) -> list[tuple[int, str, int, int]]:
    headings: list[tuple[int, str, int, int]] = []
    for match in HEADING_RE.finditer(text):
        level = len(match.group(1))
        title = match.group(2).strip()
        headings.append((level, title, match.start(), match.end()))
    return headings


def section_body(text: str, headings: list[tuple[int, str, int, int]], index: int) -> str:
    _, level, _, end = (headings[index][1], headings[index][0], headings[index][2], headings[index][3])
    next_start = len(text)
    for later_level, _, later_start, _ in headings[index + 1 :]:
        if later_level <= level:
            next_start = later_start
            break
    return text[end:next_start].strip()


def main() -> int:
    failures: list[str] = []

    for relative_path, rule in MARKDOWN_RULES.items():
        path = ROOT / relative_path
        if not path.exists():
            failures.append(f"{relative_path}: file is missing for markdown-structure validation")
            continue

        text = read(path)
        headings = parse_headings(text)
        top_titles = [title for level, title, _, _ in headings if level <= 2]
        allow_empty = set(rule.get("allow_empty_sections", set()))
        required_order = list(rule.get("required_order", []))

        seen_top: set[str] = set()
        for level, title, _, _ in headings:
            if level > 2:
                continue
            if title in seen_top:
                failures.append(f"{relative_path}: duplicate top-level heading '{title}'")
            seen_top.add(title)

        if top_titles[: len(required_order)] != required_order:
            failures.append(
                f"{relative_path}: required top-level heading order does not match expected order"
            )
            for required in required_order:
                if required not in top_titles:
                    failures.append(f"{relative_path}: missing required heading '{required}'")

        for i, (level, title, _, _) in enumerate(headings):
            if level > 2:
                continue
            body = section_body(text, headings, i)
            if not body and title not in allow_empty:
                failures.append(f"{relative_path}: heading '{title}' has an empty section")

        for pattern in PLACEHOLDER_PATTERNS:
            if pattern.search(text):
                failures.append(
                    f"{relative_path}: contains placeholder text matching rule '{pattern.pattern}'"
                )

    if failures:
        print("Markdown structure validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Markdown structure validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
