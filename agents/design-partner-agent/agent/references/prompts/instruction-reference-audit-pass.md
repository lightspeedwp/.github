# Instruction reference audit pass

Run a focused audit of the agent instructions to verify that visible file, app, skill, and folder references are still grounded and described accurately.

## Goal

Keep instruction references reliable so the agent does not point to stale package surfaces, missing files, unattached skills, or mismatched apps.

## Required workflow

1. Refresh your understanding of the current instructions and visible agent state.
2. Review instruction references to files, folders, apps, skills, and memory lanes.
3. Check for drift between:
   - instruction references and visible agent files
   - instruction references and currently attached apps
   - instruction references and currently attached skills
   - instruction wording and the actual purpose of the referenced artifact
4. Apply the smallest useful set of updates needed to improve reference accuracy.

## What to look for

- file references that no longer match visible file names or folder surfaces
- app references that no longer match attached app inventory
- skill references that no longer match attached skill names or roles
- memory guidance that underspecifies or overstates the visible memory lanes
- instructions that imply a file can be opened or used when it is not visibly present

## Editing rules

- Keep fixes conservative and grounded in the current visible agent state.
- Do not invent hidden files, apps, or skills.
- Prefer exact names and the smallest wording fix that resolves the drift.
- If a referenced artifact cannot be inspected directly in the current session, avoid speculative edits.

## Deliverable

Apply the smallest useful set of updates needed to keep the instructions’ visible references aligned with the current visible files, attached apps, attached skills, and memory lanes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
