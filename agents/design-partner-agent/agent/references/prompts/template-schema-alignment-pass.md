# Template-schema alignment pass

Run a focused pass on visible templates and schemas so each template-backed workflow uses section names and structure that line up cleanly with the current schema family.

## Goal
Tighten drift between template wording and schema-backed field expectations without inventing missing validators, hidden workflows, or unstaged files.

## Required workflow
1. Refresh your understanding of the current visible template and schema files.
2. Review the template and schema families that appear to describe the same workflow.
3. Check for drift between:
   - template section names and schema field names
   - template-required sections and schema-required fields
   - optional template sections and optional schema fields
   - nested section structure and nested schema objects
4. Apply the smallest useful set of updates needed to improve template-schema consistency.

## What to look for
- older template headings that no longer match the schema vocabulary
- schema-backed fields missing from the corresponding template
- template sections that imply structure the schema does not support
- inconsistent singular/plural naming across matched families
- required-vs-optional mismatches that create avoidable ambiguity

## Editing rules
- Keep fixes conservative and grounded in the visible package.
- Do not invent hidden template or schema families.
- Prefer exact workflow names and exact field or heading names when updating references.
- If only one side of the pair is visible, do not guess the other side.

## Deliverable
Apply the smallest useful set of updates needed to make visible template and schema families more internally consistent.