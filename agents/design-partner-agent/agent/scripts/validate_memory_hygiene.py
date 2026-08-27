#!/usr/bin/env python3
"""Validate separation of concerns across Memory files."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path("memory")
FILES = {
    "user-preferences": ROOT / "user-preferences.md",
    "project-defaults": ROOT / "project-defaults.md",
    "todos": ROOT / "todos.md",
    "review-history": ROOT / "review-history.md",
    "client-engagement-template": ROOT / "client-engagement-template.md",
}

RULES = {
    "user-preferences": {
        "required": ["working rule", "starter preferences for this setup"],
        "forbidden": ["### review", "client or project name", "starter baseline entry"],
    },
    "project-defaults": {
        "required": ["default source hierarchy", "reusable client-pattern starters"],
        "forbidden": ["### review", "starter baseline entry", "- [ ]"],
    },
    "todos": {
        "required": ["- [ ]", "starter active follow-ups"],
        "forbidden": ["### review", "client or project name", "starter baseline entry"],
    },
    "review-history": {
        "required": ["starter baseline entry", "### review"],
        "forbidden": [],
    },
    "client-engagement-template": {
        "required": ["client or project name", "business goal", "open questions that still recur"],
        "forbidden": ["- [ ]"],
    },
}


def main() -> int:
    issues: list[str] = []
    for key, path in FILES.items():
        if not path.exists():
            issues.append(f"missing file: {path}")
            continue
        text = path.read_text(encoding="utf-8").lower()
        rules = RULES.get(key, {})
        for token in rules.get("required", []):
            if token not in text:
                issues.append(f"{path} missing required marker: {token}")
        for token in rules.get("forbidden", []):
            if token in text:
                issues.append(f"{path} contains forbidden marker: {token}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nMemory hygiene validation failed with {len(issues)} issue(s).")
        return 1

    print("All Memory hygiene checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
