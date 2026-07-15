# Reconcile READMEs And Folder Inventory Prompt

Use this prompt when you want to check whether folder READMEs still match the actual attached file tree and current maintenance system.

## Prompt

Reconcile the attached README files against the current visible file tree.

Your job is to identify where README inventories, folder descriptions, usage notes, or maintenance guidance no longer match the current attached files and folders.

Focus on the following:

1. Review grounded README files for prompts, references, scripts, tests, templates, schemas, examples, and memory when visible.
2. Compare each README entry against the actual visible file tree.
3. Flag missing entries, stale entries, renamed files, duplicate descriptions, and misleading folder-purpose notes.
4. Note where a README should be updated instead of creating new documentation.
5. Recommend the smallest grounded edits needed to restore alignment.

## Output requirements

Produce the output using this structure:

## Grounded README Files Reviewed
- ...

## Inventory Mismatches
- ...

## Description Mismatches
- ...

## Recommended README Updates
### Immediate
- ...

### Optional Cleanup
- ...

## Best Next Step
- State the single best README update to apply first.

## Guardrails
- Use only grounded attached README files and the visible file tree.
- Do not describe hidden or inferred files as present.
- Prefer updating existing README files over creating overlapping new inventories.
