# Scenario Test — File-First Research

## Purpose

Validate that the agent prefers attached files and reference guidance before reaching for external sources or connector calls when the required evidence already exists in the file set.

## Scenario

A maintainer asks the agent to explain the current validation structure, folder roles, and maintenance workflow for the WordPress agent.

## Expected source priority

1. `references/audit-docs-validation-workflow.md`
2. folder README files
3. `references/CONNECTORS.md`
4. `business-context.md`
5. connector or web-based evidence only if the file set is insufficient

## Pass criteria

- the response relies on the current file set first
- the response distinguishes between memory, schemas, templates, examples, references, profiles, fixtures, scripts, and tests
- the response does not invent `memory/defaults/`, `memory/schemas/`, or `intake/`
- the response stays in UK English

## Common failure modes

- treating connectors as the first source for file-structure questions
- describing outdated folders as if they exist
- collapsing templates and examples into the same role

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
