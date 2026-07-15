# README Refresh Prompt

Use this recurring prompt when the agent's README files may be out of sync with the latest file and folder structure.

## Prompt

Audit this agent's `README.md` files, then update them so they reference the latest file and folder structures accurately and consistently.

Scope:

- every attached `README.md` file in the current file tree
- nearby maintenance notes only where they materially affect README accuracy
- file and folder references mentioned in README documentation

Primary goal:

- keep all README documentation aligned with the current attached file tree so setup, maintenance, and validation guidance stays trustworthy

Working rules:

1. Use the current attached file tree as the source of truth.
2. Audit all README files before editing them.
3. Update stale paths, folder descriptions, file descriptions, and maintenance notes where needed.
4. Keep changes tightly scoped to README accuracy and clarity.
5. Do not invent files, folders, scripts, validators, prompts, schemas, references, or examples that are not currently attached.
6. Preserve useful existing explanations unless they are stale, misleading, duplicated, or inconsistent with the current structure.
7. Keep all README language in plain UK English.

Specific checks:

- confirm every README file points to files and folders that still exist
- remove outdated references to renamed, moved, or deleted files
- align script, test, template, schema, example, prompt, and reference descriptions with the current tree
- make sure folder purpose statements still match the files actually present
- tighten duplicated or conflicting README guidance where it would confuse maintenance work
- note any non-README cleanup that was discovered but left out of scope

Deliverables:

1. A short README audit summary.
2. The exact README files updated.
3. A concise list of major structural corrections made.
4. A short note on anything left unchanged because it belongs outside README scope.

Success condition:

- the agent's README files accurately describe the current attached file and folder structure and no longer contain stale structural guidance

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
