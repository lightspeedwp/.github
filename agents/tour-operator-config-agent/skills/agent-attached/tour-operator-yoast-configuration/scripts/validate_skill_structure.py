#!/usr/bin/env python3
"""Validate the tour-operator Yoast skill structure."""
from __future__ import annotations

import sys
from pathlib import Path

REQUIRED = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/tour-operator-seo-playbook.md",
    "references/file-routing-index.md",
    "templates/tour-operator-yoast-configuration-report.md",
    "templates/rendered-output-qa-report.md",
    "templates/redirect-map-review.md",
    "scripts/generate_qa_checklist.py",
]

# Build removed-scope terms without writing the direct strings into this file.
REMOVED = [
    "wo" + "o" + "commerce",
    "e" + "commerce",
    "pro" + "duct",
    "of" + "fer",
    "st" + "ock",
    "ship" + "ping",
    "ret" + "urns",
    "ca" + "rt",
    "check" + "out",
    "face" + "ted",
]


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        print("Missing required files:")
        for p in missing:
            print(f"- {p}")
        return 1

    bad = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(root).as_posix().lower()
        text = path.read_text(errors="ignore").lower()
        # Ignore this validator's constructed term list to avoid self-reporting.
        if rel == "scripts/validate_skill_structure.py":
            continue
        for term in REMOVED:
            if term in rel or term in text:
                bad.append((rel, term))
    if bad:
        print("Removed-scope terms found:")
        for rel, term in bad:
            print(f"- {rel}: {term}")
        return 1

    print("Skill structure validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
