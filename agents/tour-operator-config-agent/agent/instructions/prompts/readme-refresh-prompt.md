# README refresh prompt

Update the README files in this agent’s attached file tree so they accurately match the latest attached file and folder structure, current routing posture, and current validation assets.

This is a maintenance implementation task. Do not just review. Make the edits.

## Scope

Update every attached README-style file you can verify, including at least:

- `tests/README.md`
- `tests/validation-readme.md`
- `scripts/README.md`
- `schemas/README.md` if it is actually present in the current attached file tree
- `references/README.md` if it is actually present in the current attached file tree

Also update any other attached README or README-like file if it exists and is stale.

## Source of truth

Use:

- the current attached file tree
- the current saved agent instructions
- the current attached skill set
- the current validation scripts, schemas, and routing snapshots

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
- Update each README so its file inventories, folder inventories, path references, validation references, workflow notes, and maintenance notes reflect the current attached structure exactly.
- Remove stale references to files, folders, scripts, schemas, templates, examples, tests, references, workflows, or validation assets that no longer exist or are not currently verifiable.
- Add references to newly present files or folders when relevant to that README’s purpose.
- Preserve each README’s existing role and scope unless a small wording fix is needed for accuracy.
- Keep edits surgical, not expansive.
- Use exact current paths.
- Use UK English.

## Routing and validation alignment rules

- If a README mentions routing, launch-readiness review, audit preparation, specialist handoff, or validation ownership, align it with the current instructions and the currently attached skills.
- Keep README references aligned with the current validation assets in `tests/`, `scripts/`, `schemas/`, and `references/` when those paths are currently verifiable.
- Where relevant, align with:
  - `tests/skill-routing-snapshot.md`
  - `tests/instruction-file-consistency-source.md`
  - current validation scripts
  - current schema files
  - current reference standards

## Anti-drift rules

Do not leave README text that implies dependence on:

- workspace-only skills
- shared directory skills
- removed skills
- stale old skill names
- generic unattached `wordpress-*` skill references
- unattached Tour Operator specialist skills presented as current attached routes

## Validation expectations

After editing, run the relevant validation checks for the updated README and documentation state.

At minimum, run the checks that verify:

- instruction/file consistency
- folder or schema consistency where relevant
- documentation or structure consistency where applicable

If a validation script fails because referenced files are not staged locally first, stage the needed files and rerun the check.

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

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
