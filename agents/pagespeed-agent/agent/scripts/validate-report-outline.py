"""Lightweight validator for templates/report-template.md.

This checks that the standard report template keeps the core sections the agent
expects before a report is turned into a Google Doc.
"""

from pathlib import Path
import sys

TEMPLATE_PATH = Path("templates/report-template.md")
REQUIRED_HEADINGS = [
    "# PageSpeed Audit Report",
    "## Executive Summary",
    "## Client Context",
    "## Prioritized Findings",
    "## Quick Wins",
    "## Medium-Effort Improvements",
    "## Larger Engineering Work",
    "## Limitations",
]


def main() -> int:
    if not TEMPLATE_PATH.exists():
        print(f"Missing file: {TEMPLATE_PATH}")
        return 1

    text = TEMPLATE_PATH.read_text(encoding="utf-8")
    missing = [heading for heading in REQUIRED_HEADINGS if heading not in text]
    if missing:
        print("report-template.md validation failed:")
        for heading in missing:
            print(f"- Missing heading: {heading}")
        return 1

    print("report-template.md looks valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
