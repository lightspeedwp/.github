---
title: "Next Issues Execution Plan"
description: "Comprehensive execution plan for all open issues, active projects, and strategic workflows."
version: "v2.2.0"
created_date: "2026-05-28"
last_updated: "2026-05-29T05:10:00Z"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["planning", "issues", "execution", "governance", "roadmap"]
domain: "governance"
stability: "active"
status: "active"
---

## Executive Summary

This document serves as the **canonical execution roadmap** for all active work in the
LightSpeed `.github` repository. It consolidates:

- All open GitHub issues requiring implementation
- All active project artefacts and their status
- Workflow automation patterns (always-run vs. agent-triggered)
- Strategic initiatives including comprehensive README/Mermaid audits
- Agent ownership and wave assignments

**Live as of 2026-05-29**: All Claude Code exclusive work completed and merged.

**Completed Waves**:

- ✅ Wave 2B: 7 agent spec upgrades (PRs #515–#521)
- ✅ Wave 2D: `.coderabbit.yml` (#23) + `markdown.instructions.md` (#31)
- ✅ Wave 3B: README & Mermaid diagram repairs (#513)
- ✅ Wave 3D: WCEU 2026 talk assets audit (#529)
- ✅ Wave 4A/4B/4D: Branding agent specs (#33, #46, #48, #49)
- ✅ Workflow Consolidation Epic (#503)

**Current Focus**:

- GitHub Copilot: Wave 2A remaining (`#476`, `#480`, `#482`) + Wave 2C (`#488`, `#490`) + Wave 3A audit (#512) + Wave 3C coordination (#514)
- Claude Code Next: Wave 4C–4F (current-state audit, schema implementation, agent merge, remediation)

## Mandatory Agent Execution Split

This section is authoritative for who must execute each task stream.

- **GitHub Copilot must do**: Wave 2A (`#476`, `#480`, `#482`), Wave 2C (`#488`, `#490`), Wave 3A (`#512`), Wave 3C (`#514`), and plugin-pack execution task lists.
- **Claude Code must do**: Wave 2B (`#470`, `#471`, `#473`, `#475`, `#478`, `#484`, `#486`), Wave 2D (`#31`, `#23`), Wave 3B (`#513`), Wave 3D (`#529`), and Wave 4 branding/meta work (`#33`, `#46`, `#48`, `#49`).
- **No cross-execution**: Copilot must not execute Claude Code exclusive tasks, and Claude Code must not take over Copilot execution queues unless this file is explicitly revised.

---

## Active Project Files Inventory

### Currently Active Projects

| Project File | Status | Owner | Action |
| --- | --- | --- | --- |
| `github-workflow-consolidation-2026-05-28/` | ✅ COMPLETED - Epic #503 closed, planning docs ready for archive | GitHub Copilot | Archive to `completed/` folder after final review |
| `launch-agents-checklist.md` | 🟡 IN PROGRESS - Partial test infrastructure fixes applied 2026-05-28 | LightSpeed Team | Complete remaining validation phases (critical pre-v1.0.0 release) |
| `spec-only-agents-issue-conversion-2026-05-28.md` | ✅ COMPLETED - All spec-only agents converted to issues (#465, #467, #466, #468, #469) | GitHub Copilot | Archive to `completed/` folder |
| `next-issues-execution-plan.md` | 📋 LIVING DOCUMENT - Updated 2026-05-29 with completion status and Wave 4C–4F allocation | Claude Code | Maintain and update continuously |
| `ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` | ✅ COMPLETED - Issue #33 merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_46_TEMPLATE_DESIGN.md` | ✅ COMPLETED - Issue #46 merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_48_CURRENT_STATE_AUDIT.md` | ✅ COMPLETED - Issue #48 merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `ISSUE_49_SCHEMA_CONFIG_IMPLEMENTATION.md` | ✅ COMPLETED - Issue #49 merged (planning phase) | Claude Code | Archive to `completed/` folder |
| `branding-meta-agent-planning-2026-05-28.md` | ✅ COMPLETED - Comprehensive Wave 4 planning (issues #33–#49 closed) | Claude Code | Archive to `completed/` folder |
| `PLANNING_SUMMARY_2026-05-28.md` | ✅ COMPLETED - Planning summary for completed branding/WCEU initiatives | Claude Code | Archive to `completed/` folder |
| `wave-3b-issue-spec.md` | ✅ COMPLETED - Issue #513 closed, remediation work ready for Wave 4C | Claude Code | Archive to `completed/` folder |
| `wave-4-continuous-monitoring.md` | ✅ COMPLETED - Design spec ready for Wave 4C–4F implementation | Claude Code | Archive to `completed/` folder; reference in Wave 4C–4F tasks |
| `wave-3c-issue-spec.md` | ✅ ACTIVE - Awaiting GitHub Copilot execution on issue #514 | GitHub Copilot | Maintain and track to completion |
| `plugin-pack-next-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (next wave) | GitHub Copilot | Execute and update per task completion |
| `plugin-pack-second-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (second wave) | GitHub Copilot | Track sequencing and dependencies across packs |
| `plugin-pack-third-wave-task-list-2026-05-28.md` | ✅ ACTIVE - Plugin-pack rollout task queue (third wave) | GitHub Copilot | Maintain as queued backlog for post-second-wave execution |
| `context-reduction-tasks.md` | ⏳ REQUIRES REVIEW - Needs audit for completion/archival status | TBD | Review and decide: archive or continue |
| `test-coverage-implementation.md` | ⏳ REQUIRES REVIEW - Needs audit for completion/archival status | TBD | Review and decide: archive or continue |
| `2025-12-11-wordpress-standards-compliance-comprehensive-review.md` | ⏳ REQUIRES REVIEW - Date-stamped archive candidate | TBD | Review and archive if complete |

### Projects Eligible for Archival (Review First)

- `context-reduction-tasks.md` — verify completion status before archiving
- `test-coverage-implementation.md` — verify completion status before archiving
- `2025-12-11-wordpress-standards-compliance-comprehensive-review.md` — verify completion status before archiving

---

## Consolidated Wave Roadmap

### Wave 1 — Completed ✅

- `#52`: Update references from `create_issue` to `issue_write`
- Status: Merged via PR `#494`

### Wave 2 — In Progress 🟡

#### **Wave 2A: Core Runtime Agent Burn-Down** (GitHub Copilot)

Open issues:

- `#476` — [Next Ready]
- `#480` — [Queued]
- `#482` — [Queued]

Recently completed:

- `#465` (PR `#497`)
- `#467` (PR `#500`)
- `#466`, `#468`, `#469`

#### **Wave 2B: Mode & Planning Agent Batch** (Claude Code) ✅ COMPLETE

All 7 issues merged 2026-05-28:

- `#470` ✅ merged via PR `#515`
- `#471` ✅ merged via PR `#516`
- `#473` ✅ merged via PR `#517`
- `#475` ✅ merged via PR `#518`
- `#478` ✅ merged via PR `#519`
- `#484` ✅ merged via PR `#520`
- `#486` ✅ merged via PR `#521`

Wave 2D is now unblocked.

#### **Wave 2C: Scaffolds & Completion Batch** (GitHub Copilot)

Issues:

- `#488` — [Queued]
- `#490` — [Queued]

#### **Wave 2D: Documentation & Standards Audits** (Parallel Track) ✅ COMPLETE

Both issues merged 2026-05-28:

- `#31` ✅ merged via PR `#523` — `markdown.instructions.md` upgraded to v1.1
- `#23` ✅ merged via PR `#522` — `.coderabbit.yml` hardened and schema-aligned

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
- Document findings in `.github/reports/mermaid-audit/`

**Completed & Proposed Sub-Waves**:

1. **Wave 3A: Discovery & Audit** ✅ CREATED (GitHub Copilot)
   - GitHub Issue: [#512 — Wave 3A: README & Mermaid Diagram Discovery & Audit](https://github.com/lightspeedwp/.github/issues/512)
   - Status: Ready for execution
   - Workflow: [`.github/workflows/readme-audit.yml`](./.github/workflows/readme-audit.yml) created
   - Deliverables: Audit report, findings.csv, audit-log.md
   - Scope: Scan all 44 README files, extract Mermaid diagrams, categorize issues
   - Effort: 2-3 hours
   - Owner: GitHub Copilot (Developer)

2. **Wave 3B: Repair & Update** ✅ ISSUE CREATED: #513 (Claude Code)
   - GitHub Issue: [#513 — Wave 3B: README & Mermaid Diagram Repair & Update](https://github.com/lightspeedwp/.github/issues/513)
   - Status: Issue created; ready for execution
   - Scope: Fix Mermaid syntax, add accessibility attributes, update stale content
   - Deliverables: Updated 44 README files, repair-report.md, accessibility-audit.md
   - Effort: 4-6 hours
   - Owner: Claude Code (AI Team - Review & UX)
   - Dependencies: Awaits Wave 3A audit report

3. **Wave 3C: Workflow & Agent Coordination** ✅ ISSUE CREATED: #514 (GitHub Copilot)
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
| **4A: Planning & Specification** | #33 (parent), #46 (templates), #49 (schema) | Claude Code | ✅ MERGED | 2026-05-28 |
| **4B: Documentation & Governance** | #48 (documentation) | Claude Code | ✅ MERGED | 2026-05-28 |

### Next Implementation Phases (Claude Code Allocation)

| Phase | Issues | Owner | Purpose | Dependencies |
| --- | --- | --- | --- | --- |
| **4C: Current-State Audit** | #553 | Claude Code | Audit existing footers, identify duplicates, validate against category schema | Awaits: #33, #46, #48, #49 merged ✅ |
| **4D: Schema & Config Implementation** | #554 | Claude Code | Build `agent-config.schema.json`, YAML validation rules, category definitions | Awaits: #553 audit report |
| **4E: Agent Merge/Refactor** | #555 | Claude Code | Consolidate header/footer/badge logic into unified branding agent | Awaits: #554 schema merged |
| **4F: Remediation & Validation** | #556 | Claude Code | Fix bad footers across README.md files, validate schema compliance | Awaits: #555 agent merged |

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

- [x] Issue #33 (parent spec) completed and merged
- [x] Issue #46 (template design) completed and merged
- [x] Issue #49 (schema/config spec) completed and merged
- [x] Issue #48 (documentation) completed and merged

**Next Steps (Implementation — Claude Code)**:

- [x] Create Wave 4C issue (#553 current-state audit)
- [x] Create Wave 4D issue (#554 schema/config implementation)
- [x] Create Wave 4E issue (#555 agent merge/refactor)
- [x] Create Wave 4F issue (#556 remediation & validation)
- [ ] Execute #553–#556 in sequence (ready to start)

---

## Wave 3D — WCEU 2026 Talk Planning ✅ COMPLETE

**Objective**: Audit talk assets and harden NotebookLM source prompts for the WordCamp Europe 2026 conference presentation.

**Status**: ✅ MERGED (2026-05-28, Issue #529 closed)

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

**Completed**: Issue #529 closed 2026-05-28 20:38:14Z

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

- `#466`, `#468`, `#469` ✅
- `#476`, `#480`, `#482` (2A)
- `#488`, `#490` (2C)

**Responsibilities**:

- Core runtime agents
- Scaffolds and completion tasks
- README/Mermaid audit discovery
- Workflow/agent coordination setup

### Claude Code

**Waves**: 2B, 2D (parallel standards audits), 3B (repair & update), **Branding Meta Agent** (EXCLUSIVE), Wave 3D (WCEU talk planning)

**Issues (must execute)**:

- `#470`, `#471`, `#473`, `#475`, `#478`, `#484`, `#486` (2B)
- `#31`, `#23` (2D — when 2A merges)
- `#33`, `#46`, `#48`, `#49` (Branding Meta Agent — **CLAUDE CODE ONLY, NO GITHUB COPILOT**)
- `#529` (Wave 3D — WCEU 2026 talk planning audit)

**Responsibilities**:

- Mode agents (demonstrate-understanding, document-reviewer, PRD)
- Planning agents
- Documentation and standards reviews
- README/Mermaid repair and update (Wave 3B)
- **Branding meta agent initiative** (unified headers, footers, badges, schema validation)
- WCEU 2026 talk planning and NotebookLM prompt hardening

### ⚠️ IMPORTANT: Branding Meta Agent Assignment

**Issues #33, #46, #48, #49 are EXCLUSIVELY assigned to Claude Code.** GitHub Copilot is excluded from this work stream to ensure coherent planning and implementation of the schema-driven branding system and meta agent architecture.

---

## Execution Order & Dependencies

### Phase 1: Finish Wave 2A (GitHub Copilot)

1. Execute `#476` → complete & merge
2. Execute `#480` → complete & merge
3. Execute `#482` → complete & merge
4. **Dependency**: All must merge before Wave 2B starts

### Phase 2: Execute Wave 2B (Claude Code) + Wave 2D in Parallel

- **Wave 2B**: `#470`, `#471`, `#473`, `#475`, `#478`, `#484`, `#486`
- **Wave 2D** (when 2A merges): `#31`, `#23`
- **Dependency**: 2A must merge before 2D starts; 2B can start immediately after last 2A merge

### Phase 3: Execute Wave 2C (GitHub Copilot)

- `#488`, `#490`
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
- [x] Wave 2B merged (target: 7 issues) — completed 2026-05-28 via PRs #515–#521
- [ ] Wave 2C merged (target: 2 issues)
- [x] Wave 2D audit documents released (target: 2 audit reports) — completed 2026-05-28 via PRs #522–#523
- [ ] Wave 3A audit report published (target: `.github/reports/mermaid-audit/`)
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
