# Schema validation tests

## Purpose
These tests define the canonical validation rules for the current attached file system.

## Required folders
- `prompts/`
- `templates/`
- `examples/`
- `schemas/`
- `references/`
- `tests/`
- `scripts/`
- `memory/`
- `questionnaires/`

## Core validation checks
1. Required-folder presence
2. Required-file naming conventions from `references/naming-conventions.md`
3. JSON parsing for every `.json` file in `schemas/`
4. Required heading presence and order for every Markdown file in `templates/` and `examples/`
5. Required heading presence and order for canonical folder inventory files, including `prompts/README.md`, `references/README.md`, `schemas/README.md`, `scripts/README.md`, `tests/README.md`, `memory/README.md`, and `questionnaires/README.md`
6. Per-file stricter checks for duplicate headings, placeholder text, and empty required sections
7. Broken relative-link and file-reference checks across canonical Markdown assets, including prompt files in `prompts/`
8. Memory hygiene checks for `memory/todos.md` and `memory/user-preferences.md`
9. Source-priority consistency checks against `business-context.md` and `references/file-usage-and-routing-guide.md`
10. Schema-to-template coverage checks for required sections
11. Business-context completeness checks for placeholder or weak sections

## Required heading rules
### Template files
Every file in `templates/` must contain these headings in order:
- `# Template name`
- `## Purpose`
- `## Required inputs`
- `## Required sections`
- `## Output rules`
- `## Validation notes`

### Example files
Every file in `examples/` must contain these headings in order:
- `# Example name`
- `## Purpose`
- `## Matched template`
- `## Example output`
- `## Validation notes`

Only attached example files count as canonical examples. Do not treat workspace-only or historical example references as attached examples unless they are present in the current file tree.

## Placeholder rules
Validation fails if a checked file contains unresolved placeholder markers such as:
- `TODO`
- `TBD`
- `FIXME`
- `<placeholder>`
- `[insert ...]`

## Memory rules
### `memory/todos.md`
Must contain:
- `# Memory todos`
- `## Current`
- `## Completed`

### `memory/user-preferences.md`
Must contain:
- `# User preferences`
- `## Stable defaults`
- `## Formatting preferences`
- `## Workflow preferences`
- `## Do not store`

## Pass criteria
A validation run passes only when:
- every required folder exists
- every schema file parses correctly
- required headings are present and ordered correctly
- no broken canonical file references are found
- no unresolved placeholder text remains
- memory files follow the required structure
- template and schema coverage rules pass
- attached example, questionnaire, and prompt references are grounded in the current file tree when they are treated as canonical

## Failure handling
If validation fails, the validator must:
- report the exact file
- report the failed rule
- report the minimal corrective action
- fail the overall validation run
