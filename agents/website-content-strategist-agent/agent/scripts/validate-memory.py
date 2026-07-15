#!/usr/bin/env python3
import re
import sys
from pathlib import Path

try:
    import yaml  # type: ignore
except Exception:
    yaml = None

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
MEMORY_DIR = ROOT / 'memory'
DEFAULTS_DIR = MEMORY_DIR / 'defaults'
PLACEHOLDERS = ['TODO', 'TBD', 'FIXME', '<placeholder>', '[insert ']
errors = []

required_files = {
    'todos.md': ['# Memory todos', '## Current', '## Completed'],
    'user-preferences.md': ['# User preferences', '## Stable defaults', '## Formatting preferences', '## Workflow preferences', '## Do not store'],
    'README.md': ['# Memory folder', '## Purpose', '## Naming conventions', '## File outline', '## Current verification note', '## Memory rules'],
}


def has_placeholder(text: str) -> bool:
    return any(marker in text for marker in PLACEHOLDERS)


def contains_completed_like_item(lines):
    completed_markers = ('- done', '- completed', '- complete', '- finished', '- closed')
    return any(line.strip().lower().startswith(completed_markers) for line in lines)


if not MEMORY_DIR.exists():
    errors.append('memory/: required folder is missing')
else:
    for filename, headings in required_files.items():
        path = MEMORY_DIR / filename
        if not path.exists():
            errors.append(f'memory/{filename}: required file is missing')
            continue
        text = path.read_text(encoding='utf-8')
        lines = text.splitlines()
        lowered = text.lower()

        for heading in headings:
            if heading not in lines:
                errors.append(f'memory/{filename}: missing heading {heading}')

        if has_placeholder(text):
            errors.append(f'memory/{filename}: contains unresolved placeholder text')

        if filename == 'user-preferences.md':
            hygiene_markers = ['one-off', 'temporary task notes', 'unconfirmed assumptions']
            if not any(item in lowered for item in hygiene_markers):
                errors.append(f'memory/{filename}: missing do-not-store hygiene guidance')

        if filename == 'README.md':
            if 'defaults/' not in text:
                errors.append(f'memory/{filename}: should explain how optional defaults profiles are handled')
            if 'No `memory/defaults/` folder is currently grounded' not in text:
                errors.append(f'memory/{filename}: should state the currently grounded defaults-folder status')

        if filename == 'todos.md':
            try:
                current_index = lines.index('## Current')
                completed_index = lines.index('## Completed')
            except ValueError:
                current_index = None
                completed_index = None

            if current_index is not None and completed_index is not None:
                current_lines = [line for line in lines[current_index + 1:completed_index] if line.strip()]
                completed_lines = [line for line in lines[completed_index + 1:] if line.strip()]
                if not current_lines:
                    errors.append('memory/todos.md: Current section is empty')
                if contains_completed_like_item(current_lines):
                    errors.append('memory/todos.md: completed items appear in the Current section')
                temporary_markers = ['temporary', 'scratch', 'one-off']
                if any(marker in ' '.join(current_lines).lower() for marker in temporary_markers):
                    errors.append('memory/todos.md: one-off or temporary content appears in the Current section')
                if not completed_lines:
                    errors.append('memory/todos.md: Completed section is empty')

if DEFAULTS_DIR.exists():
    files = sorted([p for p in DEFAULTS_DIR.iterdir() if p.is_file()])
    if not files:
        errors.append('memory/defaults/: folder exists but contains no files')
    for path in files:
        relative_path = path.relative_to(ROOT).as_posix()
        if path.suffix not in {'.md', '.yaml', '.yml'}:
            errors.append(f'{relative_path}: unsupported defaults file type')
            continue
        text = path.read_text(encoding='utf-8')
        if has_placeholder(text):
            errors.append(f'{relative_path}: contains unresolved placeholder text')
        if path.suffix == '.md':
            lines = text.splitlines()
            for heading in ['## Purpose', '## Use when']:
                if heading not in lines:
                    errors.append(f'{relative_path}: missing heading {heading}')
        elif yaml is not None:
            try:
                yaml.safe_load(text)
            except Exception as exc:
                errors.append(f'{relative_path}: invalid YAML ({exc})')

if errors:
    print('Memory validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Memory validation passed.')
