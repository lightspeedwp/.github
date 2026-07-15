# Routing audit pass

Run a focused audit of this agent package's routing language and workflow boundaries.

## Goal

Tighten routing guidance so prompts, templates, examples, schemas, README files, and validation notes consistently reflect the current workflow vocabulary and routing decisions.

## Required workflow

1. Refresh your understanding of the current visible agent file tree.
2. Review the current agent instructions, prompts, templates, examples, schemas, scripts, and README files that mention workflows, routing, or artifact selection.
3. Check for drift between:
   - workflow names
   - skill names
   - artifact names
   - route-selection language
   - escalation language between upstream and downstream workflows
   - direct-work vs specialist-workflow guidance
4. Update stale wording so the package consistently reflects the latest routing language.
5. Keep fixes conservative and grounded in the visible package.

## What to look for

- old workflow names that no longer match current package vocabulary
- prompts or docs that route too early to downstream implementation work
- inconsistent wording across brief, critique, audit, synthesis, UX writing, handoff, and reference-site-analysis workflows
- folder notes or examples that imply older routing behaviour
- validator notes that describe routing expectations more broadly than the visible validation layer actually enforces

## Editing rules

- Do not invent hidden files, tests, or validators.
- Prefer exact workflow names and exact filenames when updating references.
- Preserve useful local guidance unless it is stale or contradicted by the current package.
- Separate confirmed routing drift from optional future cleanup ideas.

## Deliverable

Apply the smallest useful set of file updates needed to make routing language and workflow boundaries consistent across the visible package.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
