#!/usr/bin/env python3
"""Validate Tour Operator output-contract and delivery-template markdown.

Run from the skill root or pass the skill root as the first argument.
This catches common template drift: unbalanced fences, accidental duplicate
headings, unsafe promises, and missing acceptance/issue handoff assets.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "references/outputs/output-contracts.md",
    "references/outputs/client-safe-language.md",
    "references/outputs/acceptance-criteria-library.md",
    "references/outputs/issue-draft-templates.md",
    "references/workflows/acceptance-test-planning.md",
    "references/workflows/issue-handoff-workflow.md",
    "references/validation/output-contract-lint.md",
]

UNSAFE_PHRASES = [
    "json-ld support is implemented",
    "guaranteed rich result",
    "guaranteed rankings",
    "guarantee availability",
    "confirmed booking",
    "core-owned special",
    "core-owned review",
    "core-owned vehicle",
    "core-owned activity",
]

ALLOWED_REPEATED_HEADINGS = {
    "## Acceptance criteria",
    "## Verification steps",
    "## Risk",
    "## Evidence",
}


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    sys.exit(1)


def markdown_files(root: Path):
    for rel in REQUIRED_FILES:
        path = root / rel
        if not path.exists():
            fail(f"missing required output/template file: {rel}")
        yield path


def check_code_fences(path: Path, text: str) -> None:
    if text.count("```") % 2:
        fail(f"unbalanced code fences in {path.relative_to(path.parents[2])}")


def check_duplicate_adjacent_headings(path: Path, text: str) -> None:
    last_heading = None
    for line in text.splitlines():
        if re.match(r"^#{1,6}\s+", line):
            heading = line.strip()
            if heading == last_heading and heading not in ALLOWED_REPEATED_HEADINGS:
                fail(f"duplicate adjacent heading in {path}: {heading}")
            last_heading = heading
        elif line.strip():
            last_heading = None


def check_unsafe_phrases(path: Path, text: str) -> None:
    """Flag unsafe promises, while allowing explicit warnings against them."""
    safe_markers = (
        "do not",
        "don't",
        "avoid",
        "must not",
        "not proof",
        "without being treated",
        "unless",
        "rather than",
        "no template",
        "without",
    )
    lines = text.splitlines()
    for line_no, line in enumerate(lines, start=1):
        lower = line.lower()
        context = "\n".join(lines[max(0, line_no - 4):line_no]).lower()
        for phrase in UNSAFE_PHRASES:
            if phrase in lower and not any(marker in (lower + "\n" + context) for marker in safe_markers):
                fail(f"unsafe phrase in {path}:{line_no}: {phrase}")


def main() -> None:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
    if not root.exists():
        fail(f"skill root does not exist: {root}")

    for path in markdown_files(root):
        text = path.read_text(encoding="utf-8")
        check_code_fences(path, text)
        check_duplicate_adjacent_headings(path, text)
        check_unsafe_phrases(path, text)

    output_contracts = (root / "references/outputs/output-contracts.md").read_text(encoding="utf-8")
    for required in ["Acceptance test plan", "Issue draft", "Structured finding register", "Client-safe summary"]:
        if required not in output_contracts:
            fail(f"output contracts missing section: {required}")

    acceptance = (root / "references/outputs/acceptance-criteria-library.md").read_text(encoding="utf-8")
    if "Given" not in acceptance or "when" not in acceptance or "then" not in acceptance:
        fail("acceptance criteria library must include Given/when/then examples")

    issue_templates = (root / "references/outputs/issue-draft-templates.md").read_text(encoding="utf-8")
    for required in ["Evidence", "Acceptance criteria", "Verification steps", "Unknowns"]:
        if required not in issue_templates:
            fail(f"issue draft templates missing required concept: {required}")

    print("OK: markdown/output contracts passed; delivery templates remain constrained.")


if __name__ == "__main__":
    main()
