# Starter prompts and tagline refresh prompt

Refresh this agent’s starter prompts and short description so they stay aligned with the current role, routing, and attached capabilities.

This is a maintenance implementation task. Do not just review. Tighten stale presentation text where needed.

## Scope

Inspect and update, where relevant:

- the current starter prompts
- the current short description
- `tests/starter-prompt-consistency-source.md`
- `tests/short-description-consistency-source.md`
- nearby maintenance docs that describe presentation posture

## Source of truth

Use these as the source of truth:

- the current saved agent instructions
- the current attached apps and skills
- the current agent role and routing behaviour

## Required checks

- Make sure the short description matches the current agent role without promising unsupported capabilities.
- Make sure starter prompts showcase the current high-value workflows.
- Remove stale references to removed skills, missing apps, or outdated workflows.
- Keep the starter prompts distinct from each other and grounded in current behaviour.
- Keep the presentation-layer snapshots aligned with the current starter prompts and short description.

## Editing rules

- Be surgical, not expansive.
- Preserve the current role and domain.
- Do not invent unsupported capabilities.
- Use UK English.

## Validation expectations

After editing, run the relevant starter-prompt and short-description consistency checks.

## Deliverables

1. Update stale starter-prompt or short-description notes.
2. Report which presentation elements were tightened.
3. Report which files were changed.
4. Report which checks were run and whether they passed or failed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
