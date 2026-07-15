# Validator failure fixture — schema alignment

## Scenario

This fixture represents a scaffold state that should fail schema presence or schema/file alignment checks in the validation pack.

## Failure conditions to simulate

- a durable memory file exists without a matching validation schema
- a schema exists but does not match the expected durable record shape
- a memory example uses fields not covered by the declared schema
- a schema name suggests one object type while the related file follows another

## Expected use

Use this fixture to test validation-pack behaviour for schema presence, schema/file alignment, and memory-schema consistency failures.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
