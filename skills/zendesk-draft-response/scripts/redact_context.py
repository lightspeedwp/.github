#!/usr/bin/env python3
"""Redact sensitive values from reusable support context.

Usage:
  python scripts/redact_context.py input.md > redacted.md
  python scripts/redact_context.py input.md --output redacted.md
  python scripts/redact_context.py input.md --map "Acme Ltd=Example Account" --map "Jane Smith=Customer A"

This helper is intentionally lightweight and dependency-free. It catches common
leaks but does not replace manual review.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

PATTERNS: list[tuple[str, re.Pattern[str], str]] = [
    ("email", re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE), "customer@example.com"),
    ("bearer_token", re.compile(r"\bBearer\s+[A-Za-z0-9._~+/=-]{12,}\b", re.IGNORECASE), "Bearer [REDACTED_TOKEN]"),
    ("api_key_assignment", re.compile(r"\b(api[_-]?key|token|secret|password)\s*[:=]\s*[^\s`]+", re.IGNORECASE), r"\1=[REDACTED]"),
    ("url", re.compile(r"https?://[^\s)\]>\"']+", re.IGNORECASE), "https://example.com/redacted"),
    ("ipv4", re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"), "0.0.0.0"),
    ("phone", re.compile(r"(?<!\w)(?:\+?\d[\d\s().-]{7,}\d)(?!\w)"), "[REDACTED_PHONE]"),
    ("cookie", re.compile(r"\b(cookie|set-cookie|sessionid|session_id)\s*[:=]\s*[^\n;]+", re.IGNORECASE), r"\1=[REDACTED]"),
    ("ticket_id", re.compile(r"\b(?:ticket|case|zd)[-_\s:#]*\d{4,}\b", re.IGNORECASE), "ZD-000000"),
    ("order_id", re.compile(r"\b(?:order|invoice|subscription)[-_\s:#]*[A-Z0-9-]{4,}\b", re.IGNORECASE), "ORDER-000000"),
    ("long_hex", re.compile(r"\b[a-f0-9]{24,}\b", re.IGNORECASE), "[REDACTED_ID]"),
]


def parse_mapping(values: list[str]) -> list[tuple[str, str]]:
    mappings: list[tuple[str, str]] = []
    for item in values:
        if "=" not in item:
            raise ValueError(f"Invalid --map value, expected 'source=replacement': {item}")
        source, replacement = item.split("=", 1)
        if source:
            mappings.append((source, replacement))
    return mappings


def redact(text: str, mappings: list[tuple[str, str]] | None = None) -> tuple[str, dict[str, int]]:
    counts: dict[str, int] = {}
    redacted = text

    for source, replacement in mappings or []:
        redacted, count = re.subn(re.escape(source), replacement, redacted)
        if count:
            counts[f"custom:{source}"] = count

    for name, pattern, replacement in PATTERNS:
        redacted, count = pattern.subn(replacement, redacted)
        if count:
            counts[name] = count

    return redacted, counts


def main() -> int:
    parser = argparse.ArgumentParser(description="Redact reusable support context.")
    parser.add_argument("input", type=Path, help="Input markdown/text file")
    parser.add_argument("--output", type=Path, help="Output file. Defaults to stdout.")
    parser.add_argument("--map", action="append", default=[], help="Literal replacement in the form 'source=replacement'. Can be repeated.")
    parser.add_argument("--report", action="store_true", help="Print redaction counts to stderr.")
    args = parser.parse_args()

    try:
        mappings = parse_mapping(args.map)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    text = args.input.read_text(encoding="utf-8")
    redacted, counts = redact(text, mappings)

    if args.output:
        args.output.write_text(redacted, encoding="utf-8")
    else:
        print(redacted, end="")

    if args.report:
        if counts:
            for key, value in sorted(counts.items()):
                print(f"{key}: {value}", file=sys.stderr)
        else:
            print("no redactions applied", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
