#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from validator_common import make_report, print_report, rel

VAGUE = {'help me', 'do this', 'make it better', 'stuff'}


def extract_prompts(text):
    prompts = []
    for line in text.splitlines():
        if line.startswith('|') and '|' in line[1:]:
            cells = [c.strip() for c in line.strip('|').split('|')]
            if cells and cells[0] and not cells[0].lower().startswith(('prompt', '---')):
                prompts.append(cells[0])
        elif re.match(r'^[-*]\s+', line):
            prompts.append(re.sub(r'^[-*]\s+', '', line).strip())
    return prompts


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    files = []
    for candidate in [root / 'templates' / 'starter-prompts.template.md', root / 'examples' / 'starter-prompts.md']:
        if candidate.exists():
            files.append(candidate)
    errors = []
    warnings = []
    checked = []
    seen = set()
    for path in files:
        checked.append(rel(root, path))
        prompts = extract_prompts(path.read_text(encoding='utf-8', errors='ignore'))
        for prompt in prompts:
            key = prompt.lower()
            if key in seen:
                warnings.append(f'duplicate starter prompt: {prompt}')
            seen.add(key)
            if len(prompt.split()) < 5:
                warnings.append(f'vague or too-short starter prompt: {prompt}')
            if any(v in key for v in VAGUE):
                warnings.append(f'vague starter prompt: {prompt}')
    if not checked:
        warnings.append('no starter prompt files found')
    report = make_report('validate-starter-prompts', errors, warnings, checked=checked, summary=f'checked {len(checked)} starter prompt files')
    sys.exit(print_report(report))

if __name__ == '__main__':
    main()
