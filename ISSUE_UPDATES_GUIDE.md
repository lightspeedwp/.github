---
file_type: "guide"
title: "Issue Updates Guide — Reusable Prompts v1.0"
description: "Complete guide for updating GitHub issues #2803–#2811 with proper descriptions, labels, and templates."
version: "1.0.0"
created: "2026-09-04"
updated: "2026-09-04"
---

# Issue Updates Guide — Reusable Prompts v1.0

This guide documents the required updates for GitHub issues #2803–#2811 to properly reflect the delivered prompts, apply correct labels and templates, and provide comprehensive descriptions for team adoption.

## Overview

All 9 issues should be updated with:

- ✅ **Title:** Updated to reflect the prompt and use `type:ai-ops:` prefix
- ✅ **Labels:** `type:ai-ops`, `area:automation`, `area:docs`, `status:ready-for-use`
- ✅ **Description:** Comprehensive body explaining the prompt, use cases, and deliverables
- ✅ **Template:** AI Ops issue template (`.github/ISSUE_TEMPLATE/23-ai-ops.md`)

---

## Issue #2803: Update Active Projects From Chat Work

### Current State

- Title: "(needs update)"
- Labels: (to be updated)
- Description: (needs enhancement)

### Required Updates

**New Title:**

```
type:ai-ops: Update Active Projects From Chat Work
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description (replace entire body):**

```markdown
## AI Ops Summary

Reusable prompt for systematically documenting session work in active project files, creating enhancement tasks, regenerating openspec, and creating/linking GitHub issues for tracking and adoption.

**Prompt File:** [prompts/01-update-active-projects-from-chat.md](prompts/01-update-active-projects-from-chat.md)

## Problem / Opportunity

When AI-assisted development completes feature/fix work tied to an active project, there's a need to:
- Document changes in project files
- Create enhancement/follow-up tasks
- Regenerate project specifications
- Create GitHub issues for team awareness
- Maintain clear audit trail of work completed

This prompt automates and standardizes that workflow.

## Approach / Solution

The prompt provides a 9-step workflow:
1. Audit active project structure
2. Document session accomplishments
3. Identify enhancement tasks
4. Regenerate openspec
5. Create GitHub issues with proper labels
6. Update project indexes
7. Create issues linking to PR #2802
8. Commit changes with proper attribution
9. Update project status

## Acceptance Criteria

- [x] Prompt file created and documented
- [x] Step-by-step workflow provided with code examples
- [x] Issue creation procedures included
- [x] Commit message templates provided
- [x] References to related documentation linked
- [x] Integrated with reusable prompts library

## Additional Context

- **Related Prompt:** PR #2802 — Reusable Prompts v1.0 Setup
- **Usage:** After chat session delivers feature/fix work to an active project
- **Effort:** 1–2 hours per session
- **Integration Points:** Active project updates workflow
- **Documentation:** `.github/projects/active/reusable-prompts-setup.md`

---

**How to Use:**
1. Copy the entire prompt from `prompts/01-update-active-projects-from-chat.md`
2. Paste into Claude Code chat
3. Follow the 9-step workflow
4. Create issues, update docs, commit work
```

---

## Issue #2804: PR Finalisation Steps and Requirements

### Current State

- Title: "(needs update)"
- Labels: (to be updated)
- Description: (needs enhancement)

### Required Updates

**New Title:**

```
type:ai-ops: PR Finalization Workflow (10 Steps)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description (replace entire body):**

```markdown
## AI Ops Summary

Reusable 10-step comprehensive PR finalization workflow with label family prefix enforcement, template auto-selection, and merge validation.

**Prompt File:** [prompts/02-pr-finalization-workflow.md](prompts/02-pr-finalization-workflow.md)

## Problem / Opportunity

Pull requests require consistent finalization:
- Correct labels (family:value format: `type:*`, `status:*`, `area:*`)
- Proper PR template matching the type
- Linked GitHub issue for tracking
- Review feedback applied
- CI checks passing
- Merge readiness validation
- Post-merge cleanup

This prompt automates the entire workflow.

## Approach / Solution

The prompt provides 10-step workflow:
1. Fetch & review PR details
2. Apply review recommendations
3. Update PR template & description
4. Apply correct labels (family:value format)
5. Verify linked issue
6. Update linked issue status
7. Rebase if necessary
8. Final merge checks
9. Merge to develop
10. Post-merge cleanup

## Acceptance Criteria

- [x] Prompt file created and documented
- [x] 10-step workflow provided with checklists
- [x] Label family:value format enforcement documented
- [x] PR template auto-selection logic included
- [x] Merge readiness checklist provided
- [x] References to PR templates and labels linked

## Additional Context

- **Related Prompt:** PR #2802 — Reusable Prompts v1.0 Setup
- **Usage:** Before merging any PR to develop
- **Effort:** 30 min–2 hours per PR
- **Integration Points:** PR finalization workflow
- **References:** `.github/labels.yml`, `.github/PULL_REQUEST_TEMPLATE/`
```

---

## Issue #2805: Context Continuation Prompt Generator

### Required Updates

**New Title:**

```
type:ai-ops: Context Continuation Prompt Generator
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- Generates continuation prompts when context limit approaching
- Includes incomplete tasks, open PRs, branch validation, label audit
- Identifies merge conflicts and pre-existing CI errors
- Produces ready-to-paste markdown document
- Usage: Between chat sessions for continuity
- Effort: 15–30 minutes
- File: [prompts/03-context-continuation-prompt.md](prompts/03-context-continuation-prompt.md)

---

## Issue #2806: Dependabot PR Merge Workflow

### Required Updates

**New Title:**

```
type:ai-ops: Dependabot PR Merge Workflow (Dependency-Ordered)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- Manual/mergify decision framework for dependabot PRs
- Package dependency ordering analysis
- Breaking change detection
- PR review checklist (CI, conflicts, versions)
- Regression testing guidance
- Usage: When dependabot PRs need merging
- Effort: 10 min per PR
- File: [prompts/04-dependabot-pr-merge-workflow.md](prompts/04-dependabot-pr-merge-workflow.md)

---

## Issue #2807: Recommend Next Focus Task

### Required Updates

**New Title:**

```
type:ai-ops: Task Prioritization (Priority Scoring 0–100)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- Active projects audit with completion percentages
- Open issues categorization (linked, CI errors, unassigned, blocked)
- Priority scoring framework (urgency, impact, dependencies, effort)
- Top 3 task recommendations with rationale
- Pre-existing vs. PR-specific CI error differentiation
- Usage: When starting new session or finishing current task
- Effort: 1–2 hours
- File: [prompts/05-recommend-next-focus-task.md](prompts/05-recommend-next-focus-task.md)

---

## Issue #2808: Evaluate Open Issues and Milestone Allocation

### Required Updates

**New Title:**

```
type:ai-ops: Milestone Allocation Strategy (Capacity Planning)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- Issue categorization by type and priority
- Dependency chain analysis and respect
- Milestone capacity planning (20–30% buffer)
- Allocation algorithm ensuring sustainable releases
- Capacity utilization charts
- Validation (no milestone > 90% capacity)
- Allocation report for team communication
- Usage: Release cycle planning
- Effort: 2–4 hours
- File: [prompts/06-milestone-allocation-strategy.md](prompts/06-milestone-allocation-strategy.md)

---

## Issue #2809: Branch and Worktree Cleanup

### Required Updates

**New Title:**

```
type:ai-ops: Branch & Worktree Cleanup (Safe Deletion)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- Branch listing with metadata and last commit dates
- Merged vs. stale vs. invalid identification
- Branch naming validation (flags claude/*, copilot/*)
- Uncommitted changes detection
- Open PR checking before deletion
- Safe deletion procedures
- Git worktree cleanup
- Cleanup report generation
- Usage: End of session, repository maintenance
- Effort: 30 min–1 hour
- File: [prompts/07-branch-worktree-cleanup.md](prompts/07-branch-worktree-cleanup.md)

---

## Issue #2810: Create or Update README Files with Mermaid Diagrams

### Required Updates

**New Title:**

```
type:ai-ops: README Creation with YAML Frontmatter & Mermaid
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- YAML frontmatter templates (title, description, owners, tags)
- Folder-specific README patterns (agents, skills, workflows, etc.)
- Mermaid diagram policy decision tree
- Accessibility guidance (alt text, WCAG compliance)
- Section ordering and validation
- Markdown linting integration
- Diagram rendering verification
- Usage: Creating/updating README files
- Effort: 1–2 hours per README
- File: [prompts/08-create-update-readme-with-diagrams.md](prompts/08-create-update-readme-with-diagrams.md)

---

## Issue #2811: Move Files From .github/ to Root Folders

### Required Updates

**New Title:**

```
type:ai-ops: File Migration to Root Folders (Portability Audit)
```

**Labels to Add:**

```
type:ai-ops
area:automation
area:docs
status:ready-for-use
```

**Description Summary:**

- `.github/` folder audit procedures
- File categorization (portable vs. repo-governance)
- Migration phases (scripts, instructions, agents)
- Git history preservation with `git mv`
- Reference update procedures
- Portability decision framework
- Migration audit report
- Usage: File organization audit, legacy structure migration
- Effort: 2–4 hours
- File: [prompts/09-move-files-to-root-folders.md](prompts/09-move-files-to-root-folders.md)

---

## Common Labels to Apply

All issues should have:

```
type:ai-ops           — AI Operations/Workflow automation
area:automation       — Automation & workflow assets
area:docs            — Documentation
status:ready-for-use — Delivered and ready for adoption
```

Optional labels based on content:

```
meta:ai-augmented    — AI-augmented workflow
priority:high        — High-priority workflow
```

---

## Issue Template Reference

Use AI Ops template (`.github/ISSUE_TEMPLATE/23-ai-ops.md`):

- **AI Ops Summary** — Describe the AI workflow/prompt
- **Problem / Opportunity** — Why this workflow is needed
- **Approach / Solution** — How the prompt solves it
- **Acceptance Criteria** — What constitutes success
- **Additional Context** — Links to related issues, PRs, docs

---

## Bulk Update Instructions

### Option 1: Manual GitHub UI Update (Per Issue)

1. Open issue #2803–#2811 on GitHub
2. Click "Edit" on issue title
3. Update title with `type:ai-ops:` prefix
4. Add labels: `type:ai-ops`, `area:automation`, `area:docs`, `status:ready-for-use`
5. Replace issue body with comprehensive description (from this guide)
6. Save changes

### Option 2: GitHub CLI (Batch)

```bash
# Update issue #2803
gh issue edit 2803 \
  --title "type:ai-ops: Update Active Projects From Chat Work" \
  --add-label "type:ai-ops,area:automation,area:docs,status:ready-for-use" \
  --body "@/path/to/issue-2803-body.md"

# Repeat for issues #2804–#2811
```

### Option 3: GitHub API (Batch via curl)

```bash
for issue_num in 2803 2804 2805 2806 2807 2808 2809 2810 2811; do
  curl -X PATCH \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/lightspeedwp/.github/issues/$issue_num \
    -d '{"title":"new title","labels":["type:ai-ops",...]}' \
    -d @issue-${issue_num}-body.json
done
```

---

## Verification Checklist

After updating each issue, verify:

- [ ] Title starts with `type:ai-ops:`
- [ ] All 4 required labels present:
  - `type:ai-ops`
  - `area:automation`
  - `area:docs`
  - `status:ready-for-use`
- [ ] Description clearly explains:
  - What the prompt delivers
  - When/how to use it
  - Expected outputs
  - Effort estimate
- [ ] Links to prompt file (e.g., `prompts/01-update-active-projects-from-chat.md`)
- [ ] Links to active project documentation (`.github/projects/active/reusable-prompts-setup.md`)
- [ ] References related PR #2802

---

## Next Steps

1. **Update all 9 issues** using preferred method above
2. **Verify labels and descriptions** against checklist
3. **Communicate to team** that prompts are available for adoption
4. **Link in relevant workflows** (agent specs, project docs, etc.)
5. **Schedule quarterly reviews** of prompt accuracy and relevance

---

**Document Version:** 1.0.0  
**Created:** 2026-09-04  
**Owner:** <ashley@lightspeedwp.agency>  
**Related PR:** #2802 — Reusable Prompts v1.0 Setup  
**Active Project:** `.github/projects/active/reusable-prompts-setup.md`
