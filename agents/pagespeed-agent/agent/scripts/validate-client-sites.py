"""Lightweight validator for references/client-sites.md.

This script checks that the file uses repeatable client headings and includes
basic fields needed for downstream use.
"""

from pathlib import Path
import re
import sys

CLIENT_SITES_PATH = Path("references/client-sites.md")
REQUIRED_FIELDS = [
    "Primary site:",
    "Business priorities:",
]


def main() -> int:
    if not CLIENT_SITES_PATH.exists():
        print(f"Missing file: {CLIENT_SITES_PATH}")
        return 1

    text = CLIENT_SITES_PATH.read_text(encoding="utf-8")
    client_headers = re.findall(r"^###\s+.+$", text, flags=re.MULTILINE)
    if not client_headers:
        print("No client sections found. Expected headings like '### Acme Fitness'.")
        return 1

    errors = []
    for header in client_headers:
        start = text.index(header)
        next_match = re.search(r"^###\s+.+$", text[start + len(header):], flags=re.MULTILINE)
        end = start + len(header) + next_match.start() if next_match else len(text)
        block = text[start:end]
        for field in REQUIRED_FIELDS:
            if field not in block:
                errors.append(f"{header}: missing '{field}'")

    if errors:
        print("client-sites.md validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("client-sites.md looks valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
