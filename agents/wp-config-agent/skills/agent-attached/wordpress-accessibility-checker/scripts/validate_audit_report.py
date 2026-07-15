#!/usr/bin/env python3
"""Sanity-check accessibility audit reports before delivery.

This is not a full accessibility validator. It checks that the report includes the
minimum evidence, limitation, and follow-up sections expected by this skill.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

REQUIRED_MD_HEADINGS = [
    "## Summary",
    "## Findings",
    "## Manual Follow-Ups",
    "## Limitations",
    "## Next Actions",
]

REQUIRED_JSON_KEYS = ["summary", "scope", "findings", "manual_follow_ups", "limitations"]


def validate_markdown(text: str) -> List[str]:
    errors = []
    for heading in REQUIRED_MD_HEADINGS:
        if heading not in text:
            errors.append(f"Missing markdown heading: {heading}")
    risky_phrases = ["fully compliant", "wcag compliant", "guaranteed accessible", "all issues fixed"]
    lower = text.lower()
    for phrase in risky_phrases:
        if phrase in lower:
            errors.append(f"Risky unsupported claim detected: {phrase}")
    return errors


def validate_json(data: Dict[str, Any]) -> List[str]:
    errors = []
    for key in REQUIRED_JSON_KEYS:
        if key not in data:
            errors.append(f"Missing JSON key: {key}")
    if isinstance(data.get("findings"), list):
        for index, finding in enumerate(data["findings"], start=1):
            for key in ["title", "url", "severity", "status"]:
                if key not in finding:
                    errors.append(f"Finding {index} missing key: {key}")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate an accessibility audit report.")
    parser.add_argument("report", type=Path, help="Markdown or JSON report path")
    args = parser.parse_args()

    if args.report.suffix.lower() == ".json":
        errors = validate_json(json.loads(args.report.read_text(encoding="utf-8")))
    else:
        errors = validate_markdown(args.report.read_text(encoding="utf-8"))

    if errors:
        print("Report validation failed:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("Report validation passed.")


if __name__ == "__main__":
    main()
