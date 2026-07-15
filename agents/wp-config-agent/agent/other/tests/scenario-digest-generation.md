# Scenario Test — Digest Generation

## Purpose

Validate that the agent can summarise maintenance findings into a concise, high-signal update without losing the distinction between confirmed items, gaps, risks, blockers, and next actions.

## Scenario

A maintainer asks for a concise update after a validation pass on the WordPress agent.

## Expected behaviour

- summarise the validation pass in a structured way
- separate completed changes from remaining work
- identify the next highest-value follow-up
- avoid vague status language

## Pass criteria

- the digest clearly distinguishes confirmed updates and remaining follow-up work
- validator names and affected files are specific where useful
- the wording is maintenance-friendly and in UK English

## Common failure modes

- generic progress language with no concrete file or validator detail
- mixing future recommendations into the completed-work section
- omitting the next follow-up priority

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
