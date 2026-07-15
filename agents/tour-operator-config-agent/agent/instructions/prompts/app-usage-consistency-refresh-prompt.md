# App usage consistency refresh prompt

Refresh this agent’s app-usage guidance so the instructions, app snapshots, and nearby maintenance docs match the apps that are currently attached in the draft.

This is a maintenance implementation task. Do not just review. Update the stale app references and consistency notes where needed.

## Scope

Inspect and update, where relevant:

- the current saved agent instructions
- `tests/app-usage-consistency-source.md`
- `tests/validation-readme.md`
- `prompts/`
- README files or validation notes that mention attached apps or app posture

## Source of truth

Use these as the source of truth:

- the apps currently attached to the draft
- the current saved agent instructions
- the current attached file tree

## Required checks

- Confirm the attached apps snapshot is complete and current.
- Remove references to unattached apps from app-usage snapshots and nearby maintenance docs.
- Add newly attached apps where they materially affect routing, delivery, or maintenance guidance.
- Make sure the instructions describe the current app posture accurately and do not imply unsupported app workflows.
- Keep WordPress site access, project-document access, and delivery-coordination guidance clearly separated.

## Editing rules

- Be surgical, not expansive.
- Preserve the current role and workflow behaviour.
- Do not invent new app workflows or destinations.
- Keep exact app names accurate.
- Use UK English.

## Validation expectations

After editing, run the relevant checks for app-usage consistency and any nearby docs you touched.

## Deliverables

1. Update stale app-usage notes and snapshots.
2. Report which files were changed.
3. Report which app references were added, removed, or tightened.
4. Report which checks were run and whether they passed or failed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
