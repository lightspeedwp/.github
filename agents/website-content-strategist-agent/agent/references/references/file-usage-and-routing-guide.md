# File usage and routing guide

## Purpose

Explain what belongs in the current maintenance file set and when to use each reference.

## Current maintenance references
- `references/audit-docs-validation-workflow.md`: use for maintenance audits, drift review, prompt-status review, and conservative repair sequencing.
- `references/validation-standards.md`: use for the quality bar for maintenance and review outputs.
- `references/naming-conventions.md`: use when creating or renaming maintenance reference files.
- `references/CONNECTORS.md`: use for attached app usage boundaries and connector guidance.
- `references/chatgpt-presentation-spec.md`: use for ChatGPT presentation guidance when updating descriptions or starter prompts.
- `references/skill-routing-guide.md`: use for routing work to the right attached specialist skill.
- `business-context.md`: use for stable strategic business context.
- `memory/README.md`: use for how the memory folder is structured and maintained.
- `templates/review-output-template.md`: use for review-style output structure.
- `examples/review-output-example.md`: use as a structural example, not reusable copy.
- `tests/schema-validation-tests.md`: use for human-readable validation expectations.
- Preview-validation checklists, repeatable preview prompts, and example-context indexes: use only when those files are actually attached in the current draft.

## Routing rules
- If the task is about drift, missing references, or maintenance scope, start with the audit workflow.
- If the task is about whether an output is acceptable, use the validation standards.
- If the task is about naming or whether to create a new file, use the naming conventions.
- If the task is about app boundaries, use `references/CONNECTORS.md`.
- If the task is about review packaging, use the review template, example, and validation tests.
- If the task is about preview coverage or repeatable QA runs, use the attached preview QA files when they are actually present in the current draft.
- If the task is about strategic context, use `business-context.md`.
- If the task is about durable memory structure, use `memory/README.md` first.

## Guardrails
- Only treat attached files as available references.
- If a file is mentioned in older outputs but is not attached, treat it as drift.
- Prefer one clear file per purpose.
- Update an existing file that already owns a purpose before creating a new overlapping file.
- Keep routing guidance grounded in the current draft rather than an assumed larger file system.
