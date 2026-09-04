---
file_type: documentation
title: "OpenSpec Requirements & Issue Templates"
description: "Requirements specification for generating openspec.json and creating GitHub issues"
status: active
version: "1.0.0"
---

# OpenSpec Requirements & Issue Templates

This document defines the requirements that will be converted to `openspec.json` for structured issue/task generation and GitHub issue creation.

---

## Project Requirements (openspec.json structure)

```json
{
  "project": {
    "title": "Project Management Agent & Automation Consolidation Initiative",
    "slug": "automation-consolidation-agentic-workflows-2026-09",
    "version": "1.0.0",
    "status": "active",
    "epic_issue": 1240,
    "start_date": "2026-09-03",
    "target_completion": "2026-11-30",
    "phases": [
      {
        "number": 1,
        "title": "Audit & Planning",
        "duration": "2-3 weeks",
        "start": "2026-09-03",
        "end": "2026-09-21",
        "status": "active",
        "effort_hours": 88,
        "deliverables": 6
      },
      {
        "number": 2,
        "title": "Implementation",
        "duration": "4-6 weeks",
        "start": "2026-09-22",
        "end": "2026-10-31",
        "status": "planned",
        "effort_hours": 140,
        "deliverables": 10
      },
      {
        "number": 3,
        "title": "Testing & Rollout",
        "duration": "2-3 weeks",
        "start": "2026-11-01",
        "end": "2026-11-30",
        "status": "planned",
        "effort_hours": 46,
        "deliverables": 5
      }
    ]
  },
  "requirements": [
    {
      "category": "audit",
      "items": [
        {
          "id": "audit-001",
          "title": "Audit all project management scripts",
          "description": "Analyze 45+ scripts in scripts/ directory for purpose, status, dependencies, and duplication",
          "phase": 1,
          "effort_hours": 10,
          "priority": "high"
        },
        {
          "id": "audit-002",
          "title": "Audit all GitHub workflows",
          "description": "Analyze 25+ workflows in .github/workflows/ for purpose, status, dependencies, and duplication",
          "phase": 1,
          "effort_hours": 8,
          "priority": "high"
        },
        {
          "id": "audit-003",
          "title": "Audit agent definitions",
          "description": "Identify 20+ agent files across multiple directories (.github/agents/, agents/, scripts/agents/), consolidation opportunities",
          "phase": 1,
          "effort_hours": 6,
          "priority": "high"
        },
        {
          "id": "audit-004",
          "title": "Analyze documentation duplication",
          "description": "Review 30+ docs for overlapping content, identify consolidation opportunities",
          "phase": 1,
          "effort_hours": 8,
          "priority": "medium"
        },
        {
          "id": "audit-005",
          "title": "Create comprehensive findings report",
          "description": "Compile audit findings into structured report with inventory tables, analysis, recommendations",
          "phase": 1,
          "effort_hours": 10,
          "priority": "high",
          "deliverable": true
        },
        {
          "id": "audit-006",
          "title": "Design issue management agent specification",
          "description": "Create detailed spec with decision trees, triggers, actions, safety gates for issue agent",
          "phase": 1,
          "effort_hours": 12,
          "priority": "high",
          "deliverable": true
        },
        {
          "id": "audit-007",
          "title": "Design PR management agent specification",
          "description": "Create detailed spec with decision trees, triggers, actions, safety gates for PR agent",
          "phase": 1,
          "effort_hours": 12,
          "priority": "high",
          "deliverable": true
        },
        {
          "id": "audit-008",
          "title": "Plan org-wide rollout strategy",
          "description": "Design installation process, config templates, monitoring approach for deployment to other repos",
          "phase": 1,
          "effort_hours": 8,
          "priority": "medium",
          "deliverable": true
        },
        {
          "id": "audit-009",
          "title": "Create bulk update test plan",
          "description": "Plan validation of issue #1240 epic + 6 child issues + linked PRs",
          "phase": 1,
          "effort_hours": 6,
          "priority": "high",
          "deliverable": true
        },
        {
          "id": "audit-010",
          "title": "Document consolidation roadmap",
          "description": "Create Phase 2-3 implementation roadmap with prioritized tasks and timeline",
          "phase": 1,
          "effort_hours": 8,
          "priority": "medium",
          "deliverable": true
        }
      ]
    },
    {
      "category": "implementation",
      "items": [
        {
          "id": "impl-001",
          "title": "Consolidate duplicate labeling scripts",
          "description": "Merge sync-pr-labels.js, sync-pr-labels-optimized.js, and review-status-labels.js into single implementation",
          "phase": 2,
          "effort_hours": 16,
          "priority": "high",
          "blockers": ["audit-001"]
        },
        {
          "id": "impl-002",
          "title": "Consolidate duplicate issue metadata updaters",
          "description": "Merge audit-issue-metadata.js, bulk-issue-metadata-updater.js, and related scripts",
          "phase": 2,
          "effort_hours": 12,
          "priority": "high",
          "blockers": ["audit-001"]
        },
        {
          "id": "impl-003",
          "title": "Consolidate agent definitions",
          "description": "Merge task-planner, task-researcher, labeling, issues agents from 3+ locations into canonical locations",
          "phase": 2,
          "effort_hours": 10,
          "priority": "medium",
          "blockers": ["audit-003"]
        },
        {
          "id": "impl-004",
          "title": "Restructure documentation",
          "description": "Consolidate 30+ docs into canonical hierarchy with redirects",
          "phase": 2,
          "effort_hours": 16,
          "priority": "medium",
          "blockers": ["audit-004"]
        },
        {
          "id": "impl-005",
          "title": "Implement issue management agent",
          "description": "Build agent based on spec with decision tree, label routing, milestone allocation, validation",
          "phase": 2,
          "effort_hours": 24,
          "priority": "high",
          "blockers": ["audit-006"]
        },
        {
          "id": "impl-006",
          "title": "Implement PR management agent",
          "description": "Build agent based on spec with template validation, linking, conflict detection, review integration",
          "phase": 2,
          "effort_hours": 24,
          "priority": "high",
          "blockers": ["audit-007"]
        },
        {
          "id": "impl-007",
          "title": "Build agentic workflow integrations",
          "description": "Create GitHub Actions workflows to trigger agents on issue/PR events",
          "phase": 2,
          "effort_hours": 12,
          "priority": "high"
        },
        {
          "id": "impl-008",
          "title": "Implement safety gates for agents",
          "description": "Add validation gates to prevent agents from making unintended changes",
          "phase": 2,
          "effort_hours": 8,
          "priority": "high"
        },
        {
          "id": "impl-009",
          "title": "Create monitoring & observability dashboard",
          "description": "Build dashboard to track agent actions, decisions, and performance",
          "phase": 2,
          "effort_hours": 10,
          "priority": "medium"
        },
        {
          "id": "impl-010",
          "title": "Write agent usage documentation",
          "description": "Create guides for using agents, troubleshooting, feedback process",
          "phase": 2,
          "effort_hours": 8,
          "priority": "medium"
        }
      ]
    },
    {
      "category": "testing",
      "items": [
        {
          "id": "test-001",
          "title": "Test issue agent on #2569",
          "description": "Run issue management agent on closed test issue #2569, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-002",
          "title": "Test issue agent on #2571",
          "description": "Run issue management agent on closed test issue #2571, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-003",
          "title": "Test issue agent on #2572",
          "description": "Run issue management agent on closed test issue #2572, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-004",
          "title": "Test issue agent on #2558",
          "description": "Run issue management agent on closed test issue #2558, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-005",
          "title": "Test issue agent on #2559",
          "description": "Run issue management agent on closed test issue #2559, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-006",
          "title": "Test issue agent on #2564",
          "description": "Run issue management agent on closed test issue #2564, validate all remediation",
          "phase": 3,
          "effort_hours": 3,
          "priority": "high"
        },
        {
          "id": "test-007",
          "title": "Link all test issues to epic #1240",
          "description": "Ensure all 6 test issues are properly linked as children to epic #1240",
          "phase": 3,
          "effort_hours": 2,
          "priority": "high"
        },
        {
          "id": "test-008",
          "title": "Validate all linked PRs",
          "description": "For each test issue, validate that linked PRs meet governance standards (template, labels, milestone, assignees)",
          "phase": 3,
          "effort_hours": 6,
          "priority": "high"
        },
        {
          "id": "test-009",
          "title": "Test PR agent on linked PRs",
          "description": "Run PR management agent on all PRs linked to test issues, validate all validations/remediations",
          "phase": 3,
          "effort_hours": 6,
          "priority": "high"
        },
        {
          "id": "test-010",
          "title": "Document test results",
          "description": "Create comprehensive test report showing before/after state, agent decisions, lessons learned",
          "phase": 3,
          "effort_hours": 4,
          "priority": "medium",
          "deliverable": true
        },
        {
          "id": "test-011",
          "title": "Deploy to additional repo",
          "description": "Install agents on test repository to validate rollout process",
          "phase": 3,
          "effort_hours": 6,
          "priority": "medium"
        },
        {
          "id": "test-012",
          "title": "Team training & feedback",
          "description": "Train team on using agents, collect feedback, iterate on design",
          "phase": 3,
          "effort_hours": 4,
          "priority": "medium",
          "deliverable": true
        }
      ]
    }
  ]
}
```

---

## GitHub Issue Templates

### Epic Issue Template (for #1240 and/or new epic if needed)

**Title:** `[Epic] Project Management Agent & Automation Consolidation Initiative`

**Body:**
```markdown
## Overview

Comprehensive audit, consolidation, and migration of project management automation to GitHub's agentic workflows.

## Goals

- [ ] Audit 150+ scripts, workflows, agents, and documentation
- [ ] Consolidate 15-20 duplicate/overlapping files
- [ ] Design issue and PR management agents using agentic workflows
- [ ] Plan org-wide rollout to other WordPress repositories
- [ ] Test agents with bulk updates to 6 real issues + linked PRs

## Related Projects

- [Workflows Consolidation 2026-Q3](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/workflows-consolidation-2026-q3)
- [Release Agentic Workflows](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/release-agentic-workflows-2026-08-11)
- [Issue Management Integration](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/issue-management-integration-2026-08-29)

## Project Structure

See `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/` for detailed planning and documentation.

## Timeline

- **Phase 1 (Audit):** Sep 3-21, 2026
- **Phase 2 (Implementation):** Sep 22-Oct 31, 2026
- **Phase 3 (Testing & Rollout):** Nov 1-30, 2026

## Success Criteria

- [ ] All 150+ files audited and categorized
- [ ] Consolidation strategy defined
- [ ] Agent specifications complete
- [ ] Agents implemented and tested
- [ ] Documentation restructured
- [ ] Deployed to organization

---
_Generated by [Claude Code](https://claude.ai/code)_
```

### Child Issue Template (audit-001)

**Title:** `[audit-001] Audit all project management scripts (45+ files)`

**Labels:** `type:task` `area:automation` `priority:high` `meta:audit` `status:in-progress`

**Body:**
```markdown
## Overview

Comprehensive analysis of 45+ scripts in the `scripts/` directory for purpose, status, dependencies, and consolidation opportunities.

## Scope

**Files to Audit:**
- 9 project management scripts (`scripts/automation/`, `scripts/workflows/projects/`)
- 8 validation scripts (`scripts/validation/`)
- 8 labeling scripts (`scripts/automation/`, `scripts/agents/`)
- 8 issue management scripts (`scripts/automation/`, `scripts/agents/`)
- 8 PR automation scripts
- 6+ agent orchestration scripts

## Tasks

- [ ] Inventory all 45 scripts with fields:
  - File path
  - Purpose (1-line summary)
  - Status (active/dead/duplicate)
  - Dependencies (what it calls/is called by)
  - Last update date
  - Error handling approach
  - Test coverage

- [ ] Categorize scripts by function
- [ ] Identify duplicate/overlapping implementations
- [ ] Map dependencies (call graph)
- [ ] Create findings table

## Acceptance Criteria

- ✅ All 45+ scripts cataloged
- ✅ Dependencies mapped
- ✅ Duplicate groups identified with consolidation options
- ✅ Effort estimates for consolidation provided
- ✅ Findings compiled in audit report

## Related

- Epic: #1240
- Project: [automation-consolidation-agentic-workflows-2026-09](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active/automation-consolidation-agentic-workflows-2026-09)

## Effort

**Estimated:** 10 hours  
**Priority:** HIGH  
**Phase:** 1 (Audit & Planning)

---
_Generated by [Claude Code](https://claude.ai/code)_
```

### Child Issue Template (impl-005)

**Title:** `[impl-005] Implement issue management agent`

**Labels:** `type:feature` `area:automation` `priority:high` `meta:implementation` `status:planned`

**Body:**
```markdown
## Overview

Build issue management agent to automate templating, labeling, milestone allocation, user assignment, and validation.

## Specification

See: `.github/projects/active/automation-consolidation-agentic-workflows-2026-09/ISSUE_MANAGEMENT_AGENT_SPEC.md`

## Decision Trees

**Event: Issue Created**
1. Detect issue type from template selection
2. Validate using correct template
3. Apply labels based on type + governance rules
4. Allocate milestone if applicable
5. Route to area owner for initial assignment
6. Sync project fields
7. Validate completeness (DOD, required fields, blocking issues)

**Event: Issue Labeled Manually**
1. Validate label is from canonical set (with family prefix)
2. Apply complementary labels if needed
3. Update project fields
4. Check if all required labels present

**Event: Issue Reopened**
1. Validate description still accurate
2. Check that linked issues/PRs still valid
3. Update status labels
4. Notify area owner

## Acceptance Criteria

- ✅ Agent responds to issue events (opened, reopened, labeled, unlabeled)
- ✅ Correct template enforcement via title/body validation
- ✅ Label governance enforcement (family prefixes, valid labels only)
- ✅ Milestone allocation from linked PRs/issues
- ✅ User assignment via code owners or area routes
- ✅ Project field sync working
- ✅ Safety gates prevent invalid operations
- ✅ Dry-run mode for testing
- ✅ Audit logging for all agent decisions
- ✅ 80%+ test coverage

## Tasks

- [ ] Implement issue detection logic (type, template)
- [ ] Implement label routing and validation
- [ ] Implement milestone allocation algorithm
- [ ] Implement user assignment routing
- [ ] Implement project field sync
- [ ] Implement safety gates and validation
- [ ] Add audit logging
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Documentation and troubleshooting guide

## Related

- Spec: [ISSUE_MANAGEMENT_AGENT_SPEC.md](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/automation-consolidation-agentic-workflows-2026-09/ISSUE_MANAGEMENT_AGENT_SPEC.md)
- Epic: #1240
- Blocks: test-001, test-002, test-003, test-004, test-005, test-006

## Effort

**Estimated:** 24 hours  
**Priority:** HIGH  
**Phase:** 2 (Implementation)  
**Blocks:** Testing phase

---
_Generated by [Claude Code](https://claude.ai/code)_
```

---

## Issue Numbering Convention

Use prefix convention for tracking:

- `audit-NNN` — Phase 1 (Audit) tasks
- `impl-NNN` — Phase 2 (Implementation) tasks
- `test-NNN` — Phase 3 (Testing) tasks

Examples:
- `[audit-001]` Audit scripts
- `[impl-005]` Implement issue agent
- `[test-007]` Link test issues to epic

---

## Notes

This specification will be converted to structured openspec.json for automated issue generation and tracking. The templates above show the expected structure for created issues.

Each issue will:
1. Use the standardized title format: `[{prefix}-{number}] {title}`
2. Include all relevant labels from `.github/labels.yml`
3. Link to related documentation
4. Include acceptance criteria and effort estimates
5. Link to parent epic and related issues

---

*This specification will be used to generate openspec.json and create 50+ GitHub issues for the entire 3-phase initiative.*
