#!/usr/bin/env python3
"""Validate that the current source-priority guidance stays consistent across maintained docs."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONNECTORS = ROOT / "references" / "CONNECTORS.md"
WORKFLOW = ROOT / "references" / "audit-docs-validation-workflow.md"
VALIDATION_README = ROOT / "tests" / "validation-readme.md"
EXPECTED_PRIORITY = [
    "current attached files and grounded agent instructions",
    "direct connected-site evidence from kwv-dev-site when live site state matters",
    "attached app evidence from drive, github, bugherd, or linear when that source is directly relevant",
    "memory for durable project continuity",
    "web search for public, current external information",
]
CONTRADICTION_PATTERNS = {
    "app-results override attached files": "attached files must remain higher priority for maintenance work",
    "web search before attached files": "web search cannot outrank attached files",
    "memory before direct connected-site evidence": "direct connected-site evidence must outrank memory for live-state claims",
}
NUMBERED_LINE_RE = re.compile(r"^\d+\.\s+(.+)$", re.MULTILINE)


def main() -> int:
    failures: list[str] = []

    for path in (CONNECTORS, WORKFLOW, VALIDATION_README):
        if not path.exists():
            failures.append(f"missing file: {path.relative_to(ROOT)}")

    if failures:
        print("Source-priority consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    connectors_text = CONNECTORS.read_text(encoding="utf-8")
    workflow_text = WORKFLOW.read_text(encoding="utf-8").lower()
    validation_text = VALIDATION_README.read_text(encoding="utf-8").lower()

    numbered_lines = [item.strip().lower() for item in NUMBERED_LINE_RE.findall(connectors_text)]
    if numbered_lines[: len(EXPECTED_PRIORITY)] != EXPECTED_PRIORITY:
        failures.append("references/CONNECTORS.md [source-priority-order-mismatch]")

    if "current attached file tree as canonical" not in workflow_text and "attached file tree as source of truth" not in workflow_text:
        failures.append("references/audit-docs-validation-workflow.md [missing-attached-file-tree-priority]")

    if "source snapshot" not in validation_text:
        failures.append("tests/validation-readme.md [missing-source-snapshot-guidance]")

    for phrase, reason in CONTRADICTION_PATTERNS.items():
        if phrase in connectors_text.lower() or phrase in workflow_text or phrase in validation_text:
            failures.append(f"[contradictory-source-priority] {reason}")

    if failures:
        print("Source-priority consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Source-priority consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
