---
file_type: "prompt"
title: "PR Finalisation Complete Workflow — Skill-Integrated Edition"
description: "12-step comprehensive PR finalization with skill & agent orchestration: changelog validation, label audit, issue management, CI error detection, and safe merge validation."
version: "1.1.0"
created: "2026-09-04"
status: "draft"
tags: ["pr", "workflow", "automation", "governance", "labels", "changelog", "agents", "skills"]
owners: ["ashley@lightspeedwp.agency"]
related_skills: ["audit-label-coverage", "issue-type-allocator"]
related_agents: ["changelog", "pr-agent", "issue-agent"]
related_instructions: ["pull-requests.instructions.md", "labeling.instructions.md"]
---

# Prompt: PR Finalisation Workflow (Skill-Integrated Version)

## Executive Summary

This prompt walks through complete PR finalization using integrated skills and agents:

- **Changelog Agent** — Validate changelog entries (Keep a Changelog 1.1.0)
- **Issue-Type Allocator Skill** — Determine correct issue types
- **Label Audit Skill** — Audit and recommend missing labels
- **Issue Agent** — Create/manage linked issues
- **PR Agent** — Coordinate PR creation and merge
- **CI Error Diagnosis** — Document pre-existing CI failures

**Process one PR at a time — don't move to the next until current PR is merged or blocked.**

---

## Context: What "PR Finalised" Means

A pull request is "finalised" when it:

1. ✓ Has valid changelog entry (Keep a Changelog 1.1.0 format, passing entry validation)
2. ✓ Has correct labels (family:value format, audit-recommended coverage)
3. ✓ Matches proper PR template for its type
4. ✓ Has linked GitHub issue (with correct type and labels via Issue Agent)
5. ✓ Has passed code review and CI checks (or documented pre-existing failures)
6. ✓ Is rebased/merged to `develop` without conflicts
7. ✓ Has post-merge cleanup completed (issue closed if work is done)

---

## Task: Execute These 12 Steps IN ORDER for EACH PR

---

## STEP 1: Fetch & Review PR Details

- [ ] Fetch PR metadata (number, title, branch, target branch)
- [ ] Identify PR type from file changes (see **Issue-Type Allocator** below):
  - Bug fix → `type:bug`
  - New feature → `type:feature`
  - Documentation → `type:documentation`
  - Refactoring → `type:refactor`
  - Chore/maintenance → `type:chore`
  - Design changes → `type:design`
  - Other → use decision tree in issue-type-allocator skill
- [ ] List all outstanding review comments (if any)
- [ ] List all CI failures and their root causes
- [ ] Determine mergeability:
  - Is PR mergeable without rebase? (conflicts check)
  - Is PR behind develop? (fetch latest)
  - Blockers: CI red? Review pending?

**Action:** If CI is failing, diagnose whether it's:
- **PR-specific** (change introduced the failure) → Must fix in STEP 3
- **Pre-existing** (fails on develop too) → Document in STEP 11 via CI error agent

**Reference:** [pull-requests.instructions.md](../instructions/pull-requests.instructions.md)

---

## STEP 2: Validate & Automate Changelog Entry

Use the **Changelog Agent** to validate the changelog entry.

- [ ] **Gate 1: Entry Validation** — Does PR have changelog entry?
  - [ ] Fetch CHANGELOG.md from PR branch
  - [ ] Use Changelog Agent: `validateEntry(entry, { autoFormat: true })`
  - [ ] Verify entry format:
    - ✓ Title < 60 characters
    - ✓ Description < 150 characters (optional)
    - ✓ Uses em-dashes (—) not hyphens (-)
    - ✓ Includes PR link (#123)
    - ✓ Proper capitalization (uppercase start)
  - [ ] If errors:
    - Request changelog update from author
    - Document issue in review comments
    - DO NOT proceed to merge until fixed
  - [ ] If entry invalid:
    - [ ] Auto-format if enabled: `autoFormat: true` flag
    - [ ] Or request manual correction

- [ ] **Entry Categories** — Verify changelog entry is in correct section:
  - `type:feature` → `### Added`
  - `type:bug` → `### Fixed`
  - `type:enhancement` → `### Changed`
  - `type:security` → `### Security` (top priority)
  - `type:a11y` → `### Accessibility`
  - `type:refactor` → `### Technical`
  - Skip: Chore, Task, Research, Documentation, Maintenance (no changelog needed)

- [ ] **Structure Check** — Does changelog follow Keep a Changelog 1.1.0?
  - [ ] [Unreleased] section exists
  - [ ] Section headers are standard (Added, Changed, Fixed, Security, etc.)
  - [ ] All entries have PR references (#123)
  - [ ] No duplicate entries
  - [ ] Version links are valid (if releasing)

**Reference:** [agents/changelog/README.md](../agents/changelog/README.md)

---

## STEP 3: Apply Review Recommendations & Fix CI

- [ ] Read all review comments carefully
- [ ] Identify which recommendations have NOT been implemented yet
- [ ] For each unimplemented recommendation:
  - If it's a code change: implement it
  - If it's a question: reply to clarify or explain
  - If it's a nit: fix if quick, skip if large refactor
- [ ] **CI Failure Handling:**
  - [ ] If CI is failing and PR-specific:
    - Reproduce the failure locally
    - Identify root cause (lint, type error, runtime, test, etc.)
    - Fix the issue
  - [ ] If CI is failing and pre-existing (fails on develop too):
    - Document for STEP 11 (CI Error Documentation)
    - Do NOT fix in this PR
- [ ] Commit changes with message:
  ```
  chore: apply review recommendations

  - Implement feedback from {reviewer}
  - Fix {specific issue}

  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```
- [ ] Push changes
- [ ] Verify CI re-runs after push

**Reference:** [pull-requests.instructions.md — Review Response Section](../instructions/pull-requests.instructions.md)

---

## STEP 4: Update PR Template & Description

- [ ] Determine correct PR template based on `type:` label:
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

**Reference:** [pull-requests.instructions.md — Template Section](../instructions/pull-requests.instructions.md)

---

## STEP 5: Apply Correct Labels (With Audit)

Use **Label Audit Skill** to recommend missing labels, then apply them.

**Step 5a: Get Current Label Audit**

- [ ] Run audit for this PR:
  ```javascript
  const { AuditLabelCoverageSkill } = require('./skills/audit-label-coverage');
  const recommendations = await skill.getRecommendations(prNumber);
  ```
- [ ] Review recommendations:
  - Missing families: `type:*`, `status:*`, `priority:*`, `area:*`
  - Coverage percentage
  - Suggested labels

**Step 5b: Apply Required Labels** (Enforce family:value format per `.github/labels.yml`)

- [ ] **type:* label** (required, exactly one):
  - `type:bug` — Bug fix
  - `type:feature` — New feature
  - `type:enhancement` — Enhancement
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

- [ ] **priority:* label** (required, choose one):
  - `priority:critical` — Blocking work
  - `priority:high` — Important
  - `priority:normal` — Standard
  - `priority:low` — Nice-to-have

- [ ] **area:* labels** (required, add all that apply):
  - `area:ci` — CI/CD changes
  - `area:docs` — Documentation
  - `area:labels` — Label system
  - `area:security` — Security
  - `area:testing` — Tests
  - `area:automation` — Automation/workflows
  - `area:workflows` — Workflow files
  - (see `.github/labels.yml` for complete list)

- [ ] **meta:* labels** (optional):
  - `meta:has-pr` — Issue has associated PR
  - `meta:needs-changelog` — Needs changelog entry
  - `meta:duplicate` — Duplicate issue
  - `meta:blocked` — Blocked by another issue

- [ ] **Verify NO bare labels** (INVALID — these cause automation failures):
  - ❌ `bug` → must be `type:bug`
  - ❌ `feature` → must be `type:feature`
  - ❌ `urgent` → must be `priority:critical`
  - ❌ `ci` → must be `area:ci`
  - ❌ `ready` → must be `status:ready-for-merge`

- [ ] Apply labels on GitHub PR page

**Reference:** [labeling.instructions.md](../instructions/labeling.instructions.md) and [skills/audit-label-coverage/SKILL.md](../skills/audit-label-coverage/SKILL.md)

---

## STEP 6: Allocate Correct Issue Type (If Issue Exists)

Use **Issue-Type Allocator Skill** to ensure linked issue has correct type.

- [ ] Check PR for linked issue (GitHub PR sidebar "Linked issues" section)
- [ ] If linked issue exists:
  - [ ] Use Issue-Type Allocator decision tree to verify type is correct
  - [ ] Determine issue type using decision tree:
    - Is something broken? → `type:bug`
    - Adding entirely new capability? → `type:feature`
    - Making existing capability better? → `type:enhancement`
    - Small, focused work? → `type:task` or `type:chore`
    - Large, coordinated initiative? → `type:epic` or `type:story`
    - Code quality work? → `type:refactor`, `type:performance`, `type:test`
    - Critical concerns? → `type:security`, `type:a11y`, `type:audit`
    - (See full decision tree in skill documentation)
  - [ ] Update issue type label if needed
  - [ ] Skip to STEP 7
- [ ] If NO linked issue:
  - [ ] Search for related issue by title/keywords
  - [ ] If found: link PR to existing issue (GitHub sidebar)
  - [ ] If NOT found: use Issue Agent to create new issue:
    - [ ] Title: Same as PR title (or derived)
    - [ ] Type: Use Issue-Type Allocator to determine
    - [ ] Description: Copy from PR description
    - [ ] Labels: Same as PR labels + correct type
    - [ ] Link PR to newly created issue

**Reference:** [skills/issue-type-allocator/SKILL.md](../skills/issue-type-allocator/SKILL.md)

---

## STEP 7: Update Linked Issue Status (With Issue Agent)

Use **Issue Agent** to update the linked issue with current PR state.

- [ ] Open the linked issue (from STEP 6)
- [ ] Use Issue Agent to update issue:
  - [ ] Update description to include PR link: "PR link: #XXXX"
  - [ ] Update issue status label:
    - If PR in review: `status:in-review`
    - If PR ready to merge: `status:ready-for-merge`
  - [ ] Ensure issue has:
    - [ ] Correct `type:*` label
    - [ ] Correct `priority:*` label
    - [ ] Matching `area:*` labels
    - [ ] `meta:has-pr` label
  - [ ] Do NOT close issue yet (wait until STEP 12)

**Reference:** [scripts/automation/issue-agent/README.md](../scripts/automation/issue-agent/README.md)

---

## STEP 8: Rebase if Necessary

- [ ] Check PR mergeability:
  - Is there a merge conflict? (GitHub shows "Cannot merge")
  - Is PR behind develop? (GitHub shows "Update branch")
- [ ] If mergeable without action: skip to STEP 9
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
  - [ ] **DO NOT rebase** if PR has been reviewed (preserves comments)
  - [ ] Verify CI re-runs after push

**Reference:** [docs/BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md)

---

## STEP 9: Final Merge Checks

- [ ] Verify CI is passing:
  - All workflow checks GREEN
  - No failing tests
  - Linting passed
  - Type checks passed
  - **Pre-existing CI failures documented** (see STEP 11)
- [ ] Verify code review:
  - At least one approval (or no blockers)
  - All review comments addressed
  - No "Request Changes" pending
- [ ] Verify PR has:
  - [ ] Correct `type:*` label
  - [ ] `status:*` label (ready-for-merge or in-review)
  - [ ] Linked issue (#XXXX)
  - [ ] Proper description (matching template)
  - [ ] Changelog entry (validated in STEP 2)
  - [ ] No pre-existing CI failures blocking this PR
- [ ] Verify mergeability:
  - No conflicts (GitHub says "Ready to merge")
  - Base branch is `develop` (NEVER `main`)
  - No uncommitted changes

---

## STEP 10: Merge to Develop (Using PR Agent)

Use **PR Agent** to coordinate final merge.

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

**Reference:** [agents/pr-creation-agent/](../agents/pr-creation-agent/) (to be renamed `agents/pr-agent/`)

---

## STEP 11: Document Pre-Existing CI Failures (If Any)

If CI shows RED but it's NOT caused by this PR, document it (don't block merge):

- [ ] Verify failure occurs on `develop` branch too:
  - Checkout develop branch locally
  - Run same CI check
  - Confirm it fails identically
- [ ] Create NEW ISSUE for pre-existing failure (if not already tracked):
  - Title: `CI: {check-name} failing on develop`
  - Type: `type:bug`
  - Labels: `type:bug`, `area:ci`, `priority:normal`
  - Description:
    ```markdown
    ## Failing Check
    {check-name}

    ## Reproduction
    Occurs on develop branch (not PR-specific)

    ## Root Cause
    {analysis of failure}

    ## Next Steps
    {proposed fix or investigation}
    ```
- [ ] Reference the new issue in this PR's review comments:
  ```
  Pre-existing CI failure tracked in #{issue-number} (not caused by this PR)
  ```
- [ ] **Do NOT block PR merge** on pre-existing failures

**Reference:** [02-pr-finalization-workflow.md — Pre-existing CI Failures Section](./02-pr-finalization-workflow.md#pre-existing-ci-failures-handling)

---

## STEP 12: Post-Merge Cleanup (With Issue Agent)

Use **Issue Agent** to manage linked issue closure.

- [ ] If linked issue represents COMPLETE work:
  - [ ] Use Issue Agent to close issue with `state_reason: "completed"`
  - [ ] Add comment: "Merged in PR #XXXX on {date}"
  - [ ] Add label: `status:done`
  - [ ] Verify issue is closed
- [ ] If linked issue has REMAINING work:
  - [ ] Use Issue Agent to update issue:
    - [ ] Add comment: "PR #XXXX merged. Remaining work: {list items}"
    - [ ] Keep issue OPEN
    - [ ] Add `status:in-progress` label
- [ ] Verify merged PR is linked to closed/updated issue

**Reference:** [scripts/automation/issue-agent/README.md](../scripts/automation/issue-agent/README.md)

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
- [x] Changelog entry validated (Keep a Changelog 1.1.0)
- [x] Review comments addressed
- [x] Labels applied (audit-recommended coverage)
- [x] Issue type verified + allocated
- [x] PR description updated to match template
- [x] Linked issue updated via Issue Agent
- [x] CI passing (or pre-existing failures documented)
- [x] Merged to develop

### Changelog Entry:
- Status: ✓ Valid
- Format: Keep a Changelog 1.1.0
- Category: {Added|Changed|Fixed|Security|etc}
- Text: {entry text}

### Label Audit:
- Coverage: {coverage}%
- Applied Labels: {labels}
- Missing Families: {families} (if any)

### Issue Resolution:
- Linked Issue: #{issue}
- Issue Type: {type}
- Issue Status: {Closed|Open|In Progress}
- Post-merge Action: {summary}

### Blockers (if any):
- {description}
- Next Action: {what's needed to unblock}

### Pre-Existing CI Failures (if any):
- Tracked in: #{issue-number}
- Check Name: {check-name}
```

---

## Key Requirements Summary

### Changelog Validation (Keep a Changelog 1.1.0)

- ✓ Entry format: Title < 60 chars, optional description < 150 chars
- ✓ Em-dashes (—) not hyphens (-)
- ✓ PR link included (#123)
- ✓ Correct section (Added, Changed, Fixed, Security, etc)
- ✓ No duplicate entries
- ✓ No bare words without context

### Label Family Rules

From `.github/labels.yml` — ALL labels must use family:value format:

| Family | Valid Values | Example | Required |
|--------|--------------|---------|----------|
| `type:` | bug, feature, enhancement, task, documentation, security, design, refactor, chore | `type:bug` | ✓ Yes |
| `status:` | needs-triage, in-progress, in-review, ready-for-merge, done, blocked | `status:ready-for-merge` | ✓ Yes |
| `priority:` | critical, high, normal, low | `priority:high` | ✓ Yes |
| `area:` | ci, docs, labels, security, testing, automation, workflows | `area:ci` | ✓ Yes |
| `meta:` | needs-changelog, has-pr, duplicate, blocked | `meta:has-pr` | ✗ Optional |

### Invalid Label Examples (DO NOT USE)

- ❌ `bug` → must be `type:bug`
- ❌ `feature` → must be `type:feature`
- ❌ `urgent` → must be `priority:critical`
- ❌ `ci` → must be `area:ci`
- ❌ `ready` → must be `status:ready-for-merge`
- ❌ `enhancement` → must be `type:enhancement`

---

## Related Skills & Agents

### Skills

- **audit-label-coverage** — Audit and recommend missing labels
  - Location: `skills/audit-label-coverage/SKILL.md`
  - Usage: `getRecommendations(prNumber)` → coverage % + suggestions
- **issue-type-allocator** — Allocate correct GitHub issue types
  - Location: `skills/issue-type-allocator/SKILL.md`
  - Usage: Decision tree + validation checklist

### Agents

- **Changelog Agent** — Validate Keep a Changelog 1.1.0 entries
  - Location: `agents/changelog/README.md`
  - Usage: `validateEntry()`, `addEntry()`, `validateChangelog()`
  - **TODO:** Integrate into PR validation workflow
- **PR Agent** — Coordinate PR creation, labeling, and merge
  - Location: `agents/pr-creation-agent/` (rename to `agents/pr-agent/`)
  - Skills: branch validation, template routing, label application, merge coordination
  - **TODO:** Update all references from `pr-creation-agent` to `pr-agent`
- **Issue Agent** — Create, validate, and manage GitHub issues
  - Location: `scripts/automation/issue-agent/` (move to `agents/issue-agent/`)
  - Skills: issue creation, validation, labeling, assignee routing, lifecycle management
  - **TODO:** Move folder to agents/ root + update all references

### Instructions

- **pull-requests.instructions.md** — PR creation, templates, frontmatter, branching
- **labeling.instructions.md** — Label strategy, configuration, enforcement
- **issues.instructions.md** — Issue creation, types, templates

---

## References

- **Label Standards:** `.github/labels.yml` and `docs/LABELING.md`
- **Branching Strategy:** `docs/BRANCHING_STRATEGY.md`
- **PR Templates:** `.github/PULL_REQUEST_TEMPLATE/`
- **Changelog Standard:** `Keep a Changelog 1.1.0` (https://keepachangelog.com/en/1.1.0/)
- **Issue Linking:** GitHub PR sidebar "Link issue" option
- **Pre-existing Issues:** Check `.github/projects/active/` and open issues

---

## Workflow Diagram

```
START: PR is ready for finalization
  │
  ├─ STEP 1: Fetch PR details
  ├─ STEP 2: Validate changelog (Changelog Agent)
  ├─ STEP 3: Apply review recommendations + fix CI
  ├─ STEP 4: Update PR template & description
  ├─ STEP 5: Apply correct labels (Label Audit Skill)
  ├─ STEP 6: Allocate issue type (Issue-Type Allocator Skill)
  ├─ STEP 7: Update linked issue (Issue Agent)
  ├─ STEP 8: Rebase if necessary
  ├─ STEP 9: Final merge checks
  ├─ STEP 10: Merge to develop (PR Agent)
  ├─ STEP 11: Document pre-existing CI failures
  ├─ STEP 12: Post-merge cleanup (Issue Agent)
  │
  └─ END: Report status, PR merged
```

---

## Effort & Logistics

**Effort:** 30 min–2 hours per PR (depending on review feedback and CI issues)
**Use When:** PR is ready to finalize, needs label audit, template update, or merge
**Output:** Merged PR, validated changelog, audit-recommended labels, closed/linked issue, clean CI
**Dependencies:** GitHub access, git, `develop` branch permissions, Node.js 18+ (for agents/skills)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-09-04 | Skill & agent integration: Changelog Agent, Label Audit Skill, Issue-Type Allocator, Issue Agent, PR Agent |
| 1.0.0 | 2026-09-04 | Original 10-step workflow |

---

## TODO: Migration Tasks

Before this prompt is production-ready, complete:

- [ ] **Rename:** `agents/pr-creation-agent/` → `agents/pr-agent/`
  - Update references in workflows, instructions, and docs
  - Update `.github/CLAUDE.md` and related config
  - Create migration issue to track
- [ ] **Move:** `scripts/automation/issue-agent/` → `agents/issue-agent/`
  - Update all file path references
  - Update workflow job paths
  - Update import statements in dependent scripts
  - Create migration issue to track
- [ ] **Integrate:** Changelog Agent into PR validation workflow
  - Add Gate 1 validation to PR workflow
  - Add Gate 2 validation to release workflow
  - Document in workflow YAML
- [ ] **Document:** CI Error Detection Skill (new)
  - Consider creating skill for identifying/documenting pre-existing CI failures
  - Could leverage changelog agent or create new utility
- [ ] **Test:** Validate all agent/skill integrations
  - Test changelog validation on real PRs
  - Test label audit recommendations
  - Test issue agent issue creation
  - Test issue type allocation
- [ ] **Review:** Have maintainers review updated prompt
  - Verify step order makes sense
  - Verify skill integrations align with actual implementation
  - Verify references to agents/skills are accurate

---

**Last Updated:** 2026-09-04
**Status:** Draft (Ready for Integration Testing)
**Maintainer:** Ashley Shaw & Automation Team
