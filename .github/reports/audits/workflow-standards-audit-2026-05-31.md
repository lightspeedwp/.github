---
title: "Workflow Standards Audit & Improvement Plan"
description: "Comprehensive audit of linting, meta, branding, and CI/CD workflows with improvement plan"
file_type: documentation
created_date: "2026-05-31"
---

# Workflow Standards Audit & Improvement Plan

**Date:** 31 May 2026
**Audit Scope:** Linting, metadata, branding, CI/CD workflows, and automation
**Status:** Active (Implementation in Progress)

## Executive Summary

Current workflow infrastructure is functional but lacks critical automation for:

- **Changelog synchronisation on PR merge** (critical gap)
- **Automated project archival** (missing)
- **Planner agent** (disabled, unimplemented)
- **Unified pre-merge checks** (opportunity for consolidation)

This audit identifies 6 priority improvements and a roadmap for streamlined, standards-compliant automation.

---

## Current State Assessment

### ✅ What's Working Well

| Component | Status | Notes |
| --- | --- | --- |
| Labeling system | ✅ Comprehensive | Unified labeling, status, type assignment working |
| Linting infrastructure | ✅ Functional | Multiple linters configured (ESLint, markdownlint, YAML) |
| Changelog validation | ✅ On PR | Schema + format validation, unreleased content check |
| Release workflow | ✅ Sophisticated | Auth gate, dry-run mode, version override alignment |
| Project sync | ✅ Working | Metadata, SLA tracking, field derivation |
| Meta workflow | ✅ Comprehensive | Frontmatter, links, metrics, badges |
| Testing | ✅ Configured | npm run check includes lint, validate, test |
| Mergify | ✅ Configured | Dependabot auto-merge with security label support |

### ⚠️ Gaps & Improvement Opportunities

| Priority | Component | Issue | Impact |
| --- | --- | --- | --- |
| **CRITICAL** | Changelog sync | No automated changelog update when PRs merge to develop | Breaking: changelog not maintained; release notes stale |
| **HIGH** | Project archival | No automation for moving completed projects to archived | Manual process; inconsistent; risk of lost metadata |
| **HIGH** | Planner agent | Disabled; unimplemented (`if: false`) | Issues not automatically added to projects |
| **MEDIUM** | Workflow unification | Linting scattered across multiple workflows (linting.yml, meta.yml, testing.yml) | Complex trigger logic; potential for redundant runs |
| **MEDIUM** | Issue templates | No automation to document planning in active projects | Manual; risk of untracked planning |
| **LOW** | Readme workflows | Multiple readme workflows (audit, regen, update) need consolidation review | Potential for conflicts or redundant output |
| **LOW** | Reporting | Ad-hoc reporting; no scheduled summary | Metrics available but not surfaced |

---

## Priority Issues & Improvements

### 1. **Changelog Auto-Sync on Develop Merge** (CRITICAL)

**Current State:** Changelog validated on PR; not updated on merge
**Gap:** No mechanism to append merged PR changelog entries to main CHANGELOG.md
**Solution:** New `changelog-auto-update.yml` workflow

**Implementation:**

- Trigger: PR merge to `develop` with `CHANGELOG.md` modified
- Action: Extract changelog entries from merged PR
- Append to main CHANGELOG.md under `[Unreleased]` section
- Commit with `[skip ci]` flag
- Validate schema before commit

**Effort:** 2–3 hours | **Complexity:** Medium | **Risk:** Low (schema validation + dry-run testing)

---

### 2. **Automated Project Archival** (HIGH)

**Current State:** Projects in active folder; archival is manual
**Gap:** No workflow to detect completion and move to archived
**Solution:** New `project-archival.yml` workflow + project schema validation

**Implementation:**

- Trigger: On-demand or scheduled (weekly)
- Scan active projects for completion markers (status: completed, all issues closed, etc.)
- Move to `.github/projects/archived/{date}-{project-name}/`
- Create archival summary (metrics, duration, outcomes)
- Commit archival record

**Effort:** 3–4 hours | **Complexity:** Medium | **Risk:** Low (with dry-run mode)

---

### 3. **Planner Agent Implementation** (HIGH)

**Current State:** Disabled (`if: false`); script not implemented
**Gap:** Issues not automatically added to project on creation
**Solution:** Implement `scripts/agents/planner.agent.js`

**Implementation:**

- Detect new issues/PRs lacking project assignment
- Derive project from labels, issue type, area
- Add to appropriate project (or queue for manual review)
- Log action in issue comment

**Effort:** 4–5 hours | **Complexity:** High | **Risk:** Medium (relies on label stability)

---

### 4. **Issue Planning Documentation** (MEDIUM)

**Current State:** Issues created ad-hoc; planning not centralised
**Gap:** No standardised location for planning docs before issues
**Solution:** Pre-issue planning template + checklist in issue-opener guide

**Implementation:**

- Create `.github/projects/active/{project}/PLANNING.md` template
- Update CONTRIBUTING.md to reference planning checklist
- Add workflow check: if issue references project, verify planning exists
- Optional: Generate project overview from PLANNING.md

**Effort:** 1–2 hours | **Complexity:** Low | **Risk:** Low

---

### 5. **Workflow Consolidation & Clarity** (MEDIUM)

**Current State:** Linting split across `linting.yml`, `meta.yml`, `testing.yml`
**Gap:** Unclear triggers; potential for redundant/competing runs
**Solution:** Unified pre-merge check workflow + documentation

**Implementation:**

- Consolidate into `checks.yml` (lint + test + validate)
- Trigger on: pull_request (branches: develop), push (branches: develop)
- Document concurrency groups to prevent overlaps
- Keep meta.yml separate (different cadence: on push, not PR)

**Effort:** 1–2 hours | **Complexity:** Low | **Risk:** Low (non-breaking change)

---

### 6. **Scheduled Metrics & Reporting** (LOW)

**Current State:** Metrics collected ad-hoc; no scheduled summary
**Gap:** Metrics available but not surfaced to team
**Solution:** Add scheduled reporting workflow

**Implementation:**

- New `weekly-metrics-summary.yml` (trigger: weekly, Mon 09:00 UTC)
- Aggregate metrics from `.github/metrics/`
- Generate summary markdown → GitHub discussion or wiki
- Include: workflow runs, linting trends, coverage, SLAs

**Effort:** 2 hours | **Complexity:** Low | **Risk:** Low

---

## Implementation Roadmap

### Phase 1: Critical Path (1–2 days)

- [ ] **Issue #1:** Implement changelog-auto-update.yml (PR ready within 4h)
- [ ] **Issue #2:** Implement project-archival.yml (PR ready within 4h)
- [ ] Test both workflows in dry-run mode; merge when green

### Phase 2: High Priority (2–3 days)

- [ ] **Issue #3:** Implement planner.agent.js (PR ready within 5h)
- [ ] **Issue #4:** Create issue planning guide (PR ready within 2h)
- [ ] Validate planner integration with existing labels/projects

### Phase 3: Polish & Automation (1–2 days)

- [ ] **Issue #5:** Consolidate workflow pre-merge checks (PR ready within 2h)
- [ ] **Issue #6:** Implement scheduled reporting (PR ready within 2h)
- [ ] Update CONTRIBUTING.md with workflow overview

### Phase 4: Validation & Documentation (1 day)

- [ ] Integration testing: full workflow chain (issue → planning → project → merge → changelog → archive)
- [ ] Update `.github/README.md` with workflow topology
- [ ] Create runbooks for common scenarios (manual trigger changelog, force archive, etc.)

---

## Success Criteria

✅ **Changelog:**

- [ ] New entries from PRs auto-merged into CHANGELOG.md on PR merge
- [ ] Unreleased section remains consistent; schema always valid
- [ ] Release workflow can read changelog without manual update

✅ **Projects:**

- [ ] Completed projects auto-archived within 1 week of closure
- [ ] All active projects have PLANNING.md documentation
- [ ] New issues auto-added to appropriate project

✅ **CI/CD:**

- [ ] Planner agent enabled; at least 80% of issues auto-assigned to project
- [ ] Workflow concurrency clear; no redundant runs
- [ ] All workflows documented in `.github/workflows/README.md`

✅ **Documentation:**

- [ ] CONTRIBUTING.md updated with planning requirements
- [ ] Workflow topology diagram in `.github/README.md`
- [ ] Runbooks for manual operations (changelog, archival, project management)

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Changelog schema breaks on auto-update | Low | Validate schema before commit; include rollback procedure |
| Project archival moves active project | Low | Dry-run mode; manual review before automation; audit trail |
| Planner assigns issues incorrectly | Medium | Fallback: manual review queue; soft-assign with optional label |
| Workflow runs compete / deadlock | Low | Use concurrency groups; document trigger precedence |
| Changelog updates miss some PRs | Medium | Run validation check on release; flag missing entries |

---

## Estimation Summary

| Phase | Issues | Effort | Duration |
| --- | --- | --- | --- |
| Phase 1 (Critical) | 2 | 8 hours | 1–2 days |
| Phase 2 (High) | 2 | 7 hours | 2–3 days |
| Phase 3 (Polish) | 2 | 4 hours | 1–2 days |
| Phase 4 (Validation) | – | 4 hours | 1 day |
| **Total** | 6 | **23 hours** | **5–8 days** |

**Fast-track option:** Run Phase 1 + Phase 2 in parallel with careful concurrency management → 3–5 days.

---

## References

- Release workflow: `.github/workflows/release.yml`
- Changelog validation: `.github/workflows/changelog-validate.yml`
- Labeling system: `.github/workflows/labeling.yml`
- Project sync: `.github/workflows/project-meta-sync.yml`
- Planner (disabled): `.github/workflows/planner.yml`
- Active projects: `.github/projects/active/`
- Archived projects: `.github/projects/archived/`
- CONTRIBUTING guide: `CONTRIBUTING.md`
