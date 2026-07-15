#!/usr/bin/env python3
"""Validate source-priority and evidence-language consistency across key maintenance docs."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = {
    "business-context.md": ROOT / "business-context.md",
    "memory/user-preferences.md": ROOT / "memory" / "user-preferences.md",
    "references/audit-docs-validation-workflow.md": ROOT / "references" / "audit-docs-validation-workflow.md",
    "references/CONNECTORS.md": ROOT / "references" / "CONNECTORS.md",
    "scripts/README.md": ROOT / "scripts" / "README.md",
}
REQUIRED_SNIPPETS = {
    "references/audit-docs-validation-workflow.md": [
        "Use the current structure as source of truth.",
        "Treat the current `memory/*.md` files as the canonical home",
        "Do not assume `intake/` exists",
    ],
    "references/CONNECTORS.md": [
        "When to prefer files or Memory instead",
        "use app calls for live evidence",
    ],
    "memory/user-preferences.md": [
        "stable client and project defaults",
        "Keep one-off scratch notes out of this file.",
    ],
    "business-context.md": [
        "WordPress",
        "Gravity Forms",
        "Yoast SEO",
    ],
    "scripts/README.md": [
        "run-master-validation.sh",
        "validate-memory-contents.py",
    ],
}
FORBIDDEN_PHRASES = {
    "references/CONNECTORS.md": [
        "single source of truth for all project context",
    ],
    "memory/user-preferences.md": [
        "temporary task list",
        "scratchpad",
    ],
}
OUTDATED_STRUCTURE_PHRASES = [
    "memory/defaults/",
    "memory/schemas/",
    "intake/",
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def main() -> int:
    failures: list[str] = []

    for relative_path, path in FILES.items():
        if not path.exists():
            failures.append(f"{relative_path}: file is missing for source-priority validation")
            continue
        text = read(path)
        for snippet in REQUIRED_SNIPPETS.get(relative_path, []):
            if snippet not in text:
                failures.append(f"{relative_path}: missing required source-priority text: {snippet}")
        for snippet in FORBIDDEN_PHRASES.get(relative_path, []):
            if snippet.lower() in text.lower():
                failures.append(f"{relative_path}: contains forbidden source-priority phrase: {snippet}")
        for outdated in OUTDATED_STRUCTURE_PHRASES:
            if relative_path != "references/audit-docs-validation-workflow.md" and outdated in text:
                failures.append(f"{relative_path}: refers to outdated structure path '{outdated}'")

    if failures:
        print("Source-priority consistency validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Source-priority consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
