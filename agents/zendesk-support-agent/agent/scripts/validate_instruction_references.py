from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path('.')
ENTITY_TAG_RE = re.compile(r'\{\{label:(?P<label>(?:\\.|[^,}])+),id:(?P<id>(?:\\.|[^,}])+),type:(?P<type>(?:\\.|[^}])+?)\}\}')
PATH_RE = re.compile(r'(?P<path>(?:tests|scripts|templates|examples|schemas|memory|references)/[^`\s)]+|business-context\.md)')

DEFAULT_INSTRUCTIONS_CANDIDATES = [
    ROOT / 'instructions.snapshot.md',
    ROOT / 'references' / 'instructions.snapshot.md',
]


class ValidationError(Exception):
    pass


def unescape(value: str) -> str:
    return re.sub(r'\\([\\,}])', r'\1', value)


def read_instructions(path: Path) -> str:
    if not path.exists():
        raise ValidationError(f'Instructions file not found: {path}')
    text = path.read_text(encoding='utf-8')
    if not text.strip():
        raise ValidationError(f'Instructions file is empty: {path}')
    return text


def find_default_instructions_file() -> Path | None:
    for path in DEFAULT_INSTRUCTIONS_CANDIDATES:
        if path.exists():
            return path
    return None


def resolve_label_to_path(label: str) -> Path | None:
    candidate = ROOT / label
    if candidate.exists():
        return candidate

    basename_matches = [path for path in ROOT.rglob('*') if path.is_file() and path.name == label]
    if len(basename_matches) == 1:
        return basename_matches[0]
    return None


def validate_entity_tags(text: str) -> None:
    file_labels: list[str] = []
    for match in ENTITY_TAG_RE.finditer(text):
        label = unescape(match.group('label'))
        entity_type = unescape(match.group('type'))
        if entity_type != 'file':
            continue
        file_labels.append(label)

    missing = []
    for label in file_labels:
        resolved = resolve_label_to_path(label)
        if resolved is None:
            missing.append(label)

    if missing:
        raise ValidationError('Instructions reference missing file tags: ' + ', '.join(sorted(set(missing))))


def validate_path_mentions(text: str) -> None:
    missing = []
    for match in PATH_RE.finditer(text):
        path = ROOT / match.group('path')
        if not path.exists():
            missing.append(match.group('path'))

    if missing:
        raise ValidationError('Instructions mention missing paths: ' + ', '.join(sorted(set(missing))))


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Validate file references in an exported instructions snapshot.'
    )
    parser.add_argument(
        '--instructions-file',
        type=Path,
        default=None,
        help='Path to a markdown snapshot of the agent instructions.',
    )
    args = parser.parse_args()

    instructions_path = args.instructions_file or find_default_instructions_file()
    if instructions_path is None:
        raise ValidationError(
            'No instructions snapshot found. Provide --instructions-file or add instructions.snapshot.md.'
        )

    text = read_instructions(instructions_path)
    validate_entity_tags(text)
    validate_path_mentions(text)
    print(f'Instruction/reference validation passed for {instructions_path}.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
