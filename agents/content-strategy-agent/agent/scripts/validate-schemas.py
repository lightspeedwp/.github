#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
SCHEMA_DIR = ROOT / 'schemas'

errors = []

if not SCHEMA_DIR.exists():
    errors.append('schemas/: required folder is missing')
else:
    for path in sorted(SCHEMA_DIR.glob('*.json')):
        try:
            json.loads(path.read_text(encoding='utf-8'))
        except Exception as exc:
            errors.append(f'{path}: invalid JSON ({exc})')

if errors:
    print('Schema validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Schema validation passed.')
