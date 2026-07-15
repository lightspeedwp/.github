# Skill package health check prompt

Run a recurring health check across this agent’s attached uploaded skill packages and any currently staged local skill packages that are visible during the task.

This is a maintenance implementation task. Do not just review. Inspect the packages, flag concrete issues, and repair package-level problems only when the package can be verified directly.

## Scope

Inspect, and when clearly supported repair, where relevant:

- attached uploaded skill packages
- locally staged skill folders visible in the current session
- skill routing references in the instructions when they materially depend on package metadata
- maintenance docs that claim a skill is attached or ready when the package evidence disagrees

## Source of truth

Use these as the source of truth:

- the current attached skill set
- the actual files inside each readable attached or staged skill package
- the current saved agent instructions

## Required checks

For each readable skill package, verify:

- `SKILL.md` frontmatter and trigger description quality
- `agents/openai.yaml` naming and metadata consistency
- whether supporting folders appear purposeful rather than placeholder-driven
- whether the package role still matches how the instructions route to that skill
- whether any local or staged package needs same-id update follow-through

For `tour-operator-website` specifically, verify that the package clearly supports its role as a primary attached specialist route for the agent’s core Tour Operator website work, including Tour Operator plugin and extension workflows, content-model interpretation, plugin-stack coherence, migration planning, and implementation handoff work.

When `tour-operator-website` is attached but unreadable in the current session, preserve its attached-primary routing status in maintenance docs where grounded, but do not describe the package itself as verified, readable, healthy, or ready.

## Repair boundary

Repair only issues that are clearly supported by inspected package files, such as:

- stale naming mismatches
- thin or misleading metadata
- stale support-file references
- mismatched skill-package descriptions
- wording that demotes `tour-operator-website` away from its primary-route role
- maintenance wording that collapses attachment state and package readability into the same claim

If a package cannot be read in the current session, mark it as partial rather than guessing.

## Editing rules

- Be surgical, not expansive.
- Do not redesign a skill unless clearly necessary.
- Do not claim a skill was updated if the package could not be edited in place.
- Use UK English.

## Validation expectations

After package edits, run the relevant package validation for the updated skill.

## Deliverables

1. Report which skills were fully verified and which were partial.
2. Report package-level issues found.
3. Report any same-id updates or follow-through completed.
4. Report which checks were run and whether they passed or failed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
