# Scripts

This folder contains the validation and maintenance scripts for Design Partner.

## Folder purpose
- validate the package structure and asset consistency
- catch drift across templates, examples, schemas, instructions, references, and memory
- provide one place to run the package checks before larger cleanup or release work

## Naming conventions
- `validate_*.py` for deterministic validation scripts
- `validate-*.sh` only when a shell script is simpler than a Python validator
- `run_*.py` for orchestrators or runners
- prefer file-specific, deterministic checks over broad heuristic linting

## Files
- `run_all_validations.py` — top-level runner for the current validation suite
- `validate_markdown_folders.py` — validates Markdown structure across key content folders
- `validate_schemas.py` — validates JSON schema files in `schemas/`
- `validate_workflow_coverage.py` — checks that each workflow has the expected core assets
- `validate_cross_file_consistency.py` — checks shared structural alignment across templates, examples, and schemas
- `validate_template_schema_alignment.py` — checks tighter alignment between template headings and schema fields
- `validate_memory_hygiene.py` — validates lane separation across memory files
- `validate_reference_site_analysis_outputs.py` — validates the reference-site-analysis package assets
- `validate_instruction_references.py` — validates file references in a staged instructions export
- `validate_app_usage_consistency.py` — validates app references in instructions against the attached-app allowlist
- `validate_source_priority_consistency.py` — validates that source-priority wording stays aligned across key package assets
- `validate_business_context.py` — validates the business-context file for core completeness markers
- `validate_links_and_references.py` — validates relative links and referenced local file targets in package Markdown
- `validate_starter_prompts.py` — validates an exported starter-prompt JSON file when available
- `validate-folder-schemas.sh` — shell-based schema/folder helper retained for compatibility

## When to run each script
- Run `run_all_validations.py` for the normal full-package pass.
- Run `validate_schemas.py` after schema edits.
- Run `validate_workflow_coverage.py` or `validate_cross_file_consistency.py` after changing templates, examples, schemas, or tests.
- Run `validate_template_schema_alignment.py` after changing output templates or schema field contracts.
- Run `validate_markdown_folders.py` after changing README files, examples, templates, or references.
- Run `validate_memory_hygiene.py` after editing files in `memory/`.
- Run `validate_instruction_references.py`, `validate_app_usage_consistency.py`, and `validate_source_priority_consistency.py` after changing instructions or `references/CONNECTORS.md`.
- Run `validate_business_context.py` after updating `business-context.md`.
- Run `validate_links_and_references.py` after link, filename, or folder-structure changes.
- Run `validate_starter_prompts.py` when a `starter-prompts.json` export is available.

## Expected inputs and outputs
- Most scripts run against the staged agent-file package rooted at `.`.
- Some scripts require additional staged inputs:
  - `agent_instructions.txt` for instruction-based validation
  - `starter-prompts.json` for starter-prompt validation
- Scripts should print file-specific `FAIL` messages for required issues.
- Scripts may print `WARN` messages for optional gaps.
- The runner may print `SKIP` when a validator or required input is not available in the current workspace.

## Fail vs warn vs skip
- `FAIL` means a required file, structure, field, or alignment rule is missing or invalid.
- `WARN` means the package has an optional gap or a non-blocking issue worth reviewing.
- `SKIP` means the validator could not run because a required staged file or helper script was not available.
