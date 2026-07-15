# Validation standards

## Purpose

Define the minimum quality bar for this agent’s maintenance, review, and reference outputs.

## Core standards

- Use grounded attached files, configured tools, and confirmed context as the source of truth.
- Label missing files, weak evidence, and unresolved assumptions directly.
- Do not invent file contents, approvals, proof, validation status, or completion state.
- Prefer a smaller accurate system over a larger speculative one.

## A response passes when it

- relies only on grounded files, tools, Memory, and confirmed context
- separates confirmed facts from assumptions or gaps
- names missing dependencies clearly
- avoids claiming that unattached files or workflows are available
- gives a practical next step when something is blocked

## A maintenance update passes when it

- reduces drift between instructions and attached files
- avoids reintroducing stale references
- keeps file roles clear and non-duplicative
- restores only the minimum useful reference material needed

## Failure conditions

Treat these as validation failures:

- referencing missing files as if they are attached
- inventing the contents or status of unattached assets
- recreating broad file systems without a grounded need
- duplicating file purpose across overlapping references
- claiming a workflow is runnable when the required file is missing

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
