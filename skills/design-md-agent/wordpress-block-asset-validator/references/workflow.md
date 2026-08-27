# Workflow

## Purpose

This reference expands the core validation flow for block theme asset reviews.

## Standard Sequence

1. Identify the asset type and intended role.
2. Confirm the expected file path or registration target.
3. Review required metadata and structure.
4. Check naming, hierarchy alignment, and style scoping where relevant.
5. Apply project conventions only after official WordPress rules.
6. Return findings in severity order.
7. Suggest the smallest safe fix.

## Validation Boundaries

This skill should:

- review and report
- validate structured inputs from generator skills
- route final build work back to a generator when needed

This skill should not:

- pretend unknown inputs are valid
- invent repository conventions
- silently rewrite large assets

## Output Priority

Prefer this response order:

1. findings
2. open questions
3. summary
4. next routing step if needed
