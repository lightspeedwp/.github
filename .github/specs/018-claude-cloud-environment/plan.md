# Implementation Plan: Standardised Claude Code Cloud Environment

**Branch**: `docs/claude-cloud-spec-reconcile` (PR lightspeedwp/.github#3726). The first implementation merged in
lightspeedwp/.github#3524 on 2026-09-30 | **Date**: 2026-10-02 (first drafted 2026-09-24) | **Spec**: [spec.md](./spec.md)

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
   (lightspeedwp/.github#3358) auto-approves nothing until a branch-age signal exists. Until then a maintainer
   can promote an empty, merged `claude/*` branch with no open PR from DISCUSS to DELETE, and it is removed
   through 009's draft-PR approval. There is no separate job.

Most of this already exists in #3524. The second clarification session added the legacy PR exception,
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

## Technical Context

**Language/Version**: Bash (hooks, setup script); Node.js ≥18 ES modules (guard, cleanup script). CI uses Node 24
per `.nvmrc`.

**Primary Dependencies**:

- `lib/validate-branch-name.js` (existing)
- `jq`, `git`
- `gh` (hook sessions and Actions runner, for the open-PR check; cloud sessions authenticate through the GitHub
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
  otherwise be refused.
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
| V. Branch naming non-negotiable | This feature enforces it for agents | ✅ |
| VI. UK English, security | UK English in docs and messages. No secrets. While enforcing, the guard fails closed on unknown file sets, unverifiable legacy PRs and its own faults (for git writes). With enforcement off, guard faults warn and allow the writes (FR-013). It protects its own files and every settings file that can disable hooks. The switch can't be changed from inside a session. CODEOWNERS covers `.claude/`. The threat model is written down (R13). The workflow has least-privilege permissions and pinned actions | ✅ |
| VII. Spec quality | Requirements checklist 16/16 and security checklist 32/32. Clarified in recorded sessions on 2026-09-24 (two sessions), 2026-10-01 (5 questions) and 2026-10-02 (2 questions). FR-013a protected paths (five files) resolved | ✅ |
| VIII. Enforcement and compliance ≥95% | The guard blocks before push. While automatic cleanup is deferred (FR-020), empty `claude/*` branches are removed through maintainer-approved draft PRs | ✅ |
| IX. Changelog compliance | Each implementation PR adds an entry of 250 characters or less linked to its PR | ✅ |
| X. Metrics-driven | Automated validation runs on every PR (FR-023). Success is measured through the existing branch-validation metrics. SC-007 is a documented manual review, the only manual check, justified by Q5 | ✅ (justified) |

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
│   └── branch-cleanup.md
├── checklists/
│   ├── requirements.md  # spec quality (16/16)
│   └── security.md      # guard and security review (32/32)
└── tasks.md             # Phase 2 (/speckit-tasks, not created here)
```

### Source Code (repository root)

```text
.claude/
├── settings.json                  # registers SessionStart + PreToolUse; matcher extended to Edit/Write/MultiEdit/NotebookEdit
├── cloud/
│   ├── setup.sh                   # environment setup script (exists)
│   └── environment.env            # environment variables (exists)
└── hooks/
    ├── session-start.sh           # rename only fresh claude/* branches; exceptions and protected files in the context
    └── enforce-branch-name.mjs    # documentation exception (R4), legacy PR exception over REST (R9), fault
                                   #   handling (R11), self-protection incl. managed settings (R12), gh CLI,
                                   #   names-only rules on other lightspeedwp repositories (FR-009 scope)

.github/workflows/
└── claude-guard-tests.yml         # FR-023 CI gate for the contract tests

scripts/
└── __tests__/
    ├── enforce-branch-name-hook.test.js   # black-box guard contract tests
    ├── session-start-hook.test.js         # black-box SessionStart contract tests (incl. SC-005 timing)
    └── helpers/claude-hook-harness.js     # temp repo + bare origin, gh/npm/git ls-remote stubs

tests/js/
└── claude-cloud-environment-docs.test.js  # spec/plan/tasks/contract consistency checks

# Included in spec 009 / #3358; pending merge (FR-020 deferral, T053):
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

1. **P1, US1 (guard and session rules)**: shipped in #3524 (merged 2026-09-30), with Jest contract tests. The
   session rules may only describe enforced behaviour (FR-003). The follow-ups from the 2026-10-01 clarifications
   (T049, T052, T054, T055) ship in a guard PR started with enforcement off. #3524 covered:
   - the documentation exception and the legacy PR exception
   - fault handling and self-protection
   - the FR-001 no-rename rule
   - the updated SessionStart text
   - the CODEOWNERS entry
2. **P2, US2 (shared environment)**: already built in #3524. Needs verification only, following quickstart §3–4
   after the Owner has set it up.
3. **P3, US3 (documentation and cleanup)**:
   - The doc updates shipped in #3524. In #3726: the FR-020 deferral note, the DISCUSS promotion route (T061),
     hotfix naming (T062), and the guard-can't-start contract rows (T064). Until #3358 merges, the cleanup note
     must say the DISCUSS behaviour arrives with it (T065).
   - The cleanup (FR-020 to FR-022) ships with spec 009 in #3358, in its deferred form: no auto-approval (removed
     in `f4fcec75`, with CLI tests covering it), and a maintainer may promote empty branches from DISCUSS to the
     draft-PR route (documented in spec 009 by T063 after #3358 merges). Automatic deletion follows once a
     branch-age signal exists.

## Complexity Tracking

No constitution violations to justify.
