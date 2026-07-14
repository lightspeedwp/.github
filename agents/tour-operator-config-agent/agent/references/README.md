# References

Use this folder for stable reference material, standards, naming rules, and agent-maintenance runbooks for the Tour Operator Website Configuration Agent.

## Folder purpose

This folder should hold durable guidance that the agent or a maintainer can rely on repeatedly, including:

- Tour Operator and WordPress standards
- file naming rules
- maintenance runbooks
- agent-internal audit and validation workflows

## Naming conventions

Prefer these patterns where practical:

- `<topic>-standard.md`
- `<topic>-reference.md`
- `<topic>-runbook.md`
- `<topic>-workflow.md`
- `<topic>-conventions.md`

## Current file inventory

### Standards and core references
- `wordpress-tour-operator-standard.md`
- `tour-operator-plugin-stack-standard.md`
- `tour-operator-content-model-standard.md`
- `yoast-seo-standard.md`
- `file-naming-conventions.md`

### Agent-maintenance references
- `audit-docs-validation-workflow.md`
- `tour-operator-agent-update-4-step-runbook.md`

## Usage guidance

- Use standards files as durable reference points for audits, reviews, and implementation planning.
- Use workflow and runbook files for agent-maintenance tasks, especially when reviewing the agent's own files and validation setup.
- Do not use this folder for temporary notes, test fixtures, or generated outputs.

## Maintenance rules

- Keep the file inventory aligned with the actual attached reference files.
- When a reference file becomes part of validation or agent-maintenance workflows, reflect that in the relevant `tests/` documentation.
- If a file is moved out of this folder, update any README, validation doc, or instruction snapshot that still points to it.
