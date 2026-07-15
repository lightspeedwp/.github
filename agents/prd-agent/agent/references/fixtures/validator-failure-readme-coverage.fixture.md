# Validator failure fixture — README coverage

## Scenario

This fixture represents a scaffold state that should fail README coverage checks in the validation pack.

## Failure conditions to simulate

- a required folder exists without a matching README.md
- a README exists but does not describe the files actually present
- a nested folder is present but undocumented
- file inventory references are stale or incomplete

## Expected use

Use this fixture to test validation-pack behaviour for README coverage, nested-folder documentation checks, and README/file inventory alignment failures.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
