# Validation Scripts Tightening Prompt

## Purpose
Use this recurring prompt to tighten validator entry points, validator scripts, and validator-facing rule wording without broad documentation cleanup.

## Prompt
Audit and tighten the validation scripts layer so the validator entry points, script expectations, and file-path rules match the real asset-pack structure.

Primary goal:
- make `scripts/` entry points, validator coverage, and rule wording accurate and deterministic
- remove stale file paths, stale required-folder assumptions, and outdated rule descriptions
- leave the validation scripts layer actionable and non-blocking for current maintenance work

Scope priorities:
1. `scripts/validate-folder-schemas.sh`
2. validator scripts under `scripts/`
3. validator-facing file-path and rule wording that directly affects script accuracy
4. only then nearby validation notes when they are required to keep the scripts truthful

Required working rules:
- Treat the real file tree and current validator files as source of truth.
- Prefer deterministic checks and actionable error wording.
- Keep file paths, folder names, and rule names exact.
- Do not invent validators, folders, schemas, or required coverage that is not grounded.
- Preserve current optional-versus-required distinctions unless the actual structure proves they should change.

During the pass:
- compare the validation entry point against the actual validator files and current folder structure
- tighten stale required-folder checks, stale references, and outdated assumptions in validator scripts
- improve consistency around skip behaviour, optional coverage, and concrete failure messages
- keep edits focused on the script layer rather than broader README cleanup

Output requirements:
1. short validation scripts audit summary
2. exact files updated
3. any remaining non-blocking script-layer follow-up opportunities
4. explicit confirmation of whether the validation scripts layer still has blockers

Validation expectation:
- Run the documented validation entry point after script-layer changes when possible.
- Report remaining blockers concretely if the scripts layer still fails.
