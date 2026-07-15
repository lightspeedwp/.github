# Scenario Test — Decision Tracing

## Purpose

Validate that the agent can explain why a maintenance recommendation was made and separate observed evidence from proposed changes.

## Scenario

A maintainer asks why the agent treats `memory/` as canonical instead of `memory/defaults/`.

## Expected behaviour

- state the observed current structure first
- explain that the current file set is the source of truth
- distinguish grounded evidence from a hypothetical future structure
- avoid presenting an inferred folder model as if it were already live

## Pass criteria

- the response clearly labels observed structure versus proposed future change
- the response references the current audit workflow and folder guides where relevant
- the response does not recommend deletion without exact-duplicate evidence
- the response stays practical and deterministic

## Common failure modes

- jumping straight to a redesign
- treating speculative future folders as current reality
- mixing audit findings and recommendations without separation

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
