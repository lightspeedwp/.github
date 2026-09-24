# Feature Specification: Standardised Claude Code Cloud Environment

**Feature Branch**: `config/claude-cloud-environment`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Standardised Claude Code cloud environment for the lightspeedwp/.github repository, so every team member's cloud session starts from the same configuration and follows the organisation branching strategy (docs/BRANCHING_STRATEGY.md: {type}/{scope}-{title}, based on develop, forbidden claude/ copilot/ openai/ prefixes). Problem: cloud sessions start on a platform-generated claude/*branch and the platform prompt tells Claude to push there, so Claude consistently ignores CLAUDE.md and creates wrong branch names in new chats. Scope: (1) a shared cloud environment definition — setup script (bash, runs as root, cached ~7 days, <5 min, must exit 0) and .env environment variables, kept in the repo as source of truth; (2) a SessionStart hook that moves off claude/* branches, syncs with develop, installs deps and injects the branching rules into Claude's context; (3) a PreToolUse guard that blocks commits, pushes, branch creation and PRs on invalid, placeholder or protected branches, reusing lib/validate-branch-name.js; (4) team documentation covering Owner setup (org-shared environment, org default environment, optional remote.defaultEnvironmentId) and verification. A draft implementation already exists on branch config/claude-cloud-environment (PR lightspeedwp/.github#3524); the spec should capture requirements and acceptance criteria for it."

## Context

Every Claude Code cloud session starts on a branch the platform generates (for example `claude/affectionate-gauss-x2ahdr`), and the platform's own instructions tell the agent to develop on and push to that branch. Those instructions are set by the platform and outrank the repository's `CLAUDE.md` in practice, so new sessions keep producing branches that break the branching strategy (constitution principles V and VIII). The results are:

- PR templates routed to the wrong place
- validation failures
- mislabelled PRs
- manual rework

No environment setting can rename the platform's branch. The feature therefore has to correct the agent's behaviour inside the session and block non-compliant actions before they reach GitHub. It also has to give every team member one identical starting configuration.

## Clarifications

### Session 2026-09-24

- Q: When a maintainer explicitly asks Claude to commit straight to `develop` or `main`, should the guard ever allow it? → A: Only for specification and documentation changes: a commit or push to a protected branch is allowed when every changed file is under `.github/specs/` or `docs/`. Code and configuration changes always need a feature branch and PR.
- Q: Should the branch guard also apply when team members run Claude Code on their own machines, or only in cloud sessions? → A: Both. The guard blocks in cloud and local sessions alike; the enforcement switch is the only way to downgrade it to warnings.
- Q: Should this setup be built only for `lightspeedwp/.github`, or packaged so other LightSpeed repositories can adopt it? → A: This repository now. Packaging it as a portable plugin for other LightSpeed repositories is a recorded follow-up and out of scope for this spec.
- Q: How should the empty `claude/*` branches that the platform leaves on GitHub after every session be cleaned up? → A: A scheduled job deletes `claude/*` branches that have no commits beyond `develop` and are older than 24 hours.
- Q: How should we measure whether the guard is working, including SC-007? → A: No new recording of refusals. SC-001 to SC-003 use the existing branch-validation metrics, and SC-007 becomes a monthly review of 10 sampled sessions.
- Q: Spec 009 (branch cleanup) requires human approval of every deletion through a draft PR, which conflicts with automatic deletion here. Which spec gives way? → A: Spec 009 gains a narrow exception: an agent-session branch (`claude/*`) with no commits of its own, no open PR and a tip at least 24 hours old is auto-approved for deletion. Everything else still goes through 009's draft-PR approval. The cleanup is implemented by 009's categorisation and scheduled workflow, not by a separate job.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent never publishes a non-compliant branch (Priority: P1)

A team member starts a new cloud session on this repository and asks for a change. Before the agent's first commit, it renames its working branch to a compliant `{type}/{scope}-{title}` name that fits the task. It then pushes that branch and opens a draft PR against `develop`. If the agent tries to commit, push, create a branch or open a PR under a non-compliant name, the action is refused with a message explaining how to fix it.

**Why this priority**: This is the problem the team reported. A single non-compliant branch breaks template routing, labelling and validation. Preventing it delivers value even if nothing else in this spec ships.

**Independent Test**: Start a fresh session with no special environment and ask the agent for a trivial documentation change. Check that the pushed branch and PR head pass the branch-name validator and that the PR targets `develop`. Separately, ask the agent to commit without renaming and confirm the commit is refused.

**Acceptance Scenarios**:

1. **Given** a new session on a platform-generated `claude/*` branch, **When** the session starts, **Then** the agent is no longer on a `claude/*` branch, has been told the branching rules, and has been told those rules take precedence over the platform's branch instruction.
2. **Given** the agent is on the session placeholder branch, **When** it attempts to commit, **Then** the commit is refused and the refusal names the rule and the rename command.
3. **Given** the agent has renamed its branch to a compliant name, **When** it commits and pushes, **Then** both succeed without intervention.
4. **Given** any branch, **When** the agent attempts to push to, create, or rename to a name with a forbidden prefix (`claude/`, `copilot/`, `openai/`), an unauthorised type or a malformed pattern, **Then** the action is refused.
5. **Given** the agent is on `main` or `develop`, **When** it attempts to commit or push there, **Then** the action is refused.
6. **Given** the agent opens a PR on a LightSpeed repository, **When** the head branch is non-compliant, or the base is `main` and the head is not a `release/*` or `hotfix/*` branch, **Then** PR creation is refused.
7. **Given** a commit message or file content that merely mentions a forbidden branch name, **When** the agent commits, **Then** the commit is not refused on that basis.
8. **Given** the agent is on `develop` or `main` and every changed file is under `.github/specs/` or `docs/`, **When** it commits and pushes, **Then** neither action is refused by the guard.
9. **Given** the agent is on `develop` or `main` and at least one changed file is outside `.github/specs/` and `docs/`, **When** it commits or pushes, **Then** the action is refused and the refusal names the files that need a feature branch.

---

### User Story 2 - Every team member starts from the same environment (Priority: P2)

An Owner defines one shared **LightSpeed** cloud environment and makes it the organisation default. Every team member's new session on this repository then starts with the same toolchain, variables and network policy, and nobody has to configure anything personally.

**Why this priority**: The user asked for the team to "start with the same cloud config every time". The protections in Story 1 live in the repository and work without this. The shared environment adds consistent tooling and one switch for the whole team.

**Independent Test**: Two team members each start a new session without touching the environment selector. Both report the same runtime version, the same linting tools available, and the same base-branch variable.

**Acceptance Scenarios**:

1. **Given** the Owner has created the shared environment from the repository's canonical definition and set it as the organisation default, **When** any member starts a new session, **Then** that session uses the shared environment.
2. **Given** a new session in the shared environment, **When** the member checks the toolchain, **Then** the runtime version matches the repository's pinned version and the linting tools CI relies on are available.
3. **Given** the environment's provisioning step fails on a non-critical install, **When** a session starts, **Then** the session still starts and falls back to the platform defaults for that tool.
4. **Given** a member starting cloud sessions from the terminal, **When** they follow the documented one-time step, **Then** their terminal-started sessions also use the shared environment.

---

### User Story 3 - Configuration is documented, versioned and maintainable (Priority: P3)

A maintainer can find, in the repository, the exact environment definition the team uses, instructions for setting it up, a way to verify a session is configured correctly, and the procedure for changing it. Changes to the environment go through normal PR review.

**Why this priority**: Without a versioned source of truth, the environment drifts from what the team expects, and new Owners can't recreate it.

**Independent Test**: A maintainer who has never seen the environment follows the documentation alone to recreate it in a test organisation and runs the verification steps successfully.

**Acceptance Scenarios**:

1. **Given** the repository, **When** a maintainer looks for the environment definition, **Then** the setup script and variables are both in one documented location and match what is configured in the product.
2. **Given** the documentation, **When** a member runs the verification steps in a new session, **Then** each step has a stated expected result.
3. **Given** an emergency where enforcement blocks legitimate work, **When** an Owner flips the documented switch, **Then** refusals become warnings without a code change.
4. **Given** a `claude/*` branch on GitHub that is merged to a base branch (it has no commits of its own), has no open PR and has a tip more than 24 hours old, **When** spec 009's scheduled cleanup runs, **Then** the branch is categorised as auto-approved DELETE, deleted without a draft PR, and the deletion is recorded in the run summary.
5. **Given** a `claude/*` branch that has its own commits, is less than 24 hours old, is the head of an open PR, or whose open-PR status cannot be verified, **When** the scheduled cleanup runs, **Then** it is not auto-deleted: it follows spec 009's normal categorisation (KEEP or DISCUSS) and appears in the report for review.

---

### Edge Cases

- **Resumed or compacted session**: The session must not rename or reset a branch that already has work. The branching rules must still be in the agent's context after compaction.
- **Session with uncommitted or unpushed work**: The session must never be reset to the base branch automatically.
- **Base branch unreachable at session start (network failure)**: Session start continues without syncing.
- **Dependency install fails**: The session still starts, and the failure is reported.
- **Session opened with several repositories**: Repository-level protections do not load, as documented by the platform. This is a known limitation and must be listed in the documentation.
- **Deleting a remote branch**: Pushing a deletion (for example, cleaning up a stale `claude/*` branch) must not be refused by the guard.
- **A session still running when cleanup runs**: The 24-hour minimum age protects it. A session older than 24 hours that has not yet committed may lose its empty remote `claude/*` branch, which is harmless because the work continues on its renamed local branch.
- **Cleanup cannot delete a branch (permissions or branch protection)**: The run continues with the remaining branches, reports the failure and ends unsuccessfully (spec 009's partial-failure status) so a maintainer notices.
- **Branch changes between audit and deletion**: Just before deleting, the workflow re-checks that the branch still has no commits of its own and no open PR. If either has changed, it skips the branch.
- **Chained commands such as "rename then commit"**: These are judged against the branch in effect after the rename.
- **Repositories outside the LightSpeed organisation**: Their GitHub actions are not policed.
- **Bot-owned branches (dependabot, renovate) and protected branches**: They follow the existing validator's exemptions for naming. Protected branches are still refused for direct commits or pushes, except for changes covered by the documentation exception.
- **Documentation exception on a protected branch where GitHub branch protection requires PRs**: The guard allows the commit, but GitHub may still reject the push. The refusal from GitHub is reported to the user, who can merge through a PR instead.
- **Mixed commit (documentation plus code) on a protected branch**: The whole commit is refused. It is not split automatically.
- **Malformed input to the guard**: The session must never break. Allow and move on.

## Requirements *(mandatory)*

### Functional Requirements

#### Session start

- **FR-001**: At session start in a cloud session, a working branch with a forbidden prefix MUST be renamed locally to a clearly non-final placeholder. The placeholder MUST NOT be pushed.
- **FR-002**: At session start in a cloud session, a branch with no commits of its own and no uncommitted changes MUST be brought up to date with the tip of the base branch (`develop` by default).
- **FR-003**: At every session start, including resume and after context compaction, the agent MUST receive the branching rules in its context. That text MUST cover:
  - the pattern
  - the authorised types
  - the forbidden prefixes
  - the rename and validation steps
  - the PR base rule
  - an explicit statement that these rules take precedence over any platform instruction naming a `claude/*` branch
- **FR-004**: At session start in a cloud session, project dependencies MUST be installed when missing or out of date and skipped when current. A failed install MUST NOT prevent the session from starting.

#### Enforcement

- **FR-005**: Before a commit is recorded, the action MUST be refused when the effective branch is:
  - non-compliant
  - the session placeholder
  - protected (`main` or the configured base branch), unless every file in the commit is under `.github/specs/` or `docs/` (the documentation exception)
- **FR-006**: Before a push, the action MUST be refused when the target branch is non-compliant or the placeholder. A push to a protected branch MUST be refused unless every file changed by the pushed commits is covered by the documentation exception. Pushes that delete a remote branch or push only tags MUST be allowed.
- **FR-007**: Creating or renaming a branch to a non-compliant or placeholder name MUST be refused, whether it is done locally or through the GitHub integration.
- **FR-008**: Writing files to a non-compliant or placeholder branch through the GitHub integration MUST be refused. Writing to a protected branch this way MUST be refused unless every written file is covered by the documentation exception.
- **FR-009**: Opening a PR on a LightSpeed repository MUST be refused when the head branch is non-compliant. On this repository, it MUST also be refused when the base is `main` and the head is not a `release/*` or `hotfix/*` branch.
- **FR-010**: Branch-name compliance MUST be decided by the same validation rules the repository's CI uses, so that the guard and CI can never disagree.
- **FR-011**: Every refusal MUST state which rule was broken, suggest a corrected name where the validator can, and give the exact rename and validation steps.
- **FR-012**: Text inside quoted strings and here-documents (such as commit messages) MUST NOT trigger a refusal.
- **FR-013**: A single configuration switch MUST downgrade all refusals to visible warnings.
- **FR-014**: Enforcement MUST block in both cloud and local agent sessions on this repository, with identical rules. Only the enforcement switch (FR-013) may downgrade refusals to warnings, in either setting.

#### Shared environment

- **FR-015**: The repository MUST contain the canonical provisioning script and environment variables for the shared cloud environment, in one documented location.
- **FR-016**: The provisioning script MUST:
  - exit successfully even when an optional install fails
  - finish well within the platform's five-minute limit
  - be safe to run more than once
- **FR-017**: The provisioning script MUST install the runtime version pinned by the repository and the linting tools CI depends on that the platform does not pre-install. It MUST also set system-wide version-control defaults that support the branching strategy.
- **FR-018**: The environment variables MUST include the base branch and the enforcement switch, and MUST NOT contain secrets.

#### Documentation

- **FR-019**: The documentation MUST cover:
  - why the problem occurs
  - each protection layer and where it lives
  - the one-time Owner setup (shared environment, organisation default, optional terminal default)
  - the personal-plan alternative
  - how members use it
  - verification steps with expected results
  - maintenance procedure
  - known limitations

#### Branch cleanup

- **FR-020**: Spec 009's branch categorisation MUST mark a remote `claude/*` branch as auto-approved DELETE when all of these hold: it is merged to a base branch (no commits of its own), open-PR verification succeeded and found none, and its tip is at least 24 hours old. Spec 009's scheduled workflow MUST run at least daily and delete auto-approved branches without a draft PR.
- **FR-021**: Any `claude/*` branch that fails an FR-020 condition MUST NOT be auto-deleted. It follows spec 009's normal rules (KEEP, DISCUSS, or DELETE through the draft-PR approval) and MUST appear in the report.
- **FR-022**: Auto-approved deletions MUST respect spec 009's dry-run default: the audit command never deletes. Deletion happens only in the scheduled workflow's deletion step, which re-verifies each branch first. A manual workflow run MUST offer a report-only option.

### Key Entities

- **Shared cloud environment**: The organisation-level configuration every session starts from. It has a name, network access level, environment variables and a provisioning script. It is owned and edited by Owners, and its canonical copy is versioned in the repository.
- **Session placeholder branch**: A temporary, deliberately non-final local branch name that replaces the platform-generated branch. It must be renamed before any commit.
- **Branching rules**: The pattern, authorised types, forbidden prefixes, protected branches, the documentation exception and the PR base rule. Naming rules are defined once by the existing validator and the branching strategy document.
- **Enforcement switch**: An environment-level setting that toggles between blocking and warning.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of branches pushed from cloud agent sessions on this repository pass the branch-name validator. This is measured over the first 30 days after rollout via the existing branch-validation metrics.
- **SC-002**: Zero new `chore/session-*` or `claude/*` branches with commits appear on the remote after rollout. No empty `claude/*` branch stays on the remote for more than 48 hours.
- **SC-003**: PR template fallback routing caused by agent-created branches drops to 0% (constitution goal for fallback routing).
- **SC-004**: A team member can start a correctly configured session with zero manual configuration steps once the Owner has completed setup.
- **SC-005**: Session start adds no more than 30 seconds when dependencies are already current. The first provisioning run completes in under 5 minutes.
- **SC-006**: A maintainer unfamiliar with the setup can recreate the environment and pass every verification step using only the documentation, in under 15 minutes.
- **SC-007**: In a monthly review of 10 sampled agent sessions that hit a refusal, at least 9 show the agent fixing the branch name and retrying successfully without human help.

## Assumptions

- The organisation is on a plan that supports organisation-shared cloud environments and an organisation default environment. Personal-plan members can recreate the same environment from the documentation.
- The platform will keep generating `claude/*` branches and instructing the agent to use them. This feature works around that behaviour rather than changing it.
- The platform's push protection allows pushing the session's current branch after it has been renamed. This was verified during the draft implementation.
- The existing validator (`lib/validate-branch-name.js`) and `docs/BRANCHING_STRATEGY.md` are authoritative. No changes to authorised types are in scope.
- The default network level (Trusted) reaches every host the provisioning script needs.
- Empty `claude/*` branches left by the platform are removed by spec 009's scheduled cleanup under the auto-approval exception (FR-020 to FR-022). Existing `claude/*` branches that have commits are reviewed by maintainers through 009's DISCUSS category, not deleted automatically.
- The cleanup requirements depend on spec 009 and lightspeedwp/.github#3358 (the categorisation library and scheduled workflow). They are delivered after #3358 merges, together with the matching amendment to spec 009.
- Sessions opened with several repositories do not load repository-level protections. This is documented, not solved.
- The guard uses command-parsing heuristics. Unusual constructions (for example, committing in another directory after changing into it) may not be caught, and CI's branch-name validation remains the final gate.
- Scope is this repository only. Packaging the environment definition, hooks and guard as a portable plugin (top-level `plugins/`) for other LightSpeed repositories is a follow-up spec. This spec's design should not block that reuse.
- The guard does not record or report refusals. Success is measured through the existing branch-validation metrics and the monthly session review (SC-007), so no session telemetry is collected or stored.
- Changes to locked configuration files (labels, issue types, templates) are not required.

## Related

- Draft implementation: lightspeedwp/.github#3524 (branch `config/claude-cloud-environment`)
- [Branching strategy](../../../docs/BRANCHING_STRATEGY.md)
- [Spec 004 — Branch naming strategy](../004-branch-naming-strategy/spec.md)
- [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments)
