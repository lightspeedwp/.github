#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')

scripts = [
    ROOT / 'scripts' / 'validate-schemas.py',
    ROOT / 'scripts' / 'validate-markdown-structure.py',
    ROOT / 'scripts' / 'validate-memory.py',
    ROOT / 'scripts' / 'validate-links.py',
    ROOT / 'scripts' / 'validate-starter-prompts.py',
    ROOT / 'scripts' / 'validate-business-context.py',
    ROOT / 'scripts' / 'validate-source-priority-consistency.py',
]

failed = []
for script in scripts:
    if not script.exists():
        failed.append(f'{script}: missing validator script')
        continue
    result = subprocess.run([sys.executable, str(script), str(ROOT)])
    if result.returncode != 0:
        failed.append(f'{script}: validator failed')

if failed:
    print('Validator runner failed:')
    for item in failed:
        print(f'- {item}')
    sys.exit(1)

print('All validators passed.')
