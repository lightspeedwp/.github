from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path('.')
DEFAULT_INSTRUCTIONS_CANDIDATES = [
    ROOT / 'instructions.snapshot.md',
    ROOT / 'references' / 'instructions.snapshot.md',
]
ENTITY_TAG_RE = re.compile(r'\{\{label:(?P<label>(?:\\.|[^,}])+),id:(?P<id>(?:\\.|[^,}])+),type:(?P<type>(?:\\.|[^}])+?)\}\}')

ATTACHED_APPS = {
    'asdk_app_6a3d28b9f3988191adbb4d4617fbe939': 'LightSpeed Zendesk',
    'connector_5f3c8c41a1e54ad7a76272c89e2554fa': 'Google Drive',
}

OPTIONAL_AVAILABLE_APPS = {
    'asdk_app_69a1d78e929881919bba0dbda1f6436d': 'Slack',
}


class ValidationError(Exception):
    pass


def read_text(path: Path) -> str:
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


def unescape(value: str) -> str:
    return re.sub(r'\\([\\,}])', r'\1', value)


def extract_app_tags(text: str) -> dict[str, str]:
    tags: dict[str, str] = {}
    for match in ENTITY_TAG_RE.finditer(text):
        entity_type = unescape(match.group('type'))
        if entity_type != 'app':
            continue
        label = unescape(match.group('label'))
        entity_id = unescape(match.group('id'))
        tags[entity_id] = label
    return tags


def validate_instruction_apps(text: str) -> None:
    app_tags = extract_app_tags(text)

    stale = sorted(set(app_tags) - set(ATTACHED_APPS))
    if stale:
        stale_labels = [f'{app_tags[app_id]} ({app_id})' for app_id in stale]
        raise ValidationError('Instructions reference unattached apps: ' + ', '.join(stale_labels))

    missing_required = sorted(set(ATTACHED_APPS) - set(app_tags))
    if missing_required:
        missing_labels = [f'{ATTACHED_APPS[app_id]} ({app_id})' for app_id in missing_required]
        raise ValidationError('Instructions are missing attached app references: ' + ', '.join(missing_labels))

    mislabeled = []
    for app_id, expected_label in ATTACHED_APPS.items():
        actual_label = app_tags.get(app_id)
        if actual_label is not None and actual_label != expected_label:
            mislabeled.append(f'{app_id}: expected {expected_label!r}, found {actual_label!r}')
    if mislabeled:
        raise ValidationError('Instructions contain app label mismatches: ' + '; '.join(mislabeled))

    still_optional = sorted(set(app_tags) & set(OPTIONAL_AVAILABLE_APPS))
    if still_optional:
        optional_labels = [f'{app_tags[app_id]} ({app_id})' for app_id in still_optional]
        raise ValidationError('Instructions still reference optional/unattached apps: ' + ', '.join(optional_labels))


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Validate that instruction app tags match the currently attached app set.'
    )
    parser.add_argument(
        '--instructions-file',
        type=Path,
        default=None,
        help='Optional markdown snapshot of agent instructions to validate app references.',
    )
    args = parser.parse_args()

    instructions_path = args.instructions_file or find_default_instructions_file()
    if instructions_path is None:
        raise ValidationError(
            'No instructions snapshot found. Provide --instructions-file or add instructions.snapshot.md.'
        )

    text = read_text(instructions_path)
    validate_instruction_apps(text)
    print(f'App-usage consistency validation passed for {instructions_path}.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
