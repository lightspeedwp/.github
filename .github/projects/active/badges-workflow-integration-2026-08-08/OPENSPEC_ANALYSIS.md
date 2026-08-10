---
title: "Badges Workflow Integration — OpenSpec Analysis & Design Decisions"
description: "Formal specification of design decisions, requirements, and architecture for badges workflow automation"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-10"
version: "v1.2.1"
authors: ["Ash Shaw", "Claude"]
tags: ["openspec", "badges", "design-decisions", "architecture"]
---

# Badges Workflow Integration — OpenSpec Analysis

**Project:** Badges Workflow Integration  
**Phase:** Phase 4 In Progress (Integration Testing)  
**Decision Framework:** Architecture Decision Records (ADRs)  
**Status:** Phase 1-3 Complete, Phase 4 Integration Testing Unblocked (GitHub Actions v7 fixes applied)

---

## Executive Summary

This document formalizes design decisions for badges workflow automation based on the comprehensive audit and planning conducted in the root `AUDIT_AND_PLAN.md`. All major architectural decisions have been made and are documented as ADRs below.

---

## Part I: Requirements Specification

### Functional Requirements

**REQ-001: Badge Schema Configuration**

- System must load badge definitions from `.github/automation/badges.schema.yml`
- Schema must include all 42 workflows from `.github/workflows/`
- Schema must support metadata badge mapping rules
- Schema must validate with YAML validator before use

**REQ-002: Documentation Badge Generation**

- System must auto-generate badges when documentation files change
- Badges must be inserted/updated between `<!-- BADGES-START -->` and `<!-- BADGES-END -->` markers
- System must skip files marked with `skip_badges: true` in frontmatter
- Generation must trigger on push to `develop` branch

**REQ-003: Badge URL Validation**

- System must validate all badge URLs weekly (HTTP/GitHub)
- System must detect broken links (404, timeout, redirect errors)
- System must create GitHub issue if >1 broken link found
- System must report results by file and badge type

**REQ-004: Workflow Discovery**

- System must scan `.github/workflows/` weekly for changes
- System must detect new workflows (additions)
- System must detect removed workflows (deletions)
- System must detect renamed workflows (name changes)
- System must auto-add new workflows to schema

**REQ-005: Governance & Documentation**

- Team must be able to update badges without code changes
- Schema update procedures must be documented
- Badge types and conventions must be defined
- Troubleshooting guide must be provided

### Non-Functional Requirements

**NFR-001: Reliability**

- Badge generation must not block PR checks
- Broken badges must not prevent PR merge (warnings only)
- Schema validation must occur before use (fail-safe)

**NFR-002: Maintainability**

- All workflows must be discoverable via schema
- Code must be readable and well-documented
- Procedures must be clear for team members

**NFR-003: Performance**

- Schema loading must complete in <1 second
- Badge generation must complete in <30 seconds per document
- URL validation must complete in <5 minutes for all documents

---

## Part II: Architectural Decisions (ADRs)

### ADR-001: Hybrid Badge Generation Strategy

**Status:** DECIDED

**Decision:** Use hybrid approach combining:

- **Manual badges** (README.md status) → Scheduled workflows with GitHub API queries
- **Auto-generated badges** (documentation) → Schema-driven generation on documentation changes

**Rationale:**

- Status badges require live API queries → scheduled workflows more efficient
- Document-type badges can be auto-generated from metadata → faster immediate feedback
- Hybrid approach balances automation and control

**Consequences:**

- ✅ Status badges always current
- ✅ Documentation badges generated immediately on changes
- ⚠️ Requires two workflow types (different trigger patterns)

**Alternatives Considered:**

- All auto-generated: Would miss live status updates (rejected)
- All scheduled: Would have stale documentation badges (rejected)

---

### ADR-002: Multi-Trigger Workflow Strategy

**Status:** DECIDED

**Decision:** Workflows trigger on:

- **On-push:** For immediate documentation badge updates
- **Scheduled (weekly):** For status validation and discovery
- **Manual dispatch:** For debugging and special operations

**Rationale:**

- Provides immediate feedback for documentation changes
- Weekly validation prevents silent failures
- Manual dispatch enables troubleshooting

**Consequences:**

- ✅ Multiple trigger points for different scenarios
- ✅ Automatic and manual control both available
- ⚠️ Multiple workflows to manage

---

### ADR-003: Schema-Driven Badge Configuration

**Status:** DECIDED

**Decision:** All badge definitions live in `.github/automation/badges.schema.yml`

**Rationale:**

- Team can update badges without touching code
- YAML is human-readable and version-controlled
- Centralized configuration reduces duplication
- Validation before use prevents runtime errors

**Consequences:**

- ✅ Team can manage badges independently
- ✅ Schema is source of truth
- ⚠️ Requires schema validation on every workflow run

---

### ADR-004: Marker-Based Badge Insertion

**Status:** DECIDED

**Decision:** Use HTML comment markers (`<!-- BADGES-START -->` / `<!-- BADGES-END -->`) for badge location

**Rationale:**

- Non-intrusive (invisible in rendered markdown)
- Works in all markdown contexts
- Easy to locate and update
- Prevents accidental badge deletion

**Consequences:**

- ✅ Safe and reliable insertion point
- ✅ No special formatting required
- ⚠️ Requires manual marker placement first time

---

### ADR-005: Graceful Error Handling

**Status:** DECIDED

**Decision:** Workflows fail gracefully with detailed logging:

- Missing schema: Log warning, skip generation, don't fail workflow
- Broken badge links: Create issue, suggest fix, don't block PR
- File update failures: Create PR instead of direct commit

**Rationale:**

- Badges are documentation enhancement, not critical
- Graceful degradation prevents workflow cascades
- Detailed logging enables debugging

**Consequences:**

- ✅ Workflows never block critical paths
- ✅ Issues are created for problems
- ⚠️ Requires monitoring for silent failures

---

## Part III: Implementation Strategy

### Phased Rollout

**Phase 1 (5 days):** Foundation

- Create badge schema configuration
- Update badges.js utility
- Document governance procedures

**Phase 2 (5 days):** Workflows

- Documentation badge update workflow
- README status workflow
- Workflow sync workflow
- Health check workflow

**Phase 3 (3 days):** Integration

- Test all workflows
- Generate initial schema
- Create comprehensive docs

**Phase 4 (2 days):** Governance

- Monitoring dashboard
- Team update policy
- Project completion

### Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Broken badge links | High | High | Weekly validation workflow |
| Schema out of sync | Medium | Medium | Weekly sync workflow |
| Performance impact | Low | Medium | Background execution, skip filters |
| Workflow confusion | Medium | Low | Comprehensive documentation |

---

## Part IV: Success Metrics

### Coverage Metrics

- ✅ 100% of 42 workflows have badge definitions
- ✅ >70% of documentation files have badges
- ✅ 0 broken badge links (weekly validation)

### Adoption Metrics

- ✅ Team can update badges without code changes
- ✅ All procedures documented
- ✅ Zero training issues

### Operational Metrics

- ✅ Workflow discovery: <7 days latency
- ✅ Status update: Daily accuracy
- ✅ Badge generation: <30 sec per document

---

## Part V: Design Decision Summary

### Key Principles

1. **Automation Over Manual Work** — Reduce manual badge maintenance
2. **Team Independence** — Team can update without code changes
3. **Fail-Safe** — Broken badges don't break workflows
4. **Discoverability** — All workflows tracked automatically
5. **Maintainability** — Clear procedures and documentation

### Trade-offs Made

| Decision | Benefit | Cost |
|----------|---------|------|
| Multi-trigger workflows | Immediate + periodic updates | More workflows to manage |
| Schema-driven config | Team independence | Requires validation |
| HTML markers | Safe insertion | Manual placement first-time |
| Graceful errors | No workflow blocking | Need monitoring |

---

## Part VI: Open Questions & Decisions Approved

### Q1: Badge Coverage Scope

**Decision:** Key document types only (docs/, agents/, schemas/, instructions/)
**Rationale:** Reduces noise, focuses on important docs
**Status:** ✅ APPROVED

### Q2: Workflow Badging Frequency

**Decision:** Every push (doc changes) + weekly (status)
**Rationale:** Immediate feedback + periodic validation
**Status:** ✅ APPROVED

### Q3: Badge PR Merge Strategy

**Decision:** Auto-merge routine, review significant changes
**Rationale:** Reduces churn while maintaining quality
**Status:** ✅ APPROVED

### Q4: Workflow Coverage

**Decision:** Configurable subset in schema (15-20 critical initially)
**Rationale:** Focused coverage, room to expand
**Status:** ✅ APPROVED

---

## Implementation Checklist

### Pre-Implementation (Phase 1)

- [ ] Schema file created and validated
- [ ] badges.js aligned with automation spec
- [ ] Governance documentation complete
- [ ] Team trained on procedures

### Implementation (Phase 2-3)

- [ ] All 4 workflows created and tested
- [ ] Initial schema generated
- [ ] Comprehensive documentation written
- [ ] Edge cases tested

### Post-Implementation (Phase 4)

- [ ] Monitoring dashboard created
- [ ] Update policy finalized
- [ ] Team feedback incorporated
- [ ] Project closure

---

## References

- [Complete Audit & Plan](./AUDIT_AND_PLAN.md)
- [Broken Badges Analysis](./BROKEN_BADGES_FINDINGS.md)
- [Project Tracker](./PROJECT_TRACKER.md)
- [Project README](./PROJECT_README.md)
- Related Issues: #1641 (Epic), #1643–#1655 (Child Issues)

---

## Sign-Off

**Design Authority:** Ash Shaw  
**Approved Date:** 2026-08-08  
**Status:** Ready for Phase 1 Implementation

This specification locks down all architectural decisions and is ready for implementation phase to begin.

---

**Document Version:** 1.2.1  
**Last Updated:** 2026-08-10  
**Status:** Phase 4 In Progress  
**Next Review:** After integration testing completion
