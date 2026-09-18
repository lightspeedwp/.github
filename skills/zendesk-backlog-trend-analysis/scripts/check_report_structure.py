#!/usr/bin/env python3
"""Check a drafted Zendesk backlog report for basic structural quality.

This optional QA helper catches missing evidence sections, unresolved
placeholders, weak action wording, and unsafe SLA phrasing. It does not validate
Zendesk facts.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

EVIDENCE_SECTION_PHRASES = [
    "evidence basis",
    "evidence basis and gaps",
    "confirmed evidence",
    "confirmed reported evidence",
]

PLACEHOLDER_PATTERNS = [
    re.compile(r"\[[^\]]+\]"),
    re.compile(r"TODO", re.IGNORECASE),
    re.compile(r"TBD", re.IGNORECASE),
]

ACTION_WORDS = [
    "assign",
    "route",
    "chase",
    "update",
    "prioritise",
    "prioritize",
    "link",
    "merge",
    "tag",
    "review",
    "create",
    "escalate",
    "request",
    "confirm",
]

UNSAFE_CERTAINTY_PATTERNS = [
    re.compile(r"definitely an incident", re.IGNORECASE),
    re.compile(r"root cause is", re.IGNORECASE),
    re.compile(r"engineering (must|needs to|should) fix", re.IGNORECASE),
]


def check_report(text: str) -> list[str]:
    lowered = text.lower()
    warnings: list[str] = []

    if not any(phrase in lowered for phrase in EVIDENCE_SECTION_PHRASES):
        warnings.append("Missing evidence basis, confirmed evidence, or evidence-gaps section")

    if "recommended" not in lowered or "action" not in lowered:
        warnings.append("Missing recommended actions section or wording")

    if not any(word in lowered for word in ACTION_WORDS):
        warnings.append("No concrete support action verb detected")

    for pattern in PLACEHOLDER_PATTERNS:
        if pattern.search(text):
            warnings.append(f"Possible unresolved placeholder detected: {pattern.pattern}")

    if "sla" in lowered and not any(word in lowered for word in ["unavailable", "visible", "breached", "at risk", "at_risk"]):
        warnings.append("SLA is mentioned without visibility, availability, or observed status language")

    for pattern in UNSAFE_CERTAINTY_PATTERNS:
        if pattern.search(text):
            warnings.append(f"Potential unsafe certainty detected: {pattern.pattern}")

    return warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Check Markdown report structure.")
    parser.add_argument("report", type=Path, help="Markdown report file to check")
    args = parser.parse_args()

    text = args.report.read_text(encoding="utf-8")
    warnings = check_report(text)

    if warnings:
        for warning in warnings:
            print(f"WARNING: {warning}")
        return 1

    print("Report structure check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
