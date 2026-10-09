---
description: "Task list for spec 020: portable changelog and WordPress release preparation agents"
---

# Tasks: Portable Changelog and WordPress Release Preparation Agents

**Input**: Design documents from `.github/specs/020-portable-changelog-release-agents/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md), [issue-map.md](./issue-map.md), [delivery-plan.md](./delivery-plan.md)

**Tests**: Included. The spec requires them (FR-021, FR-022): Jest beside scripts, Bash/Bats at agent-root `tests/` with fixtures. No new framework, no Python.

**Organization**: Grouped by user story. Delivery order follows the brief: release preparation first (priority 1), changelog second (priority 2), then the blocking handoff that needs both. Delivery priority is not a code dependency; the real dependencies are in [Dependencies](#dependencies-and-execution-order).

**Scope note**: This specification PR is Markdown only. Everything below the Setup decisions describes work for later, separately reviewed implementation PRs (profiles R1, C2, F, DEC, DOC in [delivery-plan.md](./delivery-plan.md)). No task here may be started by the spec PR. Roadmap agents (PRD, linting, PR, reviewer, testing, PageSpeed, design-partner, issue, reporting), provider installation, workflow restoration, rollback and pilots are not tasks; they stay in the delivery plan.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 release readiness, US2 changelog, US3 handoff, US4 packaging, US5 delivery governance
- Paths follow the target layout in [plan.md](./plan.md); T002 confirms them against the in-flight consolidation before any file is moved or created.

## Path Conventions

- Release agent: `agents/release-agent/` (`scripts/`, `scripts/adapters/`, `skills/`, `claude/`, `tests/`)
- Changelog agent: `agents/changelog-agent/` (same shape)
- Shipped validation engine (reused, never forked): `.github/validation/changelog/`
- Jest config: `.jest.config.cjs`; scripts: root `package.json`

---

## Phase 1: Setup and decisions (shared, no story)

**Purpose**: Close the gaps that would otherwise cause rework. No implementation yet.

- [ ] T001 Read the actual diff, checks and reviews of PR [#3881](https://github.com/lightspeedwp/.github/pull/3881) (head `7e0bcaab55703f0866d1c063c0b6e7530b97b747` at last read) and record the cause of its `blocked` state and the canonical layout it introduces in `.github/specs/020-portable-changelog-release-agents/research.md` under R-02. Claim no test results that were not rerun.
- [ ] T002 Reconcile the target layout with T001: confirm exact paths for `AGENT.md`, `scripts/`, `skills/<capability>/SKILL.md` and `claude/` for both agents, keep working-instructions `AGENTS.md` distinct from definition `AGENT.md`, and update the source tree in `.github/specs/020-portable-changelog-release-agents/plan.md` and `.github/specs/020-portable-changelog-release-agents/contracts/agent-package-layout.md`. Depends on T001.
- [ ] T003 Obtain owner confirmation of the provisional decisions R-05 (engine resolution outside a governance checkout), R-06 (one adapter module or two slices), R-07 (no default version-source hierarchy; stop as ambiguous) and R-08 (only the changelog agent edits `CHANGELOG.md`) by running `/speckit-clarify`, then update `.github/specs/020-portable-changelog-release-agents/research.md` and `spec.md` Open Decisions.
- [ ] T004 [P] Inventory every caller, export and test of `agents/wordpress-release-utilities-agent/` (references found: `.github/dependabot.yml`, `tests/jest.working-tree-guard.cjs`, `.github/reports/audit/agent-specs-phase3-validation.json`, `scripts/validation/skills-baseline.json`) and write the inventory table into `.github/specs/020-portable-changelog-release-agents/research.md` finding A-8. No removal is planned from this task.
- [ ] T005 [P] Verify Jest discovery and package commands before any test file moves: run `npx jest --config .jest.config.cjs --listTests` and confirm the new `scripts/__tests__/` and `scripts/adapters/__tests__/` locations for both agents are matched; record the result in `.github/specs/020-portable-changelog-release-agents/research.md` finding A-9. Existing Node-test, PHP and Playwright tests are not converted.
- [ ] T006 Owner decision, not executed by Claude: resolve the 019 numbering gap that fails `.specify/scripts/bash/audit-specs.sh` (merge the reserved 019 Qodo spec first, or approve a separate change allowing reserved numbers) and decide whether `Closes #1555` is acceptable for the "AI Feedback Validation" check on PR [#3883](https://github.com/lightspeedwp/.github/pull/3883). Record the outcome in `.github/specs/020-portable-changelog-release-agents/delivery-plan.md` Blockers.

**Checkpoint**: Paths, decisions and test discovery are confirmed.

---

## Phase 2: Foundational (blocks US1 and US3; US2 needs only T003)

**Purpose**: Shared guarantees every story relies on: explicit root, safe paths, fail-closed results, interop.

- [ ] T007 [P] Write failing Jest tests for explicit repository root propagation (every filesystem and git call uses the supplied `repoRoot`; process working directory deliberately different) in `agents/release-agent/scripts/__tests__/repoRoot.test.cjs`.
- [ ] T008 [P] Write failing Jest tests for path safety (reject `../` escape, absolute paths where relative is required, symlink escape out of `repoRoot`) in `agents/release-agent/scripts/__tests__/pathSafety.test.cjs`.
- [ ] T009 Remove the `process.cwd()` default from every function in `agents/release-agent/includes/gitOps.cjs` (path per T002) so `workDir` is required, and pass `repoRoot` at the call that currently omits it in `agents/release-agent/release.agent.js` (`gitOps.stageFiles(versionFiles)`, finding A-2). Depends on T007.
- [ ] T010 [P] Implement the path-safety validator in `agents/release-agent/scripts/pathSafety.cjs`. Depends on T008.
- [ ] T011 [P] Implement the fail-closed result module in `agents/release-agent/scripts/readiness.cjs` with the blocker codes from `contracts/readiness-report.md` verbatim: `dirty-tree`, `version-drift`, `version-ambiguous`, `unsafe-path`, `missing-check`, `tag-conflict`, `component-unknown`, `changelog-unverified`; `status` is `ready` only when no `blocker` finding exists; `writes` is always `0` for readiness.
- [ ] T012 Implement the ESM-to-CommonJS interop boundary for the WordPress utilities in `agents/release-agent/scripts/adapters/wordpressAdapter.cjs`, calling the existing `detectWordPressComponent`, `validateVersionConsistency` and `updateAllVersions` from `agents/wordpress-release-utilities-agent/wordpress.agent.js` without rewriting their logic or migrating module systems (research R-04, finding A-5). Add `agents/release-agent/scripts/adapters/__tests__/wordpressAdapter.test.cjs`.

**Checkpoint**: Explicit root, safe paths, fail-closed results and interop exist; story work can begin.

---

## Phase 3: User Story 1 - Release readiness validation (Priority: P1)

**Goal**: A maintainer gets a read-only readiness report for a plugin, theme or enhancement target, and only after separate approval can allowlisted, recoverable preparation edits run.

**Independent Test**: Run the readiness operation against the fixtures with the working directory elsewhere; confirm detection, blockers and zero writes ([quickstart.md](./quickstart.md) release scenarios).

### Fixtures and tests for User Story 1

- [ ] T013 [P] [US1] Create fixture repositories under `agents/release-agent/tests/fixtures/`: `plugin/`, `theme/`, `enhancement/`, `ordinary-github-target/` (has `.github/`, `package.json`, `VERSION`), `optional-version/` (no `VERSION`), `ambiguous-headers/`, `drift/`, `repeat-run/`, `invalid-paths/`, `tag-conflict/`. No fake placeholder content beyond what each case needs.
- [ ] T014 [P] [US1] Write failing Jest tests for detection in `agents/release-agent/scripts/__tests__/detect.test.cjs`: plugin, theme, enhancement, no `VERSION`, and the ordinary `.github` target not classified as governance (FR-003).
- [ ] T015 [P] [US1] Write failing Jest tests for version evidence in `agents/release-agent/scripts/__tests__/versionEvidence.test.cjs`: drift reports every differing source and file; ambiguous headers return `version-ambiguous`; no authoritative field designated means stop and report every detected value, never a silent choice (FR-004, R-07).
- [ ] T016 [P] [US1] Write failing Jest tests for blockers in `agents/release-agent/scripts/__tests__/blockers.test.cjs`: `dirty-tree`, `unsafe-path`, `tag-conflict`, `missing-check`, and that no staging, stashing, tagging, push or remote call occurs on any blocker (FR-005, FR-006).
- [ ] T017 [P] [US1] Write failing Jest tests for dry run in `agents/release-agent/scripts/__tests__/dryRun.test.cjs`: filesystem hash and git state identical before and after, `writes` equals `0`, and the working directory differs from `repoRoot` (FR-001, FR-002, SC-001, SC-002).
- [ ] T018 [P] [US1] Write failing Jest tests for preparation edits in `agents/release-agent/scripts/__tests__/prepareEdit.test.cjs`: edits run only with a matching approval digest (FR-029) and only on allowlisted version-field paths; a mismatching or missing digest writes nothing (SC-011), a part-way failure restores the repository, and a failed edit is never reported ready (FR-007, SC-004). Include the existing `updateAllVersions` partial-write behaviour (finding A-6); atomicity is tested, not assumed.
- [ ] T019 [P] [US1] Write Bats cases in `agents/release-agent/tests/release-readiness.bats` that run the agent entry point from a different working directory against each fixture and assert exit status and zero writes.

### Implementation for User Story 1

- [ ] T020 [US1] Fix detection order and criteria in `agents/release-agent/includes/repoDetector.cjs` (path per T002): remove the control-plane-first classification (finding A-1) so an ordinary WordPress repository with `.github/`, `package.json` and `VERSION` is not misidentified, and never require `VERSION`. Depends on T014.
- [ ] T021 [US1] Implement version-evidence discovery in `agents/release-agent/scripts/versionEvidence.cjs`: read the target's own instructions for designated authoritative fields, list every detected source with kind, repository-relative path, value and authoritative flag (data-model `Version source`), and return `ambiguous` or `drift` rather than choosing. Depends on T012, T015.
- [ ] T022 [US1] Turn a dirty working tree into a blocking `dirty-tree` result in `agents/release-agent/release.agent.js` (it is currently only a warning, finding A-3), and add read-only tag-conflict detection (local and remote evidence compared without fetching or pushing). Depends on T009, T011, T016.
- [ ] T023 [US1] Implement the separate read-only readiness operation in `agents/release-agent/scripts/readiness.operation.cjs` (research R-01) so that it cannot import or call any git mutation, and make `tag`, `push`, `deleteTag`, `deleteRemoteTag` and publish functions unreachable from the preparation entry point (FR-006, FR-008, finding A-4). Depends on T017, T020, T021, T022.
- [ ] T024 [US1] Implement the approved preparation operation in `agents/release-agent/scripts/prepare.operation.cjs`: allowlisted version-field paths only, approval digest required and rechecked immediately before writing (FR-029), backup captured before edit, recovery on failure, meaningful errors, no broad staging. Depends on T018, T023.
- [ ] T025 [US1] Emit the readiness report defined in `.github/specs/020-portable-changelog-release-agents/contracts/readiness-report.md` (fields `status`, `repoRoot`, `componentType`, `versionSources[]`, `findings[]`, `writes`) from `agents/release-agent/scripts/readiness.operation.cjs`. Depends on T023.
- [ ] T026 [US1] Make the release-agent Bats and Jest suites pass and record results in the R1 PR body; do not claim `ready` acceptance for the full flow until US3 (T044) has changelog evidence. Depends on T019, T024, T025.

**Checkpoint**: Release readiness works standalone, read-only by default, and fails closed.

---

## Phase 4: User Story 2 - Standalone changelog preparation (Priority: P2)

**Goal**: A maintainer inspects, drafts, validates and prepares release entries without any release workflow, and applies only separately approved bounded edits.

**Independent Test**: Run the agent against well-formed, malformed, repeated and empty-Unreleased fixtures in inspect and draft modes, then apply one approved edit ([quickstart.md](./quickstart.md) changelog scenarios).

### Tests for User Story 2

- [ ] T027 [P] [US2] Create changelog fixtures under `agents/changelog-agent/tests/fixtures/`: `valid-unreleased/`, `invalid-category/`, `empty-unreleased/`, `already-released/`, `hand-edited-between-draft-and-apply/`, `long-entry/`, `no-workflows/` (no `changelog.yml` or `release.yml`).
- [ ] T028 [P] [US2] Write failing Jest tests in `agents/changelog-agent/scripts/__tests__/draft.test.cjs`: drafting changes no file; an entry in a category outside "Added, Changed, Deprecated, Removed, Fixed, Security" is reported with those six allowed categories listed; entries are checked against the repository's length rule ("entries ≤250 characters", constitution principle IX) and link rule (FR-009, FR-011).
- [ ] T029 [P] [US2] Write failing Jest tests in `agents/changelog-agent/scripts/__tests__/apply.test.cjs`: apply requires a matching approval digest (FR-029) and writes nothing on mismatch (SC-011); historic sections and links are byte-identical after apply; a second run with no new entries changes nothing; a hand edit between draft and apply is detected and refused (SC-006, SC-007).
- [ ] T030 [P] [US2] Write failing Jest tests in `agents/changelog-agent/scripts/__tests__/engineReuse.test.cjs` asserting validation delegates to the shipped engine in `.github/validation/changelog/` and that no second validation implementation is reachable (FR-010).
- [ ] T031 [P] [US2] Write Bats cases in `agents/changelog-agent/tests/changelog-standalone.bats` that run with neither `.github/workflows/changelog.yml` nor `.github/workflows/release.yml` present (FR-012, SC-006).

### Implementation for User Story 2

- [ ] T032 [US2] Read issue [#2653](https://github.com/lightspeedwp/.github/issues/2653) body and comments and list the five-operation shared-skill obligations it carries, then record them as the acceptance list in `.github/specs/020-portable-changelog-release-agents/issue-map.md` (FR-013). Not inferred from the title.
- [ ] T033 [US2] Implement the engine-resolution decision confirmed in T003 in `agents/changelog-agent/scripts/engineResolver.cjs`: how a copied package finds the shipped engine without a governance checkout, with recorded engine identity and version, and a clear error when it cannot be found. Depends on T003, T030.
- [ ] T034 [US2] Replace or wrap the duplicate validator modules in `agents/changelog-agent/includes/` (finding A-7) so validation goes through the shipped engine; remove nothing until its callers are inventoried. Depends on T033.
- [ ] T035 [US2] Implement the inspect, draft and validate operations in `agents/changelog-agent/scripts/changelog.operations.cjs` with the six allowed categories, historic preservation and idempotent Unreleased handling (FR-011). Depends on T028, T034.
- [ ] T036 [US2] Implement the approved bounded apply operation in `agents/changelog-agent/scripts/apply.operation.cjs`: move Unreleased entries into a versioned section only, keep historic entries and links byte-identical, refuse if the file changed since the draft (research R-08: only this agent edits `CHANGELOG.md`). Depends on T029, T035.
- [ ] T037 [US2] Implement the read-only verification operation in `agents/changelog-agent/scripts/verify.operation.cjs` that returns validation outcome, categories found, Unreleased entry count and the engine identity and version used, and changes no file. Depends on T035.
- [ ] T038 [US2] Make the changelog Jest and Bats suites pass and record results in the C2 PR body. Depends on T027, T031, T036, T037.

**Checkpoint**: The changelog agent works standalone with no unbuilt workflows.

---

## Phase 5: User Story 3 - Blocking release-to-changelog handoff (Priority: P1)

**Goal**: The release agent reports ready only on recorded changelog verification success; every other outcome fails closed.

**Independent Test**: Simulate verified, failed, missing, malformed and unavailable responses and confirm only `verified` with evidence yields ready ([quickstart.md](./quickstart.md) handoff scenarios).

**Depends on**: US1 (T026) and US2 (T038). This is why the release PR's final ready state is blocked on changelog evidence even though release is delivery priority 1.

### Tests for User Story 3

- [ ] T039 [P] [US3] Write failing Jest tests in `agents/release-agent/scripts/__tests__/handoff.test.cjs` for the request and response in `.github/specs/020-portable-changelog-release-agents/contracts/verification-handoff.md`: `verified` with evidence allows ready; `failed`, no response, malformed response and unavailable responder each yield `not-ready` with `changelog-unverified`; no silent fallback or skipped gate (FR-014, SC-005).
- [ ] T040 [P] [US3] Write failing Jest tests in `agents/changelog-agent/scripts/__tests__/handoffResponder.test.cjs`: the responder refuses a request whose `readiness.status` is not `ready` or whose required fields are missing and replies `failed` with a reason; `evidence` is required when `verified`.

### Implementation for User Story 3

- [ ] T041 [US3] Implement the verification request builder in `agents/release-agent/scripts/handoff.request.cjs` carrying `contractVersion`, `repoRoot`, `targetVersion`, `readiness` and `changelogPath`. Depends on T025, T039.
- [ ] T042 [US3] Implement the handback evaluation in `agents/release-agent/scripts/handoff.evaluate.cjs` that maps every response state to a readiness outcome and sets the `changelog-unverified` blocker on anything other than `verified` with evidence. Depends on T041.
- [ ] T043 [US3] Implement the responder in `agents/changelog-agent/scripts/handoff.responder.cjs` using the verification operation from T037. Depends on T037, T040.
- [ ] T044 [US3] Wire the final ready decision in `agents/release-agent/scripts/readiness.operation.cjs` so ready requires recorded verification success, and confirm the handoff needs no new labels, event services, `changelog.yml` or `release.yml` (FR-015). Depends on T042, T043.
- [ ] T045 [US3] If the integration does not fit either independent slice, prepare the exact follow-on integration PR preview from `.github/specs/020-portable-changelog-release-agents/delivery-plan.md` (branch `aiops/release-agent-changelog-handoff`, base `develop`, `pr_aiops.md`, label set A) for approval. Do not create it automatically.

**Checkpoint**: Release plus changelog works end to end with a blocking, fail-closed gate.

---

## Phase 6: User Story 4 - Portable, self-contained packaging (Priority: P2)

**Goal**: Each agent is a coherent package that works when copied outside the governance checkout.

**Independent Test**: Place both packages in a clean location with no `~/.github` checkout and confirm they resolve all resources and run.

### Tests for User Story 4

- [ ] T046 [P] [US4] Write a Bats test in `agents/release-agent/tests/portable-install.bats` that copies the package to a temporary directory with no governance checkout on the path and runs readiness against a fixture.
- [ ] T047 [P] [US4] Write the same clean-location Bats test in `agents/changelog-agent/tests/portable-install.bats`, including the engine resolution from T033.

### Implementation for User Story 4

- [ ] T048 [US4] Write one canonical `agents/release-agent/AGENT.md`, `README.md` and agent `CHANGELOG.md` (safety defaults, dry run, approval boundaries, portability notes) per `contracts/agent-package-layout.md`, preserving the AGENTS.md versus AGENT.md roles (FR-017, FR-018). Depends on T002, T026. The README states that no Gemini, OpenAI or Copilot compatibility is claimed (FR-020).
- [ ] T049 [US4] Write one canonical `agents/changelog-agent/AGENT.md`, `README.md` and agent `CHANGELOG.md`, preserving the existing five-operation shared-skill obligations (T032). Depends on T002, T038. The README states that no Gemini, OpenAI or Copilot compatibility is claimed (FR-020).
- [ ] T050 [P] [US4] Create namespaced `agents/release-agent/skills/<capability>/SKILL.md` files only for real capabilities (readiness, preparation) and validate with `scripts/validation/validate-skills.js`; create no empty placeholders.
- [ ] T051 [P] [US4] Create namespaced `agents/changelog-agent/skills/<capability>/SKILL.md` files only for real capabilities (inspect, draft, validate, prepare, apply) and validate with `scripts/validation/validate-skills.js`.
- [ ] T052 [US4] Add the small Claude adapters in `agents/release-agent/claude/` and `agents/changelog-agent/claude/` that resolve resources outside any governance checkout, and run `scripts/agents/generate-agent-defs.cjs` and `.github/scripts/generate-agent-index.js` to refresh generated definitions. Thin relative references alone are not accepted as proof of portability. Depends on T046, T047, T048, T049.
- [ ] T053 [US4] Migrate each caller found in T004 to the release adapter, then remove or archive `agents/wordpress-release-utilities-agent/` only after every reference, export and test is migrated; skip removal and record the reason if any remains (FR-016). Depends on T004, T012, T026.
- [ ] T054 [US4] Validate frontmatter and package manifests: `npm run validate:frontmatter`, `npm run lint:pkg-json`, and confirm no `references` frontmatter field is used. Depends on T048, T049, T050, T051.

**Checkpoint**: Both agents install and run outside the governance checkout.

---

## Phase 7: User Story 5 - Verified delivery plan and governance (Priority: P3)

**Goal**: Existing issues are reused, nothing changes without approval, and PRs follow verified profiles.

**Independent Test**: Review `issue-map.md` and `delivery-plan.md` against live Linear and GitHub records: every entry has a URL, current state, proposed change and approval preview, and no fabricated numbers.

- [ ] T055 [US5] Re-read the live GitHub and Linear records listed in `.github/specs/020-portable-changelog-release-agents/issue-map.md` immediately before any proposal is acted on and update the table where a record changed; keep unread items marked UNREAD.
- [ ] T056 [US5] Present the approval preview A1 to A11 in `.github/specs/020-portable-changelog-release-agents/issue-map.md` to the owner and apply only the ones explicitly approved, one at a time, with the exact target, title, body, native type and label. Nothing is applied by default; specification approval does not imply this approval.
- [ ] T057 [US5] Decide whether GIT-1310, GIT-1744 and GIT-2623 are linked under GIT-1293 and record the decision in `.github/specs/020-portable-changelog-release-agents/issue-map.md` (A9). No automatic reparenting.
- [ ] T058 [US5] Resolve the overlap between Linear LS-4233 and GIT-2306 for GitHub [#3468](https://github.com/lightspeedwp/.github/issues/3468) and record the disposition in `.github/specs/020-portable-changelog-release-agents/issue-map.md` (A11).
- [ ] T059 [P] [US5] Prepare each implementation PR body from the live template for its branch type (`.github/PULL_REQUEST_TEMPLATE/pr_aiops.md` for R1 and C2, `pr_docs.md` for DEC and DOC), omitting frontmatter, using full issue URLs, `Closes` only for fully delivered scope, and exactly one changelog disposition. Surface the legacy-label conflict for maintainer resolution; edit no locked file.
- [ ] T060 [P] [US5] Record in `.github/specs/020-portable-changelog-release-agents/delivery-plan.md` the final ready-state rule for R1: it is not marked ready until C2 evidence from US3 exists.

**Checkpoint**: Delivery is governed, traceable and approval-gated.

---

## Phase 8: Polish and cross-cutting

- [ ] T061 [P] Make minimal code-adjacent README and runbook updates for changed behaviour only (`agents/release-agent/README.md`, `agents/changelog-agent/README.md`); broad documentation moves wait for the DOC slice.
- [ ] T062 Run the repository checks before each implementation PR: `npm test`, `npm run lint:js`, `npm run lint:md`, `npm run typecheck`, `npm run validate:branch-name -- --current`; fix only what the change caused.
- [ ] T063 [P] Add the agent `CHANGELOG.md` entries for user-visible changes, within the repository length rule and linked to the PR or issue, and validate them with the shipped engine.
- [ ] T064 Run `/speckit-analyze` for a consistency and coverage report across `spec.md`, `plan.md` and this file, and request approval before any remediation beyond the permitted spec artefacts.
- [ ] T065 Run the [quickstart.md](./quickstart.md) scenarios end to end against the fixtures and record actual results only; claim no result that was not observed.
- [ ] T066 Verify that `git diff --name-only origin/develop` lists no locked governance file (`.github/labels.yml`, `.github/issue-types.yml`, issue and PR templates, `.github/branch-types.yml`), no package manifest, no root `VERSION` and no root `CHANGELOG.md` for each implementation PR (SC-010).

---

## Dependencies and execution order

### Phase dependencies

- **Phase 1** has no dependency; T001 then T002 are sequential, T003, T004, T005 are independent, T006 is an owner decision.
- **Phase 2** depends on T002 (paths), on T003 (open decisions confirmed) and on the reviewer pass of both checklists (constitution Principle VII). It blocks US1 and US3; US2 needs only T003.
- **US1 (Phase 3)** depends on Phase 2. **US2 (Phase 4)** depends on Phase 1 (T003 for engine resolution) and not on Phase 2, so US1 and US2 can proceed in parallel as sibling PRs if files and contracts permit.
- **US3 (Phase 5)** depends on US1 (T026) and US2 (T038). This is the real dependency behind "release first, changelog second, no false ready acceptance".
- **US4 (Phase 6)** depends on US1, US2 and T002; T053 also depends on T004.
- **US5 (Phase 7)** is governance and can start once Phase 1 decisions exist; it never gates code.
- **Polish (Phase 8)** depends on the stories being delivered.

### Within a story

Fixtures, then failing tests, then implementation, then integration. A failing test must exist before the code it covers.

### Parallel opportunities

- Phase 1: T004 and T005.
- Phase 2: T007, T008, T011 together; then T009, T010 and T012.
- US1: T013 to T019 are different files and can be written together.
- US2: T027 to T031 together.
- US3: T039 and T040 together.
- US4: T046, T047, T050 and T051 together.
- US5: T059 and T060 together.

### Parallel example: User Story 1 tests

```text
T013 fixtures        agents/release-agent/tests/fixtures/
T014 detect tests    agents/release-agent/scripts/__tests__/detect.test.cjs
T015 version tests   agents/release-agent/scripts/__tests__/versionEvidence.test.cjs
T016 blocker tests   agents/release-agent/scripts/__tests__/blockers.test.cjs
T017 dry-run tests   agents/release-agent/scripts/__tests__/dryRun.test.cjs
```

## Implementation strategy

### MVP first

1. Phase 1 and Phase 2 (decisions, explicit root, fail-closed core).
2. US1 alone is a viable, safe first value: a read-only readiness report that cannot write. It fails closed on the changelog gate until US3.
3. US2 delivers the standalone changelog agent.
4. US3 joins them with the blocking handoff; only then may the release agent report ready.
5. US4 packaging, then US5 governance and documentation slices.

### Incremental delivery

Delivery follows [delivery-plan.md](./delivery-plan.md): S, then F, then R1 and C2 as siblings from refreshed `develop` (stack on #3881 only if R1 needs layout available solely there), then the optional integration PR, then DEC, DOC, SETUP, with DIST, WFLOW and ROLLBACK deferred.

## Traceability

| Story | Requirements | Tasks |
|-------|--------------|-------|
| US1 | FR-001 to FR-008, FR-016, FR-022 | T007 to T026 |
| US2 | FR-009 to FR-013, FR-021, FR-022 | T027 to T038 |
| US3 | FR-014, FR-015 | T039 to T045 |
| US4 | FR-016 to FR-020 | T046 to T054 |
| US5 | FR-025 to FR-027 | T055 to T060 |
| Release-process contract (FR-023, FR-024) | Stated in the spec section "Release Process Contract"; the DOC slice finalises wording in release documentation | none |
| Install behaviour (FR-028) | Roadmap, owned by the setup and distribution slices | none |

## Notes

- Mark a task complete only when its stated check passes; record only observed results.
- Do not start any implementation task from the specification PR.
- Commit and PR actions need explicit approval; record changes, tags, releases and deployments are never implied by task completion.
