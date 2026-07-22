# Schema Customisation

The validator reads frontmatter rules from `references/frontmatter.schema.yaml`.

## Safe customisations

You can adapt the schema by:

- adding new optional properties
- tightening enum lists
- changing string length limits
- adding array item enums
- changing `minProperties` or `maxProperties`
- switching required fields when the project standard differs

## Recommended process

1. Preserve the required core fields unless the project has a stronger compatible standard.
2. Keep `version` required if version tracking is part of the workflow.
3. Avoid moving project-specific policy into the script.
4. Re-run the validator tests after any schema change.

## Compatibility guidance

If an existing project schema is stronger and compatible, keep it. If it is weaker, merge in only the minimum additions needed for reliable validation.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
