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

## Decision: Assignee and branch roles are resolved dynamically at invocation time, never stored

**Rationale**: Per the 2026-09-18 Clarification. Assignee resolves to whoever is actually running the agent (via the authenticated `gh`/git identity). Production and integration branches are independently resolved from the target repository's authoritative branch-policy metadata and checked against its live branches, so a portable agent never assumes `main` or `develop` as literal names. The live `defaultBranchRef` remains a last-resort fallback for either role only when that role has no designation; it never overrides or masks a malformed, non-live, or ambiguous designation.

**Alternatives considered**: Treat `defaultBranchRef` as the production role and infer integration from conventional branch names. Rejected — the default branch and the production role are distinct repository concepts, while literal-name inference would make portability depend on `main`/`develop` conventions. Requiring role metadata in every repository was also rejected: when a role is genuinely undesignated, the live default branch is the documented deterministic fallback.

## Decision: One new, optional per-repository override file — `.github/pr-agent.config.json` — for review-budget thresholds and the approved-prefix list only

**Rationale**: LightSpeed's canonical "Pull Request & Code Review Workflow" document confirms the review-budget thresholds (~15 files/~400 lines preferred, ~25 files/~800 lines hard-flag, 5-PR-per-stack limit) and the approved-prefix list are organisation-wide standards, not `ls-theme`-specific tuning — so they ship as the agent's built-in defaults. The override file exists only for a repository with a genuine, documented exception to one of those defaults. `lightspeedwp/.github` itself needs no such file, since the org-wide defaults already equal its own values.

**Alternatives considered**: Environment variables passed at invocation. Rejected — a checked-in file is visible and reviewable alongside a repository's other conventions (the same pattern `.github/PULL_REQUEST_TEMPLATE/config.yml` already establishes), where an environment variable would be invisible to anyone reading the repository.

## Decision: Keep the existing cross-skill integration test suite at the agent root; move only per-skill unit tests into each skill's own folder

**Rationale**: `agents/pr-agent/__tests__/integration/` (e.g. `sequential-skill-execution.test.js`, `real-github-workflows.test.js`) exercises multiple skills together — it has no single correct "owning" skill folder under the Agent Skills specification's per-skill `scripts/`/`scripts/__tests__/` convention. Leaving it at the agent root, while moving each skill's own `*.test.js` into that skill's new `scripts/__tests__/`, matches the common convention of colocating unit tests with their source while keeping integration tests at the level that reflects what they actually integrate.

**Alternatives considered**: Assign the integration suite to whichever skill it most exercises (e.g. `orchestrate-pr-creation/`). Rejected — misrepresents ownership; a future reader would reasonably assume that skill folder's tests only cover that skill.

## Decision: `docs/ISSUE_PR_TITLE_GOVERNANCE.md` governs PR title format, not `instructions/pull-requests.instructions.md` §4

**Rationale**: The 2026-09-23 doc-alignment audit found these two documents specify genuinely different, incompatible title formats — not a detail/summary pair of the same rule. `ISSUE_PR_TITLE_GOVERNANCE.md` is the fuller, internally consistent spec (format, examples, scope rules, a type-shortening table, a documented CI-enforced regex); `pull-requests.instructions.md` §4 is a one-line format that also contradicts the governance doc's own explicit anti-pattern (placing the issue number in the title). The repository owner confirmed `ISSUE_PR_TITLE_GOVERNANCE.md` was recently and deliberately updated to be the current standard, resolving the conflict in its favour (2026-09-23 Clarification, FR-005b, FR-024).

**Alternatives considered**: Follow whichever doc was more recently updated (`pull-requests.instructions.md`, `last_updated: 2026-09-22`). Rejected — recency of a frontmatter timestamp isn't evidence of correctness, and the repository owner's direct confirmation is a stronger signal than file metadata. Merging both formats into a hybrid. Rejected — the two formats are structurally incompatible (bracketed vs. colon-delimited, issue-ref placement differs), and inventing a third hybrid format has no source of authority behind it.

## Decision: Minimum-required PR label families (`docs/LABEL_STRATEGY.md` §4B) are additive to, not a replacement for, the changelog-decision label

**Rationale**: `ls-theme` `SKILL.md` (Source B9) only ever discusses the changelog-decision label (`meta:needs-changelog`/`meta:no-changelog`) because `ls-theme` predates `LABEL_STRATEGY.md`'s current form. This repository's own canonical labeling doc requires one `status:*`, one `type:*`, one `priority:*`, at least one `area:*`/`comp:*`, and one `release:*` label on every PR — a stricter, wider rule than Source B9 alone implies. FR-012a incorporates this without weakening FR-012's existing atomic-set/never-invent-a-label requirements (FR-010).

**Alternatives considered**: Treat this as out of scope since it's not in Source B9. Rejected — Source B9 being the primary behavioural reference doesn't make it the *only* source; the spec's own stated goal (matching this repository's canonical documentation) requires incorporating a confirmed, concrete, currently-unimplemented rule found in this repository's own docs.

## Decision: `docs/PR_GOVERNANCE.md`'s per-branch-type PR-body section requirements are incorporated as FR-025, with FR-011's structure as fallback

**Rationale**: `PR_GOVERNANCE.md` is explicitly tied to real CI workflows (`pr-template-routing`, `Validate PR Template`) whose purpose is to reject incomplete PRs before they waste CI/Mergify credits. An agent generating PR bodies that don't satisfy these patterns would have its own PRs rejected by this repository's own automation — a direct, avoidable regression. The doc's "Specification & Reference" status (not yet enforced in CodeRabbit's schema) doesn't reduce its relevance: it documents the target shape the CI workflows are built toward, and it predates none of this agent's design decisions the way `ls-theme` does.

**Alternatives considered**: Wait until `PR_GOVERNANCE.md`'s status changes to "Enforced" before incorporating it. Rejected — the workflows it's tied to already exist and run today; treating the doc as inactive because of its status label would mean shipping an agent that already fails a real, running CI check.

## Decision: The oversized-PR flag is informational only — the agent never recommends restructuring into a stack or parallel PRs

**Rationale**: A deep-research pass on stacked-PR best practices (GitHub, Google, Graphite guidance) confirmed the correct trigger for stacking is a genuine dependency relationship between independently-reviewable changes, never file/line count alone — and that the agent's own Story 1 delivery (three PRs partitioning one conceptual change) was itself an example of the anti-pattern the research warns against. Applying that finding literally would have meant teaching the agent to actively recommend a stack whenever a PR is oversized. On reflection, that's wrong for a different reason specific to *when* this agent runs: per `ls-theme` `SKILL.md`'s own scope, `pr-agent` only creates/updates a PR for a branch whose commits already exist — it never creates branches or reorganises commits. By the time it runs, the one-PR/parallel/stack decision has already been made by the human, upstream. Recommending a stack at that point isn't a choice the agent can help execute — it's a request for rework (unpicking commits, creating new branches, rebasing) the agent has no means to perform itself. So FR-008 keeps the size calculation and flag (a real organisational requirement, independent of stacking), but strips the "recommend a stack" language entirely — the flag exists to support the flagged-PR carrying a documented exception, not to trigger restructuring advice.

**Alternatives considered**: Add the dependency-based "stack test" (can the lower layer be independently approved, does the upper genuinely need it, could the lower safely merge alone) as a live check this skill runs before flagging an oversized PR. Rejected for this skill's scope — the test is real and useful, but only at the point someone is *deciding how to structure upcoming work*, which is before branches/commits exist, not at PR-creation time. Keeping it here would produce exactly the disruptive, unexecutable advice this decision is trying to avoid. It may be worth a brief forward-looking note in `AGENT.md` ("this was oversized; consider structuring similar future work as a stack from the start") but that's advisory documentation, not a blocking recommendation, and is not required by any FR.

## Decision: Flag, don't fix, this feature's own non-compliant branch name

**Rationale**: The working branch (`feature/pr-agent-consolidation-portability`) predates this plan and already holds uncommitted work; a planning document performing a `git branch` rename as a side effect would be a surprising, unrequested action. Documented explicitly in `plan.md`'s Complexity Tracking table instead, with a concrete recommended rename before this work is pushed or opened as a PR.

**Alternatives considered**: Silently proceed without flagging it. Rejected — this is the exact class of discrepancy (a `feature/` prefix matching no documented convention) the spec's own Edge Cases section already calls out generically; letting the plan's own branch exemplify it unflagged would be inconsistent.
