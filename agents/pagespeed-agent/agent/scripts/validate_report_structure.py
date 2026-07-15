"""Validate a markdown PageSpeed audit draft against the report structure schema.

This script is a reference utility for validating markdown report content before
it is copied into a Google Doc, or after a Google Doc is exported to markdown or text.
"""

from pathlib import Path
import re
import sys

REQUIRED_HEADINGS = [
    '## Executive Summary',
    '## Client Context',
    '## Prioritized Findings',
    '## Quick Wins',
    '## Medium-Effort Improvements',
    '## Larger Engineering Work',
]


def main(path: str) -> int:
    text = Path(path).read_text(encoding='utf-8')
    missing = [h for h in REQUIRED_HEADINGS if h not in text]
    if missing:
        print('Missing headings:')
        for h in missing:
            print(f'- {h}')
        return 1
    print('Report structure looks valid.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1]))
