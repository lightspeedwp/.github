# Recommended cleanup pass

Run a broader consistency cleanup pass across this agent package.

## Goal

Tighten remaining consistency notes, package references, and validation-layer coverage around the current routing language and visible file structure without reopening already-resolved blocking issues.

## Current guidance

Nothing in the requested routing and validation slice is currently blocking. Focus on non-blocking cleanup, consistency tightening, and validation follow-through.

## Required workflow

1. Refresh your understanding of the current visible agent file tree.
2. Review the current templates, examples, schemas, scripts, prompts, and README files that are relevant to routing and validation consistency.
3. Check for drift between:
   - workflow names
   - template names
   - schema names
   - example names
   - validator expectations
   - README guidance
   - prompt wording
4. Tighten stale wording so the package consistently reflects the latest routing language and current file/folder structure.
5. If visible or staged test or quality-check documents exist, review them for the same naming and structure drift.
6. If test sources are not visible or staged, do not invent them; note only grounded gaps.

## What to look for

- template, example, and schema naming mismatches
- validators that check only part of a workflow family and leave obvious drift uncaught
- README notes that overclaim validation coverage
- prompt or instruction language that still reflects older workflow names or package structure
- audit, brief, critique, synthesis, UX writing, and reference-analysis artifacts that use inconsistent headings or terminology
- references to files or folders that no longer exist or are no longer the best canonical source

## Editing rules

- Keep fixes conservative and grounded in the visible package.
- Do not invent hidden folders, tests, or validators.
- Preserve useful folder-local guidance unless it is stale or contradicted by the current package.
- Prefer exact filenames and exact workflow names when updating references.
- Separate confirmed gaps from speculative cleanup ideas.

## Deliverable

Apply the smallest useful set of file updates needed to improve consistency across prompts, READMEs, templates, examples, schemas, and validation notes so the package better matches the current routing language and visible structure.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
