# Audit Docs Validation Workflow

Use this workflow when validating audit-facing package documents.

## Purpose

- confirm that required audit documents are present
- check that package files use the expected paths and names
- separate staging gaps from real package-content issues

## Validation flow

1. confirm the required files exist in the agent file tree
2. stage the relevant files into the current workspace copy
3. run the affected validators only
4. separate file-availability blockers from content failures
5. fix only the confirmed package issues in scope

## Notes

- Treat the draft file tree as the source of truth.
- Do not broaden the cleanup beyond the active validation issue.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
