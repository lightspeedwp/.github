# Issues Index — Issue Type & Metadata Automation Initiative

Complete list of all GitHub issues for this project (12 total: 1 epic + 11 child issues).

---

## Epic Issue

### 01. Epic: Issue Type & Metadata Automation Initiative

- **Type:** Epic
- **Priority:** High
- **Effort:** 37.5 hours
- **Duration:** 5 weeks (July 23 — Aug 27, 2026)
- **GitHub Issue:** [#1167](https://github.com/lightspeedwp/.github/issues/1167)
- **Status:** 🟢 Created — Ready for Phase 1 Execution
- **Children:** 11 child issues (Fixes 1.1–1.5, Features 2.1–2.3, Tasks 3.1–3.3)
- **Labels:** `type:epic`, `area:ci`, `priority:high`, `status:in-progress`
- **Milestone:** v1.0 / v1.1

---

## Phase 1: Critical Fixes (11.5 hours, Weeks 1-2)

### 02. Fix 1.1: Remove Non-existent Label Reference

- **Type:** Task
- **Priority:** High
- **Effort:** 0.5 hours
- **GitHub Issue:** [#1168](https://github.com/lightspeedwp/.github/issues/1168)
- **Description:** Remove `comp:help-tabs` from `.github/label-governance-policy.yml`
- **Status:** 🟢 Ready
- **Labels:** `type:task`, `area:ci`, `priority:high`, `status:ready`
- **Milestone:** v1.0

### 03. Fix 1.2: Add Missing Type Label Aliases

- **Type:** Task
- **Priority:** High
- **Effort:** 1 hour
- **GitHub Issue:** [#1169](https://github.com/lightspeedwp/.github/issues/1169)
- **Description:** Add aliases for 8 type labels (feature, task, chore, refactor, ci, build, epic, improve)
- **Status:** 🟢 Ready
- **Labels:** `type:task`, `area:ci`, `priority:high`, `status:ready`
- **Milestone:** v1.0

### 04. Fix 1.3: Implement Issue-Body Labeling Rules

- **Type:** Feature
- **Priority:** High
- **Effort:** 3.5 hours
- **GitHub Issue:** [#1170](https://github.com/lightspeedwp/.github/issues/1170)
- **Description:** Add 40+ body-pattern rules to `.github/labeler.yml` for type/area/component detection
- **Status:** 🟢 Ready
- **Labels:** `type:feature`, `area:ci`, `priority:high`, `status:ready`
- **Milestone:** v1.0

### 05. Fix 1.4: Fix Template-Enforcement Silent Reopening

- **Type:** Task
- **Priority:** High
- **Effort:** 2.5 hours
- **GitHub Issue:** [#1171](https://github.com/lightspeedwp/.github/issues/1171)
- **Description:** Replace silent reopening with detailed guidance comments
- **Status:** 🟢 Ready
- **Labels:** `type:task`, `area:ci`, `priority:high`, `status:ready`
- **Milestone:** v1.0

### 06. Fix 1.5: Add Issue DoD Validation Before Close

- **Type:** Feature
- **Priority:** High
- **Effort:** 2.5 hours
- **GitHub Issue:** [#1172](https://github.com/lightspeedwp/.github/issues/1172)
- **Description:** Create new workflow to prevent issue close with incomplete DoD
- **Status:** 🟢 Ready
- **Labels:** `type:feature`, `area:ci`, `priority:high`, `status:ready`
- **Milestone:** v1.0

**Phase 1 Total:** 11.5 hours | **Target Date:** Aug 3, 2026

---

## Phase 2: Enhanced Automation (15 hours, Weeks 3-4)

### 07. Feature 2.1: Implement PR Merge Blocker

- **Type:** Feature
- **Priority:** High
- **Effort:** 3.5 hours
- **GitHub Issue:** [#1173](https://github.com/lightspeedwp/.github/issues/1173)
- **Description:** Create workflow to block PR merge if linked issue has incomplete DoD
- **Status:** ⏸️ Blocked (Depends on Phase 1)
- **Labels:** `type:feature`, `area:ci`, `priority:high`, `status:blocked`
- **Milestone:** v1.1

### 08. Feature 2.2: Auto-Populate Custom Fields

- **Type:** Feature
- **Priority:** High
- **Effort:** 4.5 hours
- **GitHub Issue:** [#1174](https://github.com/lightspeedwp/.github/issues/1174)
- **Description:** Create workflow to infer and populate 7 custom fields (Risk, Impact, Domain, Team, Effort, etc.)
- **Status:** ⏸️ Blocked (Depends on Phase 1)
- **Labels:** `type:feature`, `area:ci`, `priority:high`, `status:blocked`
- **Milestone:** v1.1

### 09. Feature 2.3: Template-Aware Type Detection

- **Type:** Task
- **Priority:** Medium
- **Effort:** 1.5 hours
- **GitHub Issue:** [#1175](https://github.com/lightspeedwp/.github/issues/1175)
- **Description:** Enhance `.github/workflows/issues.yml` to use template signals for type detection
- **Status:** ⏸️ Blocked (Depends on Phase 1)
- **Labels:** `type:task`, `area:ci`, `priority:medium`, `status:blocked`
- **Milestone:** v1.1

**Phase 2 Total:** 15 hours | **Target Date:** Aug 17, 2026

---

## Phase 3: Documentation & Testing (11 hours, Weeks 4-5)

### 10. Task 3.1: Create AI Agent Issue Creation Guide

- **Type:** Task
- **Priority:** Medium
- **Effort:** 2 hours
- **GitHub Issue:** [#1176](https://github.com/lightspeedwp/.github/issues/1176)
- **Description:** Create `.github/ISSUE_CREATION_GUIDE.md` with best practices for AI agents
- **Status:** ⏸️ Blocked (Depends on Phases 1-2)
- **Labels:** `type:task`, `area:docs`, `priority:medium`, `status:blocked`
- **Milestone:** v1.1

### 11. Task 3.2: Update AGENTS.md

- **Type:** Task
- **Priority:** Medium
- **Effort:** 2 hours
- **GitHub Issue:** [#1177](https://github.com/lightspeedwp/.github/issues/1177)
- **Description:** Add "Issue Creation Best Practices" section to `.github/AGENTS.md`
- **Status:** ⏸️ Blocked (Depends on Phases 1-2)
- **Labels:** `type:task`, `area:docs`, `priority:medium`, `status:blocked`
- **Milestone:** v1.1

### 12. Task 3.3: End-to-End Testing & Validation

- **Type:** Task
- **Priority:** High
- **Effort:** 4 hours
- **GitHub Issue:** [#1178](https://github.com/lightspeedwp/.github/issues/1178)
- **Description:** Run 12+ critical test scenarios; validate success metrics
- **Status:** ⏸️ Blocked (Depends on Phases 1-2)
- **Labels:** `type:task`, `area:qa`, `priority:high`, `status:blocked`
- **Milestone:** v1.1

**Phase 3 Total:** 11 hours | **Target Date:** Aug 27, 2026

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Issues** | 12 (1 epic + 11 child) |
| **Total Effort** | 37.5 hours |
| **Total Duration** | 5 weeks (July 23 — Aug 27, 2026) |
| **Status** | 🟢 All Created — Phase 1 Ready, Phases 2-3 Blocked |
| **Priority Distribution** | 8 High + 3 Medium |
| **Type Distribution** | 1 Epic + 5 Features + 6 Tasks |
| **Phase 1 Status** | 5 issues — All labeled `status:ready`, assigned to v1.0 milestone |
| **Phase 2 Status** | 3 issues — All labeled `status:blocked`, assigned to v1.1 milestone |
| **Phase 3 Status** | 3 issues — All labeled `status:blocked`, assigned to v1.1 milestone |

---

## How to Create Issues in GitHub

### Option 1: Manual Creation (GUI)

1. Go to [.github repository Issues](https://github.com/lightspeedwp/.github/issues)
2. Click "New Issue"
3. Select appropriate template (Epic, Task, Feature, etc.)
4. Copy content from corresponding `.md` file in `issues/` folder
5. Fill in title, description, fields, and labels
6. Click "Create Issue"
7. Note the issue number
8. Return to step 2 for next issue

### Option 2: GitHub API (gh CLI)

See next section "Creating Issues via GitHub API"

---

## Creating Issues via GitHub API (gh CLI)

Once the project files are committed to `develop`, use the GitHub API to create all issues:

```bash
# Ensure gh CLI is installed and authenticated
gh --version
gh auth status

# Create epic (parent) first
gh issue create \
  --title "Epic: Issue Type & Metadata Automation Initiative" \
  --body "$(cat ./github/projects/active/issue-type-workflow-automation/issues/01-epic-issue-type-automation.md)" \
  --label "type:epic,area:ci,priority:high"

# Create child issues (with parent issue reference)
gh issue create \
  --title "Fix 1.1: Remove Non-existent Label Reference" \
  --body "$(cat ./github/projects/active/issue-type-workflow-automation/issues/02-fix-nonexistent-label.md)" \
  --label "type:task,area:ci,priority:high" \
  --projects "Issue Type & Metadata Automation"

# ... repeat for all 11 child issues
```

---

## Project Board Setup

Once issues are created in GitHub:

1. Create GitHub Project: "Issue Type & Metadata Automation"
2. Add epic as parent
3. Add 11 child issues
4. Set status field (Backlog → Ready → In Progress → In Review → Done)
5. Assign team members to Phase 1 tasks
6. Set due dates per phase

---

## Next Steps

1. **Commit project files to develop branch**
   - All markdown files created
   - Project folder structure in place
   - Documentation complete

2. **Create GitHub issues** (epic + 11 child)
   - Option: Manual creation via GitHub web UI
   - Option: Via gh CLI (batch creation)

3. **Set up GitHub Project board**
   - Link issues to project
   - Set status automation
   - Assign team members

4. **Begin Phase 1 execution**
   - Week of July 24-28: Fixes 1.1–1.2 (1.5 hours)
   - Week of July 30–Aug 3: Fixes 1.3–1.5 (10 hours)

---

## File Manifest

**Project Files:**

```
.github/projects/active/issue-type-workflow-automation/
├── PROJECT_INDEX.md (project overview)
├── README.md (quick start by role)
├── IMPLEMENTATION_PLAN.md (detailed roadmap)
├── ISSUES_INDEX.md (this file — issue listing)
└── issues/ (12 markdown issue files)
    ├── 01-epic-issue-type-automation.md
    ├── 02-fix-nonexistent-label.md
    ├── 03-fix-type-aliases.md
    ├── 04-issue-body-labeling-rules.md
    ├── 05-fix-template-enforcement.md
    ├── 06-issue-dod-validation.md
    ├── 07-pr-merge-blocker.md
    ├── 08-custom-field-population.md
    ├── 09-template-aware-type.md
    ├── 10-ai-agent-guidance.md
    ├── 11-update-agents-md.md
    └── 12-test-and-validate.md
```

**Related Reports:**

```
.github/reports/issue-management/
├── audit-2026-07-23-comprehensive.md (full audit findings)
└── solution-design-2026-07-23.md (detailed solution architecture)
```

---

**Project Status:** ✅ Ready for GitHub Issue Creation  
**Last Updated:** 2026-07-23
