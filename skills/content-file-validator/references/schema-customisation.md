# Schema Customisation

Use `references/frontmatter.schema.yaml` as the default schema unless the user supplies another schema path.

## Safe Customisations

You can safely customise:

- required fields
- allowed enum values
- string length limits
- optional metadata fields
- document-type-specific constraints

## Recommended Approach

1. Start from the default schema.
2. Add or remove required fields only when the document standard genuinely changes.
3. Keep `version` required unless the user explicitly changes the rule and understands the tradeoff.
4. Avoid creating two different schema files that define the same rule set with minor wording differences.
5. If project-specific rules differ, prefer one explicit alternate schema path instead of editing the default silently.

## Caution

- Tightening a schema can turn previously valid files into failures.
- Relaxing `additionalProperties: false` may reduce metadata consistency.
- Changing enum values or required fields can require a `major` version bump for templates or standards that depend on that schema.
