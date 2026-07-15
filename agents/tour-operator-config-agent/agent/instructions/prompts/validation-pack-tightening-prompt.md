# Validation pack tightening prompt

Run a broader pass over the validation pack so its notes, source snapshots, fixture descriptions, and maintenance guidance stay aligned with the current file tree and current routing language.

This is a maintenance implementation task. Do not just review. Make the edits where needed.

## Scope

Inspect and update, where relevant:

- `tests/`
- `scripts/`
- `schemas/`
- validation source files
- consistency source files
- routing snapshots
- QA notes
- validation README files
- script README files
- any other attached validation-layer notes that appear stale

## Source of truth

Use:

- the current attached file tree
- the current saved agent instructions
- the current attached skill set
- the current validation scripts and schemas

## Current attached specialist skills

- `site-preflight`
- `pre-launch-readiness-review`
- `yoast-configuration`
- `yoast-auditor`
- `gravity-forms-configuration`
- `gravity-forms-auditor`
- `wordpress-accessibility-checker`
- `agent-asset-validation-maintainer`

## Required alignment goals

Make sure the validation pack reflects that:

- `site-preflight` is the default first specialist route for baseline inspection and audit preparation
- `pre-launch-readiness-review` is the default route for launch-readiness, final QA, blocker triage, sign-off, and launch-status work
- Gravity Forms audit and configuration routes are distinct
- Yoast audit and configuration routes are distinct
- `wordpress-accessibility-checker` stays narrow and does not absorb general QA, preflight, or launch-readiness routing
- `agent-asset-validation-maintainer` owns self-audit, maintenance-pack review, and validation-gap analysis for this agent’s own assets
- no validation-layer note should claim there is a currently attached Tour Operator specialist skill when none is attached in the current draft
- locally staged Tour Operator skill material must not be described as a current attachment unless the draft actually shows that skill attached

## Anti-drift rules

Do not leave validation-layer text that depends on:

- workspace skills
- shared directory skills
- removed skills
- stale old skill names
- generic unattached `wordpress-*` skill references
- old non-attached Yoast skill names
- silent dependence on skills that are no longer attached
- unattached Tour Operator specialist skill references presented as current attached routes

## Editing rules

- Be surgical, not expansive.
- Update only the files that are actually stale.
- Preserve each file’s role unless a small wording fix is needed for consistency.
- Do not invent new skills, workflows, files, or validation assets.
- Keep exact paths and file names accurate.
- Use UK English.

## Validation expectations

After editing, run the relevant validation checks for the files you touched.

At minimum, run the checks that are relevant to:

- instruction/file consistency
- folder or schema consistency where applicable
- agent structure or validation-layer consistency where applicable

If a validation script needs attached files staged locally first, stage the needed files and rerun the check.

## Deliverables

1. Update any stale validation-pack notes or source files that need tightening.
2. Run the relevant validation checks.
3. Report:
   - which files were changed
   - what stale routing or skill references were removed
   - what validation-layer wording was tightened
   - which checks were run
   - whether they passed or failed
   - any remaining non-blocking cleanup still recommended.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
