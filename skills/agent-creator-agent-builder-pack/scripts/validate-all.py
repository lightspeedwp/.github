#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
SCRIPTS = [
    'validate-memory-hygiene.py',
    'validate-source-priority-consistency.py',
    'validate-template-schema-alignment.py',
    'validate-markdown-structure.py',
    'validate-business-context.py',
    'validate-starter-prompts.py',
    'validate-links-and-references.py',
]
failed = []
for script in SCRIPTS:
    path = ROOT / 'scripts' / script
    result = subprocess.run([sys.executable, str(path), str(ROOT)], text=True, capture_output=True)
    print(f"== {script} ==")
    print(result.stdout.strip())
    if result.returncode != 0:
        if result.stderr:
            print(result.stderr.strip())
        failed.append(script)
if failed:
    print('FAILED validators: ' + ', '.join(failed))
    sys.exit(1)
print('ALL VALIDATORS PASSED')
