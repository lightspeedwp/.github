---
name: pr-automation-review
description: Comprehensive audit framework for GitHub Actions PR automation workflows
metadata:
  type: instructions
  target-audience: automation-engineers, devops, maintainers
  related-docs:
    - docs/BRANCHING_STRATEGY.md
    - docs/PR_CREATION_PROCESS.md
    - .github/PULL_REQUEST_TEMPLATE/config.yml
    - .github/workflows/
---

# PR Automation Workflow Review Instructions

## Role Declaration

You are conducting a **systematic audit of PR automation capabilities** in a GitHub-hosted repository. Your goal is to assess what automations currently exist, identify coverage gaps, and recommend improvements to reduce manual overhead in the PR workflow.

## Overview

This framework guides a comprehensive review of GitHub Actions workflows to evaluate automation across five critical dimensions:

1. **Project Assignment** — Do PRs automatically join GitHub Projects? Is status updated?
2. **PR Labeling** — Are labels applied automatically based on branch, files, or content?
3. **Assignee Assignment** — Are reviewers/owners auto-assigned via CODEOWNERS?
4. **Milestone Allocation** — Are milestones automatically assigned to PRs?
5. **Issue Linking & Creation** — Do PRs auto-link to issues or create issues if needed?

---

## General Rules

### Scope Boundaries

- **In scope:** GitHub Actions workflows (`.github/workflows/*.yml`), CODEOWNERS file, labeler rules, PR template routing
- **Out of scope:** Individual contributor workflows, IDE configuration, local development setup
- **Assumption:** All workflows are intended to reduce manual overhead and enforce consistent PR handling

### Documentation Authority

The following files are the canonical source for PR workflow expectations:

| File | Purpose |
|------|---------|
| `docs/BRANCHING_STRATEGY.md` | Branch naming rules, merge targets, special handling for release/hotfix |
| `.github/PULL_REQUEST_TEMPLATE/config.yml` | PR template routing by branch prefix |
| `.github/workflows/*.yml` | Active automation implementations |
| `.github/CODEOWNERS` | Code ownership rules for reviewer assignment |

### Coverage Model

A branch type or scenario is **"covered"** if:

- Automation is explicitly configured for it in a workflow
- The automation runs on the relevant PR event trigger (`opened`, `reopened`, `synchronize`, etc.)
- There is no documented exception or conditional exclusion
- The automation does not conflict with other workflows

---

## Detailed Guidance

### Step 1: Identify All Workflow Files

**Objective:** Create a complete inventory of PR-related workflows.

**Actions:**

1. List all files in `.github/workflows/` matching `*.yml` or `*.yaml`
2. Filter to workflows with `pull_request` or `pull_request_target` events
3. Document for each workflow:
   - Filename
   - Event triggers (which types: `opened`, `reopened`, `synchronize`, `labeled`, etc.)
   - Primary purpose (label assignment, project management, validation, etc.)
   - Whether it modifies PR state (labels, assignees, projects, milestones)

**Example discovery output:**

```
├── pr-labeler.yml → pull_request:opened, pull_request:synchronize
│   Purpose: Auto-label by file path and branch name
│   State modification: Yes (labels)
│
├── project-automation.yml → pull_request:opened
│   Purpose: Auto-add PR to GitHub Project
│   State modification: Yes (project membership)
│
└── validate-pr.yml → pull_request:opened, pull_request:synchronize
    Purpose: Validation checks (no state modification)
    State modification: No
```

### Step 2: Map PR Event Triggers

**Objective:** Understand which workflows react to which PR events.

**Event Types to Check:**

- `opened` — PR is created
- `reopened` — Previously closed PR is reopened
- `synchronize` — New commits pushed to PR branch
- `labeled` — Label is added to PR
- `unlabeled` — Label is removed from PR
- `edited` — PR title or description edited
- `ready_for_review` — Draft PR is marked ready
- `converted_to_draft` — Ready PR is converted to draft
- `assigned` — Assignee is added
- `unassigned` — Assignee is removed
- `auto_merge_enabled` / `auto_merge_disabled` — Auto-merge state changes

**Guidance:**

- Workflows with `synchronize` will re-run on every commit push (validate this is intentional)
- Workflows with only `opened` trigger will miss label/milestone changes in edit flows
- Check for race conditions: two workflows modifying the same field on the same trigger

### Step 3: Audit Each Automation Category

#### 3a. Project Assignment

**Definition:** Automatic addition of PRs to GitHub Projects and project status updates.

**What to Look For:**

- `actions/github-script` with API calls to `github.rest.projects.*`
- Custom project management actions (marketplace)
- Actions like `titantium/github-project`, `actions-ecosystem/action-add-to-project`
- Conditional logic (e.g., only certain branch prefixes get added to which projects)

**Questions to Answer:**

- ✅ Which projects are PRs automatically added to?
- ✅ Are all branch types covered (feature, fix, hotfix, release, chore, etc.)?
- ✅ Is project status automatically set (e.g., "In Review", "Ready", "Done")?
- ✅ Are there conditions on project assignment (e.g., only for `feat/`, only for main team)?
- ✅ What happens to PRs from forks or external contributors (are they added)?

**Coverage Assessment:**

Create a coverage matrix:

| Branch Type | Auto-added to Project? | Status Updated? | Conditions |
|---|---|---|---|
| `feat/*` | ✅/⚠️/❌ | ✅/⚠️/❌ | Describe |
| `fix/*` | ✅/⚠️/❌ | ✅/⚠️/❌ | Describe |
| `hotfix/*` | ✅/⚠️/❌ | ✅/⚠️/❌ | Describe |
| `release/*` | ✅/⚠️/❌ | ✅/⚠️/❌ | Describe |
| `chore/*` | ✅/⚠️/❌ | ✅/⚠️/❌ | Describe |

#### 3b. PR Labeling

**Definition:** Automatic application of labels based on branch name, file changes, PR description, or other criteria.

**What to Look For:**

- `.github/labelers.yml` file (defines file-based labeling rules)
- Workflows using `actions/labeler` action
- Custom labeling logic in `github-script` actions
- Label routing that matches `.github/PULL_REQUEST_TEMPLATE/config.yml` branch prefixes
- Conditional labeling (e.g., add `type:bug` only if description contains "Fixes #")

**Questions to Answer:**

- ✅ What labels are automatically applied to all PRs?
- ✅ What labels are applied based on file changes (from `labelers.yml`)?
- ✅ What labels are applied based on branch name prefix?
- ✅ Are priority labels auto-assigned (e.g., `priority:high` for hotfixes)?
- ✅ Are type labels applied (e.g., `type:feature`, `type:bug`, `type:chore`)?
- ✅ Do label automations align with PR template routing in `config.yml`?
- ✅ Are there missing automations (e.g., auto-labeling review status)?

**Coverage Assessment:**

Create a label automation matrix:

| Label | Trigger(s) | Branch Types | Auto-applied? | Manual Required? |
|---|---|---|---|---|
| `type:feature` | Branch: `feat/*` | `feat/*` | ✅ | No |
| `type:bug` | Branch: `fix/*` | `fix/*` | ✅ | No |
| `type:hotfix` | Branch: `hotfix/*` | `hotfix/*` | ⚠️ | Check config |
| `priority:high` | Hotfix branches | `hotfix/*` | ❌ | Yes, manual add |
| `status:needs-review` | PR opened | All | ❌ | Yes, manual |

#### 3c. Assignee Assignment (CODEOWNERS)

**Definition:** Automatic assignment of reviewers or owners based on code paths and the `CODEOWNERS` file.

**What to Look For:**

- `.github/CODEOWNERS` file (defines which users own which paths)
- Workflows that enforce or auto-apply CODEOWNERS rules
- Actions like `kentaro-m/auto-assign-action`, `actions/github-script` with `github.rest.pulls.requestReviewers`
- Conditional reviewer assignment (e.g., different reviewers for different paths)
- Handling of team-based vs. user-based code ownership

**Questions to Answer:**

- ✅ Is there a `CODEOWNERS` file? Where is it? What does it define?
- ✅ Does any workflow automatically request reviewers based on CODEOWNERS?
- ✅ Are all code paths covered by CODEOWNERS rules?
- ✅ Are there edge cases (e.g., tool config files, root-level files)?
- ✅ What is the assignee assignment policy (request 1 reviewer, 2, all owners)?
- ✅ Does the workflow handle team reviews vs. individual assignments?

**Coverage Assessment:**

Document coverage by code path:

| Code Path | Owner(s) | Auto-request Reviewers? | Fallback |
|---|---|---|---|
| `src/**` | `@team/backend` | ✅ | None |
| `.github/workflows/` | `@team/devops` | ⚠️ | Manual |
| `docs/**` | `@docs-team` | ❌ | Manual |
| `*.md` | (CODEOWNERS rule) | ✅ | None |

#### 3d. Milestone Allocation

**Definition:** Automatic assignment of milestones to PRs based on branch, labels, version tags, or release cycle.

**What to Look For:**

- Workflows that parse PR metadata (branch name, labels, version tags)
- Automation that assigns milestones to PRs (e.g., next release, current sprint)
- Actions for milestone management (marketplace or custom)
- Conditional logic for special cases (hotfixes, backports, releases)

**Questions to Answer:**

- ✅ Are milestones automatically assigned to PRs?
- ✅ How is the target milestone determined (branch name? version tag? release cycle)?
- ✅ Are all branch types covered (feature, fix, hotfix, release)?
- ✅ What is the naming convention for milestones (v1.2.0, Q3-2026, Sprint-15)?
- ✅ Are hotfixes assigned to a different milestone than regular fixes?
- ✅ Are milestones linked to project roadmap or release planning?
- ✅ What happens to draft PRs (are they assigned milestones)?

**Coverage Assessment:**

Document milestone assignment rules:

| Branch Type | Milestone Assignment | Logic |
|---|---|---|
| `feat/*` | ✅ to next release | Branch parse or version tag |
| `fix/*` | ✅ to current release | Version tag |
| `hotfix/*` | ✅ to patch release | Explicit hotfix logic |
| `release/*` | ✅ to release milestone | Branch version |
| `chore/*` | ⚠️ Manual | No automation |

#### 3e. Issue Linking & Creation

**Definition:** Automatic detection of issue references, linking PRs to issues, and creating issues if none are linked.

**What to Look For:**

- Workflows that parse PR descriptions for issue keywords (Fixes #, Closes #, Relates to #)
- Automation that creates issues if none are linked
- Automation that marks linked issues as "In Progress" or updates status
- Workflows that close linked issues when PR merges
- Actions like `actions-ecosystem/action-add-labels-to-issue`, `GitHub issue linking actions`

**Questions to Answer:**

- ✅ Does a workflow detect issue references in PR descriptions?
- ✅ Are linked issues automatically updated to "In Progress" or similar status?
- ✅ Is there logic to create issues for unlinked PRs (and if so, what type)?
- ✅ When a PR merges, are linked issues automatically closed?
- ✅ Are PRs checked for issue linkage on open, or only on merge?
- ✅ What is the policy for PRs with no linked issues (block merge, warn, create)?
- ✅ Are there special cases (e.g., chores, releases don't require issues)?

**Coverage Assessment:**

Document issue automation rules:

| Scenario | Automation Present? | Action |
|---|---|---|
| Issue referenced in PR description | ✅ | Link detected and recorded |
| PR opened with no issue reference | ⚠️ | Warning comment? Or create issue? |
| PR merged with linked issue | ✅ | Issue auto-closed |
| PR for chore branch (no issue needed) | ⚠️ | Exemption logic? |
| Issue type auto-detection | ❌ | Manual issue creation |

### Step 4: Identify Workflow Interactions

**Objective:** Detect conflicts, dependencies, and race conditions between workflows.

**Actions:**

1. Map which workflows write to the same fields (labels, assignees, projects, milestones)
2. Identify event triggers that cause multiple workflows to run
3. Check for race conditions (e.g., two workflows simultaneously updating the same label)
4. Identify dependency chains (workflow A must complete before workflow B)
5. Document orchestration gaps (missing coordination points)

**Example conflict scenario:**

```yaml
# workflow1.yml: on PR open, add label "status:needs-review"
# workflow2.yml: on PR open, remove label "status:needs-review" and add "status:ready"
# Result: Race condition. Which label is final?
```

### Step 5: Check Against Branch Strategy & Templates

**Objective:** Ensure automation aligns with documented branching and PR policies.

**Reference Files:**

- `docs/BRANCHING_STRATEGY.md` — branch naming, merge targets, release/hotfix rules
- `.github/PULL_REQUEST_TEMPLATE/config.yml` — PR template routing by branch prefix

**Validation Checklist:**

- ✅ Automation rules match branch naming in BRANCHING_STRATEGY.md
- ✅ Labels applied via automation match PR template routing rules
- ✅ Special branch types (release/*, hotfix/*) have distinct automation rules
- ✅ Merge target defaults (develop vs. main) are enforced where needed
- ✅ Branch reuse prevention is documented (if applicable)

**Example validation:**

If `BRANCHING_STRATEGY.md` says:

- `feat/*` → target `develop`, auto-label with `type:feature`
- `hotfix/*` → target `main`, auto-label with `type:hotfix` + `priority:high`

Then verify:

- ✅ Labeler workflow adds `type:feature` for `feat/*` branches
- ✅ Labeler workflow adds both `type:hotfix` and `priority:high` for `hotfix/*` branches
- ✅ PR templates are routed correctly by branch prefix
- ✅ Branch validation workflow (if exists) enforces merge target rules

### Step 6: Assess Coverage Gaps

**Objective:** Summarize what is and isn't automated, and prioritise improvements.

**For Each Category (Projects, Labels, Assignees, Milestones, Issues):**

1. **Current State:** What is implemented? Which workflows?
2. **Coverage:** What scenarios/branch types are covered?
3. **Gaps:** What is missing or incomplete?
4. **Impact:** How much manual overhead do gaps create?
5. **Priority:** Quick win vs. strategic improvement?

**Gap Categories:**

| Gap Type | Example | Priority |
|---|---|---|
| **Missing automation** | No workflow auto-assigns reviewers | High |
| **Incomplete coverage** | Milestones assigned to `feat/*` only, not `fix/*` | Medium |
| **Workflow conflicts** | Two workflows race to apply conflicting labels | High |
| **Edge case handling** | Draft PRs, forks, external contributors not covered | Medium |
| **Documentation mismatch** | Automation doesn't match stated policy in BRANCHING_STRATEGY.md | Medium |
| **Integration gaps** | No issue creation for unlinked PRs | Low-Medium |

---

## Output Format

Return a structured report:

```markdown
# PR Automation Audit Report

## Executive Summary

- **Total Automation Coverage:** XX%
- **Critical Gaps:** N identified
- **Quick Wins:** N identified
- **Strategic Initiatives:** N identified

## 1. Project Assignment

**Status:** ✅ Complete / ⚠️ Partial / ❌ Missing

**Implemented:**
- [List workflows, triggers, projects covered]

**Coverage Matrix:**
| Branch Type | Auto-added? | Status Updated? | Notes |
|---|---|---|---|
| feat/* | ✅ | ✅ | Added to "Feature Work" project |
| fix/* | ✅ | ⚠️ | Added, but status not updated |
| hotfix/* | ❌ | N/A | No automation |

**Gaps:**
- [List missing automations, edge cases, conflicts]

**Recommendations:**
1. [Specific action, effort level, benefit]
2. [Specific action, effort level, benefit]

---

## 2. PR Labeling

**Status:** ✅ Complete / ⚠️ Partial / ❌ Missing

**Implemented:**
- Workflow: `pr-labeler.yml` — file-based labeling via `actions/labeler`
- Branch-based labels: `type:feature` for `feat/*`, `type:bug` for `fix/*`
- [Other automations]

**Label Coverage Matrix:**
| Label | Trigger | Auto-applied? | Branch Types |
|---|---|---|---|
| type:feature | Branch prefix | ✅ | feat/* |
| type:bug | Branch prefix | ✅ | fix/* |
| priority:high | Hotfix | ⚠️ | hotfix/*, manual add |

**Gaps:**
- No automatic `priority:*` labels for any branch type
- No `status:*` labels (needs-review, review-in-progress, etc.)
- Missing `area:*` labels based on file paths

**Recommendations:**
1. Add priority labeling for hotfixes (effort: 1h, benefit: high)
2. Implement status lifecycle labels (effort: 2h, benefit: medium)
3. Extend labelers.yml for area-based labels (effort: 1.5h, benefit: medium)

---

## 3. Assignee Assignment (CODEOWNERS)

**Status:** ✅ Complete / ⚠️ Partial / ❌ Missing

**Current CODEOWNERS:**
- [List code paths and owners]

**Automation:**
- ⚠️ CODEOWNERS file exists but no workflow auto-requests reviewers
- Manual reviewer assignment only

**Coverage:**
| Path | Owner | Auto-request? | Notes |
|---|---|---|---|
| src/** | @team/backend | ❌ | Manual request only |
| .github/** | @team/devops | ❌ | Manual request only |

**Gaps:**
- No workflow to auto-request reviewers from CODEOWNERS
- Team vs. individual reviewer policy unclear

**Recommendations:**
1. Add reviewer auto-request workflow (effort: 2h, benefit: high)
2. Document reviewer assignment policy (effort: 30m, benefit: medium)
3. Add exemption logic for docs (effort: 1h, benefit: low)

---

## 4. Milestone Allocation

**Status:** ✅ Complete / ⚠️ Partial / ❌ Missing

**Implemented:**
- No automatic milestone assignment

**Coverage:**
All branch types: ❌ No automation

**Gaps:**
- No workflow determines next milestone from version tags or release cycle
- Manual milestone assignment required for all PRs

**Recommendations:**
1. Implement milestone auto-assignment from version tags (effort: 3h, benefit: high)
2. Define milestone naming convention in BRANCHING_STRATEGY.md (effort: 1h, benefit: medium)
3. Add special handling for hotfix vs. release milestones (effort: 1.5h, benefit: medium)

---

## 5. Issue Linking & Creation

**Status:** ✅ Complete / ⚠️ Partial / ❌ Missing

**Implemented:**
- None

**Coverage:**
All scenarios: ❌ No automation

**Gaps:**
- No detection of issue references in PR descriptions
- No automatic creation of issues for unlinked PRs
- No auto-closure of issues when PR merges

**Recommendations:**
1. Add issue reference detection and linking (effort: 2.5h, benefit: high)
2. Implement issue auto-creation for unlinked PRs (effort: 3h, benefit: medium)
3. Add issue auto-closure on merge (effort: 1.5h, benefit: medium)
4. Document exemptions (e.g., chores, releases) (effort: 30m, benefit: low)

---

## Workflow Interactions & Conflicts

**No conflicts detected.** All workflows operate on different state fields (labels, projects, milestones).

**Dependencies:**
- pr-labeler.yml should run before pr-automation.yml (labels determine project assignment in custom logic)

**Recommendations:**
1. Add explicit `needs` dependency if custom logic relies on labels (effort: 30m, benefit: low)

---

## Summary & Prioritised Roadmap

### Quick Wins (1-2 hours each)
1. Add auto-request-reviewers workflow (CODEOWNERS → PR assignees)
2. Extend PR labeling for status lifecycle labels
3. Add milestone auto-assignment for hotfixes

### Strategic Initiatives (3+ hours each)
1. Full issue linking and auto-creation workflow
2. Milestone automation from release cycle
3. Project automation for all branch types + status management
4. Unified automation testing and validation suite

### Coverage Summary
| Category | Coverage | Priority |
|---|---|---|
| Project Assignment | 0% | High |
| PR Labeling | 60% | Medium |
| Assignee Assignment | 0% | High |
| Milestone Allocation | 0% | High |
| Issue Linking | 0% | High |
| **Overall** | **12%** | — |
```

---

## Validation

After conducting the review, validate:

- ✅ All workflow files examined and documented
- ✅ All five automation categories assessed
- ✅ Coverage gaps clearly identified with examples
- ✅ Recommendations are specific, actionable, and prioritised
- ✅ Findings aligned with `BRANCHING_STRATEGY.md` and `PR_CREATION_PROCESS.md`
- ✅ No conflicting automations missed
- ✅ Report includes effort estimates and benefit assessments

---

## References

- [Branching Strategy Guide](../docs/BRANCHING_STRATEGY.md)
- [PR Creation Process](../docs/PR_CREATION_PROCESS.md)
- [PR Template Routing](../.github/PULL_REQUEST_TEMPLATE/config.yml)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CODEOWNERS Guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
