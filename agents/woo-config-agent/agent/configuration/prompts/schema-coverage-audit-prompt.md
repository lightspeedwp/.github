# Schema Coverage Audit Prompt

Use this recurring prompt when you want to audit the current `schemas/` layer and the documentation that describes schema coverage for routed workflows.

## Recommended prompt

```text
Audit this WooCommerce Configuration Agent's schema coverage and schema-related validation guidance, then implement any needed documentation or maintenance fixes directly.

Primary goal:
Make sure the current schema files, schema-validation docs, and route-to-schema guidance stay aligned with the actual attached schemas and do not overstate coverage for routed skills that do not yet have dedicated schema files.

Scope:
1. Review the attached `schemas/` folder and its README.
2. Review schema-related validation docs, especially:
   - `tests/schema-validation-tests.md`
   - `tests/validation-readme.md`
   - `references/audit-docs-validation-workflow.md`
   - any saved prompt that describes schema alignment or schema coverage
3. Check which routed local skills currently have dedicated schema files and which do not.
4. Correct any wording that overclaims current schema coverage.
5. Tighten documentation so it distinguishes clearly between:
   - dedicated workflow schemas
   - file-structure validation schemas
   - documentation-validated routes without dedicated schemas

Constraints:
- Use the current attached `schemas/` folder as source of truth.
- Be conservative and precise.
- Do not invent missing schema files.
- Do not treat absent schemas as errors unless the current docs wrongly claim they already exist.

Deliverable format:
1. Audit summary
- current workflow-schema coverage
- overstated or stale schema wording found
2. Changes made
- exact documentation or validation wording fixed
3. Validation result
- whether schema guidance now matches the attached schema layer
- any remaining non-blocking schema follow-up items
```

## Use notes

- Treat actual attached schema files as canonical.
- Prefer tightening documentation over inventing missing schema assets.
- Keep this pass focused on schema coverage and schema-alignment guidance.
