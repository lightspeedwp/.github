# Research: Portable Changelog and WordPress Release Preparation Agents

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-10-09

Evidence base: repository at `origin/develop` `65a013b25eb4f81806496965adad8e3f458a34e5`, GitHub issue [#1546](https://github.com/lightspeedwp/.github/issues/1546) and its sub-issue list. Linear was read later in the session (see R-10). Findings are inspected facts at that revision, not permanent guarantees.

## Code audit against the spec

| ID | Finding (develop) | Spec impact |
|----|-------------------|-------------|
| A-1 | `agents/release-agent/includes/repoDetector.cjs` tries `detectControlPlane` first. It returns `control-plane` for any repository that has `.github/`, `VERSION` and `package.json`. | Violates FR-003: an ordinary WordPress repository with those files is misclassified. Detection order and criteria must change. |
| A-2 | `gitOps.cjs` functions default `workDir = process.cwd()`. `release.agent.js` calls `gitOps.stageFiles(versionFiles)` without passing the root (around line 128). | Violates FR-002: the explicit `repoRoot` does not reach every git operation. |
| A-3 | `release.agent.js` validation records an unclean working tree as a warning (around line 230), not a stop. | Violates FR-005: dirty tree must stop. |
| A-4 | `gitOps.cjs` exposes `push`, `createTag`, `deleteTag` and `deleteRemoteTag`; the agent also drives release flow steps. | FR-006 and FR-008: preparation mode must not reach tag, push or remote paths. These need to be unreachable from the preparation entry point, not merely unused. |
| A-5 | `wordpress.agent.js` is ESM (`export function detectWordPressComponent`, `validateVersionConsistency`, `updateAllVersions`, plus `bumpAllVersions`, `getComponentMetadata`); the release agent and the plugin/theme/readme includes are CommonJS. | FR-018: absorbing the utilities needs an explicit interop boundary without a wholesale module-system migration. |
| A-6 | `wordpress-release-utilities-agent/__tests__/integration.test.js.skip` is skipped; unit tests live under `includes/tests/`. | FR-016 and FR-022: failure and partial-write behaviour is untested today; it must be tested, not assumed atomic. |
| A-7 | The shipped changelog engine is an ESM package at `.github/validation/changelog/` with its own `node:test` runner and `bin/validate.js` CLI. The changelog agent has its own CommonJS validator modules in `agents/changelog-agent/includes/`. | FR-010: there are two validation code paths today. The agent must route to the shipped engine and retire or wrap the duplicate, not add a third. |
| A-8 | Callers of the WordPress utilities outside its own package, from a repository search: `.github/dependabot.yml`, audit/baseline JSON, `tests/jest.working-tree-guard.cjs`. | Removal is blocked until each reference is inventoried and migrated (FR-016). |
| A-9 | Root `package.json` has `typecheck`, `test:js` (Jest 30.5.2 via `.jest.config.cjs`) and `test:changelog-validation`. | Confirms Jest-beside-scripts is the in-repo convention and that a typecheck script exists. |

## Decisions

### R-01 Readiness is a distinct read-only operation

- **Decision**: the release agent has a readiness operation that cannot write or invoke git mutations, separate from the approved preparation operation.
- **Rationale**: FR-001 and SC-001 require zero writes in dry run; structural separation is stronger than a flag.
- **Alternatives**: a single function with a dry-run flag (rejected: a missed branch could write).

### R-02 Reuse the in-flight canonical-source migration

- **Decision**: do not duplicate the migration in issue #3880 / PR #3881 (open, head `7e0bcaab55703f0866d1c063c0b6e7530b97b747` at brief time). The release MVP branches from refreshed develop after it merges. A stacked branch is used only if the release MVP imports layout available solely in #3881.
- **Rationale**: avoids two competing definitions of the canonical agent layout.
- **Prerequisite not yet done**: read the actual #3881 diff and checks. This plan makes no claim about its test results.

### R-03 Distinct roles of AGENTS.md and AGENT.md

- **Decision**: keep `AGENTS.md` as working instructions and `AGENT.md` as the agent definition. Do not merge them blindly.
- **Rationale**: `.github/docs/AGENT_FOLDER_STRUCTURE.md` distinguishes them, while #3881 consolidates the definition into `AGENT.md`; both must hold. FR-018.

### R-04 WordPress utilities interop

- **Decision**: provide a thin CommonJS-facing adapter that calls the existing logic, keeping function behaviour and exports (`detectWordPressComponent`, `validateVersionConsistency`, `updateAllVersions`) intact; no ESM-to-CJS rewrite of the logic.
- **Rationale**: preserves tested logic and avoids incidental migration (FR-018). **Alternatives**: convert the utilities to CommonJS (rejected as unrequested migration); keep a separate agent (rejected: FR-016 forbids a second release agent).

### R-05 Changelog validation reuse and portability tension

- **Decision**: the changelog agent invokes the shipped engine for validation and does not add another engine.
- **Unresolved tension**: the engine lives under `.github/`, but FR-019 requires copied adapters to work without a governance checkout. Candidate resolutions: resolve the engine from the target repository if present, else from a pinned bundled copy with recorded source and version. This is a design choice with portability and drift consequences and needs owner confirmation; it is carried into `/speckit-tasks` as a decision task, not assumed.

### R-06 Plugin and theme adapter: one module or two slices (open decision 3)

- **Provisional recommendation**: one coherent adapter module with both acceptance mappings (#1565 plugin, #1566 theme), splitting only if independently reviewable.
- **Status**: provisional; owner confirmation required.

### R-07 Authoritative version source when instructions are silent (open decision 1)

- **Provisional recommendation**: when a target's own instructions do not name an authoritative field, the agent refuses to choose, reports every detected value and source, and stops as ambiguous (FR-004). No default hierarchy is invented.
- **Rationale**: the first draft of the spec invented a hierarchy; the brief says to derive sources from target instructions.
- **Status**: provisional; owner confirmation required.

### R-08 Who stamps the changelog (open decision 2)

- **Provisional recommendation**: only the changelog agent edits `CHANGELOG.md`; the release agent edits version fields only and requests verification through the handoff.
- **Rationale**: keeps the changelog agent standalone and avoids two writers. **Status**: provisional.

### R-09 Handoff mechanism needs no new infrastructure

- **Decision**: the handoff is a structured, versioned document passed between the two agents (see [contracts/verification-handoff.md](./contracts/verification-handoff.md)); it requires no labels, event service or workflow (FR-015, FR-012).
- **Alternatives**: workflow-event based (rejected for MVP; deferred workflows are unbuilt).

### R-10 Linear is the planning system of record

- **Finding**: Linear was unavailable early in the session and was read later the same day. GIT-1293 has 18 children; the three core spec 020 slices (GIT-1310, GIT-1744, GIT-2623) have no parent, and GIT-2617 is under GIT-2614. The full table is in [plan.md](./plan.md).
- **Earlier GitHub-only observation, now explained**: GitHub #1546 lists 16 sub-issues; #1563, #2653, #3880 and #3470 are not among them, matching the Linear hierarchy (GIT-2624 / #3470 is a child of GIT-1293 in Linear but was not in the GitHub list; the mirrors differ).
- **Decision**: Linear is authoritative for status, ownership and sequencing. Tasks reference both identifiers. Reparenting, retitling, relabelling and status changes are proposals in `issue-map.md` with exact previews and need separate approval. No Linear record is changed by spec 020 work.
- **Label caution**: several children carry legacy `migrate:` labels and mismatched types (for example GIT-1303 as `type:bug`); the plan does not rely on Linear labels to infer scope.

### R-11 Spec numbering gap blocks the spec PR check

- **Finding**: `.specify/scripts/bash/audit-specs.sh` fails on gaps; 019 is reserved on an unmerged branch.
- **Decision**: owner-decided. Either merge the 019 spec first, or approve a separate change allowing reserved numbers. Neither is performed by this plan.

### R-13 Approval is a digest of the exact proposed edit

- **Decision** (clarify session 2026-10-09, option A): the agent displays the exact proposed edit and a short digest; the maintainer returns the digest; the agent recomputes it immediately before writing and writes only on a match (FR-029).
- **Rationale**: machine-checkable, bound to one edit, and cannot be reused for a different change or after a hand edit.
- **Alternatives**: an explicit approve flag with no per-edit binding, conversational approval, and a committed approval file were rejected as weaker or heavier.

### R-12 Preparation path forbids remote and tag effects

- **Decision**: tag creation, push, publication and backmerge are outside the executable MVP. They are documented only as the release-process contract (FR-023, FR-024) and require separately approved, target-specific flows. The single-PR versus two-PR contradiction in current release docs is resolved in the DOC slice by stating one invariant (no tag before reviewed changes reach the authoritative main release commit) and allowing target-specific branch flow.

## Open items carried forward

1. Decide whether GIT-1310, GIT-1744 and GIT-2623 should be linked under GIT-1293 (R-10).
2. Read PR #3881 diff and checks (R-02).
3. Owner confirmation of R-05, R-06, R-07, R-08.
4. 019 numbering gap resolution (R-11).
5. Approval decisions on the previews in `issue-map.md` (A1 to A11).
