from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
TEMPLATES_DIR = ROOT / 'templates'
EXAMPLES_DIR = ROOT / 'examples'
SCHEMAS_DIR = ROOT / 'schemas'
MEMORY_DIR = ROOT / 'memory'

REQUIRED_TEMPLATE_FILES = [
    TEMPLATES_DIR / 'agent-investigation-template.md',
    TEMPLATES_DIR / 'agent-customer-reply-template.md',
    TEMPLATES_DIR / 'agent-escalation-template.md',
    TEMPLATES_DIR / 'agent-backlog-report-template.md',
    TEMPLATES_DIR / 'agent-handoff-template.md',
    TEMPLATES_DIR / 'agent-triage-summary-template.md',
]

REQUIRED_EXAMPLE_FILES = [
    EXAMPLES_DIR / 'templates' / 'agent-investigation.example.md',
    EXAMPLES_DIR / 'templates' / 'agent-customer-reply.example.md',
    EXAMPLES_DIR / 'templates' / 'agent-escalation.example.md',
    EXAMPLES_DIR / 'templates' / 'agent-backlog-report.example.md',
    EXAMPLES_DIR / 'templates' / 'agent-handoff.example.md',
    EXAMPLES_DIR / 'templates' / 'agent-triage-summary.example.md',
    EXAMPLES_DIR / 'memory' / 'user-preferences.example.md',
    EXAMPLES_DIR / 'memory' / 'report-defaults.example.yaml',
    EXAMPLES_DIR / 'memory' / 'drafting-preferences.example.md',
    EXAMPLES_DIR / 'memory' / 'todos.example.md',
]

REQUIRED_MEMORY_FILES = [
    MEMORY_DIR / 'user-preferences.md',
    MEMORY_DIR / 'report-defaults.yaml',
    MEMORY_DIR / 'drafting-preferences.md',
    MEMORY_DIR / 'todos.md',
]

MARKDOWN_EXPECTATIONS = {
    TEMPLATES_DIR / 'agent-investigation-template.md': {
        'h1': '# Investigation Summary',
        'required_headings': [
            '## What happened',
            '## Confirmed facts',
            '## Informed inferences',
            '## Unknowns',
            '## Blockers',
            '## Recommended next step',
        ],
    },
    TEMPLATES_DIR / 'agent-customer-reply-template.md': {
        'h1': '# Customer Reply',
        'required_lines': ['Hi {{customer_name}},', '{{reply_body}}', 'Best,', '{{agent_or_team_name}}'],
    },
    TEMPLATES_DIR / 'agent-escalation-template.md': {
        'h1': '# Escalation Brief',
        'required_headings': [
            '## Problem statement',
            '## Customer impact',
            '## Severity or urgency',
            '## Supporting evidence',
            '## Attempted steps',
            '## Blockers or risks',
            '## Target owner or team',
            '## Exact action or decision needed',
        ],
    },
    TEMPLATES_DIR / 'agent-backlog-report-template.md': {
        'h1': '# Backlog Report',
        'required_headings': [
            '## Scope and timeframe',
            '## Backlog health',
            '## Issue themes',
            '## SLA risk',
            '## Escalation-ready cases',
            '## Recommended next actions',
        ],
    },
    TEMPLATES_DIR / 'agent-handoff-template.md': {
        'h1': '# Support Handoff',
        'required_headings': [
            '## Case summary',
            '## Customer impact',
            '## Evidence checked',
            '## Attempted steps',
            '## Current blockers',
            '## Target owner or team',
            '## Exact ask',
            '## Urgency or risk',
        ],
    },
    TEMPLATES_DIR / 'agent-triage-summary-template.md': {
        'h1': '# Triage Summary',
        'required_headings': [
            '## Issue classification',
            '## Severity',
            '## Business impact',
            '## Likely owner or team',
            '## Missing details',
            '## Duplicate or pattern risk',
            '## Recommended next action',
        ],
    },
    EXAMPLES_DIR / 'templates' / 'agent-investigation.example.md': {
        'h1': '# Investigation Summary',
        'required_headings': [
            '## What happened',
            '## Confirmed facts',
            '## Informed inferences',
            '## Unknowns',
            '## Blockers',
            '## Recommended next step',
        ],
    },
    EXAMPLES_DIR / 'templates' / 'agent-customer-reply.example.md': {
        'h1': '# Customer Reply',
        'required_lines': ['Hi ', 'Best,'],
    },
    EXAMPLES_DIR / 'templates' / 'agent-escalation.example.md': {
        'h1': '# Escalation Brief',
        'required_headings': [
            '## Problem statement',
            '## Customer impact',
            '## Severity or urgency',
            '## Supporting evidence',
            '## Attempted steps',
            '## Blockers or risks',
            '## Target owner or team',
            '## Exact action or decision needed',
        ],
    },
    EXAMPLES_DIR / 'templates' / 'agent-backlog-report.example.md': {
        'h1': '# Backlog Report',
        'required_headings': [
            '## Scope and timeframe',
            '## Backlog health',
            '## Issue themes',
            '## SLA risk',
            '## Escalation-ready cases',
            '## Recommended next actions',
        ],
    },
    EXAMPLES_DIR / 'templates' / 'agent-handoff.example.md': {
        'h1': '# Support Handoff',
        'required_headings': [
            '## Case summary',
            '## Customer impact',
            '## Evidence checked',
            '## Attempted steps',
            '## Current blockers',
            '## Target owner or team',
            '## Exact ask',
            '## Urgency or risk',
        ],
    },
    EXAMPLES_DIR / 'templates' / 'agent-triage-summary.example.md': {
        'h1': '# Triage Summary',
        'required_headings': [
            '## Issue classification',
            '## Severity',
            '## Business impact',
            '## Likely owner or team',
            '## Missing details',
            '## Duplicate or pattern risk',
            '## Recommended next action',
        ],
    },
    EXAMPLES_DIR / 'memory' / 'user-preferences.example.md': {
        'h1': '# User Preferences',
        'required_lines': [
            '- preferred reply tone:',
            '- preferred report sections:',
            '- preferred timezone or date formatting:',
            '- preferred escalation wording:',
        ],
    },
    EXAMPLES_DIR / 'memory' / 'drafting-preferences.example.md': {
        'h1': '# Drafting Preferences',
        'required_lines': [
            '- empathy_level:',
            '- brevity_preference:',
            '- escalation_style:',
            '- documentation_style:',
        ],
    },
    EXAMPLES_DIR / 'memory' / 'todos.example.md': {
        'h1': '# Ongoing Support Follow-ups',
    },
    MEMORY_DIR / 'user-preferences.md': {
        'h1': '# User Preferences',
        'required_headings': ['## Save here', '## Do not save here', '## Current preferences'],
    },
    MEMORY_DIR / 'drafting-preferences.md': {
        'h1': '# Drafting Preferences',
        'required_headings': ['## Save here', '## Do not save here', '## Current preferences'],
    },
    MEMORY_DIR / 'todos.md': {
        'h1': '# Ongoing Support Follow-ups',
        'required_headings': ['## Store each open item with', '## Remove', '## Active items'],
    },
}

USER_PREFERENCE_KEY_MAP = {
    'preferred reply tone': 'preferred_reply_tone',
    'preferred report sections': 'preferred_report_sections',
    'preferred timezone or date formatting': 'preferred_timezone_or_date_formatting',
    'preferred escalation wording': 'preferred_escalation_wording',
    'preferred detail level': 'preferred_detail_level',
    'preferred report scope': 'preferred_report_scope',
    'preferred example-ticket rule': 'preferred_example_ticket_rule',
    'preferred example-ticket inclusion rule': 'preferred_example_ticket_rule',
}

DRAFTING_PREFERENCE_KEY_MAP = {
    'empathy_level': 'empathy_level',
    'brevity_preference': 'brevity_preference',
    'escalation_style': 'escalation_style',
    'handoff_style': 'handoff_style',
    'documentation_style': 'documentation_style',
    'avoid_long_apologies': 'avoid_long_apologies',
    'include_recommended_next_step': 'include_recommended_next_step',
}


class ValidationError(Exception):
    pass


def ensure_exists(paths: list[Path]) -> None:
    missing = [str(path) for path in paths if not path.exists()]
    if missing:
        raise ValidationError('Missing required files: ' + ', '.join(missing))


def read_text(path: Path) -> str:
    return path.read_text(encoding='utf-8').strip()


def validate_markdown_file(path: Path) -> None:
    text = read_text(path)
    if not text:
        raise ValidationError(f'File is empty: {path}')
    if not text.startswith('#'):
        raise ValidationError(f'Markdown file should begin with a heading: {path}')

    expectations = MARKDOWN_EXPECTATIONS.get(path, {})
    expected_h1 = expectations.get('h1')
    if expected_h1 and not text.startswith(expected_h1):
        raise ValidationError(f'{path} should begin with {expected_h1!r}')

    for heading in expectations.get('required_headings', []):
        if heading not in text:
            raise ValidationError(f'{path} is missing required heading {heading!r}')

    for required_line in expectations.get('required_lines', []):
        if required_line not in text:
            raise ValidationError(f'{path} is missing required content {required_line!r}')


def validate_templates() -> None:
    ensure_exists(REQUIRED_TEMPLATE_FILES)
    for path in REQUIRED_TEMPLATE_FILES:
        validate_markdown_file(path)


def validate_examples() -> None:
    ensure_exists(REQUIRED_EXAMPLE_FILES)
    for path in REQUIRED_EXAMPLE_FILES:
        suffixes = ''.join(path.suffixes)
        if suffixes.endswith('.md'):
            validate_markdown_file(path)
        elif suffixes.endswith('.yaml') and not read_text(path):
            raise ValidationError(f'YAML example file is empty: {path}')


def validate_json_schema_file(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as exc:
        raise ValidationError(f'Invalid JSON in schema file {path}: {exc}') from exc

    if not isinstance(data, dict):
        raise ValidationError(f'Schema root must be an object: {path}')
    if '$schema' not in data:
        raise ValidationError(f'Schema missing $schema: {path}')
    if data.get('type') != 'object':
        raise ValidationError(f'Schema should declare type=object: {path}')
    if 'properties' not in data or not isinstance(data['properties'], dict):
        raise ValidationError(f'Schema missing object properties: {path}')

    required = data.get('required')
    if required is not None and not isinstance(required, list):
        raise ValidationError(f'Schema required field must be an array: {path}')
    if required is not None and not all(isinstance(item, str) for item in required):
        raise ValidationError(f'Schema required entries must be strings: {path}')

    for name, rules in data['properties'].items():
        if not isinstance(rules, dict):
            raise ValidationError(f'Schema property {name!r} must be an object: {path}')
        if 'type' not in rules:
            raise ValidationError(f'Schema property {name!r} is missing a type: {path}')

    return data


def validate_schemas() -> dict:
    schema_files = sorted(SCHEMAS_DIR.glob('*.json'))
    if not schema_files:
        raise ValidationError('No schema files found in schemas/')

    schemas = {}
    for path in schema_files:
        schemas[path.name] = validate_json_schema_file(path)
    return schemas


def parse_simple_yaml(text: str) -> dict:
    result: dict[str, object] = {}
    current_list_key: str | None = None

    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith('#'):
            continue

        if line.startswith('  - '):
            if current_list_key is None:
                raise ValidationError('Found list item before list key in YAML content')
            current_value = result.setdefault(current_list_key, [])
            if not isinstance(current_value, list):
                raise ValidationError(f'Expected list for key {current_list_key}')
            current_value.append(line[4:].strip())
            continue

        if ':' not in line:
            raise ValidationError(f'Unsupported YAML line: {line}')

        key, value = line.split(':', 1)
        key = key.strip()
        value = value.strip()

        if not key:
            raise ValidationError(f'Invalid YAML key in line: {line}')

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


def validate_report_defaults(data: dict, schema: dict, path: Path) -> None:
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
        if expected_type == 'integer':
            if not isinstance(value, int):
                raise ValidationError(f'{path}: {key} should be an integer')
            if 'minimum' in rules and value < rules['minimum']:
                raise ValidationError(f'{path}: {key} is below minimum {rules["minimum"]}')
            if 'maximum' in rules and value > rules['maximum']:
                raise ValidationError(f'{path}: {key} is above maximum {rules["maximum"]}')
        elif expected_type == 'array':
            if not isinstance(value, list):
                raise ValidationError(f'{path}: {key} should be an array')
            if 'minItems' in rules and len(value) < rules['minItems']:
                raise ValidationError(f'{path}: {key} should have at least {rules["minItems"]} items')
            item_type = rules.get('items', {}).get('type')
            if item_type == 'string' and not all(isinstance(item, str) for item in value):
                raise ValidationError(f'{path}: all {key} items should be strings')


def parse_user_preferences_markdown(path: Path) -> dict[str, object]:
    text = path.read_text(encoding='utf-8')
    data: dict[str, object] = {}

    in_current_preferences = path.name == 'user-preferences.md'
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if path.name == 'user-preferences.md':
            if line == '## Current preferences':
                in_current_preferences = True
                continue
            if not in_current_preferences:
                continue
        if not line.startswith('- ') or ':' not in line:
            continue

        key_text, value_text = line[2:].split(':', 1)
        key_text = key_text.strip().lower()
        value_text = value_text.strip()
        mapped_key = USER_PREFERENCE_KEY_MAP.get(key_text)
        if mapped_key is None:
            continue

        if mapped_key == 'preferred_report_sections':
            sections = [item.strip() for item in value_text.split(',') if item.strip()]
            data[mapped_key] = sections
        else:
            data[mapped_key] = value_text

    return data


def parse_drafting_preferences_markdown(path: Path) -> dict[str, object]:
    text = path.read_text(encoding='utf-8')
    data: dict[str, object] = {}

    in_current_preferences = path.name == 'drafting-preferences.md'
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if path.name == 'drafting-preferences.md':
            if line == '## Current preferences':
                in_current_preferences = True
                continue
            if not in_current_preferences:
                continue
        if not line.startswith('- ') or ':' not in line:
            continue

        key_text, value_text = line[2:].split(':', 1)
        key_text = key_text.strip()
        value_text = value_text.strip()
        mapped_key = DRAFTING_PREFERENCE_KEY_MAP.get(key_text)
        if mapped_key is None:
            continue

        if value_text.lower() == 'true':
            data[mapped_key] = True
        elif value_text.lower() == 'false':
            data[mapped_key] = False
        else:
            data[mapped_key] = value_text

    return data


def validate_object_against_schema(data: dict, schema: dict, path: Path) -> None:
    required = schema.get('required', [])
    for key in required:
        if key not in data:
            raise ValidationError(f'Missing required key {key} in {path}')

    properties = schema.get('properties', {})
    extra = sorted(set(data) - set(properties))
    if extra:
        raise ValidationError(f'{path}: contains unknown keys: {extra}')

    for key, value in data.items():
        rules = properties.get(key)
        if rules is None:
            continue
        expected_type = rules.get('type')
        if expected_type == 'string':
            if not isinstance(value, str):
                raise ValidationError(f'{path}: {key} should be a string')
            min_length = rules.get('minLength')
            if min_length is not None and len(value) < min_length:
                raise ValidationError(f'{path}: {key} should be at least {min_length} characters')
        elif expected_type == 'array':
            if not isinstance(value, list):
                raise ValidationError(f'{path}: {key} should be an array')
            min_items = rules.get('minItems')
            if min_items is not None and len(value) < min_items:
                raise ValidationError(f'{path}: {key} should have at least {min_items} items')
            if rules.get('uniqueItems') and len(value) != len(set(value)):
                raise ValidationError(f'{path}: {key} should contain unique items')
            item_type = rules.get('items', {}).get('type')
            if item_type == 'string' and not all(isinstance(item, str) for item in value):
                raise ValidationError(f'{path}: all {key} items should be strings')
        elif expected_type == 'boolean':
            if not isinstance(value, bool):
                raise ValidationError(f'{path}: {key} should be a boolean')


def validate_memory(schema_map: dict) -> None:
    ensure_exists(REQUIRED_MEMORY_FILES)

    allowed_names = {path.name for path in REQUIRED_MEMORY_FILES}
    extra = sorted(
        path.name for path in MEMORY_DIR.glob('*') if path.is_file() and path.name not in allowed_names
    )
    if extra:
        raise ValidationError('Unexpected memory files: ' + ', '.join(extra))

    for markdown_path in [
        MEMORY_DIR / 'user-preferences.md',
        MEMORY_DIR / 'drafting-preferences.md',
        MEMORY_DIR / 'todos.md',
    ]:
        validate_markdown_file(markdown_path)

    report_defaults_path = MEMORY_DIR / 'report-defaults.yaml'
    report_defaults = parse_simple_yaml(report_defaults_path.read_text(encoding='utf-8'))
    report_defaults_schema = schema_map.get('report-defaults.schema.json')
    if report_defaults_schema is None:
        raise ValidationError('Missing report-defaults.schema.json during memory validation')
    validate_report_defaults(report_defaults, report_defaults_schema, report_defaults_path)

    example_report_defaults_path = EXAMPLES_DIR / 'memory' / 'report-defaults.example.yaml'
    example_report_defaults = parse_simple_yaml(example_report_defaults_path.read_text(encoding='utf-8'))
    validate_report_defaults(example_report_defaults, report_defaults_schema, example_report_defaults_path)

    user_preferences_schema = schema_map.get('user-preferences.schema.json')
    if user_preferences_schema is None:
        raise ValidationError('Missing user-preferences.schema.json during memory validation')

    user_preferences_path = MEMORY_DIR / 'user-preferences.md'
    user_preferences = parse_user_preferences_markdown(user_preferences_path)
    validate_object_against_schema(user_preferences, user_preferences_schema, user_preferences_path)

    example_user_preferences_path = EXAMPLES_DIR / 'memory' / 'user-preferences.example.md'
    example_user_preferences = parse_user_preferences_markdown(example_user_preferences_path)
    validate_object_against_schema(example_user_preferences, user_preferences_schema, example_user_preferences_path)

    drafting_preferences_schema = schema_map.get('drafting-preferences.schema.json')
    if drafting_preferences_schema is None:
        raise ValidationError('Missing drafting-preferences.schema.json during memory validation')

    drafting_preferences_path = MEMORY_DIR / 'drafting-preferences.md'
    drafting_preferences = parse_drafting_preferences_markdown(drafting_preferences_path)
    validate_object_against_schema(drafting_preferences, drafting_preferences_schema, drafting_preferences_path)

    example_drafting_preferences_path = EXAMPLES_DIR / 'memory' / 'drafting-preferences.example.md'
    example_drafting_preferences = parse_drafting_preferences_markdown(example_drafting_preferences_path)
    validate_object_against_schema(example_drafting_preferences, drafting_preferences_schema, example_drafting_preferences_path)


def main() -> None:
    validate_templates()
    validate_examples()
    schema_map = validate_schemas()
    validate_memory(schema_map)
    print('Schema file validation passed for templates, examples, schemas, and memory.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
