#!/usr/bin/env python3
"""Validate memory hygiene for durable defaults, open work, stale completion markers, and empty current-state handling."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
USER_PREFERENCES = ROOT / "memory" / "user-preferences.md"
TODOS = ROOT / "memory" / "todos.md"
SESSION_HANDOFF = ROOT / "memory" / "session-handoff.md"
ONE_OFF_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\btoday\b",
        r"\btomorrow\b",
        r"\bthis week\b",
        r"\bone-off\b",
        r"\btemporary\b",
        r"\bquick note\b",
    ]
]
COMPLETION_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\bcompleted\b",
        r"\bdone\b",
        r"\bresolved\b",
        r"\bshipped\b",
        r"\bclosed\b",
    ]
]
CURRENT_LINE_RE = re.compile(r"^-\s+Current[^:]*:\s*(.*)$", re.IGNORECASE | re.MULTILINE)
CURRENT_FOCUS_RE = re.compile(r"^-\s+Current focus:\s*(.*)$", re.IGNORECASE | re.MULTILINE)
ALLOWED_INTENTIONALLY_EMPTY = {"none", "intentionally empty", "n/a", "not applicable"}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_section(text: str, heading: str) -> str:
    marker = f"## {heading}"
    start = text.find(marker)
    if start == -1:
        return ""
    start = text.find("\n", start)
    if start == -1:
        return ""
    next_heading = text.find("\n## ", start + 1)
    return text[start: next_heading if next_heading != -1 else len(text)].strip()


def validate_current_lines(text: str, relative_path: str, failures: list[str]) -> None:
    for regex in (CURRENT_LINE_RE, CURRENT_FOCUS_RE):
        for match in regex.finditer(text):
            value = match.group(1).strip()
            if not value:
                failures.append(f"{relative_path}: '{match.group(0).split(':')[0][2:]}' line is empty")
            elif value.lower() not in ALLOWED_INTENTIONALLY_EMPTY and len(value) < 4:
                failures.append(f"{relative_path}: '{match.group(0).split(':')[0][2:]}' line is too vague to be useful")


def main() -> int:
    failures: list[str] = []

    required = [USER_PREFERENCES, TODOS, SESSION_HANDOFF]
    missing = [path for path in required if not path.exists()]
    if missing:
        print("Memory hygiene validation failed:")
        for path in missing:
            print(f"- missing required file: {path.relative_to(ROOT)}")
        return 1

    user_preferences_text = read(USER_PREFERENCES)
    todos_text = read(TODOS)
    session_handoff_text = read(SESSION_HANDOFF)

    for pattern in ONE_OFF_PATTERNS:
        if pattern.search(user_preferences_text):
            failures.append(
                f"memory/user-preferences.md: contains one-off or temporary language matching '{pattern.pattern}'"
            )

    for heading in ["Active", "Blocked", "Follow-ups", "Pending decisions"]:
        section = extract_section(todos_text, heading)
        for pattern in COMPLETION_PATTERNS:
            if pattern.search(section):
                failures.append(
                    f"memory/todos.md: {heading} section contains completed-work language matching '{pattern.pattern}'"
                )

    validate_current_lines(session_handoff_text, "memory/session-handoff.md", failures)

    done_section = extract_section(todos_text, "Done")
    if not done_section:
        failures.append("memory/todos.md: Done section is empty; mark it intentionally empty if nothing belongs there")

    if failures:
        print("Memory hygiene validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Memory hygiene validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
