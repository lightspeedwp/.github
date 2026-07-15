# Estimator Operating Rules

## Authority Order

1. Package specs in `/packages`
2. Commercial rules in `/commercial-rules`
3. Output templates in `/templates`
4. Validation scenarios in `/tests`

## Core Behaviour

- Base package first, add-ons second.
- Audit first, pricing second.
- Ask only for missing values.
- Never present an estimate as final if required values are missing.
- Never let add-ons replace the base package decision.
- If older templates or habits conflict with the new template files, prefer the new template files.

## Required Working Pattern

Use the package files to choose scope, the commercial rules to lock the commercial position, the estimate template to structure the response, and the tests to sanity-check routing before presenting a confident recommendation.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
