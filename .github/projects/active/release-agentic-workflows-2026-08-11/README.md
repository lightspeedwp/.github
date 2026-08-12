---
file_type: documentation
title: "GitHub Agentic Workflows Release Agent"
description: "Phase 5A: Implement GitHub Agentic Workflows for release orchestration, augmenting shell-based approach with LLM-driven reasoning and improved UX"
status: planning
version: "1.1"
last_updated: "2026-08-12"
owners: ["Ash Shaw"]
tags: ["release", "agentic-workflows", "github-copilot", "automation", "phase-5a"]
category: "release-engineering"
---

# GitHub Agentic Workflows Release Agent — Phase 5A

## Project Overview

**Objective:** Implement GitHub Agentic Workflows to orchestrate release automation, augmenting the existing shell-based approach (Phases 1-4) with LLM-driven reasoning, improved error messages, and better UX while maintaining deterministic fallback to shell scripts.

**Approach:** AUGMENT + test in parallel

- Agentic workflows wrap and call existing shell scripts
- No breaking changes to Phase 4 foundation
- Fallback available if AI reasoning fails
- Test against portable agents (Phase 5) and shell scripts

**Scope:** FULL (patch + minor + major releases)

- Auto-approve patch releases
- Require human review for minor releases
- Require 2+ maintainers for major releases

**Duration:** Phase 5A, 2-3 weeks (Aug 12-30, 2026)

**Status:** PLANNING (Phase 5A specification in progress)

---

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1777](../../../../../issues/1777) | pull | Phase 5A — GitHub Agentic Workflows Release Agent (Specification) | 🟢 Merged |

---

## Related Projects

This project is part of the **Release Orchestration Initiative** and coordinates with:

### 1. Release Process Redesign (2026-08-05) ✅ Phase 4 COMPLETE

**Status:** Phases 1-4 shipped; Phases 5-7 planned

**Relationship:** Phase 5A (agentic) builds on Phase 4 foundation:

- ✅ Authorization gating (trigger-telemetry + maintainers team)
- ✅ Develop-first stacked PR flow
- ✅ Post-release sync automation
- ✅ Rollback utilities

**Phase 5 (Portable Agents)** runs in parallel:

- Portable multi-repo agents (`agents/release/`, `agents/changelog/`)
- Phase 5A agentic workflow wraps Phase 5 agents

**Link:** [`.github/projects/active/release-process-redesign-2026-08-05/`](../release-process-redesign-2026-08-05/)

### 2. Release Workflow Authorization Fixes (2026-08-04)

**Status:** ✅ Fix implemented; ⏳ Testing pending

**Relationship:** Provides foundation for agentic auth gates:

- Made `trigger-telemetry` non-blocking
- Authorization checks available for agentic integration
- Testing validates safety for agentic workflow

**Link:** [`.github/projects/active/release-workflow-authorization-fixes/`](../release-workflow-authorization-fixes/)

---

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1777](https://github.com/lightspeedwp/.github/issues/1777) | epic | Phase 5A — GitHub Agentic Workflows Release Agent (Specification) | 🟢 Open |

---

## Project Status

### Current Phase: PLANNING (Week 0, Aug 11)

**Deliverables This Week:**

- [ ] AGENTIC_WORKFLOW_SPEC.md (design decisions, safety gates)
- [ ] RFC_AGENTIC_WORKFLOWS.md (request for comments)
- [ ] PHASE_5A_IMPLEMENTATION_PLAN.md (detailed tasks)
- [ ] `.github/agentic-workflows/release.md` (Markdown workflow skeleton)
- [ ] GitHub issues (CHILD-050 onwards, subtasks for Phase 5A)

---

## Key Decisions (Approved ✅)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| **Q1** | Replace vs. Augment vs. Parallel? | **AUGMENT** | Preserves Phase 4; safe fallback; shell scripts stay available |
| **Q2** | Timeline | **Phase 5A (parallel to Phase 5)** | Doesn't block portable agents; leverages Phase 4 output |
| **Q3** | MVP scope | **FULL (patch+minor+major)** | Full flexibility with tiered approval gates |
| **Q4** | Long-term strategy | **Both indefinitely** | Portable agents = libraries; Agentic = CLI layer; complementary |

---

## Architecture & Design

### Augmentation Strategy

```
Phase 4 (Shell-based) + Phase 5A (Agentic orchestration):

Agentic Workflow (Markdown)
  ├─ Parses user intent (scope, options)
  ├─ Calls Phase 4 shell scripts (deterministic)
  │  ├─ trigger-telemetry.cjs (authorization)
  │  ├─ release.agent.js (version bump, changelog)
  │  └─ create-main-release-pr.cjs (PR creation)
  ├─ Provides reasoning & suggestions (LLM strength)
  │  ├─ "Changelog looks good, ready to bump to vX.Y.Z?"
  │  ├─ "I notice breaking changes, should this be major?"
  │  └─ "Error: version conflict. Suggest rollback steps?"
  └─ Fallback: If agentic fails, shell scripts still work
```

### Safety Gates (All scope types)

✅ **Changelog validation** (must exist + schema-valid)  
✅ **Agentic safety score** (integrity filter + threat detection)  
✅ **Version consistency** (no jumps; no duplicates)  
✅ **Tag uniqueness** (no existing vX.Y.Z)  
✅ **Fallback available** (shell scripts still work)  
✅ **Audit trail** (log all agentic decisions)

### Approval Gates (Tiered by scope)

**PATCH:**

- ✅ Auto-approve if changelog valid + agentic score ≥ 0.8
- Minimum: changelog entries required

**MINOR:**

- 👤 Require human review comment ("approved" or "LGTM")
- Minimum: changelog + at least 1 merge to develop

**MAJOR:**

- 👥 Require 2+ maintainer approvals + agentic safety score
- Minimum: changelog + ADR + 3+ days on develop + breaking change docs
- Agentic must identify breaking changes

---

## Repo Strategy (Long-term)

### Control Plane (`.github`)

```
Primary: Agentic Workflows
├─ Reason: Interactive releases; humans trigger
├─ Workflow: gh release --scope=patch
├─ AI helps: Changelog review, version bump confirmation
└─ Fallback: Shell scripts always available
```

### WordPress Plugin & Theme

```
Primary: Portable Agents (Phase 5)
├─ Reason: CI/CD-driven; deterministic
├─ Use case: Auto-release on git push to release/v*
└─ No AI needed; version-controlled, auditable

Optional: Agentic for local development
└─ Developer: npm run release:preview
```

---

## Files in This Project

```
.github/projects/active/release-agentic-workflows-2026-08-11/
├── README.md (this file)
├── AGENTIC_WORKFLOW_SPEC.md (design decisions + safety gates)
├── RFC_AGENTIC_WORKFLOWS.md (request for comments + proposal)
├── PHASE_5A_IMPLEMENTATION_PLAN.md (detailed execution plan)
├── OPENSPEC_ANALYSIS_REPORT.md (requirements analysis, TBD)
├── QUESTIONNAIRE_PREPOPULATED.md (requirements gathering, TBD)
└── CHILD_ISSUES_TEMPLATES.md (GitHub issue templates, TBD)
```

---

## Implementation Plan (Phase 5A)

### Week 1: Specification & Design (Aug 12-16)

**Days 1-2 (Aug 12-13): Specification**

- AGENTIC_WORKFLOW_SPEC.md (design decisions, architecture)
- PHASE_5A_IMPLEMENTATION_PLAN.md (task breakdown)
- Cross-link all three projects

**Days 3-4 (Aug 14-15): RFC & Analysis**

- RFC_AGENTIC_WORKFLOWS.md (proposal + trade-offs)
- OPENSPEC_ANALYSIS_REPORT.md (requirements analysis)
- GitHub issues created (CHILD-050 onwards)

**Day 5 (Aug 16): Review & Adjust**

- Collect feedback on spec + RFC
- Finalize task list
- Ready for implementation phase

### Week 2: MVP Development (Aug 19-23)

**Days 1-2 (Aug 19-20): Core Implementation**

- `.github/agentic-workflows/release.md` (full Markdown workflow)
- Integration with Phase 4 shell scripts
- Authorization gating + approval flows

**Days 3-4 (Aug 21-22): Testing**

- Dry-run tests on develop branch
- Integration tests with portable agents (Phase 5)
- Security review + safety gates validation

**Day 5 (Aug 23): Readiness Check**

- Documentation complete
- All tests passing
- Ready for Phase 6+ integration

### Week 3: Integration & Polish (Aug 26-30)

- Integration with Phase 6 (WordPress support)
- Final documentation
- Team training materials

---

## Success Criteria

Phase 5A is successful when:

1. ✅ Agentic workflow spec complete and approved
2. ✅ RFC addresses all trade-offs and risk mitigation
3. ✅ `.github/agentic-workflows/release.md` functional (Markdown workflow)
4. ✅ Calls Phase 4 shell scripts without modifications
5. ✅ Approval gates work: patch/minor/major tiers functioning
6. ✅ Safety gates active: changelog validation, version checks, agentic scoring
7. ✅ Dry-run tests passing on develop branch
8. ✅ Integration tests with portable agents passing
9. ✅ Security review completed (no vulnerabilities)
10. ✅ Documentation complete + team trained
11. ✅ Cross-linked with related projects (redesign, authorization)
12. ✅ Ready for Phase 6 (WordPress support integration)

---

## Key Artifacts

### Specification Documents

| File | Purpose | Status |
|------|---------|--------|
| **AGENTIC_WORKFLOW_SPEC.md** | Design decisions, safety gates, approval flows | 📝 IN PROGRESS |
| **RFC_AGENTIC_WORKFLOWS.md** | Request for comments, trade-offs, risk analysis | 📝 PLANNED (Week 1) |
| **PHASE_5A_IMPLEMENTATION_PLAN.md** | Detailed task breakdown, timeline, deliverables | 📝 PLANNED (Week 1) |

### Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| **.github/agentic-workflows/release.md** | Markdown workflow definition | 📝 PLANNED (Week 1) |
| **OPENSPEC_ANALYSIS_REPORT.md** | Requirements analysis (50+ questions) | 📝 PLANNED (Week 1) |
| **QUESTIONNAIRE_PREPOPULATED.md** | Requirements answers | 📝 PLANNED (Week 1) |

### Support Files

| File | Purpose | Status |
|------|---------|--------|
| **CHILD_ISSUES_TEMPLATES.md** | GitHub issue templates for subtasks | 📝 PLANNED (Week 1) |
| **TEST_EXECUTION_PLAN.md** | Testing strategy for MVP | 📝 PLANNED (Week 2) |
| **TEST_RESULTS.md** | Test execution results | 📝 PLANNED (Week 2) |

---

## Dependencies & Blockers

### Must Complete Before Phase 5A Starts

- ✅ Phase 4 (develop-first flow) — COMPLETE Aug 8
- ⏳ Authorization fixes testing — PENDING (blocks Aug 12, should complete by Aug 11)

### Parallel with Phase 5A

- Phase 5 (Portable agents) — Aug 12-15, runs in parallel with Phase 5A spec

### After Phase 5A

- Phase 6 (WordPress support) — Aug 15-17, will leverage agentic insights
- Phase 7 (Documentation) — Aug 18-20, update to include agentic workflows

---

## Communication & Governance

- **Decisions:** Documented in AGENTIC_WORKFLOW_SPEC.md + RFC
- **Progress:** Updated in this README (daily)
- **Blockers:** Escalated immediately
- **Completion:** Announced to team + added to RELEASE_PROCESS.md

---

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1777](https://github.com/lightspeedwp/.github/issues/1777) | feat | Phase 5A — GitHub Agentic Workflows Release Agent (Specification) | 🟡 In Progress |
| [#1798](https://github.com/lightspeedwp/.github/issues/1798) | feature | GitHub Agentic Workflows Implementation | ⏳ Planned |

---

## References

### Related Projects

- [Release Process Redesign (2026-08-05)](../release-process-redesign-2026-08-05/) — Phase 1-4 complete; Phases 5-7 planned
- [Release Workflow Authorization Fixes (2026-08-04)](../release-workflow-authorization-fixes/) — Authorization implementation

### External Resources

- [GitHub Agentic Workflows](https://github.github.com/gh-aw/) — Official documentation
- [GitHub Blog: Agentic Workflows Public Preview](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/) — Announcement (June 11, 2026)

### Control Plane Documentation

- [RELEASE_PROCESS.md](../../../../docs/RELEASE_PROCESS.md) — Current release process
- [BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md) — Branch naming & flow
- [CLAUDE.md](../../../../CLAUDE.md) — Global AI governance rules

---

## Author & Ownership

**Project Created:** 2026-08-11  
**Owner:** Ash Shaw  
**Status:** PLANNING (Phase 5A specification)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and agentic workflows!*
