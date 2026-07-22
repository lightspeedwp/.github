# Validator Usage Guide

Use this guide to decide which validation scripts to run and how to interpret failures.

## Core runners

- `scripts/run_all_validations.py` runs the current full validation suite.
- `scripts/validate-folder-schemas.sh` runs the core structural checks for templates, examples, schemas, and memory.

## Targeted validators

- `scripts/validate_markdown_folders.py` checks structural quality in Markdown-heavy folders.
- `scripts/validate_schemas.py` checks JSON schema validity and required fields.
- `scripts/validate_cross_file_consistency.py` checks vocabulary and workflow drift across templates, examples, and schemas.
- `scripts/validate_memory_hygiene.py` checks separation of concerns across Memory files.
- `scripts/validate_workflow_coverage.py` reports missing workflow assets.
- `scripts/validate_instruction_references.py` checks file references used by instruction entity tags.
- `scripts/validate_app_usage_consistency.py` checks that instructions only reference currently attached apps.

## Failure interpretation

For every validation failure, capture:

- file path
- rule violated
- expected structure
- detected issue
- suggested fix

Treat failures in schemas, references, templates, examples, and memory as blockers for substantial downstream-facing artifacts until resolved.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
