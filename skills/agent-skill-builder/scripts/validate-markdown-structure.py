#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from validator_common import iter_files, make_report, print_report, rel

HEADING_RE = re.compile(r'^(#{1,6})\s+(.+)$', re.M)
PLACEHOLDER_RE = re.compile(r'\b(TODO|TBD|FIXME)\b|\{\{\s*todo\s*\}\}', re.I)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors = []
    warnings = []
    checked = []
    for path in iter_files(root, {'.md'}):
        rel_path = rel(root, path)
        if rel_path.startswith('templates/'):
            continue
        checked.append(rel_path)
        text = path.read_text(encoding='utf-8', errors='ignore')
        headings = [(m.group(1), m.group(2).strip(), m.start(), m.end()) for m in HEADING_RE.finditer(text)]
        seen = set()
        for hashes, title, start, end in headings:
            key = (len(hashes), title.lower())
            if key in seen:
                warnings.append(f'{rel_path} duplicate heading: {title}')
            seen.add(key)
        if not headings:
            warnings.append(f'{rel_path} has no markdown headings')
        if PLACEHOLDER_RE.search(text):
            errors.append(f'{rel_path} contains unshipped placeholder text')
        for idx, (_, title, _, end) in enumerate(headings):
            next_start = headings[idx + 1][2] if idx + 1 < len(headings) else len(text)
            body = text[end:next_start].strip()
            if not body and title.lower() not in {'table of contents'}:
                warnings.append(f'{rel_path} has empty section: {title}')
    report = make_report('validate-markdown-structure', errors, warnings, checked=checked, summary=f'checked {len(checked)} markdown files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
