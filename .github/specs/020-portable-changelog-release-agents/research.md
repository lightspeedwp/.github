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

### R-05 Changelog validation reuse and portability

- **Decision** (clarify session 2026-10-09, option B): the changelog agent validates with the shipped engine and does not add another. A copied agent package carries a bundled copy of that engine pinned to a recorded version and source commit, and reports the engine version in every result.
- **Rationale**: predictable and portable with no governance checkout. A version-pinned copy of the same engine is not a second engine, because it is produced by a refresh script from `.github/validation/changelog/` and checked against its pin.
- **Consequences**: drift is handled by the pin and a test that fails when the bundled copy differs from it; upgrades are an explicit refresh. Results always name the engine version (FR-010, SC-012).
- **Alternatives rejected**: preferring the target repository's own copy (versions vary), requiring a governance checkout (breaks portability), and refusing until installed separately (poor first-run experience).

### R-06 Plugin and theme adapter ships as one module

- **Decision** (clarify session 2026-10-10, option A): one coherent adapter module in a single pull request, covering plugin and theme, with both acceptance mappings (#1565 plugin, #1566 theme).
- **Rationale**: both adapters share the same detection and version-field logic, so one module avoids two reviews of overlapping code.
- **Alternatives**: two separate slices, and one module reviewed in two stages inside one pull request, were rejected as unnecessary for the MVP.

### R-07 Authoritative version source when instructions are silent

- **Decision** (clarify session 2026-10-10, option A): when a target's own instructions do not name an authoritative field, the agent refuses to choose, reports every detected value and source, and stops as ambiguous (FR-004). No default hierarchy exists, and the allowed edit set is empty in that case.
- **Rationale**: a wrong guess could stamp the wrong version into a release; the brief says to derive sources from the target's own instructions and fail closed.
- **Alternatives**: a fixed built-in order of preference, and "use the only source if exactly one exists", were rejected as guessing.

### R-08 Who stamps the changelog

- **Decision** (clarify session 2026-10-10, option A): only the changelog agent edits `CHANGELOG.md`; the release agent edits version fields only and requests verification through the handoff.
- **Rationale**: one writer for one file keeps the changelog agent standalone and keeps the release agent's edit allowlist limited to version fields, so a half-updated changelog cannot come from two writers.
- **Alternatives**: letting the release agent stamp the changelog, and having it ask the changelog agent to apply a stamp during the handoff, were rejected as widening the release agent's write scope.

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
- **Decision (2026-10-10)**: the maintainer decided this specification keeps number 020 and does not take 019, so renumbering is not an option. The failing audit is therefore cleared only by the maintainer either merging the 019 Qodo spec first or approving a separate change that lets the audit script accept reserved numbers. Neither is performed by this plan, and the choice between them is still open.

### R-13 Approval is a digest of the exact proposed edit

- **Decision** (clarify session 2026-10-09, option A): the agent displays the exact proposed edit and a short digest; the maintainer returns the digest; the agent recomputes it immediately before writing and writes only on a match (FR-029).
- **Rationale**: machine-checkable, bound to one edit, and cannot be reused for a different change or after a hand edit.
- **Alternatives**: an explicit approve flag with no per-edit binding, conversational approval, and a committed approval file were rejected as weaker or heavier.

### R-14 A missing handoff response is defined by the invocation, not a timer

- **Decision** (clarify session 2026-10-09, option A): a verification response not returned within the same invocation counts as not received, and the release agent reports not ready with `changelog-unverified`.
- **Rationale**: the agents are manually invoked, so there is no background wait to time out; the rule is simple and testable.
- **Alternatives**: a configurable timeout and a per-run maintainer decision were rejected as unnecessary for the MVP.

### R-15 Required checks come from the target, and none named means not ready

- **Decision** (clarify session 2026-10-09, option A): required checks are those named in the target repository's own instructions or CI configuration; if none are named, readiness is not ready with `missing-check`.
- **Rationale**: stays fail-closed without imposing one check list on every repository, consistent with deriving version sources from the target's own instructions (R-07).
- **Alternatives**: treating "none named" as a note, and a fixed built-in set, were rejected as weaker or too prescriptive.

### R-16 Enhancements are recognised only from the target's own declaration

- **Decision** (clarify session 2026-10-09, option C): an enhancement is recognised only when the target's own instructions declare it and name its version fields; otherwise the agent stops as `component-unknown`.
- **Rationale**: no verified sample of enhancement packaging exists and access to one pilot repository was previously denied, so the agent does not guess; consistent with R-07 and R-15.
- **Alternatives**: treating an enhancement as a plugin by header, and detecting only plugins and themes in the MVP, were rejected as guessing or as dropping a stated target.

### R-12 Preparation path forbids remote and tag effects

- **Decision**: tag creation, push, publication and backmerge are outside the executable MVP. They are documented only as the release-process contract (FR-023, FR-024) and require separately approved, target-specific flows. The single-PR versus two-PR contradiction in current release docs is resolved in the DOC slice by stating one invariant (no tag before reviewed changes reach the authoritative main release commit) and allowing target-specific branch flow.

## Open items carried forward

1. Decide whether GIT-1310, GIT-1744 and GIT-2623 should be linked under GIT-1293 (R-10).
2. Read PR #3881 diff and checks (R-02).
3. 019 numbering gap resolution (R-11).
4. Decisions A9 and A11 in `issue-map.md` (A1 to A8 and A10 were applied or needed no change on 2026-10-10).
