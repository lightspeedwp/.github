#!/usr/bin/env python3
"""Validate markdown structure for maintained docs and README files."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACEHOLDER_RE = re.compile(r"\b(?:TODO|TBD|placeholder|lorem ipsum|coming soon)\b", re.IGNORECASE)
HEADING_RE = re.compile(r"^(##+\s+.+)$", re.MULTILINE)

DOC_RULES = {
    "tests/README.md": [
        "## Purpose",
        "## Naming conventions",
        "## File inventory",
        "## Recommended usage order",
        "## Canonical role rules",
    ],
    "scripts/README.md": [
        "## Purpose",
        "## Naming conventions",
        "## File inventory",
        "## Recommended usage order",
        "## Canonical role rules",
    ],
    "schemas/README.md": [
        "## Purpose",
        "## Naming conventions",
        "## File inventory",
        "## Canonical role rules",
    ],
    "references/README.md": [
        "## Purpose",
        "## Naming conventions",
        "## File inventory",
        "## Canonical role rules",
    ],
    "examples/README.md": [
        "## Purpose",
        "## Naming conventions",
        "## File inventory",
        "## Canonical role rules",
    ],
    "references/CONNECTORS.md": [
        "## Purpose",
        "## App map",
        "## Source-priority guidance",
    ],
    "references/audit-docs-validation-workflow.md": [
        "## Prompt 1 — Audit, compare, and document the file structure",
        "## Prompt 2 — Update instructions and all README files",
        "## Prompt 3 — Expand the validation pack",
        "## Prompt 4 — Add validation documentation and test scenarios",
        "## Recommended order",
    ],
    "tests/validation-readme.md": [
        "## Primary validation runner",
        "## Included validators",
        "## Source snapshots",
        "## When to run validation",
        "## QA flow references",
        "## Best practice",
    ],
    "tests/schema-validation-tests.md": [
        "## Validation goals",
        "## Folder coverage",
        "## Pass criteria",
        "## Failure handling",
    ],
}



def extract_headings(text: str) -> list[str]:
    return [match.group(1).strip() for match in HEADING_RE.finditer(text)]



def section_body(text: str, heading: str) -> str:
    lines = text.splitlines()
    capture = False
    body: list[str] = []
    for line in lines:
        if line.strip() == heading:
            capture = True
            continue
        if capture and re.match(r"^##+\s+", line):
            break
        if capture:
            body.append(line)
    return "\n".join(body).strip()



def main() -> int:
    failures: list[str] = []

    for rel, required_order in DOC_RULES.items():
        path = ROOT / rel
        if not path.exists():
            failures.append(f"{rel} [missing-file]")
            continue

        text = path.read_text(encoding="utf-8")
        headings = extract_headings(text)
        seen: set[str] = set()
        positions: dict[str, int] = {}

        for idx, heading in enumerate(headings):
            if heading in seen:
                failures.append(f"{rel} [duplicate-heading] {heading}")
            seen.add(heading)
            positions.setdefault(heading, idx)

        last_index = -1
        for heading in required_order:
            if heading not in positions:
                failures.append(f"{rel} [missing-heading] {heading}")
                continue
            if positions[heading] < last_index:
                failures.append(f"{rel} [out-of-order-heading] {heading}")
            last_index = positions[heading]
            if not section_body(text, heading):
                failures.append(f"{rel} [empty-section] {heading}")

        if PLACEHOLDER_RE.search(text):
            failures.append(f"{rel} [placeholder-text]")

    memory_readme = ROOT / "memory" / "README.md"
    if memory_readme.exists():
        text = memory_readme.read_text(encoding="utf-8")
        for heading in [
            "## Purpose",
            "## Naming conventions",
            "## File inventory",
            "## Canonical location rules",
            "## Duplicate-handling rule",
        ]:
            if heading not in extract_headings(text):
                failures.append(f"memory/README.md [missing-heading] {heading}")

    if failures:
        print("Markdown structure validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Markdown structure validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
