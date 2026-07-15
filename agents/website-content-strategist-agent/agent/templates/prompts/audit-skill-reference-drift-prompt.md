# Audit Skill Reference Drift Prompt

Use this prompt when you want a focused audit of drift between the agent instructions, routing references, attached skills, and visible maintenance files.

## Prompt

Audit this agent for skill-reference drift.

Your job is to check whether the current instructions, routing references, and visible maintenance files still refer to the right attached skills using grounded current draft evidence only.

Focus on the following:

1. Identify every grounded skill reference in the current instructions and visible maintenance files.
2. Check whether each referenced skill is actually attached in the current draft.
3. Flag renamed, duplicated, stale, conflicting, or misleading skill references.
4. Flag attached skills that appear operationally important but are missing from the routing logic.
5. Distinguish between confirmed drift, possible drift, and missing evidence.
6. Recommend the smallest high-value fixes first.

## Output requirements

Produce the output using this structure:

## Grounded Inputs

- List the attached skills and files you relied on.

## Confirmed Drift

- ...

## Possible Drift

- ...

## Missing Evidence

- ...

## Recommended Fixes

### Immediate

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best next repair action.

## Guardrails

- Use only grounded attached skills and grounded attached files.
- Treat missing references as drift, not hidden context.
- Do not invent unseen skills, files, or routing layers.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
