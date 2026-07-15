# Audit Reference Files Consistency Prompt

Use this prompt to review whether the files in `references/` still act as a coherent, low-duplication source of truth.

## Prompt

Audit the reference files in this agent for consistency, overlap, and source-of-truth drift.

Your job is to review the grounded files in `references/` and determine whether their purposes are clear, non-overlapping, and still aligned with the current instructions, prompts, and validation assets.

Focus on the following:

1. Identify the grounded reference files that appear to define routing, naming, validation, app usage, presentation rules, and maintenance workflow.
2. Flag reference files whose scope overlaps too heavily with another grounded file.
3. Flag outdated names, unclear ownership, duplicated guidance, or conflicting instructions across grounded reference files.
4. Identify gaps where a current reference file appears to be the intended source of truth but is not clearly described or linked from related files.
5. Recommend whether each issue needs:
   - a wording update
   - a scope clarification
   - a cross-reference update
   - a consolidation recommendation

## Output requirements

Use this structure:

## Grounded Reference Inventory

- ...

## Confirmed Source-Of-Truth Roles

- ...

## Findings

### Overlap Risks

- ...

### Conflict Risks

- ...

### Naming Or Scope Issues

- ...

### Cross-Reference Gaps

- ...

## Recommended Fixes

### Immediate

- ...

### Structural

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best reference-file consistency fix.

## Guardrails

- Use only grounded reference files and grounded related files.
- Do not invent hidden reference layers.
- Prefer conservative fixes that preserve working sources of truth.
