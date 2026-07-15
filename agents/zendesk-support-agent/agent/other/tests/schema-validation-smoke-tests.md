# Schema validation smoke tests

Use these checks when validating the agent files in `templates/`, `examples/`, `schemas/`, and `memory/`.

## Run order

1. `python scripts/run_agent_file_checks.py`
2. `python scripts/validate_templates.py`
3. `python scripts/validate_memory.py`
4. `python scripts/validate_schema_files.py`
5. `python scripts/validate_template_example_parity.py`

## Expected results

- required files exist across templates, examples, schemas, memory, and scripts
- markdown files in templates and examples start with headings
- schema files in `schemas/` parse as valid JSON objects with object properties
- `memory/report-defaults.yaml` matches `schemas/report-defaults.schema.json`
- `examples/memory/report-defaults.example.yaml` also matches the same schema
- `memory/user-preferences.md` matches `schemas/user-preferences.schema.json`
- `examples/memory/user-preferences.example.md` also matches the same schema
- `memory/drafting-preferences.md` matches `schemas/drafting-preferences.schema.json`
- `examples/memory/drafting-preferences.example.md` also matches the same schema
- the backlog report template and example are present and pass the template/example parity check
- no unexpected files appear in `memory/`

## Failure focus

If a run fails, check:

- missing files referenced by the validator
- malformed JSON in `schemas/`
- invalid structure in `memory/report-defaults.yaml`
- invalid or missing preference fields in user-preferences markdown
- invalid or missing preference fields in drafting-preferences markdown
- blank or malformed markdown files in `templates/` or `examples/`
- mismatched headings or sections between the backlog report template and example
