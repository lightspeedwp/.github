# Validation-pack tightening

Run a focused pass on the package validation layer so validators, schemas, templates, examples, and quality-check sources stay aligned.

## Goal

Tighten visible validation coverage around the current workflow names, file structure, and output expectations without inventing hidden tests or overstating what the validators enforce.

## Required workflow

1. Refresh your understanding of the current visible agent file tree.
2. Review the current schemas, templates, examples, scripts, README files, and prompts that describe validation expectations.
3. Check for drift between:
   - schema names and workflow names
   - template headings and schema fields
   - example structure and schema-backed expectations
   - validator scripts and the files they actually inspect
   - README or prompt notes about validation coverage
4. If visible or staged test or quality-check documents exist, review them for the same drift.
5. If test sources are not visible or staged, do not invent them; note only grounded gaps.
6. Apply the smallest useful set of updates needed to improve validation consistency.

## What to look for

- schema/template/example families that no longer line up cleanly
- validator scripts that only check part of a workflow family and leave obvious drift uncaught
- README or prompt wording that overclaims validation coverage
- stale references to hidden or unstaged test sources
- examples that teach a looser structure than the visible schema-backed expectations

## Editing rules

- Keep fixes conservative and grounded in the visible package.
- Do not invent hidden folders, tests, validators, or schema coverage.
- Prefer exact filenames, exact headings, and exact workflow names when updating references.
- Preserve useful validator guidance unless it is stale or contradicted by the current package.

## Deliverable

Apply the smallest useful set of file updates needed to make the visible validation pack more internally consistent across schemas, templates, examples, scripts, and validation notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
