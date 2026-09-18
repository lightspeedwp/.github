#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from validator_common import make_report, print_report

REQUIRED_HEADINGS = ['operating preferences', 'skill ecosystem context', 'boundaries']
PLACEHOLDER_RE = re.compile(r'\b(TODO|TBD|PLACEHOLDER|FIXME)\b', re.I)


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    path = root / 'references' / 'business-context.md'
    errors = []
    warnings = []
    checked = []
    if not path.exists():
        report = make_report('validate-business-context', warnings=['references/business-context.md not present'], summary='business context not present')
        sys.exit(print_report(report))
    checked.append('references/business-context.md')
    text = path.read_text(encoding='utf-8', errors='ignore')
    lower = text.lower()
    for heading in REQUIRED_HEADINGS:
        if heading not in lower:
            errors.append(f'business context missing section: {heading}')
    if PLACEHOLDER_RE.search(text):
        errors.append('business context contains placeholder text')
    if 'must never override' not in lower and 'should not override' not in lower:
        warnings.append('business context should state that it does not override current user requests')
    report = make_report('validate-business-context', errors, warnings, checked=checked, summary='checked business context')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
