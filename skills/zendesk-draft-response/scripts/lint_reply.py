#!/usr/bin/env python3
"""Lightweight QA linter for customer support reply drafts.

Usage:
  python scripts/lint_reply.py path/to/draft.md
  python scripts/lint_reply.py path/to/draft.md --strict

The linter is intentionally conservative. It catches common portability,
evidence-safety, and copy-paste issues; it does not replace human judgement.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable

PLACEHOLDER_PATTERNS = [
    re.compile(r"\[\[[^\]]+\]\]"),
    re.compile(r"\{\{[^}]+\}\}"),
    re.compile(r"<[^>\n]{2,80}>")
]

# Phrases that often indicate unsupported guarantees or over-commitment.
RISKY_PATTERNS = {
    "unsupported_guarantee": [
        r"\bguarantee(?:d|s)?\b",
        r"\bdefinitely\b",
        r"\bcertainly\b",
        r"\bwill not happen again\b",
        r"\bpermanently fixed\b",
    ],
    "unsupported_resolution": [
        r"\b(?:has been|is now) resolved\b",
        r"\b(?:has been|is now) fixed\b",
        r"\broot cause (?:is|was)\b",
    ],
    "unconfirmed_eta": [
        r"\bby end of day\b",
        r"\btoday\b",
        r"\btomorrow\b",
        r"\bwithin \d+\s*(?:minute|minutes|hour|hours|day|days|week|weeks)\b",
    ],
    "internal_leakage": [
        r"\binternal note\b",
        r"\bescalat(?:e|ed|ion) to engineering\b",
        r"\bzendesk\b",
        r"\blinear issue\b",
        r"\bgithub issue\b",
        r"\bslack thread\b",
    ],
}

CUSTOMER_HEADING = re.compile(
    r"^#{1,6}\s*customer reply draft\s*$", re.IGNORECASE | re.MULTILINE
)
NEXT_HEADING = re.compile(r"^#{1,6}\s+", re.MULTILINE)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text()


def extract_customer_reply(text: str) -> tuple[str | None, bool]:
    """Return the customer-facing section and whether a template heading exists."""
    match = CUSTOMER_HEADING.search(text)
    if not match:
        return None, False

    start = match.end()
    next_heading = NEXT_HEADING.search(text, start)
    end = next_heading.start() if next_heading else len(text)
    return text[start:end].strip(), True


def find_matches(patterns: Iterable[re.Pattern[str]], text: str) -> list[str]:
    matches: list[str] = []
    for pattern in patterns:
        for match in pattern.finditer(text):
            value = match.group(0).strip()
            if value not in matches:
                matches.append(value)
    return matches


def lint(text: str) -> dict[str, list[dict[str, str]]]:
    customer_reply, has_template_heading = extract_customer_reply(text)
    customer_text = customer_reply if has_template_heading else text

    issues: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    if has_template_heading and not customer_reply:
        issues.append({
            "code": "empty_customer_reply",
            "message": "Customer reply draft section is present but empty.",
        })

    placeholders = find_matches(PLACEHOLDER_PATTERNS, text)
    if placeholders:
        issues.append({
            "code": "unresolved_placeholder",
            "message": "Unresolved placeholder-like text found: " + ", ".join(placeholders[:8]),
        })

    if re.search(r"\bdear user\b", customer_text, re.IGNORECASE):
        issues.append({
            "code": "placeholder_greeting",
            "message": "Avoid placeholder greetings such as 'Dear user'.",
        })

    for category, patterns in RISKY_PATTERNS.items():
        found: list[str] = []
        for pattern in patterns:
            for match in re.finditer(pattern, customer_text, re.IGNORECASE):
                phrase = match.group(0).strip()
                if phrase not in found:
                    found.append(phrase)
        if found:
            warnings.append({
                "code": category,
                "message": "Review potentially unsafe wording: " + ", ".join(found[:8]),
            })

    # Encourage use of the support-ready wrapper when the draft appears to contain notes.
    if not has_template_heading and re.search(r"^#{1,6}\s*(summary|notes)\s*$", text, re.IGNORECASE | re.MULTILINE):
        warnings.append({
            "code": "missing_customer_reply_heading",
            "message": "Draft contains internal sections but no 'Customer reply draft' heading.",
        })

    return {"issues": issues, "warnings": warnings}


def main() -> int:
    parser = argparse.ArgumentParser(description="Lint a Zendesk customer reply draft.")
    parser.add_argument("draft", type=Path, help="Path to a markdown or text reply draft")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero on warnings as well as issues")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON only")
    args = parser.parse_args()

    text = read_text(args.draft)
    result = lint(text)

    issue_count = len(result["issues"])
    warning_count = len(result["warnings"])
    status = "pass" if issue_count == 0 and (warning_count == 0 or not args.strict) else "fail"
    payload = {"status": status, "issue_count": issue_count, "warning_count": warning_count, **result}

    if args.json:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        print(f"status: {status}")
        print(f"issues: {issue_count}")
        for issue in result["issues"]:
            print(f"- ERROR {issue['code']}: {issue['message']}")
        print(f"warnings: {warning_count}")
        for warning in result["warnings"]:
            print(f"- WARN {warning['code']}: {warning['message']}")

    if issue_count > 0 or (args.strict and warning_count > 0):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
