---
title: Next Issues Execution Plan
description: Comprehensive execution plan for all open issues, active projects, and
  strategic workflows.
version: v2.2.6
created_date: '2026-05-28'
last_updated: '2026-06-03'
file_type: documentation
maintainer: LightSpeed Team
authors:
- Codex
license: GPL-3.0
tags:
- planning
- issues
- execution
- governance
- roadmap
domain: governance
stability: stable
status: active
---

# Next Issues Execution Plan

## 2026-06-03 Branch Governance Hardening Kickoff

- New active project folder created: `.github/projects/active/branch-governance-hardening/`
- Focus: convert the branch strategy docs into enforceable rulesets, workflow checks, and AI branch-selection guardrails.
- The intent is to stop new work batches from being started on reused branches and to make the repo reject invalid branch state before mutation steps run.
- Next step: create and propose the strict issue chain in the new project pack, then implement the controls issue-by-issue.

## 2026-06-03 Awesome GitHub Site Planning Kickoff

- New active project folder created: `.github/projects/active/awesome-github-site/`
- Delivery is split into two phases:
  - Phase 1: 1-3 page launchable MVP
  - Phase 2: full resource-style site expansion
- GitHub Pages target: custom subdomain `github.lightspeedwp.agency` with `lightspeedwp.github.io` as the Pages CNAME target.
- Source briefs were normalised into the project folder so the phase split can be planned without leaking talk-specific copy into the site plan.
- Created GitHub issues `[#756](https://github.com/lightspeedwp/.github/issues/756)` through `[#766](https://github.com/lightspeedwp/.github/issues/766)` for the phase 1 and phase 2 chains; next step is to keep the project register and launch docs aligned as implementation progresses.

## 2026-06-03 Awesome GitHub WCEU Expansion Update

- The WCEU 2026 folder was scanned end-to-end, including slides, references, notebook prompts, audit material, and readiness checklists.
- The public site now exposes the full conference slice:
  - WCEU talk page
  - slide index
  - one public page per slide
- Each slide page carries its own references and source markdown link, so the visible content stays traceable back to the repository.
- A light/dark mode switcher is now part of the shared shell and should remain in the launch checklist alongside accessibility and reference validation.
- Next step: keep the expanded WCEU pages aligned with the source tree, update the issue register if new public subpages are added, and prepare the next content page only after the current set is polished.

## 2026-06-01 v0.5.0 Readiness Execution Update (Block 1)

- `npm test` passed (`56/56` suites, `452/452` tests).
- `npm run validate:agents` passed.
- Additional blocker surfaced and fixed during gate verification:
  - `npm run validate:frontmatter` failed on 13 files in `.github/projects/active/refactor-migrate-prompts/*`.
  - Remediated invalid frontmatter schema usage (status enum and missing required metadata).
- Next in strict order: critical release safety bugs `[#587](https://github.com/lightspeedwp/.github/issues/587)`, `[#589](https://github.com/lightspeedwp/.github/issues/589)`, `[#590](https://github.com/lightspeedwp/.github/issues/590)`, `[#588](https://github.com/lightspeedwp/.github/issues/588)`.

## 2026-06-01 v0.5.0 Readiness Execution Update (Block 2)

- Scope executed: `[#746](https://github.com/lightspeedwp/.github/issues/746)` then `[#602](https://github.com/lightspeedwp/.github/issues/602)` with `[#599](https://github.com/lightspeedwp/.github/issues/599)`, `[#600](https://github.com/lightspeedwp/.github/issues/600)`, `[#601](https://github.com/lightspeedwp/.github/issues/601)` (coverage/reliability gate).
- Implemented test/reactivation work:
  - Added active planner/reviewer reliability suites:
    - `scripts/agents/__tests__/planner.agent.test.js`
    - `scripts/agents/__tests__/reviewer.agent.test.js`
  - Added module consistency guard:
    - `scripts/agents/__tests__/module-system-consistency.test.js`
  - Removed obsolete skipped test files:
    - `.jest-skip/planner.agent.test.js`
    - `.jest-skip/reviewer.agent.test.js`
- Implemented dry-run workflow support for reviewer execution:
  - `.github/workflows/reviewer.yml` now supports `workflow_dispatch` and `workflow_call` `dry-run` input and passes `DRY_RUN` env.
- Hardened agent runtime compatibility and testability:
  - Removed `import.meta`-based CLI entry guards in planner/reviewer agents in favour of script-path checks.
- Validation evidence:
  - Focused reliability suite: `20/20` tests passed.
  - Focused coverage: `planner.agent.js 82.20%`, `reviewer.agent.js 91.34%` statements.
  - Full readiness gates re-run: `validate:frontmatter`, `validate:workflows`, `validate:agents`, `validate:skill-manifests`, `validate:plugins`, and `npm test` all passing.
- Next in strict order: release completeness chain `[#594](https://github.com/lightspeedwp/.github/issues/594)`, `[#592](https://github.com/lightspeedwp/.github/issues/592)`, `[#591](https://github.com/lightspeedwp/.github/issues/591)`, `[#595](https://github.com/lightspeedwp/.github/issues/595)`, `[#593](https://github.com/lightspeedwp/.github/issues/593)`.

## 2026-06-01 v0.5.0 Readiness Execution Update (Block 3)

- Scope executed: release completeness chain `[#594](https://github.com/lightspeedwp/.github/issues/594)`, `[#592](https://github.com/lightspeedwp/.github/issues/592)`, `[#591](https://github.com/lightspeedwp/.github/issues/591)`, `[#595](https://github.com/lightspeedwp/.github/issues/595)`, `[#593](https://github.com/lightspeedwp/.github/issues/593)`.
- Implemented release safety/completeness work:
  - Added rollback automation utility:
    - `scripts/workflows/release/rollback.cjs` (`--version`, `--force`, `--dry-run`)
  - Strengthened release workflow post-release changelog validation:
    - `.github/workflows/release.yml` now runs `validate-changelog.cjs`, `changelogUtils --validate`, and `changelogUtils --unreleased` after release mutation.
  - Enforced explicit version/scope alignment in release agent with guarded override path:
    - `scripts/agents/release.agent.js` (`RELEASE_FORCE_VERSION=1` required for mismatch bypass).
  - Removed superseded duplicate release PR script:
    - `scripts/create-release-pr.cjs`
  - Completed release governance instructions body:
    - `instructions/release.instructions.md`
- Issue state updates completed:
  - Closed: `[#594](https://github.com/lightspeedwp/.github/issues/594)`, `[#592](https://github.com/lightspeedwp/.github/issues/592)`, `[#591](https://github.com/lightspeedwp/.github/issues/591)`, `[#595](https://github.com/lightspeedwp/.github/issues/595)`, `[#593](https://github.com/lightspeedwp/.github/issues/593)`.
- Next in strict order: launch-gate chain `[#729](https://github.com/lightspeedwp/.github/issues/729)`, `[#730](https://github.com/lightspeedwp/.github/issues/730)`, `[#731](https://github.com/lightspeedwp/.github/issues/731)`, then `[#728](https://github.com/lightspeedwp/.github/issues/728)`.

## 2026-06-01 v0.5.0 Readiness Execution Update (Block 4)

- Scope executed: launch-gate chain `[#729](https://github.com/lightspeedwp/.github/issues/729)`, `[#730](https://github.com/lightspeedwp/.github/issues/730)`, `[#731](https://github.com/lightspeedwp/.github/issues/731)`, then parent `[#728](https://github.com/lightspeedwp/.github/issues/728)`.
- Closure status:
  - Closed: `[#729](https://github.com/lightspeedwp/.github/issues/729)`, `[#730](https://github.com/lightspeedwp/.github/issues/730)`, `[#731](https://github.com/lightspeedwp/.github/issues/731)`, `[#728](https://github.com/lightspeedwp/.github/issues/728)`.
- Evidence basis:
  - Prior blocker chains (`[#746](https://github.com/lightspeedwp/.github/issues/746)`, `[#602](https://github.com/lightspeedwp/.github/issues/602)`, `[#599](https://github.com/lightspeedwp/.github/issues/599)`, `[#600](https://github.com/lightspeedwp/.github/issues/600)`, `[#601](https://github.com/lightspeedwp/.github/issues/601)`, `[#594](https://github.com/lightspeedwp/.github/issues/594)`, `[#592](https://github.com/lightspeedwp/.github/issues/592)`, `[#591](https://github.com/lightspeedwp/.github/issues/591)`, `[#595](https://github.com/lightspeedwp/.github/issues/595)`, `[#593](https://github.com/lightspeedwp/.github/issues/593)`) closed.
  - Required validation gates remained passing for release readiness.

## 2026-06-01 v0.5.0 Readiness Execution Update (Block 5)

- Scope evaluation completed for `[#614](https://github.com/lightspeedwp/.github/issues/614)`, `[#615](https://github.com/lightspeedwp/.github/issues/615)`, `[#616](https://github.com/lightspeedwp/.github/issues/616)`, `[#627](https://github.com/lightspeedwp/.github/issues/627)`, `[#628](https://github.com/lightspeedwp/.github/issues/628)`, `[#629](https://github.com/lightspeedwp/.github/issues/629)`, `[#632](https://github.com/lightspeedwp/.github/issues/632)`.
- Decision:
  - Closed as `not planned` for this milestone (post-release enhancement/debt scope; not blocking safe `v0.5.0` tagging).
- Meta tracker closeout:
  - Closed final tracker `[#747](https://github.com/lightspeedwp/.github/issues/747)` after all ordered chains and scope evaluations were completed.

## 2026-06-01 Audit Update (Canonical)

- Parent/child issue hierarchy repaired for open titled-child issues:
  - `[#654](https://github.com/lightspeedwp/.github/issues/654) [#655](https://github.com/lightspeedwp/.github/issues/655) [#656](https://github.com/lightspeedwp/.github/issues/656) [#657](https://github.com/lightspeedwp/.github/issues/657)` -> parent `[#649](https://github.com/lightspeedwp/.github/issues/649)`
  - `[#660](https://github.com/lightspeedwp/.github/issues/660) [#661](https://github.com/lightspeedwp/.github/issues/661)` -> parent `[#650](https://github.com/lightspeedwp/.github/issues/650)`
  - `[#664](https://github.com/lightspeedwp/.github/issues/664) [#665](https://github.com/lightspeedwp/.github/issues/665)` -> parent `[#651](https://github.com/lightspeedwp/.github/issues/651)`
  - `[#671](https://github.com/lightspeedwp/.github/issues/671) [#672](https://github.com/lightspeedwp/.github/issues/672) [#673](https://github.com/lightspeedwp/.github/issues/673)` -> parent `[#653](https://github.com/lightspeedwp/.github/issues/653)`
- Corrected status truth:
  - `[#514](https://github.com/lightspeedwp/.github/issues/514)` (Wave 3C) is **closed**.
  - `[#670](https://github.com/lightspeedwp/.github/issues/670)` (README refresh child) is **closed**.
  - `[#35](https://github.com/lightspeedwp/.github/issues/35)` (instruction audit) is **closed**.
- Active-project restructure completed:
  - `test-coverage-implementation.md` moved to `test-coverage-implementation/README.md`.
  - `issue-670-readme-refresh-tasks.md` moved to `issue-670-readme-refresh/README.md`.
  - `ISSUE_35_INSTRUCTION_AUDIT_SUMMARY.md` moved to `issue-35-instruction-audit/README.md`.
- Plugin-pack wave task list files currently have frontmatter stubs only and no matching open issues by title; issue creation/spec conversion required before execution.

## Executive Summary

This document serves as the **canonical execution roadmap** for all active work in the
LightSpeed `.github` repository. It consolidates:

- All open GitHub issues requiring implementation
- All active project artefacts and their status
- Workflow automation patterns (always-run vs. agent-triggered)
- Strategic initiatives including comprehensive README/Mermaid audits
- Agent ownership and wave assignments

**Live as of 2026-05-31**: All prior waves complete. Wave 5 Documentation Audit initiative created and ready for execution.

**Completed Waves**:

- ✅ Wave 1: API reference updates (PR [#494](https://github.com/lightspeedwp/.github/issues/494))
- ✅ Wave 2B: 7 agent spec upgrades (PRs [#515](https://github.com/lightspeedwp/.github/issues/515)–[#521](https://github.com/lightspeedwp/.github/issues/521))
- ✅ Wave 2D: `.coderabbit.yml` ([#23](https://github.com/lightspeedwp/.github/issues/23)) + `markdown.instructions.md` ([#31](https://github.com/lightspeedwp/.github/issues/31))
- ✅ Wave 3B: README & Mermaid diagram repairs ([#513](https://github.com/lightspeedwp/.github/issues/513))
- ✅ Wave 3D: WCEU 2026 talk assets audit ([#529](https://github.com/lightspeedwp/.github/issues/529))
- ✅ Wave 4A/4B/4D: Branding agent specs ([#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49))
- ✅ Wave 4C: Branding agent current-state audit ([#553](https://github.com/lightspeedwp/.github/issues/553))
- ✅ Wave 4D: Branding agent schema & config implementation ([#554](https://github.com/lightspeedwp/.github/issues/554))
- ✅ Wave 4E: Branding agent consolidation ([#555](https://github.com/lightspeedwp/.github/issues/555))
- ✅ Wave 4F: Branding agent remediation & validation ([#556](https://github.com/lightspeedwp/.github/issues/556))
- ✅ Workflow Consolidation Epic ([#503](https://github.com/lightspeedwp/.github/issues/503))

**Current Focus**:

- **Claude Code**: Executing Wave 5 Documentation Audit (5 parent + 24 child issues created [#649](https://github.com/lightspeedwp/.github/issues/649)–[#673](https://github.com/lightspeedwp/.github/issues/673)). Proceeding with first actionable audit task.
- GitHub Copilot: Previous Wave 2A/2C/3A/3C tasks available if capacity allows; defer to current priorities.

## Mandatory Agent Execution Split

This section is authoritative for who must execute each task stream.

- **GitHub Copilot must do**: Wave 2A (`[#476](https://github.com/lightspeedwp/.github/issues/476)`, `[#480](https://github.com/lightspeedwp/.github/issues/480)`, `[#482](https://github.com/lightspeedwp/.github/issues/482)`), Wave 2C (`[#488](https://github.com/lightspeedwp/.github/issues/488)`, `[#490](https://github.com/lightspeedwp/.github/issues/490)`), Wave 3A (`[#512](https://github.com/lightspeedwp/.github/issues/512)`), Wave 3C (`[#514](https://github.com/lightspeedwp/.github/issues/514)`), and plugin-pack execution task lists.
- **Claude Code must do**: Wave 2B (`[#470](https://github.com/lightspeedwp/.github/issues/470)`, `[#471](https://github.com/lightspeedwp/.github/issues/471)`, `[#473](https://github.com/lightspeedwp/.github/issues/473)`, `[#475](https://github.com/lightspeedwp/.github/issues/475)`, `[#478](https://github.com/lightspeedwp/.github/issues/478)`, `[#484](https://github.com/lightspeedwp/.github/issues/484)`, `[#486](https://github.com/lightspeedwp/.github/issues/486)`), Wave 2D (`[#31](https://github.com/lightspeedwp/.github/issues/31)`, `[#23](https://github.com/lightspeedwp/.github/issues/23)`), Wave 3B (`[#513](https://github.com/lightspeedwp/.github/issues/513)`), Wave 3D (`[#529](https://github.com/lightspeedwp/.github/issues/529)`), and Wave 4 branding/meta work (`[#33](https://github.com/lightspeedwp/.github/issues/33)`, `[#46](https://github.com/lightspeedwp/.github/issues/46)`, `[#48](https://github.com/lightspeedwp/.github/issues/48)`, `[#49](https://github.com/lightspeedwp/.github/issues/49)`).
- **No cross-execution**: Copilot must not execute Claude Code exclusive tasks, and Claude Code must not take over Copilot execution queues unless this file is explicitly revised.

## GitHub Copilot Continuation Mandate

GitHub Copilot is confirmed to continue the remaining Wave 2 implementation queue without handoff:

- **Wave 2A**: `[#476](https://github.com/lightspeedwp/.github/issues/476)`, `[#480](https://github.com/lightspeedwp/.github/issues/480)`, `[#482](https://github.com/lightspeedwp/.github/issues/482)`
- **Wave 2C**: `[#488](https://github.com/lightspeedwp/.github/issues/488)`, `[#490](https://github.com/lightspeedwp/.github/issues/490)`
- **Execution expectation**: proceed issue-by-issue from the current queue, complete scoped implementation and validation, and stop only when the work is packaged into PR-ready changes for merge back into `develop`.
- **Readiness bar**: acceptance criteria met, local validation completed, changelog/documentation updated where needed, and branch state suitable for opening a merge-ready PR.

---

## Active Project Files Inventory

### Currently Active Projects

| Project File | Status | Owner | Action |
| --- | --- | --- | --- |
| `github-workflow-consolidation-2026-05-28/` | ✅ COMPLETED - Epic [#503](https://github.com/lightspeedwp/.github/issues/503) closed, planning docs ready for archive | GitHub Copilot | Archive to `completed/` folder after final review |
| `branch-governance-hardening/` | 🆕 ACTIVE - Branch rulesets, workflow validation, and AI branch-selection guardrails | GitHub Copilot | Keep the issue pack, live issues, and rollout controls aligned |
| `launch-agents-checklist.md` | 🟡 IN PROGRESS - Partial test infrastructure fixes applied 2026-05-28 | LightSpeed Team | Complete remaining validation phases (critical pre-v1.0.0 release) |
| `awesome-github-site/` | 🟢 ACTIVE - Conference-ready WCEU site with slide subpages and theme switcher | Ash Shaw | Keep slide references, accessibility notes, and nav links aligned as the site expands |
| `spec-only-agents-issue-conversion-2026-05-28.md` | ✅ COMPLETED - All spec-only agents converted to issues ([#465](https://github.com/lightspeedwp/.github/issues/465), [#467](https://github.com/lightspeedwp/.github/issues/467), [#466](https://github.com/lightspeedwp/.github/issues/466), [#468](https://github.com/lightspeedwp/.github/issues/468), [#469](https://github.com/lightspeedwp/.github/issues/469)) | GitHub Copilot | Archive to `completed/` folder |
| `next-issues-execution-plan.md` | 📋 LIVING DOCUMENT - Updated 2026-05-29 with completion status and Wave 4C–4F allocation | Claude Code | Maintain and update continuously |
| `ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` | ✅ COMPLETED - Issue [#33](https://github.com/lightspeedwp/.github/issues/33) merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_46_TEMPLATE_DESIGN.md` | ✅ COMPLETED - Issue [#46](https://github.com/lightspeedwp/.github/issues/46) merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_48_CURRENT_STATE_AUDIT.md` | ✅ COMPLETED - Issue [#48](https://github.com/lightspeedwp/.github/issues/48) merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_49_SCHEMA_CONFIG_IMPLEMENTATION.md` | ✅ COMPLETED - Issue [#49](https://github.com/lightspeedwp/.github/issues/49) merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `branding-meta-agent-planning-2026-05-28.md` | ✅ COMPLETED - Comprehensive Wave 4 planning (issues [#33](https://github.com/lightspeedwp/.github/issues/33)–[#49](https://github.com/lightspeedwp/.github/issues/49) closed) | Claude Code | Archive to `completed/` folder |
| `PLANNING_SUMMARY_2026-05-28.md` | ✅ COMPLETED - Planning summary for completed branding/WCEU initiatives | Claude Code | Archive to `completed/` folder |
| `wave-3b-issue-spec.md` | ✅ COMPLETED - Issue [#513](https://github.com/lightspeedwp/.github/issues/513) closed, remediation work ready for Wave 4C | Claude Code | Archive to `completed/` folder |
| `wave-4-continuous-monitoring.md` | ✅ COMPLETED - Design spec ready for Wave 4C–4F implementation | Claude Code | Archive to `completed/` folder; reference in Wave 4C–4F tasks |
| `wave-3c-issue-spec.md` | ✅ ACTIVE - Awaiting GitHub Copilot execution on issue [#514](https://github.com/lightspeedwp/.github/issues/514) | GitHub Copilot | Maintain and track to completion |
| `plugin-pack-next-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (next wave) | GitHub Copilot | Execute and update per task completion |
| `plugin-pack-second-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (second wave) | GitHub Copilot | Track sequencing and dependencies across packs |
| `plugin-pack-third-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (third wave) | GitHub Copilot | Maintain as queued backlog for post-second-wave execution |
| `context-reduction-tasks.md` | ⏳ REQUIRES REVIEW - Needs audit for completion/archival status | TBD | Review and decide: archive or continue |
| `test-coverage-implementation.md` | ⏳ REQUIRES REVIEW - Needs audit for completion/archival status | TBD | Review and decide: archive or continue |
| `2025-12-11-wordpress-standards-compliance-comprehensive-review.md` | ⏳ REQUIRES REVIEW - Date-stamped archive candidate | TBD | Review and archive if complete |
| `wave-5-documentation-audit/` | 🆕 ACTIVE - 5 parent + 24 child audits created ([#649](https://github.com/lightspeedwp/.github/issues/649)–[#673](https://github.com/lightspeedwp/.github/issues/673)) | Claude Code | Execute audits in priority order; consolidate findings into implementation issues |

### Projects Eligible for Archival (Review First)

- `context-reduction-tasks.md` — verify completion status before archiving
- `test-coverage-implementation.md` — verify completion status before archiving
- `2025-12-11-wordpress-standards-compliance-comprehensive-review.md` — verify completion status before archiving

---

## Consolidated Wave Roadmap

### Wave 1 — Completed ✅

- `[#52](https://github.com/lightspeedwp/.github/issues/52)`: Update references from `create_issue` to `issue_write`
- Status: Merged via PR `[#494](https://github.com/lightspeedwp/.github/issues/494)`

### Wave 2 — In Progress 🟡

#### **Wave 2A: Core Runtime Agent Burn-Down** (GitHub Copilot)

Open issues:

- `[#476](https://github.com/lightspeedwp/.github/issues/476)` — [Next Ready]
- `[#480](https://github.com/lightspeedwp/.github/issues/480)` — [Queued]
- `[#482](https://github.com/lightspeedwp/.github/issues/482)` — [Queued]

Recently completed:

- `[#465](https://github.com/lightspeedwp/.github/issues/465)` (PR `[#497](https://github.com/lightspeedwp/.github/issues/497)`)
- `[#467](https://github.com/lightspeedwp/.github/issues/467)` (PR `[#500](https://github.com/lightspeedwp/.github/issues/500)`)
- `[#466](https://github.com/lightspeedwp/.github/issues/466)`, `[#468](https://github.com/lightspeedwp/.github/issues/468)`, `[#469](https://github.com/lightspeedwp/.github/issues/469)`

#### **Wave 2B: Mode & Planning Agent Batch** (Claude Code) ✅ COMPLETE

All 7 issues merged 2026-05-28:

- `[#470](https://github.com/lightspeedwp/.github/issues/470)` ✅ merged via PR `[#515](https://github.com/lightspeedwp/.github/issues/515)`
- `[#471](https://github.com/lightspeedwp/.github/issues/471)` ✅ merged via PR `[#516](https://github.com/lightspeedwp/.github/issues/516)`
- `[#473](https://github.com/lightspeedwp/.github/issues/473)` ✅ merged via PR `[#517](https://github.com/lightspeedwp/.github/issues/517)`
- `[#475](https://github.com/lightspeedwp/.github/issues/475)` ✅ merged via PR `[#518](https://github.com/lightspeedwp/.github/issues/518)`
- `[#478](https://github.com/lightspeedwp/.github/issues/478)` ✅ merged via PR `[#519](https://github.com/lightspeedwp/.github/issues/519)`
- `[#484](https://github.com/lightspeedwp/.github/issues/484)` ✅ merged via PR `[#520](https://github.com/lightspeedwp/.github/issues/520)`
- `[#486](https://github.com/lightspeedwp/.github/issues/486)` ✅ merged via PR `[#521](https://github.com/lightspeedwp/.github/issues/521)`

Wave 2D is now unblocked.

#### **Wave 2C: Scaffolds & Completion Batch** (GitHub Copilot)

Issues:

- `[#488](https://github.com/lightspeedwp/.github/issues/488)` — [Queued]
- `[#490](https://github.com/lightspeedwp/.github/issues/490)` — [Queued]

#### **Wave 2D: Documentation & Standards Audits** (Parallel Track) ✅ COMPLETE

Both issues merged 2026-05-28:

- `[#31](https://github.com/lightspeedwp/.github/issues/31)` ✅ merged via PR `[#523](https://github.com/lightspeedwp/.github/issues/523)` — `markdown.instructions.md` upgraded to v1.1
- `[#23](https://github.com/lightspeedwp/.github/issues/23)` ✅ merged via PR `[#522](https://github.com/lightspeedwp/.github/issues/522)` — `.coderabbit.yml` hardened and schema-aligned

---

### Wave 3 — README & Mermaid Diagram Audit 🆕 (HIGH PRIORITY)

**Objective**: Systematically review, repair, and maintain all 44 README.md files and embedded Mermaid diagrams across the repository.

**Status**: Proposed — requires GitHub issue creation and wave sequencing

**Scope**:

README inventory: 44 files identified across the repo structure

| Category | Count | Priority | Notes |
| --- | --- | --- | --- |
| Root & core | 6 | High | Main README, docs/, .github/ |
| Feature folders | 12 | High | agents/, skills/, workflows/, instructions/, etc. |
| Sub-folders | 20 | Medium | Plugin READMEs, downstream docs, hooks, etc. |
| Test/config | 6 | Low | Auto-generated or reference-only |

**Mermaid Diagram Audit**:

- Identify all Mermaid diagrams in README files
- Verify syntax validity (no parse errors)
- Check WCAG AA contrast and accessibility compliance (`accTitle`, `accDescr` attributes)
- Validate diagram relevance and update outdated flows
- Document findings in `.githu./.github/reports/mermaid-audit/`

**Completed & Proposed Sub-Waves**:

1. **Wave 3A: Discovery & Audit** ✅ CREATED (GitHub Copilot)
   - GitHub Issue: [#512 — Wave 3A: README & Mermaid Diagram Discovery & Audit](https://github.com/lightspeedwp/.github/issues/512)
   - Status: Ready for execution
   - Workflow: [`.github/workflows/readme-audit.yml`](../../workflows/readme-audit.yml) created
   - Deliverables: Audit report, findings.csv, audit-log.md
   - Scope: Scan all 44 README files, extract Mermaid diagrams, categorize issues
   - Effort: 2-3 hours
   - Owner: GitHub Copilot (Developer)

2. **Wave 3B: Repair & Update** ✅ ISSUE CREATED: [#513](https://github.com/lightspeedwp/.github/issues/513) (Claude Code)
   - GitHub Issue: [#513 — Wave 3B: README & Mermaid Diagram Repair & Update](https://github.com/lightspeedwp/.github/issues/513)
   - Status: Issue created; ready for execution
   - Scope: Fix Mermaid syntax, add accessibility attributes, update stale content
   - Deliverables: Updated 44 README files, repair-report.md, accessibility-audit.md
   - Effort: 4-6 hours
   - Owner: Claude Code (AI Team - Review & UX)
   - Dependencies: Awaits Wave 3A audit report

3. **Wave 3C: Workflow & Agent Coordination** ✅ ISSUE CREATED: [#514](https://github.com/lightspeedwp/.github/issues/514) (GitHub Copilot)
   - GitHub Issue: [#514 — Wave 3C: README Workflow & Agent Coordination Setup](https://github.com/lightspeedwp/.github/issues/514)
   - Status: Issue created; ready for execution
   - Scope: Create readme-update.yml workflow, integrate with Release Agent
   - Deliverables: readme-update.yml workflow, Release Agent integration, workflow-coordination.md updates
   - Effort: 1-2 hours
   - Owner: GitHub Copilot (Developer)
   - Dependencies: Awaits Wave 3A/3B completion

**Related Workflows**:

- `readme-regen.yml` — Already exists; runs on `.md` changes
- Future: `readme-audit.yml` — Proposed to validate Mermaid syntax, WCAG compliance, staleness
- Trigger: Combine manual dispatch + agent integration

---

## Wave 4 — Branding Meta Agent & Schema-Driven Footers (CLAUDE CODE EXCLUSIVE)

**Objective**: Implement a unified branding agent that automates category-aware Markdown headers, footers, and badges across the repository using schema-driven configuration.

**Status**: Planning phase ✅ COMPLETE (2026-05-28). Implementation phases (4C–4F) ready to allocate.

### Completed Sub-Waves

| Phase | Issues | Owner | Status | Completed |
| --- | --- | --- | --- | --- |
| **4A: Planning & Specification** | [#33](https://github.com/lightspeedwp/.github/issues/33) (parent), [#46](https://github.com/lightspeedwp/.github/issues/46) (templates), [#49](https://github.com/lightspeedwp/.github/issues/49) (schema) | Claude Code | ✅ MERGED | 2026-05-28 |
| **4B: Documentation & Governance** | [#48](https://github.com/lightspeedwp/.github/issues/48) (documentation) | Claude Code | ✅ MERGED | 2026-05-28 |

### Next Implementation Phases (Claude Code Allocation)

| Phase | Issues | Owner | Purpose | Dependencies |
| --- | --- | --- | --- | --- |
| **4C: Current-State Audit** | [#553](https://github.com/lightspeedwp/.github/issues/553) | Claude Code | Audit existing footers, identify duplicates, validate against category schema | Awaits: [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49) merged ✅ |
| **4D: Schema & Config Implementation** | [#554](https://github.com/lightspeedwp/.github/issues/554) | Claude Code | Build `agent-config.schema.json`, YAML validation rules, category definitions | Awaits: [#553](https://github.com/lightspeedwp/.github/issues/553) audit report |
| **4E: Agent Merge/Refactor** | [#555](https://github.com/lightspeedwp/.github/issues/555) | Claude Code | Consolidate header/footer/badge logic into unified branding agent | Awaits: [#554](https://github.com/lightspeedwp/.github/issues/554) schema merged |
| **4F: Remediation & Validation** | [#556](https://github.com/lightspeedwp/.github/issues/556) | Claude Code | Fix bad footers across README.md files, validate schema compliance | Awaits: [#555](https://github.com/lightspeedwp/.github/issues/555) agent merged |

**Key Implementation Deliverables**:

1. **4C Audit Report**: Current-state inventory of all `.md` files with footer/header/badge patterns
2. **4D Implementation**: Updated `agent-config.schema.json` + category YAML configuration
3. **4E Agent Code**: Unified branding agent with consolidated logic (replaces separate header/footer/badge concerns)
4. **4F Validation**: All `.md` files remediated + passing schema compliance checks

**Why Claude Code Exclusive?**:

This initiative requires coherent planning, architectural decisions, and schema-driven thinking to avoid:

- Hard-coded branding logic
- Duplicated footer enforcement across separate agents
- Schema drift between documentation and implementation
- Confusion about category taxonomy and template selection rules

Keeping this workstream under Claude ensures the entire system (planning → specification → implementation → validation) follows one coherent brief.

**Status Tracking (Planning)**:

- [x] Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (parent spec) completed and merged
- [x] Issue [#46](https://github.com/lightspeedwp/.github/issues/46) (template design) completed and merged
- [x] Issue [#49](https://github.com/lightspeedwp/.github/issues/49) (.schemas/config spec) completed and merged
- [x] Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (documentation) completed and merged

**Next Steps (Implementation — Claude Code)**:

- [x] Create Wave 4C issue ([#553](https://github.com/lightspeedwp/.github/issues/553) current-state audit)
- [x] Create Wave 4D issue ([#554](https://github.com/lightspeedwp/.github/issues/554) .schemas/config implementation)
- [x] Create Wave 4E issue ([#555](https://github.com/lightspeedwp/.github/issues/555) agent merge/refactor)
- [x] Create Wave 4F issue ([#556](https://github.com/lightspeedwp/.github/issues/556) remediation & validation)
- [ ] Execute [#553](https://github.com/lightspeedwp/.github/issues/553)–[#556](https://github.com/lightspeedwp/.github/issues/556) in sequence (ready to start)

---

## Wave 3D — WCEU 2026 Talk Planning ✅ COMPLETE

**Objective**: Audit talk assets and harden NotebookLM source prompts for the WordCamp Europe 2026 conference presentation.

**Status**: ✅ MERGED (2026-05-28, Issue [#529](https://github.com/lightspeedwp/.github/issues/529) closed)

**Scope Completed**:

- ✅ Audited `wceu-2026/` folder structure and content readiness
- ✅ Hardened NotebookLM source prompts with explicit develop-branch URLs
- ✅ Produced improvements plan with priority and effort estimates
- ✅ Updated `deep-research-prompt.md` with canonical sources and develop URLs
- ✅ Updated `source-ingestion-checklist.md` with canonical sources and develop URLs

**Deliverables Completed**:

1. ✅ Folder audit report (strengths, risks, artifacts, recommendations)
2. ✅ Updated `deep-research-prompt.md` with explicit develop URLs
3. ✅ Updated `source-ingestion-checklist.md` with explicit develop URLs
4. ✅ Canonical source set ingestion order (foundation → governance → plugin-packs → talk assets)
5. ✅ Acceptance checklist for NotebookLM source verification

**Owner**: Claude Code (AI Team - Review & UX)

**Completed**: Issue [#529](https://github.com/lightspeedwp/.github/issues/529) closed 2026-05-28 20:38:14Z

---

## Wave 5 — Documentation & Governance Audit Initiative 🆕 ACTIVE

**Objective**: Comprehensive audit of documentation, file organization, issue templates, labeling, and governance alignment across the repository.

**Status**: 🟡 ACTIVE (29 issues created 2026-05-31, parent + child tracking structure ready)

**Parent Issues (5 total)**:

| Issue | Title | Status | Owner |
| --- | --- | --- | --- |
| [#649](https://github.com/lightspeedwp/.github/issues/649) | Issue Templates, Automation, & AI Agent Integration | 🔴 Ready | Claude Code |
| [#650](https://github.com/lightspeedwp/.github/issues/650) | Canonical Config Files (labels, issue-types, issue-fields) | 🔴 Ready | Claude Code |
| [#651](https://github.com/lightspeedwp/.github/issues/651) | Documentation Consolidation - Reduce Duplication | 🔴 Ready | Claude Code |
| [#652](https://github.com/lightspeedwp/.github/issues/652) | 44 README Files - Mermaid Diagrams & Accessibility | 🟡 Follow-on (Wave 3B insights) | Claude Code |
| [#653](https://github.com/lightspeedwp/.github/issues/653) | File Organization - Align with CLAUDE.md Boundaries | 🔴 Ready | Claude Code |

**Scope**:

Wave 5 consolidates five parallel audit streams, each with 4-6 child issues:

- Issue template standardization and automation mapping (4 children)
- Canonical config files audit (4 children)
- Documentation consolidation and deduplication (5 children)
- README/Mermaid maintenance (4 children) — leverages Wave 3B audit report
- File organization alignment (3 children)

**Expected Deliverables**:

1. Audit reports for each domain (templates, config, docs, README, files)
2. Consolidation recommendations with prioritisation
3. Implementation issues for high-priority findings
4. Updated governance and automation documentation

**Dependencies**:

- Wave 5 audit findings → Wave 6 implementation issues
- Wave 3B README audit report already available for [#652](https://github.com/lightspeedwp/.github/issues/652)

---

## Workflow Automation Patterns

### 1. Always-Run Workflows (Automatic on Push/PR)

These workflows trigger automatically on code changes and **do not require agent coordination**.

| Workflow | Trigger | Purpose | Agent Involved? |
| --- | --- | --- | --- |
| `linting.yml` | push/PR on develop | Lint JS/TS/CSS/YAML | No (automatic) |
| `labeling.yml` | issue/PR/discussion events | Auto-apply labels | No (GitHub automation) |
| `issues.yml` | issue opened/edited | Template validation | No (GitHub automation) |
| `meta.yml` | PR opened/issues | Apply frontmatter validation | No (automatic) |
| `readme-regen.yml` | push/PR on `.md` files | Validate/regen README indices | No (automatic) |
| `testing.yml` | push/PR | Run Jest tests + coverage | No (automatic) |
| `changelog-validate.yml` | PR to develop | Validate CHANGELOG entries | No (automatic) |

### 2. Agent-Triggered or Manual Workflows

These workflows require **explicit agent invocation or manual dispatch** and coordinate with agents.

| Workflow | Trigger | Purpose | Agent Involvement |
| --- | --- | --- | --- |
| `release.yml` | workflow_dispatch + workflow_call | Semantic versioning + tag/release | Release agent triggers on demand |
| `planner.yml` | workflow_dispatch | Generate implementation plans | Planner agent triggers |
| `reporting.yml` | workflow_dispatch | Generate audit/metric reports | Reporting agent triggers |
| `reviewer.yml` | workflow_dispatch (manual) | Post PR review summaries | Reviewer agent uses manually |
| `metrics.yml` | workflow_dispatch + scheduled? | Collect repo health metrics | Metrics agent or scheduled |
| `project-meta-sync.yml` | workflow_dispatch | Sync project board metadata | Project Meta Sync agent triggers |

### 3. Proposed: New Agent-Triggered Workflows

| Workflow | Agent | Trigger | Purpose |
| --- | --- | --- | --- |
| `readme-audit.yml` | README Review Agent (new) | Agent dispatch | Validate Mermaid syntax, WCAG compliance, staleness |
| `readme-update.yml` | README Review Agent (new) | Agent dispatch | Apply fixes to README and Mermaid diagrams |

---

## Release Agent & Workflow Coordination

The **Release Agent** should coordinate the following workflows on demand:

1. **Pre-Release Tasks**:
   - Invoke `changelog-validate.yml` to verify changelog entries
   - Invoke `testing.yml` to confirm test suite passes
   - Invoke `linting.yml` to ensure code quality gates
   - Optionally invoke `metrics.yml` for release health snapshot

2. **Release Execution**:
   - Invoke `release.yml` with `workflow_call` to create tag/release
   - Monitor for success/failure

3. **Post-Release Tasks**:
   - Optionally invoke `readme-regen.yml` if version bumps README
   - Optionally invoke `reporting.yml` to generate release report

**Pattern**: Release agent should act as an orchestrator, calling workflows in sequence and validating outputs before proceeding to the next step.

---

## Agent Ownership & Wave Assignments

### GitHub Copilot

**Waves**: 2A, 2C, 3A (audit), 3C (workflow setup)

**Issues**:

- `[#466](https://github.com/lightspeedwp/.github/issues/466)`, `[#468](https://github.com/lightspeedwp/.github/issues/468)`, `[#469](https://github.com/lightspeedwp/.github/issues/469)` ✅
- `[#476](https://github.com/lightspeedwp/.github/issues/476)`, `[#480](https://github.com/lightspeedwp/.github/issues/480)`, `[#482](https://github.com/lightspeedwp/.github/issues/482)` (2A)
- `[#488](https://github.com/lightspeedwp/.github/issues/488)`, `[#490](https://github.com/lightspeedwp/.github/issues/490)` (2C)

**Responsibilities**:

- Core runtime agents
- Scaffolds and completion tasks
- README/Mermaid audit discovery
- Workflow/agent coordination setup

### Claude Code

**Waves**: 2B, 2D (parallel standards audits), 3B (repair & update), **Branding Meta Agent** (EXCLUSIVE), Wave 3D (WCEU talk planning)

**Issues (must execute)**:

- `[#470](https://github.com/lightspeedwp/.github/issues/470)`, `[#471](https://github.com/lightspeedwp/.github/issues/471)`, `[#473](https://github.com/lightspeedwp/.github/issues/473)`, `[#475](https://github.com/lightspeedwp/.github/issues/475)`, `[#478](https://github.com/lightspeedwp/.github/issues/478)`, `[#484](https://github.com/lightspeedwp/.github/issues/484)`, `[#486](https://github.com/lightspeedwp/.github/issues/486)` (2B)
- `[#31](https://github.com/lightspeedwp/.github/issues/31)`, `[#23](https://github.com/lightspeedwp/.github/issues/23)` (2D — when 2A merges)
- `[#33](https://github.com/lightspeedwp/.github/issues/33)`, `[#46](https://github.com/lightspeedwp/.github/issues/46)`, `[#48](https://github.com/lightspeedwp/.github/issues/48)`, `[#49](https://github.com/lightspeedwp/.github/issues/49)` (Branding Meta Agent — **CLAUDE CODE ONLY, NO GITHUB COPILOT**)
- `[#529](https://github.com/lightspeedwp/.github/issues/529)` (Wave 3D — WCEU 2026 talk planning audit)

**Responsibilities**:

- Mode agents (demonstrate-understanding, document-reviewer, PRD)
- Planning agents
- Documentation and standards reviews
- README/Mermaid repair and update (Wave 3B)
- **Branding meta agent initiative** (unified headers, footers, badges, schema validation)
- WCEU 2026 talk planning and NotebookLM prompt hardening

### ⚠️ IMPORTANT: Branding Meta Agent Assignment

**Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49) are EXCLUSIVELY assigned to Claude Code.** GitHub Copilot is excluded from this work stream to ensure coherent planning and implementation of the schema-driven branding system and meta agent architecture.

---

## Execution Order & Dependencies

### Phase 1: Finish Wave 2A (GitHub Copilot)

GitHub Copilot must continue this phase through PR-ready state for `develop`.

1. Execute `[#476](https://github.com/lightspeedwp/.github/issues/476)` → complete & merge
2. Execute `[#480](https://github.com/lightspeedwp/.github/issues/480)` → complete & merge
3. Execute `[#482](https://github.com/lightspeedwp/.github/issues/482)` → complete & merge
4. **Dependency**: All must merge before Wave 2B starts

### Phase 2: Execute Wave 2B (Claude Code) + Wave 2D in Parallel

- **Wave 2B**: `[#470](https://github.com/lightspeedwp/.github/issues/470)`, `[#471](https://github.com/lightspeedwp/.github/issues/471)`, `[#473](https://github.com/lightspeedwp/.github/issues/473)`, `[#475](https://github.com/lightspeedwp/.github/issues/475)`, `[#478](https://github.com/lightspeedwp/.github/issues/478)`, `[#484](https://github.com/lightspeedwp/.github/issues/484)`, `[#486](https://github.com/lightspeedwp/.github/issues/486)`
- **Wave 2D** (when 2A merges): `[#31](https://github.com/lightspeedwp/.github/issues/31)`, `[#23](https://github.com/lightspeedwp/.github/issues/23)`
- **Dependency**: 2A must merge before 2D starts; 2B can start immediately after last 2A merge

### Phase 3: Execute Wave 2C (GitHub Copilot)

GitHub Copilot must continue this phase through PR-ready state for `develop`.

- `[#488](https://github.com/lightspeedwp/.github/issues/488)`, `[#490](https://github.com/lightspeedwp/.github/issues/490)`
- **Dependency**: 2A + 2B should be merged

### Phase 4: Wave 3 — README & Mermaid Audit (Parallel)

1. **Wave 3A (GitHub Copilot)**: Discover + audit all 44 READMEs
2. **Wave 3B (Claude Code)**: Repair & update (runs in parallel during 3A discovery)
3. **Wave 3C (GitHub Copilot)**: Workflow setup + agent coordination
4. **Dependency**: 3B and 3C can start after 3A audit is underway

---

## Consolidated Execution Queue (Prompt Synthesis)

Use this sequence for all active implementation work:

1. **Verify baseline** from latest `origin/develop`
2. **Identify next ready issue** from Wave list above
3. **Create missing GitHub issues** if plan/spec drift detected
4. **Branch from develop**, implement scoped changes, validate locally
5. **Open PR** for implementation work only; monitor checks, rerun transients
6. **Merge** to develop when green; close linked issue with evidence
7. **Update metadata** (labels, types, fields, milestones) using canonical governance files
8. **Clean up** merged branches/worktrees
9. **Verify closure** targets and epic/tracker updates
10. **Proceed to next issue** in Wave

---

## Definition of Done

- [ ] GitHub issue created with acceptance criteria
- [ ] Issue linked to Epic/Wave tracker
- [ ] Branch created from `develop` with scoped changes
- [ ] PR opened with issue link and acceptance criteria mapping
- [ ] All CI checks pass (linting, testing, etc.)
- [ ] Code review approved
- [ ] PR merged to `develop`
- [ ] Issue closed with merged PR link
- [ ] Any affected epic/tracker updated with status
- [ ] Metadata aligned to canonical governance files (labels, types, fields)
- [ ] Merged branch deleted

---

## Known Blockers & Mitigation

| Blocker | Status | Mitigation | Owner |
| --- | --- | --- | --- |
| Test infrastructure incomplete | 🟡 In progress | launch-agents-checklist Phase 2 post-release | Team |
| README audit tooling missing | 🔴 Not started | Create `readme-audit` agent + workflow | Wave 3C |
| Mermaid diagram validation gaps | 🔴 Not started | Configure `readme-regen.yml` validator | Wave 3C |

---

## Success Criteria

- [x] Wave 1 completed
- [ ] Wave 2A merged (target: 3 issues)
- [x] Wave 2B merged (target: 7 issues) — completed 2026-05-28 via PRs [#515](https://github.com/lightspeedwp/.github/issues/515)–[#521](https://github.com/lightspeedwp/.github/issues/521)
- [ ] Wave 2C merged (target: 2 issues)
- [x] Wave 2D audit documents released (target: 2 audit reports) — completed 2026-05-28 via PRs [#522](https://github.com/lightspeedwp/.github/issues/522)–[#523](https://github.com/lightspeedwp/.github/issues/523)
- [ ] Wave 3A audit report published (target: `.githu./.github/reports/mermaid-audit/`)
- [ ] Wave 3B fixes merged (target: 0 failing Mermaid diagrams)
- [ ] Wave 3C workflows active (target: `readme-audit` + `release` coordination)
- [ ] All 44 READMEs passing Mermaid + WCAG AA validation
- [ ] Release agent orchestrating workflows on demand

---

## Archive Plan

After Wave completion, review these active projects for archival:

- **context-reduction-tasks.md** → Archive to `/archived/` once completion confirmed
- **test-coverage-implementation.md** → Archive to `/archived/` once merged
- **2025-12-11-wordpress-standards-compliance-comprehensive-review.md** → Archive to `/archived/` once review complete

Archival checklist per file:

1. Verify completion or decision to defer
2. Move to `.github/projects/archived/{name}/`
3. Add completion note at top of file with date and status
4. Update this roadmap file with archival record

---

## Plugin-Pack Waves (2026-06-01 Activation)

- Parent issue: [#732](https://github.com/lightspeedwp/.github/issues/732)
- Child issues:
  - [#733](https://github.com/lightspeedwp/.github/issues/733) (Second Wave)
  - [#734](https://github.com/lightspeedwp/.github/issues/734) (Third Wave)
  - [#735](https://github.com/lightspeedwp/.github/issues/735) (Next-Wave Backlog)
- Spec location: `.github/projects/active/plugin-pack-waves/`
