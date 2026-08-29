---
document_type: "Framework Definition"
framework: "openspec Status Labels"
created_date: 2026-08-27
status: "Active"
---

# Openspec Status Framework for Issue Management

## Overview

This document defines the openspec status labels and tracking framework for the issue management infrastructure improvement project.

## Openspec Status Labels

### Label Definitions

| Label | Description | Meaning | Color |
|-------|-------------|---------|-------|
| `openspec:status/discovery` | Initial audit and discovery phase | Component has been identified and audited | 🟡 Yellow |
| `openspec:status/planning` | Planning and design phase | Component has a documented improvement plan | 🟠 Orange |
| `openspec:status/implementation` | Active implementation phase | Component is being built/improved | 🔵 Blue |
| `openspec:status/testing` | Validation and testing phase | Component is being tested and validated | 🟣 Purple |
| `openspec:status/production` | Production ready | Component is complete and production-ready | 🟢 Green |
| `openspec:status/deprecated` | No longer active | Component is deprecated or archived | ⚫ Grey |

### Status Progression

```
discovery → planning → implementation → testing → production
```

**One-Way Transition**: Status always moves forward, never backward.

---

## Component Status Tracking

### Core Components

#### 1. issues.agent.md

- **Current Status**: `openspec:status/production` (v2.0 active)
- **Target Status**: `openspec:status/production` (v2.1 improved)
- **Current Phase**: `planning`
- **Expected Completion**: 2026-08-30
- **Improvements**:
  - Add openspec integration documentation
  - Enhance workflow patterns
  - Improve error handling
  - Add examples and metrics

#### 2. Agentic Workflow

- **Current Status**: `openspec:status/planning` (proposed)
- **Target Status**: `openspec:status/production`
- **Current Phase**: `implementation`
- **Expected Completion**: 2026-09-02
- **File**: `.github/workflows/issue-management-orchestration.yml`

#### 3. Documentation Suite

- **Current Status**: `openspec:status/production` (existing)
- **Target Status**: `openspec:status/production` (enhanced)
- **Current Phase**: `planning`
- **Expected Completion**: 2026-09-05
- **Files**: 20+ markdown files in `/docs/`

#### 4. Automation Scripts

- **Current Status**: `openspec:status/production` (active)
- **Target Status**: `openspec:status/production` (optimized)
- **Current Phase**: `planning`
- **Expected Completion**: 2026-09-01
- **Location**: `/scripts/automation/`

#### 5. Test Suite

- **Current Status**: `openspec:status/discovery` (skipped)
- **Target Status**: `openspec:status/production` (active)
- **Current Phase**: `implementation`
- **Expected Completion**: 2026-09-03
- **Location**: `/.jest-skip/` → `/tests/`

---

## Phase Definitions & Completion Criteria

### Phase 1: Discovery

**Criteria for Completion**:

- ✅ Component audited and documented
- ✅ Current capabilities documented
- ✅ Gaps identified
- ✅ Baseline established

### Phase 2: Planning

**Criteria for Completion**:

- ✅ Improvement plan documented
- ✅ Architecture designed
- ✅ Resource requirements identified
- ✅ Success criteria defined
- ✅ Stakeholder review completed

### Phase 3: Implementation

**Criteria for Completion**:

- ✅ Code changes completed
- ✅ Documentation updated
- ✅ Tests written
- ✅ Examples added
- ✅ Local validation passed

### Phase 4: Testing

**Criteria for Completion**:

- ✅ Unit tests passing (90%+ coverage)
- ✅ Integration tests passing
- ✅ Manual testing completed
- ✅ Performance validated
- ✅ Documentation reviewed

### Phase 5: Production

**Criteria for Completion**:

- ✅ Deployed to main branch
- ✅ Monitoring established
- ✅ Runbooks created
- ✅ Team trained
- ✅ Support documentation completed

---

## Component Status Matrix

### Current Status (2026-08-27)

```
Component                       Current   Target    Phase           ETA
────────────────────────────────────────────────────────────────────────
issues.agent.md                 prod      prod      planning        8/30
Agentic Workflow                plan      prod      implementation  9/02
Documentation Suite             prod      prod      planning        9/05
Automation Scripts              prod      prod      planning        9/01
Test Suite                      disc      prod      implementation  9/03
────────────────────────────────────────────────────────────────────────
```

### Completion Progress

**Overall Project Progress**: 20% complete

- Discovery: ✅ 100% (audit done)
- Planning: ⏳ 70% (plan drafted)
- Implementation: ⏳ 0% (about to start)
- Testing: ⏳ 0% (queued)
- Production: ⏳ 0% (queued)

---

## Tracking & Reporting

### Status Updates

**Update Frequency**: Daily (during active work)  
**Reporting Method**: Comment on active issues and this document  
**Escalation Path**: Issues → PR → Review → Merge

### Sample Status Update Format

```markdown
### [Component] Status Update — [Date]

**Current Phase**: Planning → Implementation
**Status**: ✅ Complete / ⏳ In Progress / ⚠️ Blocked

**Completed**:
- Task 1
- Task 2

**In Progress**:
- Task 3

**Next Steps**:
- Task 4
- Task 5

**Blockers**: None / [Describe blockers]
```

### Progress Tracking

**Metrics to Track**:

- Completion percentage per phase
- Velocity (tasks completed per day)
- Blockers and blockers resolved
- Documentation completeness
- Test coverage

---

## Integration with GitHub

### Label Management

**Creating Labels in GitHub**:

```bash
# Example: Create production-ready label
gh label create \
  --name "openspec:status/production" \
  --color "22863a" \
  --description "Component is production-ready"
```

**Applying Labels to Issues**:

- Manually during issue triage
- Automatically via workflow
- Batch update via script

### Issue Templates

Add to issue templates:

```markdown
## openspec Status
- [ ] discovery
- [ ] planning
- [ ] implementation
- [ ] testing
- [ ] production
```

### Project Board

Organize project board by status:

- Backlog: `discovery` status
- To Do: `planning` status
- In Progress: `implementation` status
- Review: `testing` status
- Done: `production` status

---

## Metrics & Reporting

### Key Metrics

**Lead Time**: Days from discovery to production

- Target: < 14 days for improvements
- Measurement: status transition dates

**Throughput**: Components completed per phase

- Target: 3-5 components per week
- Measurement: count of production-ready components

**Quality**: Defect rate after production

- Target: < 2% issues reported
- Measurement: issues created after deployment

**Documentation**: Coverage per component

- Target: 100%
- Measurement: documentation pages per component

### Sample Report Template

```markdown
## openspec Progress Report — [Week]

### Overall Status
- Components in discovery: X
- Components in planning: X
- Components in implementation: X
- Components in testing: X
- Components in production: X

### Key Achievements
- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

### Blockers
- [Blocker 1: status, impact, resolution ETA]

### Next Week's Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]
```

---

## Best Practices

### Status Label Best Practices

1. **One Status Per Component**: Each component has exactly one active status
2. **Clear Criteria**: Use documented criteria for transitions
3. **Regular Updates**: Update status daily during active work
4. **Escalate Blockers**: Report blockers immediately
5. **Document Decisions**: Record why status changed

### Documentation Best Practices

1. **Link to Plan**: Every status update references improvement plan
2. **Document Decisions**: Record architectural decisions
3. **Include Examples**: Provide concrete examples
4. **Version Control**: Track changes over time
5. **Peer Review**: Have changes reviewed before merge

### Workflow Best Practices

1. **Automate Where Possible**: Use workflows to apply labels
2. **Manual Review**: Always review before production
3. **Staged Rollout**: Test with subset before full deployment
4. **Monitor Closely**: Watch metrics after deployment
5. **Rapid Response**: Fix issues quickly if problems appear

---

## Related Documentation

- [Project Overview](./00-PROJECT-OVERVIEW.md)
- [Current State Audit](./01-CURRENT-STATE-AUDIT.md)
- [Improvement Plan](./02-IMPROVEMENT-PLAN.md)
- [OpenSpec Project](/.github/projects/active/openspec/)
- [Issues Agent](/.github/agents/issues.agent.md)

---

## FAQ

**Q: What if a component doesn't fit the phases?**  
A: Use the closest phase and document any deviations.

**Q: Can a component go backwards?**  
A: No, status is one-way. If issues appear, create a new improvement cycle.

**Q: How do we handle dependencies between components?**  
A: Document dependencies in the improvement plan, coordinate timing.

**Q: Who approves status transitions?**  
A: PR review process validates transitions before merge.

**Q: How often should we update status?**  
A: Daily during active work, weekly otherwise.

---

**Framework Active**: 2026-08-27  
**Next Review**: 2026-09-03  
**Last Updated**: 2026-08-27
