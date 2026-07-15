# Source audit prompt

Audit `prompts/tour-operator-website` as the single source of truth for a local `tour-operator-website` skill.

This is a verification task first. Do not package, upload, attach, or rewrite the skill yet.

## Goal

Produce a verified inventory of what the source folder actually contains and what can already be trusted as package evidence.

## Scope

Inspect, where present and readable:

- `prompts/tour-operator-website/agents/`
- `prompts/tour-operator-website/references/`
- `prompts/tour-operator-website/memory/`
- `prompts/tour-operator-website/assets/`
- `prompts/tour-operator-website/scripts/`
- `prompts/tour-operator-website/examples/`
- `prompts/tour-operator-website/schemas/`
- `prompts/tour-operator-website/SKILL.md`
- any other file inside the source folder that appears to belong to the skill package

## Source of truth

Use only:

- the actual files present in `prompts/tour-operator-website`
- current readable file contents
- exact current paths

## Required checks

- Verify which package entry files are present.
- Verify which support directories are present.
- Distinguish clearly between present, missing, unreadable, and partially visible material.
- Record any references inside readable files that point to files not yet verified.
- Identify whether the folder already looks like a complete skill package, a partial package, or a source tree that still needs packaging work.
- Do not infer package validity from one file alone.

## Editing rules

- Do not create or edit files in this phase.
- Do not invent missing package files.
- Do not collapse unknowns into assumptions.
- Use UK English.

## Deliverables

1. A verified file-and-folder inventory.
2. A list of package-critical files that are present.
3. A list of package-critical files that are missing, unreadable, or unverified.
4. A short verdict: `complete enough to package`, `packageable with repairs`, or `not yet packageable`.
5. The smallest safe next phase to run.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
