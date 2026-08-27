---
document_type: "Labels Mapping Reference"
created_date: 2026-08-27
status: "active"
openspec_status: "planning"
---

# Openspec Labels Mapping — Complete Reference

This document maps all issue management components to their openspec status labels for tracking and progress measurement.

## Label Categories

### Status Labels (Lifecycle)
```
openspec:status/discovery       🟡 Initial audit and discovery
openspec:status/planning        🟠 Planning and design phase
openspec:status/implementation  🔵 Active development phase
openspec:status/testing         🟣 Validation and testing phase
openspec:status/production      🟢 Production ready
openspec:status/deprecated      ⚫ Deprecated or archived
```

### Domain Labels (Component Type)
```
openspec:domain/agent-design         For agent specifications
openspec:domain/automation           For automation scripts
openspec:domain/governance           For governance and policies
openspec:domain/documentation        For documentation
openspec:domain/testing              For test infrastructure
openspec:domain/workflow             For GitHub workflows
```

### Priority Labels (Urgency)
```
openspec:priority/critical  🔴 Must complete immediately
openspec:priority/high      🟠 Important, soon
openspec:priority/medium    🟡 Important, normal schedule
openspec:priority/low       🟢 Nice to have, when available
```

### Phase Labels (Implementation)
```
openspec:phase/discovery         Audit and discovery work
openspec:phase/planning          Design and planning work
openspec:phase/implementation    Building and coding work
openspec:phase/validation        Testing and validation work
openspec:phase/deployment        Release and deployment work
```

---

## Component Labels Matrix

### Core Components

#### 1. issues.agent.md
**Current Status**: Production (v2.0)  
**Target Status**: Production (v2.1)  
**Labels**:
```
openspec:status/production        (current v2.0)
openspec:status/planning          (v2.1 improvements)
openspec:domain/agent-design
openspec:priority/high
openspec:phase/planning
```

**Improvements Planned**:
- ✅ Add openspec integration section
- ✅ Enhance workflow patterns
- ✅ Improve error handling
- ✅ Add examples and metrics

---

#### 2. Agentic Workflow (New)
**Status**: Not yet created  
**Target Status**: Production  
**File**: `.github/workflows/issue-management-orchestration.yml`  
**Labels**:
```
openspec:status/planning
openspec:domain/workflow
openspec:domain/automation
openspec:priority/high
openspec:phase/implementation
```

**Components**:
- Content Analysis Agent
- Labeling Agent
- Enrichment Agent
- Validation Agent
- Reporting Agent

---

#### 3. Automation Scripts (13 scripts)
**Status**: All production (active)  
**Target Status**: Production (optimized)  
**Location**: `.github/scripts/automation/`  
**Labels**:
```
openspec:status/production
openspec:domain/automation
openspec:priority/medium
openspec:phase/validation
```

**Scripts** (all labeled):
- add-issue-template-sections.js
- audit-issue-metadata.js
- bulk-issue-metadata-updater.js
- manage-stale-issues.js
- allocate-to-milestone.js
- review-meta-labels.js
- review-status-labels.js
- sync-pr-labels.js
- staging-validation.js
- handlers-orchestrator.js
- label-orchestrator.js
- pr-triage-orchestrator.js
- dor-dod-templates.cjs

---

#### 4. Documentation Suite (20+ files)
**Status**: All production  
**Target Status**: Production (enhanced)  
**Location**: `.github/docs/`  
**Labels**:
```
openspec:status/production
openspec:domain/documentation
openspec:priority/medium
openspec:phase/planning
```

**Key Files**:
- ISSUE_CREATION_GUIDE.md
- ISSUE_TYPES.md
- ISSUE_TRIAGE.md
- ISSUE_TRIAGE_AUTOMATION.md
- ISSUE_TRIAGE_LABELING.md
- LABEL_STRATEGY.md
- LABELING_GOVERNANCE.md
- LABEL_INVENTORY.md
- And 12+ more

---

#### 5. Test Suite (11 test files)
**Status**: Skipped (inactive)  
**Target Status**: Production (active)  
**Location**: `.github/.jest-skip/`  
**Labels**:
```
openspec:status/discovery
openspec:domain/testing
openspec:priority/high
openspec:phase/implementation
```

**Action**: Enable and maintain test suite

---

#### 6. Configuration Files (5 files)
**Status**: All production  
**Target Status**: Production (current)  
**Labels**:
```
openspec:status/production
openspec:domain/governance
openspec:priority/high
```

**Files**:
- issue-types.yml
- labels.yml
- issue-fields.yml
- label-governance-policy.yml
- labeler.yml

---

### Project Components

#### 7. Issue Management Audit & Polish Project
**Status**: Planning phase (active)  
**Location**: `.github/projects/active/issue-management-audit-polish-2026-08-27/`  
**Labels**:
```
openspec:status/planning
openspec:domain/agent-design
openspec:domain/automation
openspec:domain/governance
openspec:priority/high
```

**Documents**:
- 00-INDEX.md
- 00-PROJECT-OVERVIEW.md — openspec:status/planning
- 01-CURRENT-STATE-AUDIT.md — openspec:status/planning
- 02-IMPROVEMENT-PLAN.md — openspec:status/planning
- 03-OPENSPEC-STATUS-FRAMEWORK.md — openspec:status/planning
- 04-AGENTIC-WORKFLOW-DESIGN.md — openspec:status/planning
- 05-AUTOMATION-SCRIPTS-INVENTORY.md — openspec:status/planning
- README.md — openspec:status/planning

---

## Implementation Timeline

### Phase 1: Discovery (Complete ✅)
**Labels**: `openspec:status/discovery` ✅  
**Duration**: 1 day (2026-08-27)  
**Completion**: 100%

**Tasks**:
- ✅ Audit all components
- ✅ Document current state
- ✅ Identify gaps

---

### Phase 2: Planning (In Progress ⏳)
**Labels**: `openspec:status/planning` ⏳  
**Duration**: 3-4 days (2026-08-27 to 2026-08-31)  
**Completion**: 70%

**Tasks**:
- ✅ Create improvement plan
- ✅ Design agentic workflow
- ✅ Plan automation improvements
- ⏳ Review and approve plans
- ⏳ Allocate resources

---

### Phase 3: Implementation (Upcoming 🔵)
**Labels**: `openspec:status/implementation` 🔵  
**Duration**: 5-7 days (2026-09-01 to 2026-09-07)  
**Completion**: 0%

**Tasks**:
- Build agentic workflow
- Update issues.agent.md v2.1
- Improve automation scripts
- Optimize test suite
- Update documentation

---

### Phase 4: Testing (Upcoming 🟣)
**Labels**: `openspec:status/testing` 🟣  
**Duration**: 2-3 days (2026-09-08 to 2026-09-10)  
**Completion**: 0%

**Tasks**:
- Test workflow execution
- Validate labels application
- Test automation scripts
- Verify documentation

---

### Phase 5: Production (Upcoming 🟢)
**Labels**: `openspec:status/production` 🟢  
**Duration**: 1-2 days (2026-09-11 to 2026-09-12)  
**Completion**: 0%

**Tasks**:
- Deploy to production
- Enable monitoring
- Document learnings
- Close project

---

## Labels in GitHub Issues

### Creating Issues with Labels

When opening issues for this project, use:

```
Title: [Component] Description

Labels:
- openspec:status/planning (or current status)
- openspec:domain/automation (or relevant domain)
- openspec:priority/high (or relevant priority)
- openspec:phase/implementation (or relevant phase)
```

### Example Issues

**Example 1: Create Agentic Workflow**
```
Title: Create Issue Management Orchestration Workflow
Labels:
- openspec:status/implementation
- openspec:domain/workflow
- openspec:domain/automation
- openspec:priority/high
- openspec:phase/implementation
```

**Example 2: Update Documentation**
```
Title: Update documentation with openspec status tracking
Labels:
- openspec:status/planning
- openspec:domain/documentation
- openspec:priority/medium
- openspec:phase/planning
```

**Example 3: Enable Test Suite**
```
Title: Enable and maintain issue management test suite
Labels:
- openspec:status/implementation
- openspec:domain/testing
- openspec:priority/high
- openspec:phase/implementation
```

---

## Tracking Progress with openspec Labels

### Command Line Examples

**Find all planning items**:
```bash
gh issue list --label "openspec:status/planning"
```

**Find all high priority items**:
```bash
gh issue list --label "openspec:priority/high"
```

**Find items by domain**:
```bash
gh issue list --label "openspec:domain/automation"
```

**Track implementation progress**:
```bash
gh issue list --label "openspec:status/implementation" --label "openspec:domain/workflow"
```

---

## Label Legend

| Label | Meaning | Count | Status |
|-------|---------|-------|--------|
| openspec:status/discovery | In initial audit phase | 0 | ✅ |
| openspec:status/planning | In planning & design | 8 | ⏳ |
| openspec:status/implementation | Under active development | 0 | 🔵 |
| openspec:status/testing | In validation phase | 0 | 🟣 |
| openspec:status/production | Production ready | 16 | 🟢 |
| **Total** | | **24** | |

---

## Component Status Summary

```
Component                        Status      Labels
─────────────────────────────────────────────────────────────
issues.agent.md v2.0             🟢 prod     status:prod, domain:agent
issues.agent.md v2.1             🟠 plan     status:planning, domain:agent
Agentic Workflow                 ⏳ design   status:planning, domain:workflow
13 Automation Scripts            🟢 prod     status:prod, domain:automation
Documentation Suite              🟢 prod     status:prod, domain:docs
Test Suite                       🟡 skip     status:discovery, domain:testing
5 Config Files                   🟢 prod     status:prod, domain:governance
Project Documentation            🟠 plan     status:planning, domain:all
─────────────────────────────────────────────────────────────
TOTAL                                        24 components
```

---

## Best Practices

### Applying Labels

1. **Always use status label** - Every item has exactly one status
2. **Add domain label** - Categorize by component type
3. **Add priority if high** - Highlight urgent work
4. **Add phase label** - Track workflow stage
5. **Keep labels consistent** - Follow naming convention

### Updating Labels

1. **On Status Change** - Update status label immediately
2. **On Phase Progress** - Update phase label
3. **On Priority Change** - Update priority label
4. **Document in Comments** - Explain label changes
5. **Maintain Audit Trail** - Keep history of changes

### Monitoring Progress

1. **Daily Check** - Review status labels
2. **Weekly Summary** - Aggregate metrics
3. **Monthly Report** - Track trends
4. **Phase Transitions** - Note key milestones

---

## Integration Points

### GitHub Actions
- Workflows can read labels via `github.event.issue.labels`
- Can apply labels automatically in workflows
- Can trigger on label changes

### GitHub Projects
- Filter by labels in project views
- Group by labels in columns
- Track progress by label counts

### Reporting
- Generate metrics by label
- Create dashboards by label
- Export data by label filter

---

## FAQ

**Q: Can components have multiple status labels?**  
A: No, each component has exactly one status label at a time. Status progresses forward only.

**Q: How do I find all items in a phase?**  
A: Use `gh issue list --label "openspec:phase/implementation"`

**Q: What if a component stalls?**  
A: Keep status as-is, note the blocker in comments, and escalate if needed.

**Q: Can I add custom labels?**  
A: Use the defined set for consistency. Propose new labels in project discussions.

---

## Related Documentation

- [Openspec Status Framework](./03-OPENSPEC-STATUS-FRAMEWORK.md)
- [Project Overview](./00-PROJECT-OVERVIEW.md)
- [Current State Audit](./01-CURRENT-STATE-AUDIT.md)
- [Improvement Plan](./02-IMPROVEMENT-PLAN.md)

---

**Mapping Complete**: 2026-08-27  
**Last Updated**: 2026-08-27  
**Total Components Labeled**: 24  
**Status**: Active - Ready for use
