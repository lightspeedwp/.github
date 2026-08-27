from __future__ import annotations

from pathlib import Path

ROOT = Path('.')
SCHEMA_PATH = ROOT / 'schemas' / 'report-defaults.schema.json'
TARGET_FILES = [
    ROOT / 'memory' / 'report-defaults.yaml',
    ROOT / 'examples' / 'memory' / 'report-defaults.example.yaml',
]

APPROVED_KEYS = {
    'timeframe_days',
    'default_scope',
    'include_sections',
    'grouping_priority',
    'next_actions_count',
    'comparison_window',
    'include_comparison',
    'example_ticket_count',
    'example_ticket_rule',
    'redact_customer_details',
}

ALLOWED_DEFAULT_SCOPES = {
    'open_backlog',
    'assigned_backlog',
    'queue_backlog',
}

ALLOWED_INCLUDE_SECTIONS = {
    'backlog_health',
    'issue_themes',
    'sla_risk',
    'escalation_ready_cases',
    'next_actions',
}

ALLOWED_GROUPING_PRIORITY = {
    'theme',
    'sla_risk',
    'owner_or_queue',
    'priority',
    'status',
}

ALLOWED_COMPARISON_WINDOWS = {
    'previous_equivalent_period',
    'previous_week',
    'previous_month',
    'none',
}

ALLOWED_EXAMPLE_TICKET_RULES = {
    'include_only_when_high_signal',
    'always_include',
    'never_include',
}


class ValidationError(Exception):
    pass


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
                raise ValidationError(f'{path}: found list item before list key')
            current_value = result.setdefault(current_list_key, [])
            if not isinstance(current_value, list):
                raise ValidationError(f'{path}: expected list for key {current_list_key}')
            current_value.append(line[4:].strip())
            continue

        if ':' not in line:
            raise ValidationError(f'{path}: unsupported YAML line: {line!r}')

        key, value = line.split(':', 1)
        key = key.strip()
        value = value.strip()
        if not key:
            raise ValidationError(f'{path}: invalid YAML key in line {line!r}')
        if key in result:
            raise ValidationError(f'{path}: duplicate key {key!r}')

        if value == '':
            result[key] = []
            current_list_key = key
            continue

        current_list_key = None

        if value.lower() == 'true':
            parsed: object = True
        elif value.lower() == 'false':
            parsed = False
        else:
            try:
                parsed = int(value)
            except ValueError:
                parsed = value

        result[key] = parsed

    return result


def ensure_list_of_allowed_strings(path: Path, key: str, value: object, allowed: set[str]) -> None:
    if not isinstance(value, list):
        raise ValidationError(f'{path}: {key} should be a list')
    if not value:
        raise ValidationError(f'{path}: {key} should not be empty')
    invalid = [item for item in value if not isinstance(item, str) or item not in allowed]
    if invalid:
        raise ValidationError(f'{path}: {key} contains invalid values: {invalid}')


def validate_target_file(path: Path) -> None:
    data = parse_simple_yaml(path)

    extra_keys = sorted(set(data) - APPROVED_KEYS)
    if extra_keys:
        raise ValidationError(f'{path}: contains unapproved keys: {extra_keys}')

    required_keys = {'timeframe_days', 'include_sections', 'next_actions_count'}
    missing = sorted(required_keys - set(data))
    if missing:
        raise ValidationError(f'{path}: missing required keys: {missing}')

    timeframe_days = data.get('timeframe_days')
    if not isinstance(timeframe_days, int) or timeframe_days < 1:
        raise ValidationError(f'{path}: timeframe_days must be an integer >= 1')

    next_actions_count = data.get('next_actions_count')
    if not isinstance(next_actions_count, int) or not 1 <= next_actions_count <= 10:
        raise ValidationError(f'{path}: next_actions_count must be an integer between 1 and 10')

    ensure_list_of_allowed_strings(path, 'include_sections', data.get('include_sections'), ALLOWED_INCLUDE_SECTIONS)

    if 'grouping_priority' in data:
        ensure_list_of_allowed_strings(path, 'grouping_priority', data.get('grouping_priority'), ALLOWED_GROUPING_PRIORITY)

    if 'default_scope' in data:
        default_scope = data['default_scope']
        if not isinstance(default_scope, str) or default_scope not in ALLOWED_DEFAULT_SCOPES:
            raise ValidationError(f'{path}: default_scope must be one of {sorted(ALLOWED_DEFAULT_SCOPES)}')

    if 'comparison_window' in data:
        comparison_window = data['comparison_window']
        if not isinstance(comparison_window, str) or comparison_window not in ALLOWED_COMPARISON_WINDOWS:
            raise ValidationError(f'{path}: comparison_window must be one of {sorted(ALLOWED_COMPARISON_WINDOWS)}')

    if 'example_ticket_rule' in data:
        example_ticket_rule = data['example_ticket_rule']
        if not isinstance(example_ticket_rule, str) or example_ticket_rule not in ALLOWED_EXAMPLE_TICKET_RULES:
            raise ValidationError(f'{path}: example_ticket_rule must be one of {sorted(ALLOWED_EXAMPLE_TICKET_RULES)}')

    if 'include_comparison' in data and not isinstance(data['include_comparison'], bool):
        raise ValidationError(f'{path}: include_comparison must be a boolean')

    if 'redact_customer_details' in data and not isinstance(data['redact_customer_details'], bool):
        raise ValidationError(f'{path}: redact_customer_details must be a boolean')

    if 'example_ticket_count' in data:
        example_ticket_count = data['example_ticket_count']
        if not isinstance(example_ticket_count, int) or example_ticket_count < 0:
            raise ValidationError(f'{path}: example_ticket_count must be an integer >= 0')


def main() -> None:
    if not SCHEMA_PATH.exists():
        raise ValidationError(f'Missing schema file: {SCHEMA_PATH}')

    for path in TARGET_FILES:
        validate_target_file(path)

    print('Report-defaults key validation passed.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
