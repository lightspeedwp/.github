from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
PROFILE_PATH = ROOT / 'profiles' / 'default-support-profile.yaml'
PROFILE_SCHEMA_PATH = ROOT / 'schemas' / 'default-support-profile.schema.json'
FIXTURE_PATHS = {
    ROOT / 'fixtures' / 'ticket-intake-fixture.md': ROOT / 'schemas' / 'ticket-intake-fixture.schema.json',
    ROOT / 'fixtures' / 'backlog-audit-fixture.md': ROOT / 'schemas' / 'backlog-audit-fixture.schema.json',
}


class ValidationError(Exception):
    pass


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except FileNotFoundError as exc:
        raise ValidationError(f'Missing file: {path}') from exc
    except json.JSONDecodeError as exc:
        raise ValidationError(f'Invalid JSON in {path}: {exc}') from exc


def parse_simple_yaml(path: Path) -> dict[str, object]:
    if not path.exists():
        raise ValidationError(f'Missing file: {path}')
    result: dict[str, object] = {}
    current_list_key: str | None = None
    for raw_line in path.read_text(encoding='utf-8').splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith('#'):
            continue
        if line.startswith('  - '):
            if current_list_key is None:
                raise ValidationError(f'List item without key in {path}: {line}')
            current = result.setdefault(current_list_key, [])
            if not isinstance(current, list):
                raise ValidationError(f'Expected list for {current_list_key} in {path}')
            current.append(line[4:].strip())
            continue
        if ':' not in line:
            raise ValidationError(f'Unsupported YAML line in {path}: {line}')
        key, value = line.split(':', 1)
        key = key.strip()
        value = value.strip()
        if value == '':
            result[key] = []
            current_list_key = key
            continue
        current_list_key = None
        result[key] = value
    return result


def parse_fixture_markdown(path: Path) -> dict[str, object]:
    if not path.exists():
        raise ValidationError(f'Missing file: {path}')
    data: dict[str, object] = {'expected_use': []}
    section = None
    for raw_line in path.read_text(encoding='utf-8').splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith('# '):
            data['title'] = line[2:].strip()
            continue
        if line.startswith('## '):
            section = line[3:].strip().lower()
            continue
        if not line.startswith('- '):
            continue
        item = line[2:].strip()
        if section == 'intake':
            key, value = item.split(':', 1)
            normalized = key.strip().lower().replace(' ', '_')
            data[normalized] = value.strip()
        elif section == 'scope':
            key, value = item.split(':', 1)
            normalized = key.strip().lower().replace(' ', '_')
            data[normalized] = value.strip()
        elif section == 'expected use':
            expected = data.setdefault('expected_use', [])
            if not isinstance(expected, list):
                raise ValidationError(f'Expected use should be a list in {path}')
            expected.append(item)
    return data


def validate_object(data: dict[str, object], schema: dict, path: Path) -> None:
    required = schema.get('required', [])
    for key in required:
        if key not in data:
            raise ValidationError(f'Missing required key {key} in {path}')
    properties = schema.get('properties', {})
    for key, rules in properties.items():
        if key not in data:
            continue
        value = data[key]
        expected_type = rules.get('type')
        if expected_type == 'string' and not isinstance(value, str):
            raise ValidationError(f'{path}: {key} should be a string')
        if expected_type == 'array' and not isinstance(value, list):
            raise ValidationError(f'{path}: {key} should be an array')
        if 'const' in rules and value != rules['const']:
            raise ValidationError(f'{path}: {key} should equal {rules["const"]!r}')
        if isinstance(value, str) and 'minLength' in rules and len(value) < rules['minLength']:
            raise ValidationError(f'{path}: {key} is shorter than {rules["minLength"]}')
        if isinstance(value, list) and 'minItems' in rules and len(value) < rules['minItems']:
            raise ValidationError(f'{path}: {key} has fewer than {rules["minItems"]} items')


def main() -> None:
    profile_schema = read_json(PROFILE_SCHEMA_PATH)
    profile_data = parse_simple_yaml(PROFILE_PATH)
    validate_object(profile_data, profile_schema, PROFILE_PATH)

    for fixture_path, schema_path in FIXTURE_PATHS.items():
        fixture_schema = read_json(schema_path)
        fixture_data = parse_fixture_markdown(fixture_path)
        validate_object(fixture_data, fixture_schema, fixture_path)

    print('Profile and fixture validation passed.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
