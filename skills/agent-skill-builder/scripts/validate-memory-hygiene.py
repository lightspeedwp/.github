#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from validator_common import iter_files, make_report, print_report, rel

TEMP_RE = re.compile(r'\b(just for now|temporary|temp|later maybe|random note)\b', re.I)
DONE_RE = re.compile(r'\b(done|completed|finished)\b', re.I)
DATED_DECISION_RE = re.compile(r'^-\s+\d{4}-\d{2}-\d{2}:', re.M)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    mem = root / 'memory'
    errors = []
    warnings = []
    checked = []
    if not mem.exists():
        report = make_report('validate-memory-hygiene', info=['no memory folder present'], summary='no memory folder present')
        sys.exit(print_report(report))
    for path in iter_files(mem, {'.md'}):
        rel_path = rel(root, path)
        checked.append(rel_path)
        text = path.read_text(encoding='utf-8', errors='ignore')
        if TEMP_RE.search(text):
            warnings.append(f'{rel_path} appears to contain temporary memory')
        if path.name == 'todos.md' and DONE_RE.search(text):
            warnings.append(f'{rel_path} may contain completed items in active todos')
        if path.name == 'decisions.md' and '-' in text and not DATED_DECISION_RE.search(text):
            warnings.append(f'{rel_path} has decisions without yyyy-mm-dd dates')
        headings = re.findall(r'^#{1,6}\s+(.+)$', text, flags=re.M)
        for heading in headings:
            section_re = re.compile(r'^#{1,6}\s+' + re.escape(heading) + r'\s*$([\s\S]*?)(?=^#{1,6}\s+|\Z)', re.M)
            match = section_re.search(text)
            if match and not match.group(1).strip():
                warnings.append(f'{rel_path} has empty section without intentional-empty note: {heading}')
    report = make_report('validate-memory-hygiene', errors, warnings, checked=checked, summary=f'checked {len(checked)} memory markdown files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
