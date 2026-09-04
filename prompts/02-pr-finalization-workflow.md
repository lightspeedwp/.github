---
file_type: "prompt"
title: "PR Finalisation Complete Workflow"
description: "10-step comprehensive PR finalization with label family prefix enforcement, template auto-selection, and merge validation."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["pr", "workflow", "automation", "governance", "labels"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: PR Finalisation Steps and Requirements

## PROMPT: Finalize a single PR or batch of PRs

This prompt walks through complete PR finalization, including review recommendations, label audit, template updates, linked issues, and safe merge validation.

**Process one PR at a time — don't move to the next until current PR is merged or blocked.**

### Context

A pull request is "finalised" when it:

1. Has correct labels (family:value format per `.github/labels.yml`)
2. Matches the proper PR template for its type (type:bug → pr_bug.md)
3. Has a linked GitHub issue (for tracking)
4. Has passed code review and CI checks
5. Is rebased/merged to `develop` without conflicts
6. Has post-merge cleanup completed (linked issue closed if work is done)

### Task

Execute these 10 steps IN ORDER for EACH PR:

---

## STEP 1: Fetch & Review PR Details

- [ ] Fetch PR metadata (number, title, branch, target branch)
- [ ] Identify PR type from file changes:
  - Bug fix → `type:bug`
  - New feature → `type:feature`
  - Documentation → `type:documentation`
  - Refactoring → `type:refactor`
  - Chore/maintenance → `type:chore`
  - Design changes → `type:design`
  - Other → determine from changes
- [ ] List all outstanding review comments (if any)
- [ ] List all CI failures and their root causes
- [ ] Determine mergeability:
  - Is PR mergeable without rebase? (conflicts check)
  - Is PR behind develop? (fetch latest)
  - Blockers: CI red? Review pending?

**Action:** If CI is failing, diagnose whether it's:
- **PR-specific** (change introduced the failure) → Must fix in STEP 2
- **Pre-existing** (fails on develop too) → Document in STEP 9, don't block merge

---

## STEP 2: Apply Review Recommendations

- [ ] Read all review comments carefully
- [ ] Identify which recommendations have NOT been implemented yet
- [ ] For each unimplemented recommendation:
  - If it's a code change: implement it
  - If it's a question: reply to clarify or explain
  - If it's a nit: fix if quick, skip if large refactor
- [ ] If CI is failing and PR-specific:
  - Reproduce the failure locally
  - Identify root cause (lint, type error, runtime, etc.)
  - Fix the issue
- [ ] Commit changes with message:
  ```
  chore: apply review recommendations

  - Implement feedback from {reviewer}
  - Fix {specific issue}

  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```
- [ ] Push changes

---

## STEP 3: Update PR Template & Description

- [ ] Determine correct PR template based on type:label:
  - `type:bug` → `.github/PULL_REQUEST_TEMPLATE/pr_bug.md`
  - `type:feature` → `.github/PULL_REQUEST_TEMPLATE/pr_feature.md`
  - `type:documentation` → `.github/PULL_REQUEST_TEMPLATE/pr_documentation.md`
  - `type:refactor` → `.github/PULL_REQUEST_TEMPLATE/pr_refactor.md`
  - `type:chore` → `.github/PULL_REQUEST_TEMPLATE/pr_chore.md`
  - `type:design` → `.github/PULL_REQUEST_TEMPLATE/pr_design.md`
  - Check `.github/PULL_REQUEST_TEMPLATE/` for other templates
- [ ] Rewrite PR description to match template structure:
  - Keep existing accepted sections
  - Add missing template sections
  - Update "Summary" to reflect CURRENT state (not original state)
  - Ensure all checklist items are addressed
- [ ] Include in description:
  - Summary of changes
  - Why the change was made
  - Files changed (brief list)
  - Testing/validation performed
  - Any breaking changes
- [ ] **DO NOT** add credentials, secrets, or internal hostnames
- [ ] Update PR description (edit PR on GitHub)

---

## STEP 4: Apply Correct Labels

Labels MUST follow family:value format per `.github/labels.yml`. NO bare labels.

- [ ] **type:* label** (required, exactly one):
  - `type:bug` — Bug fix
  - `type:feature` — New feature
  - `type:task` — Task/chore
  - `type:documentation` — Documentation
  - `type:security` — Security fix
  - `type:design` — Design changes
  - `type:refactor` — Refactoring
  - `type:chore` — Maintenance
  - Choose the ONE that fits best

- [ ] **status:* label** (required, choose one):
  - `status:in-progress` — Still needs work
  - `status:in-review` — Under review
  - `status:ready-for-merge` — Approved, ready to merge
  - `status:done` — Work complete

- [ ] **area:* labels** (optional, add all that apply):
  - `area:ci` — CI/CD changes
  - `area:docs` — Documentation
  - `area:labels` — Label system
  - `area:security` — Security
  - `area:testing` — Tests
  - `area:automation` — Automation/workflows
  - `area:workflows` — Workflow files

- [ ] **priority:* labels** (optional):
  - `priority:critical` — Blocking work
  - `priority:high` — Important
  - `priority:normal` — Standard
  - `priority:low` — Nice-to-have

- [ ] **meta:* labels** (optional):
  - `meta:has-pr` — Issue has associated PR
  - `meta:needs-changelog` — Needs changelog entry
  - `meta:duplicate` — Duplicate issue
  - `meta:blocked` — Blocked by another issue

- [ ] **Verify NO bare labels** (invalid examples):
  - ❌ `bug` → use `type:bug`
  - ❌ `feature` → use `type:feature`
  - ❌ `urgent` → use `priority:critical`
  - ❌ `ci` → use `area:ci`
  - ❌ `ready` → use `status:ready-for-merge`

- [ ] Apply labels on GitHub PR page

---

## STEP 5: Verify Linked Issue

- [ ] Check if PR has a linked issue (sidebar on GitHub PR page)
- [ ] If linked issue exists:
  - [ ] Verify issue number is correct and relevant
  - [ ] Review issue description to ensure it matches PR work
  - Skip to STEP 6
- [ ] If NO linked issue:
  - [ ] Search for related issue by title/keywords
  - [ ] If found: link PR to issue (GitHub sidebar)
  - [ ] If NOT found: create new issue matching PR changes
    - Title: Same as PR title (or derived)
    - Description: Copy from PR description
    - Labels: Same as PR labels
    - Link to PR in issue description

---

## STEP 6: Update Linked Issue Status

- [ ] Open the linked issue (from STEP 5)
- [ ] Update issue description to include:
  - Current status: "PR link: #XXXX"
  - Latest state: Describe what's been done
  - Any blockers or next steps
- [ ] Update issue labels to match PR:
  - Add `status:in-review` or `status:ready-for-merge`
  - Add matching `area:*` labels
  - Add `meta:has-pr` label
- [ ] Do NOT close issue yet (wait until STEP 10)

---

## STEP 7: Rebase if Necessary

- [ ] Check PR mergeability:
  - Is there a merge conflict? (GitHub shows "Cannot merge")
  - Is PR behind develop? (GitHub shows "Update branch")
- [ ] If mergeable without action: skip to STEP 8
- [ ] If conflicts or behind:
  - [ ] Fetch latest develop: `git fetch origin develop`
  - [ ] Merge develop into PR branch (preserve review comments):
    ```bash
    git checkout {branch-name}
    git merge origin/develop
    # Resolve conflicts if any
    git add .
    git commit -m "merge: resolve conflicts with develop"
    git push origin {branch-name}
    ```
  - [ ] Do NOT rebase if PR has been reviewed (preserves comments)
  - [ ] Verify CI re-runs after push

---

## STEP 8: Final Merge Checks

- [ ] Verify CI is passing:
  - All workflow checks GREEN
  - No failing tests
  - Linting passed
  - Type checks passed
- [ ] Verify code review:
  - At least one approval (or no blockers)
  - All review comments addressed
  - No "Request Changes" pending
- [ ] Verify PR has:
  - [ ] Correct type:* label
  - [ ] status:* label (ready-for-merge or in-review)
  - [ ] Linked issue (#XXXX)
  - [ ] Proper description (matching template)
  - [ ] No pre-existing CI failures blocking this PR
- [ ] Verify mergeability:
  - No conflicts (GitHub says "Ready to merge")
  - Base branch is `develop` (NEVER `main`)
  - No uncommitted changes

---

## STEP 9: Merge to Develop

- [ ] **Base branch MUST be `develop` (not main)**
- [ ] Choose merge strategy:
  - **Squash merge** (recommended for feature branches): Combines all commits into one
    - Use if: Multiple commits, wants clean history
  - **Regular merge**: Preserves all commits
    - Use if: Repository convention prefers commit history
- [ ] Merge commit message format:
  ```
  [Type] PR Title (#XXXX)

  Description summary from PR body

  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```
- [ ] After merge: Delete PR branch (GitHub checkbox option)
- [ ] Verify merge succeeded (GitHub shows merged badge)

---

## STEP 10: Post-Merge Cleanup

- [ ] If linked issue represents COMPLETE work:
  - [ ] Close issue with `state_reason: "completed"`
  - [ ] Add comment: "Merged in PR #XXXX on {date}"
  - [ ] Add label: `status:done`
- [ ] If linked issue has REMAINING work:
  - [ ] Add comment: "PR #XXXX merged. Remaining work: {list items}"
  - [ ] Keep issue OPEN
  - [ ] Add `status:in-progress` label
- [ ] Verify merged PR is linked to closed/updated issue
- [ ] Report status (see section below)

---

## Key Requirements — Label Family Rules

**From `.github/labels.yml`** — ALL labels must use family:value format:

| Family | Valid Values | Example |
|--------|--------------|---------|
| `type:` | bug, feature, task, documentation, security, design, refactor, chore | `type:bug` |
| `status:` | needs-triage, in-progress, in-review, ready-for-merge, done, blocked | `status:ready-for-merge` |
| `area:` | ci, docs, labels, security, testing, automation, workflows | `area:ci` |
| `priority:` | critical, high, normal, low | `priority:high` |
| `meta:` | needs-changelog, has-pr, duplicate, blocked | `meta:has-pr` |

**INVALID Examples (DO NOT USE):**
- ❌ `bug` → must be `type:bug`
- ❌ `ready` → must be `status:ready-for-merge`
- ❌ `urgent` → must be `priority:critical`

---

## Status Report (After Each PR)

After completing each PR, report:

```
## PR #{XXXX} — [{Status}]

**Title:** {PR Title}
**Branch:** {branch-name}
**Type:** {type:label}
**Status:** {Merged|Blocked|In Progress}

### Actions Completed:
- [x] Review comments addressed
- [x] Labels applied (type:*, status:*, area:*)
- [x] PR description updated to match template
- [x] Linked issue verified/created
- [x] CI passing (or pre-existing failures documented)
- [x] Merged to develop

### Issue Resolution:
- Linked Issue: #{issue}
- Issue Status: {Closed|Open|In Progress}
- Post-merge Comments: {summary}

### Blockers (if any):
- {description}
- Next Action: {what's needed to unblock}
```

---

## Pre-existing CI Failures Handling

If CI shows RED but it's NOT caused by this PR:

1. Verify failure occurs on `develop` branch too
2. Document the failure in a NEW ISSUE (if not already tracked)
   - Title: `CI: {check-name} failing on develop`
   - Label: `type:bug`, `area:ci`
   - Description: Root cause and reproduction steps
3. Reference the issue in this PR's review comments
4. **Do NOT block PR merge** on pre-existing failures
5. Example comment in PR: "Pre-existing CI failure tracked in #XXXX (not caused by this PR)"

---

### Merge Strategy

- **Base branch:** `develop` (ALWAYS, never `main`)
- **Rebase:** Only if behind/conflicted; preserve review comments if possible
- **Merge message:** Must include PR number (#XXXX)
- **Branch deletion:** Delete after merge

---

## References

- **Label Standards:** `.github/labels.yml` and `docs/LABELING.md`
- **Branching Strategy:** `docs/BRANCHING_STRATEGY.md`
- **PR Templates:** `.github/PULL_REQUEST_TEMPLATE/`
- **Milestone Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **Issue Linking:** GitHub PR sidebar "Link issue" option
- **Pre-existing Issues:** Check `.github/projects/active/` and open issues

---

**Effort:** 30 min–2 hours per PR (depending on review feedback and CI issues)  
**Use When:** PR is ready to finalize, needs label audit, template update, or merge  
**Output:** Merged PR, updated labels, closed/linked issue, clean CI  
**Dependencies:** GitHub access, git, `develop` branch permissions
