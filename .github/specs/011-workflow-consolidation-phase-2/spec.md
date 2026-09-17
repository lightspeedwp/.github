---
feature: "Workflow Consolidation Phase 2 — Unified Workflow Implementation"
date_created: "2026-09-14"
phase: 2
parent_epic: "Workflow Consolidation Initiative 2026-Q4"
related_issue: "#2902"
status: "planning"
---

# Phase 2: Unified Workflow Implementation

## Overview

Phase 2 consolidates 71 archived workflows into 5 unified consolidated workflows, eliminating duplicate code and reducing GitHub Actions minutes by a hard minimum of ≥15% (baseline: ~2,500 minutes/month → target: ≤2,125/month).

## Clarifications

### Session 2026-09-14

- Q: What is "Option A" and the GitHub Actions minute baseline? → A: Phase 1 baseline: ~2,500 minutes/month. Option A is alternative consolidation pattern (not selected). Success criterion: maintain or reduce to ≤2,500 minutes/month.
- Q: What does "full test coverage" mean? → A: Functional coverage (all critical paths execute), integration coverage (routes events correctly), scenario coverage (primary/error/edge cases). No hard line-coverage target.
- Q: What is the rollback strategy and error boundary? → A: Rollback to archived Phase 1 versions (preserved in archived/2026-09-11/). Error boundary: single workflow type fails safely without cascading. Max failure impact: one workflow type fails, others continue.
- Q: Is 15-20% reduction a hard requirement? → A: Hard requirement—must achieve ≤15% reduction (target: 2,125 minutes/month max). If not met, defer Phase 2 and revisit architecture. Acceptance gate: PR cannot merge unless minutes target met.
- Q: What does "passing CI" mean? → A: All GitHub Actions checks green on feature branch. Workflows tested on actual PR/issue events. Production readiness: Phase 2 cannot merge until all 5 unified workflows pass CI for ≥3 consecutive runs on feature branch.
- Q: Should all 7 phases be on a single feature branch or split into multiple branches? → A: Single feature branch `refactor/workflow-consolidation-phase-2` for all phases (Setup, Foundational, US1-US5, Integration), with sequential/parallel commits per phase plan.
- Q: How should commits be merged — squash, merge commit, or rebase? → A: Merge commit to preserve phase boundaries in git history, enabling phase-by-phase tracking and selective rollback if needed.
- Q: When should the PR be approved — after each phase or after all phases complete? → A: Single approval after all 7 phases complete and hard requirements verified (≥15% reduction, all 5 workflows passing CI ≥3 times).
- Q: How should parallel phases (US2 & US3) be coordinated on a single branch? → A: Both US2 and US3 can commit to the feature branch in parallel; CI tests both workflows together without file-level conflicts.
- Q: How to handle upstream changes during the 7-phase development cycle? → A: Merge develop into feature branch when critical upstream changes occur; avoid rebasing to preserve phase commit history.

### Session 2026-09-17

- Q: What is the actual hard requirement for GitHub Actions minutes reduction — is it minimum ≥15% reduction or a target range of 15–20%? → A: Hard minimum: ≥15% reduction required (≤2,125/month baseline from ~2,500). If achieved <15%, PR cannot merge. Anything ≥15% passes merge gate; 15–20% range was aspirational but not enforced.
- Q: When labeling-unified.yml fails on a PR, what should happen operationally to other workflows? → A: Isolated failure model: labeling-unified fails → PR status check shows only "labeling" as failed; validation, testing, linting, quality-gates remain unaffected (pass/fail independently). Dependent systems receive last-known-good label state or use fallback logic. No cascade to other workflows.
- Q: What specific test coverage targets should Phase 2 require — line coverage %, branch coverage %, or functional coverage only? → A: Hybrid coverage: Composite actions (apply-labels, validate-check, aggregate-tests, collect-metrics) require ≥80% line coverage (reusable, shared logic). Unified workflows require 100% functional coverage (all critical paths, primary/error/edge cases); line % not enforced for workflows.
- Q: Should Phase 2 scope explicitly address footer insertion logic and badge validation? → A: Defer to Phase 2.1 (immediate follow-up). Phase 2 excludes footer/badge logic; document as "Phase 2.1 Consolidation Enhancements" with separate issue. Keeps Phase 2 focused on workflow consolidation, reduces timeline risk, faster Phase 2 delivery.

## Branch Strategy

### Feature Branch

**Branch Name:** `refactor/workflow-consolidation-phase-2` (follows CLAUDE.md naming: `{type}/{scope}-{title}`)

**Duration:** All 7 phases (Setup, Foundational, US1-US5, Integration) remain on this single feature branch for the entire development cycle.

**Base Branch:** `develop` (standard development integration branch per project workflow)

**Protection Rules:**

- All commits must pass CI before merge
- PR requires explicit approval (see Approval Gates below)
- Hard requirements (performance target, CI passes) must be met before merge is allowed

### Commit Organization

| Phase | Commit Pattern | Example |
|-------|---|---|
| Setup | `phase(setup): <description>` | `phase(setup): measure baseline github actions minutes` |
| Foundational | `phase(foundational): <description>` | `phase(foundational): create composite actions framework` |
| US1 | `phase(us1): <description>` | `phase(us1): implement labeling-unified.yml` |
| US2/US3 (parallel) | `phase(us2/us3): <description>` | `phase(us2): implement validation-unified.yml` and `phase(us3): implement testing-unified.yml` (parallel) |
| US4/US5 | `phase(us4/us5): <description>` | `phase(us4): implement linting-unified.yml` |
| Integration | `phase(integration): <description>` | `phase(integration): validate all workflows and performance targets` |

**Attribution:** All commits include co-authorship line: `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>`

### Parallel Development (US2 & US3)

Both validation-unified.yml (US2) and testing-unified.yml (US3) can commit to the feature branch simultaneously:

- **No file-level conflicts:** US2 writes to `.github/workflows/validation-unified.yml`, US3 writes to `.github/workflows/testing-unified.yml`
- **Parallel CI testing:** GitHub Actions tests both workflows together on each push
- **Coordination:** Both must pass their respective ≥3 consecutive CI runs (measured independently but executed together)

### Approval Gates

**Hard Requirements (Merge Blockers):**

1. ✅ All 5 unified workflows passing CI for ≥3 consecutive runs on feature branch
2. ✅ GitHub Actions minutes ≤2,125/month (≥15% reduction from baseline ~2,500/month)
3. ✅ Error isolation validated (single workflow failure does not cascade)
4. ✅ All acceptance criteria met per Success Criteria section

**Approval Process:**

- PR created as draft when feature branch is pushed
- PR marked ready-for-review only after all 7 phases complete
- Explicit approval required from code reviewer (acknowledges hard requirements met)
- PR can merge only after approval + all CI checks pass + hard requirements verified

**Rationale:** Phase 2 is a feature unit; intermediate approvals would be premature since hard requirements depend on measuring all 5 workflows together.

### Merge Strategy

**Method:** Merge commit (preserves all phase commits)

**Expected Merge Commit:**

```
Merge branch 'refactor/workflow-consolidation-phase-2' into develop

Phase 2: Consolidate 71 archived workflows into 5 unified workflows
- Setup: Baseline measurement and infrastructure
- Foundational: Composite actions framework
- US1: labeling-unified.yml (9 workflows)
- US2: validation-unified.yml (12 workflows)
- US3: testing-unified.yml (8 workflows)
- US4: linting-unified.yml (2 workflows)
- US5: quality-gates.yml (5 utilities)
- Integration: Performance validation and cutover

GitHub Actions minutes: X → Y (Z% reduction, target ≤15%)
```

**Rationale:** Merge commits preserve phase boundaries in production history, making it easy to see which phases were included and to selectively revert phases if needed post-deploy.

### Handling Upstream Changes

**When `develop` receives critical changes (e.g., label updates, template changes):**

1. **Identify impact:** Assess whether upstream change affects Phase 2 workflows
2. **Merge approach:** Use `git merge develop` to integrate upstream changes into feature branch
3. **Conflict resolution:** Resolve conflicts preserving both upstream changes and phase commits
4. **Re-test:** Run CI to validate workflows still pass with upstream integration
5. **No rebase:** Avoid `git rebase develop` to preserve phase commit history

**Example:**

```bash
git fetch origin develop
git merge origin/develop
# Resolve any conflicts
git push origin refactor/workflow-consolidation-phase-2
# Await CI results
```

### Rollback Strategy

**During Feature Branch Development:**

- If a phase fails hard requirements, that phase is reworked on the same branch (no branch deletion)
- If entire feature must be abandoned, feature branch is deleted and develop remains unaffected

**After Merge to Develop:**

- All archived Phase 1 workflows preserved in `.github/workflows/archived/2026-09-11/`
- Rollback procedure documented in `PHASE2_ROLLBACK.md`
- Rollback is callable within 15 minutes: restore archived workflow files, disable unified workflows

**Post-Production (if needed):**

- Revert merge commit: `git revert -m 1 <merge-commit-sha>`
- Restore archived workflows to active directory
- Deploy hotfix to production

### Branch Cleanup

**After Merge:**

- Feature branch is deleted from remote once PR is merged
- Local branch can be deleted with `git branch -d refactor/workflow-consolidation-phase-2`

**Rationale:** Single feature branch simplifies management; no need to maintain multiple per-phase branches post-merge.

## Deliverables

1. **labeling-unified.yml** — Unified labeling engine (9 archived workflows)
2. **validation-unified.yml** — Unified validation gate (12 archived workflows)
3. **linting-unified.yml** — Unified code quality linting (2 archived workflows)
4. **quality-gates.yml** — Unified security and quality gates (5 utilities)
5. **testing-unified.yml** — Unified test orchestration (8 archived workflows)

## Success Criteria

### Measurable Outcomes

1. **Performance Target (Hard Requirement):** Achieve ≤15% reduction in GitHub Actions minutes (baseline: 2,500/month → target: ≤2,125/month)
2. **All 5 Unified Workflows Passing CI:** GitHub Actions checks green on feature branch for ≥3 consecutive runs
3. **Functional Coverage (100%):** All critical workflow paths (labeling, validation, testing, linting, quality-gates) execute successfully; primary flows, error cases, and edge cases all addressed in test suite
4. **Composite Action Line Coverage (≥80%):** Apply-labels, validate-check, aggregate-tests, and collect-metrics composite actions tested for ≥80% line coverage (reusable shared logic requires higher rigor)
5. **Integration Coverage:** Each unified workflow correctly routes events to downstream systems
6. **Rollback Capability:** Documented rollback procedure to Phase 1 archived versions; tested and validated
7. **Error Isolation (Isolated Failure Model):** When one unified workflow fails (e.g., labeling-unified.yml), other workflows (validation, testing, linting, quality-gates) continue independently. PR status check reports only the failed workflow's status; others report pass/fail based on their own execution. Dependent systems use last-known-good state or fallback logic; no cascade to other workflows.
8. **Complete Documentation:** Architecture guide, consolidation mapping, rollback procedure, operational runbook

## Timeline

- Oct 1-5: New workflow development
- Oct 6-10: Integration testing
- Oct 11-15: Cutover preparation
- Oct 16-31: Production deployment and monitoring

## Risk Assessment

- **Critical:** Unified workflows must not introduce new failure modes; error isolation tested and validated
- **Critical:** Performance target (≤15% reduction) is hard merge requirement—Phase 2 deferred if not achievable
- **Critical:** Rollback procedure documented, tested, and callable within 15 minutes
- **High:** Ensure backward compatibility with existing automation; all archived workflows behavior preserved
- **High:** GitHub Actions minutes baseline must be measured before and after consolidation
- **Medium:** Performance optimization under concurrent load; no performance regression allowed
- **Medium:** Composite actions reused; coupling with Phase 1 architecture must be explicit

## Phase 2.1: Consolidation Enhancements (Follow-up Scope)

**Deferred to immediate follow-up after Phase 2 merge:**

- Footer insertion de-duplication logic (prevent duplicate footers in PR descriptions)
- Badge validation and application rules (workflow status badges, coverage badges)
- Mergify dependabot merge frequency configuration (daily/hourly automation)

These are related but distinct from core workflow consolidation. Phase 2.1 will be scoped as separate feature branch after Phase 2 ships. Tracked in separate GitHub issue: `[FEATURE-REQUEST] Phase 2.1: Footer & Badge Management`
