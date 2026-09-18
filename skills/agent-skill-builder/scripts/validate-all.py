#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path

VALIDATORS = [
    'validate-memory-hygiene.py',
    'validate-source-priority-consistency.py',
    'validate-template-schema-alignment.py',
    'validate-links.py',
    'validate-markdown-structure.py',
    'validate-business-context.py',
    'validate-starter-prompts.py',
]


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    script_dir = Path(__file__).resolve().parent
    reports = []
    blocking = 0
    for validator in VALIDATORS:
        proc = subprocess.run([sys.executable, str(script_dir / validator), str(root)], capture_output=True, text=True)
        try:
            report = json.loads(proc.stdout)
        except Exception:
            report = {
                'validator': validator,
                'status': 'fail',
                'errors': [proc.stderr or proc.stdout or 'validator produced no report'],
                'warnings': [],
                'info': [],
                'checked_files': [],
                'skipped_files': [],
                'summary': 'invalid validator output'
            }
        reports.append(report)
        if report.get('errors'):
            blocking += len(report['errors'])
    summary = {
        'validator': 'validate-all',
        'status': 'fail' if blocking else ('warn' if any(r.get('warnings') for r in reports) else 'pass'),
        'errors': [e for r in reports for e in r.get('errors', [])],
        'warnings': [w for r in reports for w in r.get('warnings', [])],
        'info': [i for r in reports for i in r.get('info', [])],
        'checked_files': sorted({f for r in reports for f in r.get('checked_files', [])}),
        'skipped_files': sorted({f for r in reports for f in r.get('skipped_files', [])}),
        'summary': f'ran {len(reports)} validators with {blocking} blocking errors',
        'reports': reports
    }
    print(json.dumps(summary, indent=2))
    sys.exit(1 if blocking else 0)

if __name__ == '__main__':
    main()
