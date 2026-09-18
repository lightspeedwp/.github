# Phase 0 Research: PR Agent Consolidation & Portability

No `NEEDS CLARIFICATION` markers remained in the Technical Context after drafting `plan.md` — the one open question that would have produced one (the per-repository configuration mechanism) was already resolved during `/speckit-clarify`. This document instead records the technical decisions made while translating that clarification, and the rest of the spec, into a concrete design.

## Decision: Source the canonical prefix/routing tables from this repository's own constitution and `docs/BRANCHING_STRATEGY.md`, never re-hardcoded

**Rationale**: `validate-branch-name.js`'s current bug exists *because* the forbidden/approved prefix lists were hardcoded independently of the canonical documents. `.specify/memory/constitution.md`'s own "Branch Type to PR Template Routing" table and `docs/BRANCHING_STRATEGY.md` already carry the authoritative 38-type list and the three forbidden prefixes — fixing the skill to read from (or be generated from) these documents, rather than hardcoding a corrected list a third time, prevents this exact bug from recurring the next time either canonical document changes.

**Alternatives considered**: Hardcode the corrected list once, carefully, in `validate-branch-name.js`. Rejected — this is exactly the failure mode being fixed; a future edit to the constitution or `docs/BRANCHING_STRATEGY.md` would silently re-desynchronise the skill from its source of truth.

## Decision: WCAG 2.2 AA applies unconditionally here — no reconciliation needed

**Rationale**: `ls-theme`'s own constitution had to explicitly note an unresolved conflict (Principle V's 2.1 AA baseline vs. Principle VIII's 2.2 AA PR-review figure). This repository's constitution has no such conflict — Principle VI sets WCAG 2.2 AA as the single, universal, non-negotiable standard for all documentation and guidance. The self-review-gate behaviour absorbed from `ls-theme` `SKILL.md` Step 2.10 carries the 2.2 AA figure forward as-is, with no override note required.

**Alternatives considered**: Copy `ls-theme`'s override language verbatim ("use 2.2 AA even though this repo's docs say otherwise"). Rejected — that framing doesn't apply here and would misrepresent this repository's own constitution as having a conflict it does not have.

## Decision: The five-missing-template-routing-entries discrepancy is deferred, not fixed, because `config.yml` is a LOCKED file

**Rationale**: Constitution Principle II designates `.github/PULL_REQUEST_TEMPLATE/*.md` (and by extension the `config.yml` routing table that references them) as LOCKED — changes require a `[TEMPLATE-UPDATE-REQUEST]` issue and @ashley's explicit approval, regardless of how mechanically obvious the fix looks. `validate-branch-name.js`'s prefix-list bug is different in kind: it's a bug in the *agent's own code*, not in a LOCKED governance file, so it's fixed directly by this feature.

**Alternatives considered**: Bundle a `config.yml` fix into this feature's PR as an obviously-correct drive-by fix. Rejected — Principle II's approval requirement is about process and blast-radius control across dependent systems, not about whether a given fix is correct; bundling it would violate that process regardless of correctness.

## Decision: Assignee and base branch are resolved dynamically at invocation time, never stored

**Rationale**: Per the 2026-09-18 Clarification. Assignee resolves to whoever is actually running the agent (via the authenticated `gh`/git identity); base branch resolves by checking the target repository's own actual default branch (`gh repo view --json defaultBranchRef`, the same call `ls-theme` `SKILL.md` Step 2.5 already used as its *last-resort* fallback) — promoted here from fallback to the primary mechanism, since a portable agent can no longer assume `develop`/`main` are the literal names in every repository.

**Alternatives considered**: Require a config-file entry for either value. Rejected — both are already answerable directly from `gh`/`git` state at the moment the agent runs; a config entry would just be a second, staler copy of information already available live.

## Decision: One new, optional per-repository override file — `.github/pr-agent.config.json` — for review-budget thresholds and the approved-prefix list only

**Rationale**: LightSpeed's canonical "Pull Request & Code Review Workflow" document confirms the review-budget thresholds (~15 files/~400 lines preferred, ~25 files/~800 lines hard-flag, 5-PR-per-stack limit) and the approved-prefix list are organisation-wide standards, not `ls-theme`-specific tuning — so they ship as the agent's built-in defaults. The override file exists only for a repository with a genuine, documented exception to one of those defaults. `lightspeedwp/.github` itself needs no such file, since the org-wide defaults already equal its own values.

**Alternatives considered**: Environment variables passed at invocation. Rejected — a checked-in file is visible and reviewable alongside a repository's other conventions (the same pattern `.github/PULL_REQUEST_TEMPLATE/config.yml` already establishes), where an environment variable would be invisible to anyone reading the repository.

## Decision: Keep the existing cross-skill integration test suite at the agent root; move only per-skill unit tests into each skill's own folder

**Rationale**: `agents/pr-agent/__tests__/integration/` (e.g. `sequential-skill-execution.test.js`, `real-github-workflows.test.js`) exercises multiple skills together — it has no single correct "owning" skill folder under the Agent Skills specification's per-skill `scripts/`/`scripts/__tests__/` convention. Leaving it at the agent root, while moving each skill's own `*.test.js` into that skill's new `scripts/__tests__/`, matches the common convention of colocating unit tests with their source while keeping integration tests at the level that reflects what they actually integrate.

**Alternatives considered**: Assign the integration suite to whichever skill it most exercises (e.g. `orchestrate-pr-creation/`). Rejected — misrepresents ownership; a future reader would reasonably assume that skill folder's tests only cover that skill.

## Decision: Flag, don't fix, this feature's own non-compliant branch name

**Rationale**: The working branch (`feature/pr-agent-consolidation-portability`) predates this plan and already holds uncommitted work; a planning document performing a `git branch` rename as a side effect would be a surprising, unrequested action. Documented explicitly in `plan.md`'s Complexity Tracking table instead, with a concrete recommended rename before this work is pushed or opened as a PR.

**Alternatives considered**: Silently proceed without flagging it. Rejected — this is the exact class of discrepancy (a `feature/` prefix matching no documented convention) the spec's own Edge Cases section already calls out generically; letting the plan's own branch exemplify it unflagged would be inconsistent.
