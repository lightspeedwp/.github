# Skills routing and directory validation prompt

Run a comprehensive validation pass over this agent’s attached skills, skill-routing references, and skill-directory maintenance layer.

This is a maintenance implementation task. Do not just review. Inspect the current state, identify concrete issues, and only make changes or attach follow-through when the current setup and permissions clearly support it.

## Goal

Validate that:

- the current attached skill set is coherent
- the instructions route to currently attached skills only
- skill names, descriptions, routing notes, snapshots, and maintenance docs stay aligned
- uploaded or locally staged skill packages are structurally sound
- draft or locally prepared skills that are clearly intended for this agent are attached or surfaced for follow-through when needed
- locally staged Tour Operator skill material is not mistaken for a currently attached specialist route unless the draft actually shows that attachment

## Scope

Inspect and validate, where relevant:

- the current attached skill set
- the current saved agent instructions
- `prompts/`
- `tests/`
- `scripts/`
- README files and routing snapshots
- consistency-source files
- attached uploaded skill packages
- locally staged skill folders when they are visible during the task

## Source of truth

Use these as the source of truth, in order:

- the current attached skill set in the draft
- the current saved agent instructions
- the current attached file tree
- the actual files inside attached uploaded skills when available
- locally staged skill folders only when they are clearly the current draft source for a skill update

## Required validation checks

### 1. Attached skill inventory check

Confirm:

- every attached skill is still intentional and relevant
- no current maintenance docs still depend on removed or unattached skills
- the skill-routing sections in the instructions match the actual attached skill set
- any attached-skill list in prompt docs, snapshots, READMEs, or consistency sources matches the current draft
- locally staged Tour Operator skill material is described accurately as staged or unattached when the current draft does not show it as attached

### 2. Instruction-to-skill routing check

Check that the instructions:

- reference only currently attached skills
- use exact attached skill names consistently
- route narrowly and correctly between broad workflows and specialist skills
- do not silently depend on workspace-only skills, stale old names, or unattached alternatives
- preserve the agent’s current role and routing intent unless a narrower correction is required

### 3. Skill package health check

For each attached uploaded skill you can inspect directly, validate:

- `SKILL.md` frontmatter and trigger description quality
- `agents/openai.yaml` consistency with the canonical skill name and job
- whether example, reference, schema, script, or template folders appear purposeful rather than placeholder-driven
- whether the skill description still matches how the instructions route to it
- whether supporting files look stale, thin, duplicated, or mismatched to the current role of that skill

For locally staged but unattached Tour Operator skill material, assess it as staged package evidence only. Do not treat it as attached-routing proof unless the draft actually includes that attachment.

### 4. Local draft or staged skill check

When locally staged skill folders are visible, check whether they:

- are valid skill packages
- correspond to already attached skills or clearly intended new skills
- need same-id upload follow-through
- need attach follow-through if they are new and meant for this agent

If a draft or local skill is clearly the intended current version and the current setup supports finishing that flow, attach or update it. If the current draft then needs to be made live for the change to become the live version, say so clearly.

Do not invent a publish step for skills themselves. Treat skill upload or attachment as draft configuration, and only call out agent **Update** when the draft must be made live.

### 5. Anti-drift checks

Flag any:

- unattached skill references in instructions
- attached skills missing from routing or maintenance docs where they materially matter
- stale references in `prompts/`, `tests/`, `scripts/`, or README files
- overlapping skill responsibilities that make routing ambiguous
- local skill packages that appear newer than the attached routing/docs but are not yet reflected
- wording that presents a staged Tour Operator skill package as a current attached route when the draft does not show that attachment

## Repair boundary

This prompt is primarily for validation, but you may perform small direct fixes that are obviously required for consistency, such as:

- correcting attached-skill lists
- replacing stale skill names with the exact attached names
- updating consistency-source snapshots
- tightening README or prompt inventory references

For broader repair work, use `prompts/skills-routing-and-directory-repair-prompt.md`.

## Editing rules

- Be surgical, not expansive.
- Preserve the current agent role and routing behaviour as closely as possible.
- Do not invent new skills, workflows, or directories.
- Do not detach skills unless the user clearly asked for removal.
- Do not replace an attached skill with a different one unless the user clearly asked for that swap.
- Keep exact paths and exact skill names accurate.
- Use UK English.

## Validation expectations

After any edits, run the relevant checks for what changed.

At minimum, run the checks relevant to:

- instruction/file consistency
- routing snapshot and consistency-source alignment
- agent structure or documentation consistency where applicable
- skill package validity when a locally staged or attached skill package is being updated

If a skill package cannot be fully inspected in the current session, say that plainly and mark the result as partial rather than guessing.

## Deliverables

1. Report the current attached skills reviewed.
2. State which skills and routing references were fully verified versus partially verified.
3. List issues found, grouped as:
   - `blocking`
   - `important`
   - `non-blocking`
4. List any direct fixes made.
5. State whether any local or draft skill still needs attach or draft-to-live follow-through.
6. State which checks were run and whether they passed or failed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
