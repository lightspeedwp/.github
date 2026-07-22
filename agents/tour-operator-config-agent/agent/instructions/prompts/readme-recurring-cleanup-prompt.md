# README recurring cleanup prompt

Update all README files in this agent’s attached file tree so they accurately match the latest attached file and folder structure, then run the relevant validation checks.

This is a maintenance implementation task. Do not just review. Make the edits and run the checks.

## Scope

- Update every attached README-style file you can find, including at least:
  - `tests/README.md`
  - `scripts/README.md`
  - `schemas/README.md`
  - `references/README.md`
- Also update any other attached README or README-like file if it exists and is stale.

## Source of truth

- Use the current attached file tree as the only source of truth for file and folder structure.
- Use the current attached skill set and current instruction routing as the source of truth for any README text that mentions routing, validation ownership, specialist handoff, launch-readiness review, or audit preparation.

## Current attached specialist skills to align with

- `site-preflight`
- `pre-launch-readiness-review`
- `yoast-configuration`
- `yoast-auditor`
- `gravity-forms-configuration`
- `gravity-forms-auditor`
- `wordpress-accessibility-checker`
- `agent-asset-validation-maintainer`

## README update requirements

- Inspect the current attached file tree first.
- Update each README so its:
  - file inventories
  - folder inventories
  - path references
  - validation references
  - workflow notes
  - maintenance notes
  accurately reflect the current attached structure.
- Remove stale references to files, folders, scripts, schemas, templates, examples, tests, references, workflows, or validation assets that no longer exist.
- Add references to newly present files or folders when relevant to that README’s purpose.
- Preserve each README’s existing role and scope unless a small wording fix is needed for accuracy.
- Keep edits surgical, not expansive.
- Use exact current paths.
- Use UK English.

## Skill and routing anti-drift rules

- Do not leave README text that implies dependence on:
  - workspace-only skills
  - shared directory skills
  - removed skills
  - stale old skill names
  - generic unattached `wordpress-*` skill references
- If a README mentions routing, launch-readiness, audit preparation, specialist review, or validation ownership, align it with the currently attached skills and current instruction logic.
- Do not present an unattached Tour Operator specialist skill as part of the current attached route inventory.

## Validation alignment rules

- Keep README references aligned with the current attached validation assets in:
  - `tests/`
  - `scripts/`
  - `schemas/`
  - `references/`
- Where relevant, align with:
  - `tests/skill-routing-snapshot.md`
  - `tests/instruction-file-consistency-source.md`
  - current validation scripts
  - current schema files
  - current reference standards

After editing, run the relevant validation checks for the updated README and documentation state. At minimum, run the validation checks that verify:

- instruction/file consistency
- folder/schema consistency where relevant
- agent structure or documentation consistency if applicable

If a validation script fails because a referenced file is not staged locally first, stage the needed attached files and rerun the check.

## Deliverables

1. Update all affected README files.
2. Run the relevant validation checks.
3. Report:
   - which README files were changed
   - stale references removed
   - new structure references added
   - which validation checks were run
   - whether they passed or failed
   - any remaining ambiguities caused by truncated file visibility or unclear ownership
4. Flag any non-README documentation that still appears stale, but do not rewrite it unless needed for README consistency.

## Editing standard

- Be surgical, not expansive.
- Prefer precise corrections over broad rewrites.
- Do not invent missing files, folders, workflows, or capabilities.
- Keep the final README set coherent and internally consistent.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
