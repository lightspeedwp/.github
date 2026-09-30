#!/usr/bin/env python3
import json
from pathlib import Path

SKIP_DIRS = {'.git', '__pycache__', '.venv', 'node_modules', 'dist'}


def should_skip(path: Path) -> bool:
    parts = set(path.parts)
    if parts & SKIP_DIRS:
        return True
    text = str(path).replace('\\', '/')
    if '/tests/fixtures/invalid-' in text:
        return True
    return False


def rel(root: Path, path: Path) -> str:
    try:
        return str(path.relative_to(root)).replace('\\', '/')
    except ValueError:
        return str(path)


def iter_files(root: Path, suffixes):
    for path in sorted(root.rglob('*')):
        if path.is_file() and path.suffix.lower() in suffixes and not should_skip(path):
            yield path


def make_report(name, errors=None, warnings=None, info=None, checked=None, skipped=None, summary=''):
    errors = errors or []
    warnings = warnings or []
    info = info or []
    checked = checked or []
    skipped = skipped or []
    status = 'fail' if errors else ('warn' if warnings else 'pass')
    return {
        'validator': name,
        'status': status,
        'errors': errors,
        'warnings': warnings,
        'info': info,
        'checked_files': checked,
        'skipped_files': skipped,
        'summary': summary or ('failed' if errors else 'passed')
    }


def print_report(report):
    print(json.dumps(report, indent=2))
    return 1 if report['errors'] else 0
