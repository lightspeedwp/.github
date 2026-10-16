# Implementation Plan: Standardised Claude Code Cloud Environment

**Branch**: `docs/cloud-env-org-rollout` (draft PR lightspeedwp/.github#3878, the organisation-wide rollout increment). Earlier: lightspeedwp/.github#3524
(merged 2026-09-30) and lightspeedwp/.github#3726 (merged 2026-10-05) | **Date**: 2026-10-12 (first drafted 2026-09-24) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/018-claude-cloud-environment/spec.md`

## Summary

Cloud sessions start on a platform-generated `claude/*` branch, and the platform tells the agent to push there.
This plan enforces the LightSpeed branching strategy with four repository-level controls:

1. **SessionStart hook**: renames the branch locally, syncs it with `develop`, installs dependencies and injects
   the branching rules.
2. **PreToolUse guard**: blocks non-compliant commits, pushes, branches and PRs. It reuses the CI validator and
   allows the documentation exception on `develop` (never on `main`).
3. **Shared cloud environment definition**: a setup script and variables, versioned in `.claude/cloud/`.
4. **Cleanup of empty `claude/*` branches**: deferred under FR-020. Spec 009's categoriser
   (lightspeedwp/.github#3358) auto-approves nothing until its three prerequisites exist (branch-age storage, branch-origin verification and a delivered deletion workflow; `branch-audit.yml` is absent). Until then a maintainer
   can promote an empty, merged `claude/*` branch with no open PR from DISCUSS to DELETE, and it is removed
   through 009's draft-PR approval. There is no separate job.

Most of this already exists in #3524. The second clarification session added the legacy PR exception (superseded on 2026-10-15),
no-rename for `claude/*` branches that already have commits, fail-closed handling of guard faults while enforcing, and
self-protection with CODEOWNERS review (research R9 to R12). The third session set the threat model (accidents plus the obvious self-bypasses) and
named the validator authority (research R13). The rest of the work is the documentation exception (Q1), the spec 009 amendment
for cleanup (Q4, revised after `/speckit-analyze`), automated tests and documentation updates.

**Update, 2026-10-02**: #3524 merged on 2026-09-30, and this plan now tracks the follow-up work in #3726. The
2026-10-01 and 2026-10-02 clarification sessions added:

- the launcher's fault split when the guard can't start (R15)
- the cleanup deferral in both specs, and the DISCUSS promotion route (R16)
- the refusal to delete `main` or the base branch
- the `main` rule on every LightSpeed repository
- the hotfix naming decision (R17)

The guard changes that follow from these (T049, T052, T054, T055) need a session started with
`LS_ENFORCE_BRANCH_NAMES=0`, because the guard protects its own files.

**Update, 2026-10-09 (organisation-wide rollout)**: US1 and US3 are on `develop`. The goal now is that team members
get the same cloud environment automatically, and that it's saved as the organisation's shared configuration. See
[Increment: organisation-wide rollout](#increment-organisation-wide-rollout-2026-10-09) and research R18 to R22.

**Update, 2026-10-12 (spec amended)**: the rollout proposals are now requirements in `spec.md`: FR-024, FR-025,
FR-026 and SC-010, plus the revised US2 scenario 1 and an extended FR-019 (clarification session 2026-10-12). The
same session settled four points:

- A newly onboarded member's Default environment is treated as a saved selection until quickstart §6 shows
  otherwise (R19), so new members select **LightSpeed** once.
- Spec 009's daily auto-delete step (task T034) is out of scope for this spec. It stays with spec 009 and stays
  deferred under FR-020.
- GIT-2581, GIT-2571 and #3727 (GIT-2514) need no further spec work. Their changes merged in #3813 and #3726.
- The spec's **Status** stays `Draft` until all spec 018 work and every related Linear issue is complete. The owner
  then moves it to Ready for Review.

## Technical Context

**Language/Version**: Bash (hooks, setup script); Node.js ≥18 ES modules (guard, cleanup script). CI uses Node 24
per `.nvmrc`.

**Primary Dependencies**:

- `lib/validate-branch-name.js` (existing)
- `jq`, `git`
- `gh` (hook sessions and Actions runner, for the open-PR check of the delivered guard only; the specification no longer needs it for writes; cloud sessions authenticate through the GitHub
  proxy, while local sessions require an authenticated `gh` login)
- GitHub Actions pinned by SHA

**Storage**: N/A (no persistent data; reports are written to `.github/reports/` by the existing script)

**Testing**:

- Jest (`.jest.config.cjs`), black-box tests that spawn the hook with JSON on stdin
- CI gate (FR-023): `.github/workflows/claude-guard-tests.yml` runs the guard, SessionStart, setup Node install
  and docs contract tests on every PR into `develop` or `main`, exiting early when nothing guard-related changed; branch protection
  requires it (T048)
- shellcheck
- actionlint
- existing `scripts/validation/__tests__/cleanup-branches.test.js` extended

**Target Platform**:

- Claude Code sessions: the Anthropic cloud VM (Ubuntu 24.04) and developers' local machines
- GitHub Actions `ubuntu-latest`

**Project Type**: Repository governance tooling (hooks, a CLI script, a workflow)

**Performance Goals**:

- Guard adds 150 ms or less per matched tool call. The legacy PR check (up to 10 s) runs only when a write would
  otherwise be refused. (Superseded on 2026-10-15: the check is removed from the specification; the delivered guard still has it.)
- SessionStart adds 30 s or less when dependencies are current (SC-005).
- The setup script finishes in under 5 minutes (it measured about 22 s).

**Constraints**:

- Hooks must never break a session: malformed input is allowed, and the SessionStart exit code is always 0.
- The setup script must exit 0.
- No secrets in environment variables.
- No refusal telemetry (Q5).

**Scale/Scope**: One repository, a team of about 10 people, and about 38 branch types. The cleanup handles tens
of branches a day.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
| --- | --- | --- |
| I. Org-wide governance authority | Changes live in the control-plane repo and implement the org branching strategy | ✅ |
| II. Locked configuration | Doesn't touch `labels.yml`, `issue-types.yml` or the issue/PR templates | ✅ |
| III. Clear boundaries, no duplication | Reuses `lib/validate-branch-name.js` and spec 009's categoriser and workflow (no second cleanup job). #3358 should also import `lib/validate-branch-name.js` instead of its own copy (analysis finding F5). Hooks stay in `.claude/`, which is repository configuration, not a portable asset. Portability is a follow-up spec (Q3) | ✅ |
| IV. Technology-agnostic guidance | No change to guidance content | ✅ N/A |
| V. Branch naming non-negotiable | The specification conforms: the legacy PR write exception was removed on 2026-10-15, so writes to a forbidden or invalid name are refused even for an open-PR head. **Implementation compliance is open**: the delivered guard and the session-start text still implement the exception until a separate follow-up change | ✅ spec, ⚠️ implementation |
| VI. UK English, security | UK English in docs and messages. No secrets. While enforcing, the guard fails closed on unknown file sets, unverifiable legacy PRs (delivered guard only; removed from the specification on 2026-10-15) and its own faults (for git writes). With enforcement off, guard faults warn and allow the writes (FR-013). It protects its own files and every settings file that can disable hooks. The switch can't be changed from inside a session. CODEOWNERS covers `.claude/`. The threat model is written down (R13). The workflow has least-privilege permissions and pinned actions | ✅ |
| VII. Spec quality | Requirements checklist 16/16 and security checklist 32/32. Clarified in recorded sessions on 2026-09-24 (two sessions), 2026-10-01 (5 questions), 2026-10-02 (2 questions) and 2026-10-12 (4 questions, plus the rollout requirements FR-024 to FR-026 and SC-010). FR-013a protected paths (five files) resolved. The requirements checklist is re-validated after the amendment. The 2026-10-15 reconciliation (GIT-2741) does not re-tick any reviewer-owned marker, so the requirements and security reviews stay open until separately scoped checks run | ✅ (reviews open) |
| VIII. Enforcement and compliance ≥95% | The guard blocks before push. While automatic cleanup is deferred (FR-020), only empty, merged `claude/*` branches with no open PR are removed, through maintainer-approved draft PRs; branches with open PRs are kept. Specification alignment ✅; implementation ⚠️ until the guard stops allowing the superseded legacy exception | ✅ spec, ⚠️ implementation |
| IX. Changelog compliance | Each implementation PR adds an entry of 250 characters or less linked to its PR | ✅ |
| X. Metrics-driven | Automated validation runs on every PR (FR-023). Success is measured through the existing branch-validation metrics. SC-007 is a documented manual review, the only manual check, justified by Q5 (see Complexity Tracking). The rollout increment adds automated drift detection: a CI revision-stamp test (FR-025) and session-start checks (FR-024, FR-025, R21), with SC-010 measured in the same transcript review as SC-007 | ✅ (justified) |

**Documentation exception vs `CLAUDE.md` ("never commit feature work directly to `main`")**: the exception covers
only `.github/specs/**` and `docs/**`, which aren't feature work. GitHub branch protection still applies to the
push. No violation.

**Post-design re-check (after Phase 1)**: the contracts and data model add no new dependencies, storage or locked
files. All gates still pass.

## Project Structure

### Documentation (this feature)

```text
.github/specs/018-claude-cloud-environment/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── hooks.md         # SessionStart + PreToolUse contract
│   ├── branch-cleanup.md
│   └── cloud-environment.md   # revision stamp, SessionStart drift check, Owner change procedure (FR-024, FR-025)
├── checklists/
│   ├── requirements.md  # spec quality (16/16)
│   └── security.md      # guard and security review (32/32)
└── tasks.md             # Phase 2 (/speckit-tasks); Phase 12 is the rollout work
```

### Source Code (repository root)

```text
.claude/
├── settings.json                  # registers SessionStart + PreToolUse; matcher extended to Edit/Write/MultiEdit/NotebookEdit
├── cloud/
│   ├── setup.sh                   # environment setup script (exists)
│   ├── environment.env            # environment variables (exists); gains LS_CLOUD_ENV and LS_CLOUD_ENV_REVISION (FR-025)
│   └── revision.sh                # planned: prints the revision stamp, shared by CI and session start (FR-025)
└── hooks/
    ├── session-start.sh           # rename only fresh claude/* branches; reset only a placeholder it renamed (FR-002); rules text
    │                              #   (still names the superseded legacy PR exception until the follow-up change)
    └── enforce-branch-name.mjs    # documentation exception (R4), legacy PR exception over REST (R9, superseded
                                   #   2026-10-15 but still delivered), fault
                                   #   handling (R11), self-protection incl. managed settings (R12), gh CLI,
                                   #   names-only rules and direct-main-write refusal on other lightspeedwp repositories;
                                   #   base-branch, documentation-exception and PR-to-main rules on this repository only
                                   #   (FR-009 scope)

.github/workflows/
└── claude-guard-tests.yml         # FR-023 CI gate for the contract tests

scripts/
└── __tests__/
    ├── enforce-branch-name-hook.test.js   # black-box guard contract tests
    ├── session-start-hook.test.js         # black-box SessionStart contract tests (incl. SC-005 timing)
    └── helpers/claude-hook-harness.js     # temp repo + bare origin, gh/npm/git ls-remote stubs

tests/js/
└── claude-cloud-environment-docs.test.js  # spec/plan/tasks/contract consistency checks

# Delivered with spec 009 / #3358, merged 2026-10-05 (FR-020 deferral, T053):
scripts/lib/branch-categorization.js       # no auto-approval rule while deferred: claude/* → DISCUSS
scripts/lib/__tests__/branch-categorization.test.js   # deferral cases (any tip age → DISCUSS)
scripts/validation/__tests__/cleanup-branches-cli.test.js   # CLI with git, gh and fs mocked; no claude/* auto-approval
.github/specs/009-audit-branch-cleanup/    # amendment recording the deferral (clarification, FR-010, US3, SC-007)
# After the deferral is lifted (branch-age signal decided and built):
scripts/lib/constants.js                   # AUTO_DELETE_PREFIXES, AUTO_DELETE_MIN_AGE_DAYS, reason code
.github/workflows/<009 cleanup workflow>   # auto-delete step with re-verification

docs/
└── CLAUDE_CLOUD_ENVIRONMENT.md    # update: documentation exception, cleanup, local enforcement, measurement

CODEOWNERS                         # add explicit /.claude/ entry (FR-013a)
CHANGELOG.md                       # entry per implementation PR
```

**Structure Decision**: Add to the existing layout. Keep hooks in `.claude/` (repository configuration), tests in
`scripts/__tests__/` (already covered by Jest's `testMatch`), and the workflow in `.github/workflows/`. No new
top-level folders.

## Delivery Slices

These follow the user-story priorities in the spec:

1. **Priority P1, US1 (guard and session rules)**: shipped in #3524 (merged 2026-09-30), with Jest contract tests. The
   session rules may only describe enforced behaviour (FR-003). The follow-ups from the 2026-10-01 clarifications
   (T049, T052, T054, T055) ship in a guard PR started with enforcement off. #3524 covered:
   - the documentation exception and the legacy PR exception (superseded on 2026-10-15)
   - fault handling and self-protection
   - the FR-001 no-rename rule
   - the updated SessionStart text
   - the CODEOWNERS entry
2. **Priority P2, US2 (shared environment)**: already built in #3524. Needs verification only, following quickstart §3–4
   after the Owner has set it up.
3. **Priority P3, US3 (documentation and cleanup)**:
   - The doc updates shipped in #3524. In #3726: the FR-020 deferral note, the DISCUSS promotion route (T061),
     hotfix naming (T062), and the guard-can't-start contract rows (T064). With #3358 merged, the cleanup note
     needs no qualifier (T065).
   - The cleanup (FR-020 to FR-022) ships with spec 009 in #3358, in its deferred form: no auto-approval (removed
     in `f4fcec75`, with CLI tests covering it), and a maintainer may promote empty branches from DISCUSS to the
     draft-PR route (documented in spec 009 by T063). Automatic deletion follows only once both
     the three prerequisites exist (branch-age storage, branch-origin verification and a delivered deletion workflow); the age signal alone does not enable it.
   - Spec 009's daily auto-delete step (task T034) is not part of this spec's delivery. It stays with spec 009.
4. **Rollout slice (US2, FR-024 to FR-026, SC-010)**: the organisation-wide rollout in the increment below. Its work
   falls into three groups:
   - **Agent**: `.claude/cloud/environment.env` variables, the revision helper and its CI test, the documentation
     and the changelog entry.
   - **Guard-protected (a person, or an Owner session started with `LS_ENFORCE_BRANCH_NAMES=0`)**: the drift check in
     `.claude/hooks/session-start.sh` and its tests in `scripts/__tests__/session-start-hook.test.js`, because the
     guard protects `.claude/hooks/**`.
   - **Owner only**: creating the **LightSpeed** environment and the organisation default, the server-managed CLI
     default, the "Require review from Code Owners" and required-check settings on `develop` and `main`, the
     one-time switch announcement, and the fresh-cloud evidence run.

   Task T029 (a per-repository `defaultEnvironmentId` in `.claude/settings.json`) is superseded by FR-026.

## Increment: organisation-wide rollout (2026-10-09)

**Goal**: every team member's cloud sessions run in one organisation-shared **LightSpeed** environment without
setup on their part, the configuration lives in the repository, and any drift between the repository and the
admin console, or any session outside the environment, is visible.

**What the product allows** (research R18 to R20, from the cloud environments, cloud sessions and server-managed
settings documentation, read 2026-10-09):

- Owners create organisation-shared environments on the **Cloud environments** admin page. There's no API or file
  import, so the repository is the source of truth and the admin page holds a manual copy.
- The organisation default fills only an empty selection. It never overrides a member's saved choice, and nothing
  can lock the environment. "Automatic" therefore needs a one-time switch for existing members, plus a warning that
  catches anyone who drifts (R19, R21).
- For `claude --cloud`, `remote.defaultEnvironmentId` can be delivered org-wide through server-managed settings
  (R20). That replaces T029's per-repository edit of the guard-protected `.claude/settings.json`.
- The default applies to every LightSpeed repository. `setup.sh` makes no repository assumptions. The one visible
  change elsewhere is Node 24 on `PATH` (R22).

**Spec amendments** (recorded in `spec.md`, clarification session 2026-10-12; the proposals P1 to P4 now have real IDs):

- **FR-024 (was P1)**: In a cloud session, session start MUST show a visible warning, without blocking or failing, when the
  session isn't running in the shared environment, and say how to select it.
- **FR-025 (was P2)**: The canonical environment definition MUST carry a revision stamp derived from its own content. CI MUST
  fail when the stamp is stale. In a cloud session, session start MUST warn when the session's stamp differs from
  the repository's.
- **FR-026 (was P3)**: The CLI default environment SHOULD be delivered to the whole organisation through server-managed
  settings (`remote.defaultEnvironmentId`). Project settings are only a fallback.
- **FR-019 addition**: the documentation covers the organisation-wide scope (R22), the one-time switch for members
  with a saved selection, and the Owner change procedure ([contract](./contracts/cloud-environment.md)).
- **SC-010 (was P4)**: Within 14 days of rollout, every session in the SC-007 monthly sample runs in **LightSpeed** at the
  current revision, with no `Cloud environment:` warning.
- **US2 scenario 1**: replaces the assumption that the default reaches everyone with "members with a saved selection
  are told to switch once" (R19). A newly onboarded member is treated the same way until quickstart §6 shows otherwise.

**Work items** (input for `/speckit-tasks`; existing open tasks are folded in):

| # | Work | Files | Who | Replaces / relates |
| --- | --- | --- | --- | --- |
| 1 | Add `LS_CLOUD_ENV` and `LS_CLOUD_ENV_REVISION` to the environment definition | `.claude/cloud/environment.env` | Agent | FR-025 (new) |
| 2 | Revision-stamp contract test | `tests/js/claude-cloud-environment-docs.test.js` (or a sibling test in the FR-023 workflow) | Agent | FR-025 (new) |
| 3 | Drift check in session start, with tests for the four states | `.claude/hooks/session-start.sh`, `scripts/__tests__/session-start-hook.test.js` | Owner session with `LS_ENFORCE_BRANCH_NAMES=0` (guard-protected) | FR-024, FR-025 (new) |
| 4 | Docs: organisation-wide scope, the one-time switch, managed-settings CLI default, the change procedure | `docs/CLAUDE_CLOUD_ENVIRONMENT.md` | Agent | FR-019 |
| 5 | Create **LightSpeed** and set the organisation default | Admin console | Owner | T028 |
| 6 | Server-managed `remote.defaultEnvironmentId` | Admin console | Owner | T029 (superseded by FR-026) |
| 7 | Announce the one-time switch to existing members | Team channel | Owner | US2 scenario 1 (new) |
| 8 | Run quickstart §6 and record the evidence | `.github/reports/audit/` | Owner + one member | T030 (extended), SC-010 |

Order: 1 → 2 → 3 (same PR, so the stamp, test and check land together) → 4 → 5 → 6 → 7 → 8. Items 5 and 6 can be
done before 1 to 3 merge. Sessions then show the "out of date" warning until the files match, which is the
expected signal.

**Risks**:

- A newly onboarded member's **Default** environment is treated as a saved selection (decided 2026-10-12, R19).
  Quickstart §6(b) can show otherwise. Until then, the announcement tells new members to pick **LightSpeed**.
- Other repositories' sessions get Node 24 by default (R22). This is documented, with a per-repository override.
- If a member's client skips server-managed settings (a third-party provider variable or a custom base URL), the CLI
  falls back to their `/remote-env` pick. `claude doctor` shows this.

**Decisions confirmed 2026-10-12**:

- Quickstart §6 check (b) is split: (b) is a member with no saved selection, and (b2) is a brand-new member, who is
  expected to keep their Default environment and see the warning until they pick **LightSpeed** once.
- R19 records that decision, so it is no longer an open point.
- FR-025's "differs" includes a missing or empty `LS_CLOUD_ENV_REVISION`, so a LightSpeed session with no stamp
  warns. `spec.md` is unchanged, and the contract and data model state it.
- Byte rule for the stamp (**confirmed by the user**): every remaining line of `environment.env` is
  newline-terminated, as `grep -v` writes it, so the shell helper and the CI test's Node recomputation agree. The CI
  test covers a file with and without a trailing newline. Changed 2026-10-12 after a review comment on #3878: the
  stamp is worked out from a two-line manifest of each file's own digest, so a line moving between the two files
  changes it (FR-025).
- SC-009: the "Nested interpreters (SC-009)" citation in `contracts/hooks.md` will be reworded to cite FR-012 (the
  shell-parsing requirement). SC-009 is not declared in `spec.md` and no success criterion is added. The edit itself
  is task T088.

**Constitution re-check (increment)**: I ✅ (the control-plane repository owns the definition). II ✅ (no locked
files). III ✅ (`.claude/cloud/` is repository configuration that the admin console reads, not an asset installed
into other repositories; packaging stays a follow-up). V and VIII ✅ (unchanged). VI ✅ (the new variables aren't
secrets; managed settings are Owner-only). X ✅ (the drift check and CI stamp are automated monitoring). No new
violations.

Re-check after the 2026-10-12 fixes: V ✅ and VIII ✅ (unchanged). VI ✅ (the stamp and `LS_CLOUD_ENV` contain no
secrets). X ✅ (justified, see Complexity Tracking). **VII is open**: T089 re-ran the requirements checklist on
2026-10-12 (14 of 16 items pass); the two failing items are listed in its Notes and must be fixed before the spec
leaves Draft. **IX needs a decision**: T073 covers the
changelog entry for the code PR (T067 to T072), but the docs-only Phase 13 PR (T078, T081, T082) has no changelog
task, so whether it needs an entry has to be confirmed.

## Linear issue mapping

How the plan covers each Linear issue that relates to spec 018 (the `.github` project, checked 2026-10-12). The spec's
**Status** stays `Draft` until all of these are complete.

| Issue | Status | What it needs | Covered by |
| --- | --- | --- | --- |
| GIT-2532 (#3742) docs: document Spec 018 and contract checks | Todo | Current artefacts and contract checks linked, historical numbering distinguished, limitations accurate, reconciled with #3727 | Rollout work item 4 and FR-019. Task to be added by `/speckit-tasks` |
| GIT-2530 (#3740) aiops: enforce branch naming in shared sessions | Todo | Delivered versus remaining limitations stated, shared-session evidence linked. No new guard code | Existing guard tests (T008 to T014), plus the fresh-cloud evidence in work item 8. Overlaps epic GIT-2524 |
| GIT-2581 (#3818) close out cleanup documentation tasks | In Review | Nothing further. Delivered in #3813 | Housekeeping only: Linear status and closing #3818 |
| GIT-2571 (#3802) clarify rules and guard fault behaviour | In Review | Nothing further. Delivered in #3726 | Housekeeping only: Linear status and closing #3802 |
| GIT-2514 (#3727) record clarifications and convergence fixes | In Review | Nothing further in the spec. #3726 merged, and #3727 was reopened on 2026-10-09 with no recorded reason | Housekeeping, plus a check that nothing is outstanding |
| GIT-2524 (#3736) epic: verify shared environment and branch routing | Tracking | Owner setup (T028, T042, T048) and fresh-cloud verification (T030, T043) | Rollout work items 5 to 8. Owner actions |

Related and done: GIT-2291 (report-only branch audit CLI, #3358), GIT-2479 (#3691, all seven guard gaps closed),
GIT-2406 (semver release branches in the validator), GIT-2498 (original branch naming), GIT-2400 (spec 016, now spec
018). GIT-2523 is a duplicate of the epic.

**Open items for `/speckit-tasks`**:

- `contracts/hooks.md` cites **SC-009** (nested interpreters), which `spec.md` doesn't declare. **Decided
  2026-10-12**: reword the citation to FR-012 rather than declare SC-009. The edit is task T088, done by
  `/speckit-implement`. SC-010 was used for the adoption criterion so this citation keeps its meaning until then.
- Add tasks for GIT-2532 and GIT-2530 as above, and a housekeeping task covering GIT-2581, GIT-2571 and GIT-2514.
- Retire T029 (superseded by FR-026) and mark T034 out of scope (spec 009).
- Retarget the evidence tasks (T030, T043) from the merged #3524 description to the evidence report.

## Reconciliation of 2026-10-15 (GIT-2741)

Owner decision: remove the legacy PR write exception and preserve constitution V and VIII unchanged. This change is
**specification alignment only**. The artefacts now describe the target (no exception, narrower reset, two clear
protection scopes, cleanup limited to what is delivered). Implementation compliance is not claimed.

**Open mismatch between the specification and the delivered guard** (kept visible until separately fixed):

| Area | Specification now says | Delivered code still does |
| --- | --- | --- |
| Open-PR heads | Refuse commits, pushes and GitHub file writes to a non-compliant branch, even an open-PR head | `enforce-branch-name.mjs` allows them when `git ls-remote` and the REST lookup find an open PR in this repository |
| Session-start text | Says such writes are refused and the work moves to a compliant branch and PR | `session-start.sh` still tells Claude the legacy PR exception exists |
| Reset | Only a placeholder the hook renamed (FR-002) | Matches: the hook already resets only a renamed placeholder |
| Cleanup | Report-only categorisation delivered, automatic deletion deferred | Matches: `branch-audit.yml` is absent |

**Follow-up proposals** (proposals only: no issues were created and no implementation task is marked complete):

1. **Guard logic**: in `.claude/hooks/enforce-branch-name.mjs`, drop the open-PR lookup and the exception on the commit,
   push and GitHub-write paths, and make the refusal message say the work moves to a compliant branch and PR with
   maintainer approval. The file is guard-protected, so a person or an Owner session with enforcement off makes the change.
2. **SessionStart messaging**: in `.claude/hooks/session-start.sh`, replace the legacy PR exception paragraph in the rules
   text with the refusal and migration wording (also guard-protected).
3. **Documentation outside spec 018**: `docs/CLAUDE_CLOUD_ENVIRONMENT.md` describes the exception in its guard section and
   in the "Use it" note about `gh`.
4. **Regression tests**: change `scripts/__tests__/enforce-branch-name-hook.test.js` (about 11 cases mention the exception) and
   add a case that an open-PR head is refused; add a session-start case that a clean existing branch behind the base is
   not reset; revisit `tests/js/claude-cloud-environment-docs.test.js` once the guard and text change.
5. **Reset behaviour check**: confirm the delivered reset behaviour with a behavioural test (a text assertion alone doesn't
   prove it). The existing session-start test "does not reset a clean existing branch that is behind develop" already covers it.

**Constitution gate reassessment**: V and VIII are ✅ for specification alignment and ⚠️ for implementation compliance. VII
stays open for the reviewer-owned checklists. The 58 of 65 ticked tasks at the reviewed baseline are historical delivery
claims, not proof of passing tests or enforced settings.

## Complexity Tracking

| Deviation | Why needed | Simpler alternative rejected because |
| --- | --- | --- |
| SC-007 relies on a monthly manual review of sampled sessions (principle X prefers automated monitoring) | The guard records no refusals by design (Q5), so the agent's recovery after a refusal can't be measured automatically without adding session telemetry | Refusal telemetry was rejected in Q5 (privacy and storage). The branch-validation metrics, and from this increment the automated drift check, cover everything that can be monitored automatically |
