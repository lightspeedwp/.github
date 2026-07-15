#!/usr/bin/env python3
"""Validate that the WordPress agent has the expected core folders, docs, prompts, and validators."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_PATHS = [
    "README.md",
    "business-context.md",
    "references",
    "references/README.md",
    "references/CONNECTORS.md",
    "references/audit-docs-validation-workflow.md",
    "templates",
    "templates/README.md",
    "examples",
    "examples/README.md",
    "schemas",
    "schemas/README.md",
    "memory",
    "memory/README.md",
    "profiles",
    "profiles/README.md",
    "fixtures",
    "fixtures/README.md",
    "scripts",
    "scripts/README.md",
    "scripts/validate-agent-structure.py",
    "scripts/validate-memory-contents.py",
    "scripts/validate-markdown-structure.py",
    "scripts/validate-template-schema-alignment.py",
    "scripts/validate-memory-hygiene.py",
    "scripts/validate-source-priority-consistency.py",
    "scripts/validate-business-context.py",
    "scripts/validate-short-description-consistency.py",
    "scripts/validate-inventory-consistency.py",
    "prompts",
    "prompts/README.md",
    "prompts/readme-recurring-cleanup-prompt.md",
    "prompts/routing-language-cleanup-prompt.md",
    "prompts/validation-pack-tightening-prompt.md",
    "prompts/skills-routing-and-directory-validation-prompt.md",
    "schemas/memory-entry-schema.json",
]


def main() -> int:
    errors: list[str] = []
    for relative_path in REQUIRED_PATHS:
        path = ROOT / relative_path
        if not path.exists():
            errors.append(f"missing required path: {relative_path}")

    if errors:
        print("Agent structure validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Agent structure validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
