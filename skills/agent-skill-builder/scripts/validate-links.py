#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from validator_common import iter_files, make_report, print_report, rel, should_skip

LINK_RE = re.compile(r'\[[^\]]+\]\(([^)]+)\)')


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors = []
    warnings = []
    checked = []
    skipped = []
    for path in iter_files(root, {'.md'}):
        checked.append(rel(root, path))
        text = path.read_text(encoding='utf-8', errors='ignore')
        for match in LINK_RE.finditer(text):
            target = match.group(1).strip()
            if target.startswith(('http://', 'https://', 'mailto:', '#')):
                continue
            target = target.split('#', 1)[0]
            if not target:
                continue
            if target.startswith('<') and target.endswith('>'):
                target = target[1:-1]
            resolved = (path.parent / target).resolve()
            if root not in resolved.parents and resolved != root:
                warnings.append(f'{rel(root, path)} links outside skill folder: {target}')
                continue
            if not resolved.exists():
                errors.append(f'{rel(root, path)} has broken link: {target}')
    report = make_report('validate-links', errors, warnings, checked=checked, skipped=skipped, summary=f'checked {len(checked)} markdown files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
