---
title: "Badges Workflow Integration — Project Tracker"
description: "GitHub issue checklist and progress tracking for badges workflow integration"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-09"
version: "v1.1.0"
authors: ["Ash Shaw"]
tags: ["badges", "project-tracking", "github-issues", "checklist"]
---

# Badges Workflow Integration — Project Tracker

**Project:** Badges Workflow Integration  
**Timeline:** 2026-08-08 → 2026-08-22 (15 days)  
**Total Issues:** 14 (1 epic + 13 child tasks)  
**Status:** 📋 Ready to Create

---

## Phase Overview

| Phase | Duration | Issues | Status |
|-------|----------|--------|--------|
| Phase 1: Schema & Config | 5 days (8-12) | 3 | 📋 Ready |
| Phase 2: Workflows | 5 days (13-17) | 4 | 📋 Ready |
| Phase 3: Integration | 3 days (18-20) | 3 | 📋 Ready |
| Phase 4: Governance | 2 days (21-22) | 3 | 📋 Ready |

---

## GitHub Issues to Create

### Epic Issue (Parent)

**Title:** Badges Workflow Integration — Complete Implementation

**Labels:** `type:epic`, `area:automation`, `area:documentation`

**Assignee:** Ash Shaw

**Description:**

```markdown
# Badges Workflow Integration — Complete Implementation

## Overview
Audit, plan, and implement badges workflow automation to:
- Auto-generate badges for documentation
- Validate badge URLs daily
- Discover new workflows and update schema
- Establish governance for badge maintenance

## Context
- **Issue:** Badge utilities exist (scripts/agents/includes/badges.js) but are unused
- **Problem:** Previous broken badges (PR #1609) caused CI failures
- **Solution:** 4 new GitHub Actions workflows + schema configuration
- **Related:** #1547 (closed), PR #1609

## Success Criteria
1. ✅ Badge schema exists and validates correctly
2. ✅ All 42 workflows have badge definitions
3. ✅ Documentation badges auto-generated on push
4. ✅ Badge URLs validated weekly (zero 404s)
5. ✅ New workflows auto-discovered within 7 days
6. ✅ Team can update badges without code changes
7. ✅ Full documentation and governance established

## Phases
- Phase 1: Schema & Config (5 days)
- Phase 2: Workflows (5 days)
- Phase 3: Integration (3 days)
- Phase 4: Governance (2 days)

## Child Issues (13 total)
- CHILD-001: Create badge schema configuration
- CHILD-002: Align badges.js with automation spec
- CHILD-003: Create badge governance documentation
- CHILD-004: Documentation badge update workflow
- CHILD-005: README status badge maintenance workflow
- CHILD-006: Workflow inventory synchronization
- CHILD-007: Badge health check workflow
- CHILD-008: Testing & validation
- CHILD-009: Initial schema generation
- CHILD-010: Documentation & examples
- CHILD-011: Monitoring dashboard
- CHILD-012: Update policy documentation
- CHILD-013: Phase 4 completion and project summary

## References
- [Audit & Plan](./AUDIT_AND_PLAN.md)
- [Broken Badges Analysis](./BROKEN_BADGES_FINDINGS.md)
- [Project README](./PROJECT_README.md)
- Issue #1547 (Broken badges - closed)
- PR #1609 (Fix broken badges)
```

**Milestone:** (TBD - Automation)

---

## Phase 1: Schema & Configuration (5 days)

### CHILD-001: Create Badge Schema Configuration

**Title:** Create `.github/automation/badges.schema.yml` with all workflow definitions  
**Labels:** `type:task`, `phase:1`, `priority:critical`, `area:automation`  
**Assignee:** Ash Shaw  
**Points:** 5  

**Description:**

```markdown
## Task
Create comprehensive badge schema configuration file that defines:
- All 42 workflows with badge metadata
- Metadata mapping rules for documents
- Badge templates and formats
- Conditional badge application rules

## Deliverable
`.github/automation/badges.schema.yml` with:
- [ ] All 42 workflows listed with proper names
- [ ] Badge template definitions
- [ ] Metadata mapping rules
- [ ] Validation schema structure
- [ ] Comments explaining each section

## Success Criteria
- [ ] Schema validates with YAML schema validator
- [ ] All 42 workflows from .github/workflows/ are listed
- [ ] Schema is referenced successfully by badges.js
- [ ] No validation errors

## Related
- Depends on: CHILD-002
- Blocks: CHILD-004, CHILD-005, CHILD-006
```

**Due Date:** 2026-08-10

---

### CHILD-002: Align badges.js with Automation Spec

**Title:** Update `scripts/agents/includes/badges.js` to align with latest automation spec  
**Labels:** `type:task`, `phase:1`, `priority:high`, `area:code-quality`  
**Assignee:** Ash Shaw  
**Points:** 3  

**Description:**

```markdown
## Task
Update badges.js implementation to:
- Remove TODO comment about automation spec alignment
- Add schema validation function
- Improve error handling
- Add comprehensive logging
- Update documentation

## Changes Required
- [ ] Remove TODO on line 7
- [ ] Add `validateSchema()` function
- [ ] Add error handling for missing schema
- [ ] Add debug logging for badge generation
- [ ] Update JSDoc comments with examples
- [ ] Add support for dynamic badge templates

## Testing
- [ ] All existing tests pass
- [ ] New tests for schema validation
- [ ] New tests for error cases

## Success Criteria
- [ ] No TODO comments
- [ ] Improved error messages
- [ ] Logging available for debugging
- [ ] Tests pass (>80% coverage)
```

**Due Date:** 2026-08-09

---

### CHILD-003: Create Badge Governance Documentation

**Title:** Document badge governance, policies, and procedures  
**Labels:** `type:documentation`, `phase:1`, `priority:high`  
**Assignee:** Ash Shaw  
**Points:** 3  

**Description:**

```markdown
## Task
Create comprehensive governance documentation including:
- Badge types and naming conventions
- When to use manual vs auto-generated
- Update frequency and triggers
- Broken badge reporting process
- Schema update procedure
- Marker placement guidelines

## Deliverables
1. `docs/BADGES_GOVERNANCE.md` — Main governance doc
2. `docs/BADGES_EXAMPLES.md` — Examples for each doc type
3. `docs/BADGES_TROUBLESHOOTING.md` — Troubleshooting guide

## Content Sections
- [ ] Badge types overview
- [ ] Naming conventions (prefixes, format)
- [ ] When to use manual vs auto badges
- [ ] Badge update frequency
- [ ] Broken badge response process
- [ ] Schema update workflow
- [ ] Document marker guidelines (<!-- BADGES-START/END -->)
- [ ] Examples for docs, agents, schemas, workflows
- [ ] Common issues and solutions
- [ ] Team responsibilities

## Success Criteria
- [ ] Team can understand and follow procedures
- [ ] Clear decision tree for badge decisions
- [ ] Examples for all document types
- [ ] Troubleshooting covers common issues
```

**Due Date:** 2026-08-12

---

## Phase 2: Workflow Implementation (5 days)

### CHILD-004: Documentation Badge Update Workflow

**Title:** Create workflow to auto-generate badges when documentation changes  
**Labels:** `type:feature`, `phase:2`, `priority:critical`, `area:automation`  
**Assignee:** Ash Shaw  
**Points:** 5  

**Description:**

```markdown
## Task
Create GitHub Actions workflow that:
- Triggers on push to develop (documentation files)
- Detects changed documentation files
- Loads badge schema
- Generates appropriate badges
- Updates files with badges
- Commits changes (or creates PR for review)

## Deliverable
`.github/workflows/badges-documentation-update.yml` with:
- [ ] Correct trigger conditions
- [ ] Changed file detection
- [ ] Badge generation logic
- [ ] File update logic
- [ ] Commit/PR creation logic
- [ ] Proper error handling
- [ ] Logging for debugging

## Behavior
- Skip files marked with `skip_badges: true`
- Only update sections between markers
- Create PR if major changes needed
- Commit directly for minor updates

## Success Criteria
- [ ] Workflow runs without errors
- [ ] Correctly identifies changed files
- [ ] Generates expected badges
- [ ] Files are properly updated
```

**Due Date:** 2026-08-15

---

### CHILD-006: README Status Badge Maintenance Workflow

**Title:** Create workflow to validate and maintain README status badges  
**Labels:** `type:feature`, `phase:2`, `priority:high`, `area:automation`  
**Assignee:** Ash Shaw  
**Points:** 4  

**Description:**

```markdown
## Task
Create GitHub Actions workflow that:
- Runs daily (scheduled)
- Validates README badge URLs
- Checks workflow status via GitHub API
- Updates badge status if changed
- Reports broken links
- Creates issues if repairs needed

## Deliverable
`.github/workflows/badges-readme-status.yml` with:
- [ ] Scheduled trigger (daily)
- [ ] Badge URL validation
- [ ] GitHub API integration
- [ ] Status update logic
- [ ] Issue creation logic
- [ ] Detailed logging

## Behavior
- Validate all badge links exist (no 404)
- Check workflow status (passing/failing)
- Update status if changed
- Create issue if >1 broken link
- Post summary comment

## Success Criteria
- [ ] Workflow runs on schedule
- [ ] All badges validated
- [ ] Status updates are accurate
- [ ] Issues created for problems
```

**Due Date:** 2026-08-16

---

### CHILD-007: Workflow Inventory Synchronization

**Title:** Create workflow to discover new workflows and update schema  
**Labels:** `type:feature`, `phase:2`, `priority:high`, `area:automation`  
**Assignee:** Ash Shaw  
**Points:** 4  

**Description:**

```markdown
## Task
Create GitHub Actions workflow that:
- Scans .github/workflows/ directory
- Compares against schema
- Detects new workflows
- Detects removed workflows
- Detects renamed workflows
- Updates schema (auto or PR)
- Creates issues for removed workflows

## Deliverable
`.github/workflows/badges-workflow-audit.yml` with:
- [ ] Workflow directory scanning
- [ ] Schema comparison logic
- [ ] Change detection (new/removed/renamed)
- [ ] Schema update logic
- [ ] Issue creation logic
- [ ] Coverage reporting

## Behavior
- Run weekly
- Auto-add new workflows to schema
- Create issue for removed workflows
- Alert on renames (require manual update)
- Report coverage percentage

## Success Criteria
- [ ] New workflows detected within 7 days
- [ ] Schema stays current
- [ ] Issues created for removed workflows
- [ ] Coverage metrics reported
```

**Due Date:** 2026-08-17

---

### CHILD-008: Badge Health Check Workflow

**Title:** Create workflow to validate all badge links across documentation  
**Labels:** `type:feature`, `phase:2`, `priority:high`, `area:automation`  
**Assignee:** Ash Shaw  
**Points:** 4  

**Description:**

```markdown
## Task
Create GitHub Actions workflow that:
- Scans all Markdown files for badge links
- Validates each link (HTTP + GitHub)
- Detects broken links (404, timeout, etc)
- Reports results
- Creates issues for broken links
- Optionally auto-fixes simple cases

## Deliverable
`.github/workflows/badges-health-check.yml` with:
- [ ] Markdown file scanning
- [ ] Badge link extraction
- [ ] URL validation logic
- [ ] Error detection
- [ ] Issue creation logic
- [ ] Summary reporting

## Behavior
- Run weekly
- Validate all badge URLs
- Report broken links by category
- Create issue if problems found
- Post summary report

## Success Criteria
- [ ] All badge links validated
- [ ] Broken links detected early
- [ ] Issues created for problems
- [ ] Zero silent failures
```

**Due Date:** 2026-08-18

---

## Phase 3: Integration & Testing (3 days)

### CHILD-009: Test All Workflows

**Title:** Test and validate all phase 2 workflows  
**Labels:** `type:testing`, `phase:3`, `priority:critical`  
**Assignee:** Ash Shaw  
**Points:** 5  

**Description:**

```markdown
## Task
- [ ] Test each workflow in dry-run mode
- [ ] Validate output format
- [ ] Check error handling
- [ ] Test edge cases
- [ ] Verify logging
- [ ] Create test fixtures
- [ ] Document test results

## Success Criteria
- All workflows tested
- All tests pass
- Edge cases covered
- Behavior documented
```

**Due Date:** 2026-08-19

---

### CHILD-010: Initial Schema Generation

**Title:** Generate initial badge schema from current workflows  
**Labels:** `type:task`, `phase:3`, `priority:high`  
**Assignee:** Ash Shaw  
**Points:** 3  

**Description:**

```markdown
## Task
- [ ] Generate list of all 42 workflows
- [ ] Extract metadata
- [ ] Create badge definitions
- [ ] Test schema validation
- [ ] Validate against badges.js

## Success Criteria
- Schema includes all workflows
- All definitions are valid
- Schema loads without errors
```

**Due Date:** 2026-08-20

---

### CHILD-011: Documentation & Examples

**Title:** Create comprehensive workflow documentation and examples  
**Labels:** `type:documentation`, `phase:3`, `priority:high`  
**Assignee:** Ash Shaw  
**Points:** 3  

**Description:**

```markdown
## Task
- [ ] Document each workflow
- [ ] Create usage examples
- [ ] Write troubleshooting guide
- [ ] Document schema format
- [ ] Create quick reference

## Deliverables
- `WORKFLOW_DOCUMENTATION.md`
- `BADGES_EXAMPLES.md`
- `BADGES_TROUBLESHOOTING.md`
- `SCHEMA_REFERENCE.md`
```

**Due Date:** 2026-08-20

---

## Phase 4: Governance & Monitoring (2 days)

### CHILD-012: Monitoring Dashboard

**Title:** Create dashboard to track badge coverage and health  
**Labels:** `type:documentation`, `phase:4`, `priority:medium`  
**Assignee:** Ash Shaw  
**Points:** 2  

**Description:**

```markdown
## Task
Create document tracking:
- [ ] Badge coverage by document type
- [ ] Broken badge detection
- [ ] Workflow status changes
- [ ] Schema version history
- [ ] Metrics over time
```

**Due Date:** 2026-08-21

---

### CHILD-013: Update Policy Documentation

**Title:** Document badge update policy and procedures  
**Labels:** `type:documentation`, `phase:4`, `priority:medium`  
**Assignee:** Ash Shaw  
**Points:** 2  

**Description:**

```markdown
## Task
Document:
- [ ] Update approval process
- [ ] PR review checklist
- [ ] Breaking change policy
- [ ] Deprecation path
- [ ] Team responsibilities
```

**Due Date:** 2026-08-22

---

## Summary Table

| Issue | Title | Points | Status |
|-------|-------|--------|--------|
| EPIC | Badges Workflow Integration | — | 📋 Ready |
| CHILD-001 | Create badge schema | 5 | 📋 Ready |
| CHILD-002 | Align badges.js | 3 | 📋 Ready |
| CHILD-003 | Badge governance docs | 3 | 📋 Ready |
| CHILD-004 | Documentation update workflow | 5 | 📋 Ready |
| CHILD-005 | README status workflow | 4 | 📋 Ready |
| CHILD-006 | Workflow sync workflow | 4 | 📋 Ready |
| CHILD-007 | Health check workflow | 4 | 📋 Ready |
| CHILD-008 | Test all workflows | 5 | 📋 Ready |
| CHILD-009 | Initial schema generation | 3 | 📋 Ready |
| CHILD-010 | Documentation & examples | 3 | 📋 Ready |
| CHILD-011 | Monitoring dashboard | 2 | 📋 Ready |
| CHILD-012 | Update policy | 2 | 📋 Ready |
| CHILD-013 | Project completion | 2 | 📋 Ready |
| **TOTAL** | | **46 points** | |

---

## Progress Tracking

### Current Status

```
Phase 1 (Schema & Config)     ░░░░░░░░░░ 0% (0/3 issues)
Phase 2 (Workflows)          ░░░░░░░░░░ 0% (0/4 issues)
Phase 3 (Integration)        ░░░░░░░░░░ 0% (0/3 issues)
Phase 4 (Governance)         ░░░░░░░░░░ 0% (0/3 issues)

Overall Progress             ░░░░░░░░░░ 0% (0/13 child issues + epic)
```

### Milestones

- [ ] **2026-08-10** — Phase 1 schema complete
- [ ] **2026-08-13** — Phase 1 all tasks complete
- [ ] **2026-08-18** — Phase 2 all workflows complete
- [ ] **2026-08-20** — Phase 3 integration complete
- [ ] **2026-08-22** — Project complete (all phases)

---

## Notes

- **Total effort:** ~46 story points (4-5 days of focused work)
- **Parallel work:** Some tasks in Phase 2 can run in parallel
- **Dependencies:** CHILD-001 and CHILD-002 should complete before Phase 2
- **Review:** Plan to review after each phase completion

---

*Last updated: 2026-08-08 — Ready to create issues in GitHub*
