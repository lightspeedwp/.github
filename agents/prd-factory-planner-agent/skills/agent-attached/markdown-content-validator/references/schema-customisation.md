# Schema Customisation

## Goal

Keep project-specific frontmatter rules in the schema file instead of hard-coding them into the script.

## Safe customisations

You may extend the schema by:

- adding new optional properties
- tightening string lengths or enum values
- adding array item constraints
- adjusting `minProperties` or `maxProperties`
- adding required fields when the project truly depends on them

## Avoid

Avoid changing the script just to support project-specific metadata rules. Prefer updating `references/frontmatter.schema.yaml` or passing a stronger compatible schema.

## Recommendation

If a project already has a stronger schema, reuse it when it remains compatible with the core requirements for:

- top-of-file YAML frontmatter
- required `version`
- valid SemVer format
- deterministic schema validation

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
