"""Validate a client-sites markdown registry against expected headings.

This is a lightweight reference validator for registry hygiene. It is most useful
for the markdown file stored with the agent, not for Google Docs.
"""

from pathlib import Path
import sys

REQUIRED_MARKERS = [
    '# Client Sites Registry',
    '## Entry Format',
]


def main(path: str) -> int:
    text = Path(path).read_text(encoding='utf-8')
    missing = [m for m in REQUIRED_MARKERS if m not in text]
    if missing:
        print('Missing required markers:')
        for marker in missing:
            print(f'- {marker}')
        return 1
    print('Client sites registry looks valid.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1]))
