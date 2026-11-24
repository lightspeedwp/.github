# Feature Specification: Spec Kit Upgrade to v1.4.4

**Feature Branch**: `aiops/spec-kit-upgrade-v1-4-4`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Upgrade GitHub Spec Kit in lightspeedwp/.github from 1.0.7.dev0 to v1.4.4, keeping the repository's local changes to managed files."

## Context

This repository runs every significant change through GitHub Spec Kit. The installed copy was a development build (`1.0.7.dev0`) from 10 September 2026. The current release is `v1.4.4`, published on 23 November 2026.

Three problems follow from the old install:

- `specify integration status` reported 12 managed files as modified, so an upgrade refused to run without `--force`.
- The `speckit-taskstoissues` skill was still installed as a core skill. Upstream removed it from core in 1.3.0 and moved it to the bundled `github` extension.
- Two managed scripts carry a local change that lets the specifications live in `.github/specs/` (spec 007). A forced upgrade overwrites that change.

Tracking issue: [GIT-2801](https://linear.app/lightspeedwp/issue/GIT-2801). Parent epic: [#3464](https://github.com/lightspeedwp/.github/issues/3464).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintainers work with the current Spec Kit release (Priority: P1)

A maintainer who runs any Spec Kit skill in this repository gets the behaviour of the current release, and the project records which release it is on.

**Why this priority**: Every later piece of standards work is meant to run through Spec Kit. Running it on a development build from September makes each of those runs unreliable.

**Independent Test**: Read `.specify/integration.json` and the `metadata.version` field of any `speckit-*` skill, and run `specify integration status`.

**Acceptance Scenarios**:

1. **Given** the upgraded branch, **When** a maintainer reads `.specify/integration.json` and `.specify/init-options.json`, **Then** both record version `1.4.4`.
2. **Given** the upgraded branch, **When** a maintainer opens any `.claude/skills/speckit-*/SKILL.md`, **Then** its frontmatter carries `metadata.version: "1.4.4"`.
3. **Given** the upgraded branch, **When** a maintainer runs `specify integration status`, **Then** it reports no missing files and no invalid manifest paths.

---

### User Story 2 - Specifications keep landing in `.github/specs/` (Priority: P1)

A maintainer who creates a new specification after the upgrade gets it in `.github/specs/`, with the next number in sequence, exactly as before.

**Why this priority**: Upstream defaults to a root `specs/` folder. Losing the local change would split specifications across two folders and break the catalogue, the audit script and its tests.

**Independent Test**: Run `.specify/scripts/bash/create-new-feature.sh --json --dry-run --short-name example "Example"` and read the reported path.

**Acceptance Scenarios**:

1. **Given** `specs_directory` is `.github/specs` in `.specify/init-options.json`, **When** the feature-creation script runs in dry-run mode, **Then** the reported `SPEC_FILE` is under `.github/specs/`.
2. **Given** the existing specifications end at 024, **When** the script allocates a number, **Then** it allocates 025.
3. **Given** the upgraded `common.sh`, **When** the existing `tests/bash/specs-directory.bats` suite runs, **Then** every test passes.

---

### User Story 3 - Tasks can still become GitHub issues (Priority: P2)

A maintainer who wants to turn `tasks.md` into GitHub issues still has a skill for it, supplied by the supported extension rather than by a stale copy.

**Why this priority**: The capability is optional in the Spec Kit workflow, but removing it without a replacement would be a regression.

**Independent Test**: List `.claude/skills/` and run `specify extension list`.

**Acceptance Scenarios**:

1. **Given** the upgraded branch, **When** a maintainer lists `.claude/skills/`, **Then** `speckit-taskstoissues` is absent and `speckit-github-taskstoissues` is present.
2. **Given** the upgraded branch, **When** a maintainer runs `specify extension list`, **Then** the `github` extension is listed as enabled.

---

### Edge Cases

- A later upgrade will again report the two locally changed scripts as modified. This is expected and is documented in the plan; it must not be mistaken for drift.
- The repository's specification audit requires contiguous numbering and already fails because 020 to 022 are absent. Adding 025 does not change that result. The fix belongs to [GIT-2676](https://linear.app/lightspeedwp/issue/GIT-2676).
- The Spec Kit command line sets the execute bit on scripts under `.specify/scripts/`. `migrate-specs.sh` therefore changes mode without changing content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST record Spec Kit version `1.4.4` in `.specify/integration.json`, `.specify/init-options.json` and both integration manifests.
- **FR-002**: Every managed `speckit-*` skill MUST be the version shipped with `v1.4.4`.
- **FR-003**: `read_specs_directory` MUST remain available in `.specify/scripts/bash/common.sh` with unchanged behaviour.
- **FR-004**: `.specify/scripts/bash/create-new-feature.sh` MUST resolve the specifications folder from `specs_directory`, falling back to `.github/specs`.
- **FR-005**: The stale core `speckit-taskstoissues` skill MUST be removed and the bundled `github` extension MUST be installed.
- **FR-006**: Every local change to a managed file MUST be either carried forward or listed in the plan with the reason it was dropped.
- **FR-007**: The change MUST NOT alter the constitution, any locked file, or any existing specification.
- **FR-008**: The change MUST add a changelog entry and a catalogue row for this specification.
- **FR-009**: Files that Spec Kit installs and tracks by hash MUST be excluded from Markdown linting, so that a lint fix cannot make them count as locally modified again.

### Key Entities

- **Managed file**: A file Spec Kit installed and tracks by hash in `.specify/integrations/*.manifest.json`.
- **Local change**: A difference between a managed file and the hash recorded for it.
- **Extension**: An optional Spec Kit package installed under `.specify/extensions/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The recorded Spec Kit version is `1.4.4` in all four records named in FR-001.
- **SC-002**: `specify integration status` reports exactly two modified managed files, both listed in the plan, and zero missing files.
- **SC-003**: A dry run of the feature-creation script reports a path under `.github/specs/` and the next number in sequence: 025 before this specification's directory exists, 026 once it does.
- **SC-004**: The required pull request checks pass.
- **SC-005**: No file outside `.specify/`, `.claude/skills/speckit-*`, `.github/specs/025-spec-kit-upgrade/`, `.github/specs/CATALOG.md`, `.markdownlintignore` and `CHANGELOG.md` changes.

## Assumptions

- Claude Code is the only Spec Kit integration this repository needs. No other integration is installed.
- The remaining bundled extensions, the `pipeline` workflow, and `tasks.md` for specifications 016 and 017 are separate follow-up work.
- The ten skill files that the old manifest reported as modified carried no deliberate local edits. Git history shows no commit touching them after the install commit, so they are replaced with the upstream versions.
