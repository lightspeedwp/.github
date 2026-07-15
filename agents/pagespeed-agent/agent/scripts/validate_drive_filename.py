"""Validate Drive file names against the agent naming convention.

Use this before creating a Drive document name, or when checking exported
file metadata after creation.
"""

import re
import sys

PATTERNS = {
    "report": re.compile(r"^PageSpeed Audit - .+ - .+ - \d{4}-\d{2}-\d{2}( - .+)?$"),
    "draft": re.compile(r"^Draft - PageSpeed Audit - .+ - .+ - \d{4}-\d{2}-\d{2}( - .+)?$"),
    "comparison": re.compile(r"^Comparison - .+ - .+ - \d{4}-\d{2}-\d{2}( - .+)?$"),
    "reference": re.compile(r"^Reference - .+ - .+ - .+$"),
}


def main(kind: str, value: str) -> int:
    pattern = PATTERNS[kind]
    if pattern.match(value):
        print("Filename is valid.")
        return 0
    print("Filename does not match the expected convention.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1], sys.argv[2]))
