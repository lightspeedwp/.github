---
title: "Badges Workflow Integration Project"
description: "Active project for integrating badges workflow automation into GitHub Actions"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-09"
version: "v1.1.0"
authors: ["Ash Shaw"]
tags: ["badges", "workflow", "automation", "documentation"]
---

# Badges Workflow Integration Project

**Project Location:** `.github/projects/active/badges-workflow-integration-2026-08-08/`

**Status:** 🔄 Phase 1-3 IN PROGRESS (Audit Complete, Phase 4 Integration Ready)

**Timeline:** 2026-08-08 → 2026-08-22 (15 days)

**Effort:** ~40 hours completed, ~20 hours remaining (Phase 4 integration, Phase 5 governance)

## Documents

This project contains comprehensive audit and planning documentation:

### Planning Documents

1. **PROJECT_README.md** — Project overview, open questions, next steps
2. **AUDIT_AND_PLAN.md** — Complete audit findings + 4-phase implementation plan
3. **BROKEN_BADGES_FINDINGS.md** — Root cause analysis of broken badges
4. **PROJECT_TRACKER.md** — GitHub issues checklist (13 child issues + 1 epic)

### Deliverables

- **Epic Issue:** #1641 (Parent issue with full scope)
- **Child Issues:** #1643–#1655 (13 actionable tasks, ready to start)

## Project Scope

### What This Project Solves

- Badge utilities exist but are unused (`scripts/agents/includes/badges.js`)
- Previous broken badges were removed (PR #1609)
- No automation for badge validation or discovery
- Missing configuration file (`.github/automation/badges.schema.yml`)

### What We're Building

4 GitHub Actions workflows:

1. Documentation badge update (auto-generate on push)
2. README status badge maintenance (daily validation)
3. Workflow inventory synchronization (weekly discovery)
4. Badge health check (weekly URL validation)

### Success Metrics

- ✅ All 42 workflows have badge definitions
- ✅ Documentation badges auto-generated on push
- ✅ Zero broken badge links (weekly validation)
- ✅ New workflows auto-discovered within 7 days
- ✅ Team can update badges without code changes

## Phases

| Phase | Duration | Focus | Issues |
|-------|----------|-------|--------|
| **Phase 1** | 5 days | Schema & Configuration | #1643, #1645, #1644 |
| **Phase 2** | 5 days | Workflow Implementation | #1646–#1649 |
| **Phase 3** | 3 days | Integration & Testing | #1650–#1652 |
| **Phase 4** | 2 days | Governance & Monitoring | #1653–#1655 |

## Getting Started

See **PROJECT_README.md** for:

- Open questions requiring approval (Q1–Q4)
- Next steps for Phase 1
- Links to all supporting documents

See **AUDIT_AND_PLAN.md** for:

- Complete technical audit
- Detailed design decisions
- Risk assessment
- Timeline and resource allocation

## Related Issues & PRs

| Item | Status | Link |
|------|--------|------|
| Epic Issue | ✅ Created | #1641 |
| PR (Audit & Plan) | ⏳ Pending Review | #1642 |
| Child Issues (13) | ✅ Created | #1643–#1655 |
| Issue #1547 | ✅ Closed | Broken badges |
| PR #1609 | ✅ Merged | Remove broken badges |

## Next Steps

1. Review audit and plan documents
2. Decide on open questions (Q1–Q4)
3. Approve PR #1642
4. Begin Phase 1 (schema creation)

---

*Created 2026-08-08 | Ready for implementation*
