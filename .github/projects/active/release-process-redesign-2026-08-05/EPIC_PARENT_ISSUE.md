---
title: "[EPIC] Release Process Redesign & Multi-Repo Support"
description: "Complete audit, redesign, and implementation of release workflow, documentation, and governance for control plane + WordPress plugins/themes"
labels: ["epic", "release", "automation", "documentation", "priority:critical"]
milestone: "Release Process v2.0"
---

# [EPIC] Release Process Redesign & Multi-Repo Support

## Overview

Complete redesign of the release process to:

1. Fix critical workflow/documentation misalignments
2. Implement develop-first release flow
3. Create portable release agents for organization-wide use
4. Support WordPress plugins and themes alongside .github control plane
5. Establish governance, authorization, and error handling

## Status

- **Phase:** Requirements & Design
- **Timeline:** 3-4 weeks (18-23 days implementation)
- **Owner:** Ash Shaw
- **Related:** Audit Report: [AUDIT_REPORT.md](./AUDIT_REPORT.md)

## Critical Issues Requiring Fix

🔴 **BLOCKING RELEASE:**

- [ ] #CHILD-001: Authorization gating fails (telemetry doesn't block)
- [ ] #CHILD-002: Release flow contradicts documentation (target main vs develop)
- [ ] #CHILD-003: Broken workflow badges in documentation

🟠 **MAJOR ISSUES:**

- [ ] #CHILD-004: No post-release sync (develop stays stale)
- [ ] #CHILD-005: Changelog validation timing unclear
- [ ] #CHILD-006: Dry-run defaults to true (easy to forget actual release)
- [ ] #CHILD-007: Pre-release checklist not enforced
- [ ] #CHILD-008: Rollback automation missing
- [ ] #CHILD-009: Trigger telemetry doesn't stop unauthorized releases
- [ ] #CHILD-010: Release notes preview unclear

## Design Phase Deliverables

- [ ] #CHILD-011: Requirements specification (from OpenSpec analysis)
- [ ] #CHILD-012: Architecture diagrams & workflow YAML
- [ ] #CHILD-013: Release agent specification (portable, multi-repo)
- [ ] #CHILD-014: Changelog agent specification
- [ ] #CHILD-015: WordPress plugin/theme support specification
- [ ] #CHILD-016: Documentation reorganization plan
- [ ] #CHILD-017: Architectural Decision Records (ADRs)

## Implementation Phase Deliverables

- [ ] #CHILD-020: Update release.yml workflow
- [ ] #CHILD-021: Modify release.agent.js (develop-first flow)
- [ ] #CHILD-022: Create rollback.cjs automation
- [ ] #CHILD-023: Build portable release agent (agents/release/)
- [ ] #CHILD-024: Build portable changelog agent (agents/changelog/)
- [ ] #CHILD-025: Add WordPress plugin version handling
- [ ] #CHILD-026: Add WordPress theme version handling
- [ ] #CHILD-027: Rewrite RELEASE_PROCESS.md
- [ ] #CHILD-028: Update BRANCHING_STRATEGY.md alignment
- [ ] #CHILD-029: Update CHANGELOG_AUTOMATION.md
- [ ] #CHILD-030: Create RELEASE_WORDPRESS.md
- [ ] #CHILD-031: Fix broken badges in docs
- [ ] #CHILD-032: Add CI validation for docs/code alignment

## Testing & Validation Phase

- [ ] #CHILD-040: Test dry-run release workflow
- [ ] #CHILD-041: Test live patch release (control plane)
- [ ] #CHILD-042: Test live minor release (control plane)
- [ ] #CHILD-043: Test plugin release workflow
- [ ] #CHILD-044: Test theme release workflow
- [ ] #CHILD-045: Test hotfix flow
- [ ] #CHILD-046: Test rollback procedure
- [ ] #CHILD-047: Team training & documentation

## Success Criteria

Release process is successful when:

✅ **Workflow & Implementation Aligned**

- [ ] Release workflow implementation matches documentation exactly
- [ ] No discrepancies between docs and code
- [ ] CI validates alignment automatically

✅ **Governance & Authorization**

- [ ] Authorization gating actually blocks unauthorized releases
- [ ] Only authorized users can trigger workflows
- [ ] Audit trail of all release attempts (successful & failed)

✅ **Multi-Repo Support**

- [ ] Control plane (.github) can release
- [ ] WordPress plugins can release with portable agent
- [ ] WordPress themes can release with portable agent
- [ ] Consistent process across all repo types

✅ **Error Handling & Rollback**

- [ ] Pre-release checklist enforced by workflow
- [ ] Rollback automation available (one-button undo)
- [ ] Failed releases detected and cleaned up
- [ ] Post-release sync (if needed) automated

✅ **Documentation Quality**

- [ ] All links and badges are live
- [ ] Docs organized by audience (developers, leads, release manager)
- [ ] WordPress-specific guidance documented
- [ ] Decision records explain "why" each choice

✅ **Developer Experience**

- [ ] Release process is one-button trigger
- [ ] Dry-run available for preview
- [ ] Clear error messages on failure
- [ ] Estimated time-to-release < 10 minutes

✅ **Team Alignment**

- [ ] Team understands and approves release flow
- [ ] ADRs explain major architectural decisions
- [ ] Team can execute release with confidence

## Key Questions to Answer

*These will be resolved through questionnaire + OpenSpec analysis:*

1. **Release Flow:** Should first PR target `develop` (your preference) or `main` (current)?
2. **Post-Release Sync:** After releasing to main, should version sync back to develop?
3. **Authorization:** Who can trigger releases? (Currently: just you)
4. **Pre-Release Support:** Should we support beta/RC versions (v1.0.0-beta.1)?
5. **Error Handling:** Should rollback be fully automated or partially manual?
6. **Portability:** How do agents in agents/ folder access shared utilities?
7. **WordPress:** How to handle plugin headers, theme CSS, readme.txt versions?
8. **Documentation:** Single doc or split into multiple focused docs?

## Timeline

### Phase 1: Requirements & Design (1 week)

- Complete questionnaire: 1 hour (you)
- OpenSpec analysis: 2-3 hours (automated)
- Review OpenSpec output: 30 min (you)
- Create architecture spec & ADRs: 2-3 days (me)

**Deliverable:** Full design spec ready for implementation

### Phase 2: Implementation (2 weeks)

- Update workflows: 2-3 days
- Build portable agents: 3-4 days
- Add WordPress support: 2-3 days
- Rewrite documentation: 3-4 days

**Deliverable:** Code & docs ready for testing

### Phase 3: Testing & Validation (1 week)

- Test all repo types: 2-3 days
- Rollback validation: 1 day
- Team training: 1 day

**Deliverable:** Production-ready release process

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Release flow change breaks existing releases | High | Medium | Thorough testing, rollback validation |
| Documentation drift continues | Medium | High | Add CI validation for docs/code alignment |
| Team disagrees on flow architecture | High | Medium | Questionnaire + OpenSpec forces decision early |
| Automation too complex for users | Medium | Medium | Keep dry-run mode easy to access |
| Authorization too strict, blocks legitimate releases | Medium | Medium | Design for override + audit trail |
| WordPress versioning inconsistencies | Medium | High | Comprehensive testing across plugin/theme repos |

## Related Documents

- **Audit Report:** [AUDIT_REPORT.md](./AUDIT_REPORT.md) — Complete findings & analysis
- **Questionnaire:** [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md) — 50 questions with recommended answers
- **Multi-Repo Strategy:** [MULTI_REPO_AGENT_STRATEGY.md](./MULTI_REPO_AGENT_STRATEGY.md) — Portable agent architecture
- **Answering Guide:** [QUESTIONNAIRE_ANSWERING_GUIDE.md](./QUESTIONNAIRE_ANSWERING_GUIDE.md) — How to fill questionnaire
- **OpenSpec Setup:** [OPENSPEC_SETUP.md](./OPENSPEC_SETUP.md) — Analysis instructions

## How to Use This Epic

### For Product Owner (You)

1. Review [AUDIT_REPORT.md](./AUDIT_REPORT.md) for complete context
2. Review [QUESTIONNAIRE_PREPOPULATED.md](./QUESTIONNAIRE_PREPOPULATED.md) for design decisions
3. Approve/modify questionnaire
4. Trigger OpenSpec analysis
5. Review OpenSpec output (requirements, decision matrix, architecture spec)
6. Create child issues from implementation plan

### For Implementation Team

1. Once epic approved, child issues created
2. Each issue links to:
   - Design spec (from OpenSpec)
   - Related architecture doc
   - Test requirements
3. Follow prioritized task list
4. Update epic status as issues complete

### For Quality Assurance

1. Review test requirements in [CHILD-040] through [CHILD-047]
2. Test across all repo types:
   - Control plane (.github)
   - WordPress plugins
   - WordPress themes
3. Validate against success criteria (above)

---

## Issue Template Links

- **#CHILD-001 to #CHILD-003:** Critical fixes
- **#CHILD-004 to #CHILD-010:** Major issues
- **#CHILD-011 to #CHILD-017:** Design phase
- **#CHILD-020 to #CHILD-032:** Implementation phase
- **#CHILD-040 to #CHILD-047:** Testing phase

---

## Approval & Sign-Off

- **Created:** 2026-08-05
- **Status:** READY FOR QUESTIONNAIRE COMPLETION
- **Owner:** Ash Shaw
- **Next Step:** Review questionnaire → Trigger OpenSpec analysis

---

*This epic captures the complete release process redesign. All work items trace back to audit findings, questionnaire answers, and OpenSpec analysis.*
