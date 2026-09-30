#!/usr/bin/env python3
import sys
from pathlib import Path
from validator_common import make_report, print_report
REQUIRED_PHRASES = ['current user request', 'memory', 'templates', 'examples', 'prior assumptions']
FILES = ['SKILL.md', 'references/source-priority-guide.md', 'references/business-context.md', 'memory/defaults/user-preferences.md']


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors = []
    warnings = []
    checked = []
    for name in FILES:
        path = root / name
        if not path.exists():
            warnings.append(f'missing optional source-priority file: {name}')
            continue
        checked.append(name)
        text = path.read_text(encoding='utf-8', errors='ignore').lower()
        for phrase in REQUIRED_PHRASES:
            if phrase not in text:
                warnings.append(f'{name} does not mention source-priority phrase: {phrase}')
        if 'override the current user request' in text and 'never' not in text[max(0, text.find('override the current user request') - 80):text.find('override the current user request') + 80]:
            warnings.append(f'{name} may allow lower-priority context to override the current request')
    report = make_report('validate-source-priority-consistency', errors, warnings, checked=checked, summary=f'checked {len(checked)} source-priority files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
