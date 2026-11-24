# Implementation Plan: Spec Kit Upgrade to v1.4.4

**Branch**: `aiops/spec-kit-upgrade-v1-4-4` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/025-spec-kit-upgrade/spec.md`

## Summary

Upgrade the installed Spec Kit from `1.0.7.dev0` to `v1.4.4` with the upstream command line, re-apply the one deliberate local change (configurable specifications folder), and remove the stale `taskstoissues` skill, which is no longer in core.

## Technical Context

**Language/Version**: Bash scripts, Markdown skills, JSON manifests

**Primary Dependencies**: `specify-cli` v1.4.4, installed with `uv tool install`

**Storage**: Files under `.specify/` and `.claude/skills/`

**Testing**: `tests/bash/specs-directory.bats` in CI, `bash -n`, ShellCheck, `specify integration status`

**Target Platform**: Claude Code sessions, local and cloud

**Project Type**: Repository tooling

**Constraints**: No constitution change, no locked file touched, no existing specification edited

**Scale/Scope**: 30 files changed, added or removed under `.specify/` and `.claude/skills/`, plus this specification, the catalogue, the lint ignore list and the changelog

## Constitution Check

| Principle | Result | Note |
| --- | --- | --- |
| II. Locked governance | Pass | No locked file is touched. |
| III. Asset boundaries | Pass, relies on the platform-required locations exception | Spec Kit reads its state from `.specify/` and Claude Code reads skills from `.claude/skills/`. Both are fixed paths chosen by the tools. The exception covers the scripts Spec Kit installs under `.specify/scripts/`: the tool resolves them at those paths and tracks them by hash, so they cannot move to root `scripts/`, where `AGENTS.md` places repository-authored scripts. |
| V and VIII. Branch naming | Pass | `aiops/spec-kit-upgrade-v1-4-4` uses an authorised type. |
| VI. UK English | Pass | Applies to this specification. Upstream skill text is left as shipped. |
| VII. Specification quality | Pass | See `checklists/requirements.md`. |
| IX. Changelog compliance | Pass | One entry under 250 characters, linked to the pull request. |

## Research

### Decision 1: upgrade with `specify integration upgrade claude --force`

- **Rationale**: This is the upstream procedure for an existing project. `--force` is required because the manifest reported 12 modified files.
- **Evidence**: Git history shows the ten skill files were never committed again after the install commit `d317850805`, so their hash mismatch was not a deliberate edit. Only `common.sh` and `create-new-feature.sh` were changed later (commits `93a2b9aabb` and `8fb8f108b4`, spec 007).
- **Alternative rejected**: `specify init --here --force`. It rewrites more than the upgrade command does.

### Decision 2: re-apply the specifications-folder change directly in the two scripts

- **Rationale**: `v1.4.4` still hard-codes `specs/` in `create-new-feature.sh` and has no `specs_directory` setting. `migrate-specs.sh` and `tests/bash/specs-directory.bats` both call `read_specs_directory`.
- **Consequence**: `specify integration status` reports these two files as modified. That is expected.
- **Alternative deferred**: Packaging the change as a Spec Kit preset so that upgrades no longer need `--force`. This needs its own specification.

### Decision 3: drop the second path guard in `create-new-feature.sh`

- **Rationale**: The `case "$SPECS_DIRECTORY"` guard repeated checks that `read_specs_directory` already performs, so it could never fire. This is the defect recorded in [GIT-2309](https://linear.app/lightspeedwp/issue/GIT-2309). The upgrade replaced the file, so the guard is not re-added.

### Decision 4: install no extensions

- **Rationale**: Upstream moved `taskstoissues` out of core in 1.3.0 into the optional `github` extension. A first version of this change installed that extension to keep the old behaviour. Review found it unwanted: it created the stale issue backlog in [#3540](https://github.com/lightspeedwp/.github/issues/3540), and work is tracked in Linear. It was removed with `specify extension remove github`. Matching core `v1.4.4` means installing no extensions.

### Decision 5: exclude hash-tracked Spec Kit files from Markdown linting

- **Rationale**: The ten skill files on `develop` differed from their recorded hashes only by blank lines of the kind a Markdown lint fix adds. That mismatch is what made the old install refuse to upgrade. Adding `.claude/skills/speckit-*/**/*.md` to `.markdownlintignore` keeps those files as shipped.

### Decision 6: do not patch upstream files in this change

- **Rationale**: Files that Spec Kit installs are tracked by hash. Editing them here would bring back the modified-file state this change removes, and the next upgrade would overwrite the edits.
- **Consequence**: Review findings on upstream content are recorded here and belong upstream in `github/spec-kit`, not in this repository:
  - `speckit-converge` can append a convergence task that duplicates an open task.
  - `speckit-specify` writes `.specify/feature.json` without checking `SPECIFY_FEATURE_NO_PERSIST`.
  - `markdown_sections.py` can join a replacement to the next heading when the replacement has no final newline.

## Local changes to managed files

| File | Before the upgrade | After |
| --- | --- | --- |
| `.specify/scripts/bash/common.sh` | Added `read_specs_directory` | Carried forward unchanged |
| `.specify/scripts/bash/create-new-feature.sh` | Read `specs_directory`; extra path guard | Reads `specs_directory`; the unreachable guard is dropped |
| `.claude/skills/speckit-*/SKILL.md` (nine files) | Hash mismatch, no deliberate edit | Replaced with upstream `v1.4.4` |
| `.claude/skills/speckit-taskstoissues/SKILL.md` | Stale core skill | Removed; not replaced |

## Project Structure

### Documentation (this feature)

```text
.github/specs/025-spec-kit-upgrade/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
.specify/
├── init-options.json            # version 1.4.4
├── integration.json             # version 1.4.4
├── integrations/*.manifest.json # regenerated
└── scripts/bash/                # upstream v1.4.4 plus the two local changes
.claude/skills/
└── speckit-*/SKILL.md           # upstream v1.4.4, nine core skills
```

## Complexity Tracking

No constitution violation to justify.
