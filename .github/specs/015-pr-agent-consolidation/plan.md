# Implementation Plan: PR Agent Consolidation & Portability

**Branch**: `aiops/pr-agent-consolidation-portability` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/015-pr-agent-consolidation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Consolidate `agents/pr-agent/` and `agents/pr-creation-agent/` into a single, Agent Skills-spec-compliant, portable `pr-agent`, fixing a verified bug (`validate-branch-name.js`'s forbidden-prefix list contradicts this repository's own `docs/BRANCHING_STRATEGY.md`/constitution routing table), absorbing the fully validated PR-creation behaviour from `lightspeedwp/ls-theme` PR #53 into the six existing (already tested) skills without discarding their current `.js` logic or Jest coverage, and making the whole agent portable via dynamic runtime resolution (assignee, base branch) plus organisation-wide defaults with one new optional per-repository override file for review-budget thresholds and the approved-prefix list.

## Technical Context

**Language/Version**: No new language for the agent's own instructions — `AGENT.md`/`SKILL.md` remain Markdown, interpreted by an AI coding agent. The six skills' executable logic stays Node.js/JavaScript (matching the existing `.js` files' current runtime — ES modules per `agents/pr-agent/package.json`'s `"type": "module"`).

**Primary Dependencies**: `git` and the GitHub CLI (`gh`) for all branch/PR/label/user-identity operations; the existing `agents/pr-agent/skills/*.js` implementations and their Jest test suites (preserved, not replaced); this repository's own `docs/BRANCHING_STRATEGY.md` and `.specify/memory/constitution.md` (Branch Type to PR Template Routing table) as the canonical, single source for the approved/forbidden prefix lists; `.github/PULL_REQUEST_TEMPLATE/config.yml` for PR-template routing.

**Storage**: N/A for the agent's own re-derived-per-invocation state (per spec FR-005/FR-019, matching `ls-theme`'s own "no persistent state" design) — the one genuine piece of persisted state this feature introduces is the new, optional, per-repository override file (`.github/pr-agent.config.json`), read but never written by the agent itself.

**Testing**: Jest for the six skills' existing and extended unit-level logic (`scripts/__tests__/` per skill, per the Agent Skills restructuring), with the existing cross-skill integration suite kept at `agents/pr-agent/__tests__/integration/` rather than being forced into one skill's folder. The agent's own higher-level orchestration instructions remain validated the same way `ls-theme`'s `SKILL.md` was — a runnable `quickstart.md` of live scenarios — since a Markdown instruction file has no applicable unit-test framework.

**Target Platform**: Claude Code (or another agentskills.io-compatible agent) with Bash/Node/`gh`-CLI access, operating first-class inside `lightspeedwp/.github`, and portable to any other LightSpeedWP repository it is installed into.

**Project Type**: Agent (one consolidated agent directory — `AGENT.md` plus six restructured skills, each a mix of Markdown instructions and tested Node.js logic) — not a library, service, or application in the traditional sense.

**Performance Goals**: N/A — not a running service; success is correctness of the resulting agent behaviour and portability, not latency/throughput.

**Constraints**:

- MUST NOT modify any LOCKED file (`.github/labels.yml`, `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/*.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`) as part of this feature — per constitution Principle II, any such change requires a separate `[TEMPLATE-UPDATE-REQUEST]`/`[LABEL-UPDATE-REQUEST]` issue and @ashley's explicit approval. This specifically means the five-missing-routing-entries discrepancy noted in spec Edge Cases stays a flagged, deferred issue — this feature does not touch `config.yml`'s routing table itself.
- MUST use UK English throughout every file this feature creates or edits (constitution Principle VI, non-negotiable) — `spec.md` has already been corrected (`behavior`→`behaviour`, `recognize`→`recognise`, etc.); the same applies to `AGENT.md`, every `SKILL.md`, `README.md`, and `CHANGELOG.md` produced by this work.
- MUST NOT fabricate verification results (spec FR-019); MUST preserve 100% of existing Jest test coverage through the restructuring (spec FR-020, SC-006).
- Changelog entries this feature's own work produces MUST themselves comply with constitution Principle IX (≤250 characters, user-focused, 100% linked to a PR/issue).

**Scale/Scope**: Single agent directory (`agents/pr-agent/`); six existing skills restructured (not created from scratch); one new optional config-file schema; no new services, no new top-level folders, no changes to any other agent in this repository.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applicability | Result |
|---|---|---|
| I. Organisation-Wide Governance Authority | This agent *enforces* standards defined elsewhere in this repo (branch naming, PR templates) rather than inventing its own. | PASS |
| II. Curated Assets with Locked Governance | Directly applicable — see Constraints above. This feature fixes a bug in the agent's own code (not a LOCKED file) and explicitly defers the LOCKED-file discrepancy (missing `config.yml` routing entries) to a separate governance process rather than fixing it inline. | PASS (compliant by deferral, not by touching the LOCKED file) |
| III. Clear Asset Boundaries (No Duplication) | `agents/pr-agent/` already lives at the correct top-level `agents/` location (not under `.github/`), consistent with this principle. | PASS |
| IV. Technology-Agnostic Guidance | This feature's own portability requirement (spec User Story 3) is a direct instance of this principle applied to an agent rather than a guidance doc. | PASS |
| V. Branch Naming Strategy is Non-Negotiable | Directly implements/enforces this principle via FR-003/FR-004. This feature's own working branch was originally created as `feature/pr-agent-consolidation-portability` — not one of the 38 authorised types — and was renamed to `aiops/pr-agent-consolidation-portability` before any PR was opened. See Complexity Tracking below. | PASS (renamed before PR opened) |
| VI. UK English, Accessibility, Security Standards | Directly applicable to every file this feature writes. `spec.md` corrected during this planning pass (see Technical Context). Every subsequent artifact (`AGENT.md`, `SKILL.md`s, `README.md`, `CHANGELOG.md`) MUST be written in UK English and hold the WCAG 2.2 AA bar unconditionally — no reconciliation needed here, unlike `ls-theme`'s constitution, since this repository's Principle VI already sets 2.2 AA as the single, universal baseline. | PASS (corrective action taken) |
| VII. Specification Quality Standards | `spec.md` and `checklists/requirements.md` already validated: 15/15 checklist items passing, one clarification session resolved, zero remaining `[NEEDS CLARIFICATION]` markers. | PASS |
| VIII. Branch Strategy Compliance & Automated Enforcement | Same routing table as Principle V; this feature's agent enforces it. Same branch-name resolution as Principle V applies. | PASS (renamed before PR opened) |
| IX. Requirements-Driven Quality & Changelog Compliance | Directly relevant to the `Changelog Entry` entity and FR-013/FR-021 — carried forward into `data-model.md`'s constraints (≤250 chars, user-focused, linked to PR/issue). | PASS (constraint carried into design) |
| X. Automated Validation & Metrics-Driven Governance | Org-wide metrics dashboards are a separate, existing concern this single-agent feature does not build or modify. | PASS (N/A) |

*Re-checked after Phase 1 design (data-model.md, contracts/, quickstart.md): no new dependencies, architecture, or source/test directories were introduced beyond what's documented below — the gate results above are unchanged. The Principle V/VIII flag remains open as a maintainer housekeeping item, not a design defect.*

## Project Structure

### Documentation (this feature)

```text
.github/specs/015-pr-agent-consolidation/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── pr-agent-invocation.md
│   └── repository-override-config.schema.json
└── tasks.md             # Phase 2 output (/speckit-tasks command — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
agents/pr-agent/
├── AGENT.md                          # Merged instruction set (was AGENT.md + pr-creation.agent.md)
├── README.md                         # New (FR-021)
├── CHANGELOG.md                      # New (FR-021)
├── package.json                      # Fixed name/repository.directory (was pointing at pr-creation-agent)
├── package-lock.json
├── eslint.config.js                  # Adopted from pr-creation-agent (the only working flat config either dir had)
├── __tests__/
│   └── integration/                  # Existing cross-skill suite — kept at this level, untouched location
│       ├── setup.js
│       ├── real-github-workflows.test.js
│       ├── performance-edge-cases.test.js
│       ├── sequential-skill-execution.test.js
│       ├── label-application-scenarios.test.js
│       ├── template-routing-scenarios.test.js
│       └── error-recovery-workflows.test.js
└── skills/
    ├── route-pr-template/
    │   ├── SKILL.md                  # Filled in (was template-skill placeholder)
    │   ├── scripts/
    │   │   ├── route-pr-template.js
    │   │   └── __tests__/route-pr-template.test.js
    │   └── references/               # → docs/BRANCHING_*.md, docs/PR_*.md (pattern references, FR-022)
    ├── handle-pr-errors/              # Same shape as above
    ├── validate-branch-name/          # Same shape; validate-branch-name.js's prefix lists fixed (FR-003/FR-004)
    ├── orchestrate-pr-creation/       # Same shape; absorbs ls-theme SKILL.md's Step 1/2 + self-review-gate logic
    ├── validate-and-apply-labels/     # Same shape; absorbs changelog-decision-label logic (FR-012/FR-013)
    └── submit-pr/                     # Same shape; absorbs stack/draft/ready-for-review logic (FR-014–FR-016)

# Removed entirely, only after User Story 1's file-by-file inventory confirms
# every one of its 5 files has a recorded disposition (folded in / superseded /
# discarded-with-reason) — not just its pr-creation.agent.md:
# agents/pr-creation-agent/
#   ├── pr-creation.agent.md      → folded into AGENT.md (rewritten, not copied)
#   ├── eslint.config.js          → becomes agents/pr-agent/eslint.config.js (the
#   │                                only working flat config either dir has)
#   ├── __tests__/eslint-config.test.js → relocated alongside it
#   ├── package.json              → superseded (pr-agent's own package.json is
#   │                                corrected instead of adopting this one)
#   └── package-lock.json         → discarded (regenerated for pr-agent's own
#                                    corrected package.json)
```

**Structure Decision**: Single consolidated agent at `agents/pr-agent/`, per Source A's proposed structure layered with the Agent Skills specification's per-skill `scripts/`/`references/`/`assets/` shape. No new top-level folder, no new service — this is a restructuring of what already exists at `agents/pr-agent/` and `agents/pr-creation-agent/`, not a new component.

**Delivery Decision**: Rather than one branch/PR for all of User Story 1, the work was split into three stacked branches to stay within the review budget in LightSpeed's Pull Request & Code Review Workflow (≈15 files preferred, ≈25 hard cap, stack ≤5 PRs):

1. `aiops/pr-agent-consolidation-portability` → `develop` — this spec's planning docs, plus the `package.json`/`AGENT.md`/`eslint.config.js` fixes and dependency corrections (14 files)
2. `refactor/pr-agent-skills-restructure` → branch 1 — the six-skill Agent Skills restructuring (23 files)
3. `fix/pr-agent-branch-name-validation` → branch 2 — the `validate-branch-name.js` prefix-list fix, deferred lint verification, `pr-creation-agent` deletion, and `README.md`/`CHANGELOG.md` (~10 files)

Each PR's body states its stack position, depends-on/followed-by links, and review scope per that workflow's Section 4 format; only the final layer (if any) uses a closing issue keyword.

## Complexity Tracking

*No open violations. The one flagged during planning (below) was resolved before any PR was opened.*

| Violation | Why Needed | Resolution |
|---|---|---|
| Working branch `feature/pr-agent-consolidation-portability` used a prefix (`feature/`) outside the constitution's 38 authorised types (Principles V/VIII) | The branch was created mid-session, off current `develop`, before this plan existed, and already held the untracked planning brief and this spec's own files | Renamed to `aiops/pr-agent-consolidation-portability` (matching this work's own `type:aiops` Linear label and `LS-4214`'s Linear-generated branch name) before any PR was opened — confirmed safe since a branch rename touches no commit content or history. |
