---
file_type: documentation
title: "GitHub Issue Type & Workflow Management Audit"
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# GitHub Issue Type & Workflow Management Audit

**Date:** 2026-07-23  
**Scope:** Configuration files, workflows, labeling system, issue type automation  
**Status:** Complete | **Findings:** Critical issues identified, solutions designed

---

## Executive Summary

The LightSpeedWP `.github` repository has a well-designed issue type and labeling taxonomy (158 labels, 32 issue types, 25 templates), but **critical automation gaps** prevent proper metadata assignment at issue creation. Additionally, a defensive issue-reopening workflow creates user friction by silently reopening incomplete issues without clear guidance.

### Key Findings

| Category | Status | Impact |
|----------|--------|--------|
| **Issue types not auto-assigned at creation** | 🔴 CRITICAL | 25 templates have no automated labeling; AI agents must manually apply labels |
| **GitHub bot reopens incomplete issues** | 🔴 CRITICAL | Confusing UX; no guidance on how to fix; blocks PR merges indefinitely |
| **DoD enforcement missing for issues** | 🔴 CRITICAL | Only PR DoD is validated; issues can be closed with incomplete checklists |
| **PR merge blocked if linked issue incomplete** | ❌ NOT IMPLEMENTED | Required by user requirements; needs new workflow |
| **109 labels unprotected by governance** | 🟠 MAJOR | Risk of deletion if cleanup is enabled; inconsistent protection model |
| **Label aliases incomplete** | 🟠 MAJOR | `type:bug` → `bug` alias preserved; `type:feature` has no alias → confusing asymmetry |
| **Component labeling not automated** | 🟠 MAJOR | 20 component labels defined but not applied by any rule |
| **Custom field assignment undocumented** | 🟠 MAJOR | 7 custom fields defined but no AI agent instructions for assignment |

---

## Part 1: Configuration Audit

### File Inventory & Structure

#### 1. `.github/labels.yml` (707 lines)

- **Purpose:** Single source of truth for 158 canonical labels
- **Organization:** 14 label families (status, priority, type, area, component, language, environment, compatibility, content-type, ai-ops, contributor, discussion, meta, release)
- **Coverage:** All labels follow `family:value` naming convention
- **Color Palette:** 8-color system (green=ready, blue=planning, yellow=testing, red=blocked, orange=on-hold, purple=design, gray=meta, teal=integration)

**Label Distribution:**

- `status:*` (20 labels): needs-planning, needs-triage, ready, in-progress, on-hold, blocked, done, etc.
- `priority:*` (4): critical, important, normal, minor
- `type:*` (32): bug, feature, task, chore, epic, story, design, refactor, a11y, security, etc.
- `area:*` (20+): block-editor, theme, ci, documentation, performance, seo, etc.
- `component:*` (20): block-editor, block-inserter, block-variations, etc.
- `language:*` (7): php, js, css, json, md, yaml, html
- Others (45+): environment, compatibility, ai-ops, discussion, contributor, meta, release labels

#### 2. `.github/labeler.yml` (218 lines)

- **Purpose:** Maps branch/file patterns to labels for PRs and issues
- **Coverage:** ~40 automation rules
- **What It Does:**
  - Branch pattern matching for PRs (e.g., `feat/.*` → `type:feature`, `fix/.*` → `type:bug`)
  - File change detection for area/component assignment (e.g., `src/blocks/**` → `area:block-editor`)
  - Language detection (e.g., `*.php` → `lang:php`)
  - Priority inference (e.g., hotfix branches → `priority:critical`)
  - Status/discussion labels for PRs

**Critical Gap:**

- **NO issue-based rules** — Documented as Wave 5.1.2 work (see issue #649)
- **No template detection** — When an issue is created from a template, no label is automatically applied
- **No body pattern matching** — Keywords in issue descriptions don't trigger labels

#### 3. `.github/label-governance-policy.yml` (64 lines)

- **Purpose:** Define label protection and cleanup rules
- **Status:** `destructive_cleanup: enabled: false` (gated by issue #95)
- **Protected Labels:** 51 of 158 (32%)
- **Critical Issue:** `comp:help-tabs` listed as never_delete but does NOT exist in labels.yml

**Protected Label Categories:**

- Type labels (11): bug, feature, task, design, chore, refactor, a11y, test, automation, build, performance
- Area labels (12): block-editor, theme, ci, security, documentation, etc.
- Status labels (partial): Some covered under meta labels
- Meta labels (partial): dependabot-security, duplicate

**Unprotected (109 labels):**

- All 20 status labels except implicit coverage
- All 4 priority labels
- 21 type labels (epic, story, improve, enhance, ci, help, qa, ui, etc.)
- 8+ area labels (ai, analytics, automation, core, deployment, etc.)
- All 20 component labels
- All 7 discussion labels
- All 6 compatibility labels
- 1 language label (html missing from protection list)
- All environment, content-type, release, contributor labels

#### 4. `.github/issue-types.yml` (110 lines)

- **Purpose:** Define 32 issue type labels and their project UI representation
- **Coverage:** Complete mapping of type labels to colors and names
- **Examples:**
  - `type:bug` → Bug (Red)
  - `type:feature` → Feature (Green)
  - `type:task` → Task (Gray)
  - `type:epic` → Epic (Purple)
  - `type:a11y` → A11y (Purple)
  - ... (26 more types)

**Note:** Issue types are complete and well-defined; the gap is in automation, not definition.

#### 5. `.github/issue-fields.yml` (334 lines)

- **Purpose:** Define custom field model and mappings for issues
- **Custom Fields (7):**
  - Domain (select: dotgithub, wordpress-block-theme, wordpress-block-plugin)
  - Delivery Track (select)
  - Team (select)
  - Effort (number)
  - Start Date (date)
  - Target Date (date)
  - Risk (select)
  - Customer Impact (select: none, low, medium, high)
  - Technical Impact (select: none, low, medium, high)
  - Spec Link (text)

**Field Mappings:**

- Type → Project field value: Some types collapse (improve/enhance → Feature, security/performance/audit → Task)
- Pinned fields per type: Priority, Effort, Dates, Domain, Delivery Track, Team, Risk, Impact
- Default assignee: ashleyshaw
- Profiles (3): dotgithub, wordpress_block_theme, wordpress_block_plugin with preferred areas/components

---

### Configuration Issues Identified

#### 🔴 CRITICAL #1: Non-existent Label in Governance

- **File:** `label-governance-policy.yml` line 61
- **Issue:** `comp:help-tabs` marked as never_delete but does NOT exist in labels.yml
- **Impact:** Stale reference; unclear whether the label should be deleted or recreated
- **Action Required:** Decide and either (a) remove from governance, or (b) add label to labels.yml

#### 🟠 MAJOR #2: Issue-Based Labeling Rules Missing (DOCUMENTED GAP)

- **File:** `labeler.yml` (documented in header as Wave 5.1.2 work)
- **Issue:** No automation for issue template → type label mapping
- **Impact:** 25 issue templates with no automated labeling; AI agents must manually apply labels
- **Examples of Missing Rules:**
  - `.github/ISSUE_TEMPLATE/01-bug.md` → `type:bug`
  - `.github/ISSUE_TEMPLATE/03-feature.md` → `type:feature`
  - Keywords like "security vulnerability" → `type:security` + `priority:critical`
  - Area keywords (theme, block, gutenberg, etc.) → `area:*` labels
- **Referenced in:** Issue #649 (child tasks), issue-template-audit-2026-05-31.md report

#### 🟠 MAJOR #3: 109 Labels Unprotected by Governance

- **Files:** `labels.yml`, `label-governance-policy.yml`
- **Issue:** Only 51 of 158 labels protected; inconsistent protection model
- **Risk:** If `destructive_cleanup` is enabled, 109 labels could be deleted, breaking automation
- **Unprotected Categories:**
  - All status labels (20) — type:ready, status:in-progress, etc.
  - All priority labels (4) — priority:critical, priority:normal, etc.
  - 21 type labels — epic, story, improve, enhance, ci, help, qa, ui, ux-feedback, etc.
  - 20 component labels — all comp:* labels unprotected
  - 7 discussion labels — all discussion:* unprotected
- **Action Required:** Audit and either protect all labels or mark deprecated ones for deletion (issue #95 decision)

#### 🟠 MAJOR #4: Type Label Alias Inconsistency

- **File:** `labels.yml`
- **Issue:** `type:bug` has `bug` alias, but `type:feature` has NO aliases
- **Impact:** Bare `feature` label is removed as non-canonical; bare `bug` is preserved (confusing asymmetry)
- **Missing Aliases:**
  - `type:feature` ← should have: feature, feat, enhancement, improve
  - `type:task` ← should have: task, todo, work
  - `type:chore` ← should have: chore, housekeeping
  - `type:refactor` ← should have: refactor, cleanup, refactoring
  - And others...

#### 🟠 MAJOR #5: Component Labeling Not Automated

- **File:** `labeler.yml`
- **Issue:** 20 component labels defined in labels.yml but NO automation rules
- **Components Affected:** block-editor, block-inserter, block-variations, block-supports, block-locking, block-bindings, block-templates, block-patterns, template-parts, block-json, theme-json, wp-admin, settings, post-settings, style-variations, block-styles, color-palette, typography, section-styles, spacing
- **Impact:** Component assignment must be manual; no PR/issue automation
- **Action Required:** Add file pattern rules to labeler.yml for component detection

---

## Part 2: Workflow & Automation Audit

### Workflows Analyzed

#### `issues.yml` (Trigger: `issues.opened`, `issues.edited`, `issues.reopened`)

- **Job:** Apply default labels and type detection
- **Logic:**
  1. Run `scripts/agents/issues.agent.js --apply`
  2. Add `status:needs-triage` and `priority:normal` if no labels exist
  3. Detect issue type from title/body using keyword heuristics
  4. Fallback to `type:task` if no type detected
- **Problem:** Type detection is content-based, not template-based
  - If issue created from "Feature" template but body mentions "bug fix", it gets `type:bug`
  - No mechanism to capture which template was selected

#### `labeling.yml` (Trigger: pushes, PRs, issues)

- **Job:** Unified labeling agent via `scripts/agents/run-labeling-agent.cjs`
- **Coverage:**
  - File pattern matching (for area/component)
  - Branch pattern matching (for type)
  - Content-based type detection (for issues)
  - Label validation and standardization
  - Alias migration (e.g., bare `bug` → `type:bug`)
  - One-hot enforcement: max 1 label per family (status, priority, type)
- **Strength:** Well-designed, enforces canonical label names
- **Weakness:** Only works on PRs and branch patterns; issues get keyword detection only

#### `template-enforcement.yml` (Trigger: `issues.closed`)

- **Critical Behavior:** AUTO-REOPENS INCOMPLETE ISSUES
- **Logic:**
  1. When an issue is closed, workflow runs
  2. Re-fetches issue body and checks for:
     - "Definition of Ready (DoR)" section exists
     - "Definition of Done (DoD)" section exists
     - `status:needs-more-info` label NOT present
  3. If missing DoR/DoD or has `status:needs-more-info`:
     - **REOPENS THE ISSUE** with a comment explaining why
     - Sets workflow status to failed
  4. If all checks pass: allows close

**Code snippet:**

```yaml
if (missingSections.length === 0 && !hasNeedsMoreInfo) {
  core.info(`Issue #${issue.number} meets close requirements.`);
  return;
}
// Otherwise reopen:
await github.rest.issues.update({
  state: 'open',  # REOPEN
  body: '...'
});
```

**Problems with this approach:**

- ❌ Silent reopening with no user guidance on how to fix
- ❌ Only checks for section TEXT presence, not checklist completion
- ❌ No way for users to force-close if intentionally bypassing template
- ❌ Creates frustrating loop: close → reopen → close → reopen

#### `validate-pr-template.yml` (Trigger: PR open/edit/sync)

- **Validations:**
  1. PR has linked issue(s): `Linked issues` section with at least one reference
  2. PR has changelog: `Changelog` section (unless `meta:no-changelog` label)
  3. **PR DoD completed:** All checklist items in "Checklist (Global DoD)" marked with `[x]`
  4. Returns success/failure to CI
- **Strength:** Enforces DoD completion before PR merge
- **Weakness:** Issues have NO equivalent validation

#### `checklist-finalisation.yml` (Trigger: `issues.closed`, PR merged)

- **Behavior:** AUTO-COMPLETES all unchecked boxes
- **Logic:**

  ```
  Convert all [ ] to [x] in DoD/DoR sections
  ```

- **Problem:** ⚠️ This defeats the purpose of DoD enforcement
  - Users don't need to actually complete items
  - Boxes are auto-marked when closing
  - No validation that work is actually done

#### `issue-create-from-template.yml` (Trigger: `workflow_dispatch` manual only)

- **What It Does:**
  1. Accepts workflow inputs: template type, issue title, labels
  2. Reads template markdown from `.github/ISSUE_TEMPLATE/{template}.md`
  3. Validates template contains DoR and DoD sections
  4. Creates issue with pre-populated body
  5. Sets `type:*` label based on template selection
- **Strength:** Type IS set correctly when used
- **Weakness:** Only available via workflow dispatch (manual); not used by automated issue creation

---

### Workflow Issues Identified

#### 🔴 CRITICAL #1: Issue Type Not Applied from Template

- **Root Cause:** `issues.yml` uses keyword detection, not template metadata
- **Impact:** Template selection ignored; type assigned based on body content
- **Example Failure:**
  - User selects "Feature" template
  - Body mentions "fixing bug" in example context
  - Workflow assigns `type:bug` instead of `type:feature`
- **Workaround:** `issue-create-from-template.yml` works correctly but is manual workflow_dispatch only

#### 🔴 CRITICAL #2: Silent Issue Reopening Without Clear Guidance

- **Root Cause:** `template-enforcement.yml` reopens issues if DoR/DoD sections missing
- **User Impact:**
  1. User creates issue without proper template
  2. Later tries to close issue
  3. Bot silently reopens with generic message
  4. User confused; tries again; same result
  5. Issue stays open indefinitely
- **Blocking Problem:** When a PR tries to close an issue via "closes #123" in PR body:
  - PR merges successfully
  - GitHub auto-closes the linked issue
  - `template-enforcement.yml` immediately reopens it
  - PR and issue get out of sync
  - **User sees merged PR but issue still open**

#### 🔴 CRITICAL #3: DoD Enforcement Missing for Issues

- **Current State:**
  - ✅ PRs: DoD checklist completion required before merge
  - ❌ Issues: No DoD validation before closing
  - ❌ Issues: `checklist-finalisation.yml` auto-completes boxes (defeating DoD)
- **Impact:** Issues can be closed with incomplete DoD checklist; no accountability
- **Required Behavior (from user requirements):**
  - Issue cannot be closed if DoD checklist has unchecked items
  - PR cannot merge if linked issue has unchecked DoD items
  - All items must be manually marked `[x]` by human action (not auto-completed)

#### 🟠 MAJOR #4: PR Merge Not Blocked by Incomplete Issue DoD

- **Current State:** No workflow prevents PR merge if linked issue is incomplete
- **Required Behavior:** PR should be blocked if:
  - Linked issue has unchecked DoD items
  - Linked issue not in `status:done` or similar
- **User Requirement:** This is a critical enforcement point

#### 🟠 MAJOR #5: No Custom Field Assignment Automation

- **Current State:** 7 custom fields defined in issue-fields.yml but no automation
- **Fields:** Domain, Delivery Track, Team, Effort, Risk, Customer Impact, Technical Impact
- **Manual Process:** Users must fill in custom fields after issue creation
- **Required:** AI agents given guidance on how to populate these from issue content

---

## Part 3: Root Cause Analysis

### Why Issue Types Aren't Applied at Creation

```
Template Selected (UI) → Issue Created with Template Body
                       ↓
               issues.yml Workflow Triggers
                       ↓
         Attempts Keyword Detection in Body
                       ↓
     IF "bug" in body → type:bug (WRONG if "Feature" template selected)
     IF "feature" not in body AND no keywords → type:task (WRONG)
                       ↓
         Issue Created with WRONG Type & Wrong Template Section Labels
```

**Why It Fails:**

- Template selection is NOT captured by workflow; only body content is visible
- Keyword detection is unreliable (false positives/negatives)
- No "golden source" of truth for which template was actually used

### Why PRs Fail to Close Issues

```
PR Merged with "closes #123" in Body
       ↓
GitHub Auto-Close Triggered
       ↓
Issue #123 Closed Successfully
       ↓
template-enforcement.yml Workflow Triggers (on issues.closed)
       ↓
Check: Does Issue Have DoR Section? Usually NO (not all templates have it)
Check: Does Issue Have DoD Section? Depends on template used
       ↓
IF Missing Sections OR has status:needs-more-info
       ↓
       REOPEN Issue #123
       ↓
User Sees: PR Merged ✅ but Issue Still Open ❌
Result: Confusion & Manual Cleanup Needed
```

**Why Auto-Reopen is Problematic:**

- Happens silently after user closes issue
- No way to override (no "force close" option)
- Creates infinite loop if issue truly doesn't meet requirements
- Breaks the PR→Issue relationship (PR merged but issue open)

### Why DoD Enforcement Doesn't Work

```
Issue Created with Incomplete DoD Checklist
       ↓
User Works on Issue (or doesn't)
       ↓
User Closes Issue (via GitHub web UI or PR closing)
       ↓
checklist-finalisation.yml Triggered
       ↓
Auto-Completes All [ ] Boxes → [x]
       ↓
Issue Marked as Done (WITHOUT validation work was completed)
```

**The Problem:**

- No validation that human actually completed work
- No requirement to mark items manually
- No accountability; boxes auto-completed on close
- Defeats the purpose of Definition of Done

---

## Part 4: Custom Fields & Metadata Gaps

### Defined Custom Fields (Not Populated Automatically)

| Field | Type | Options/Values | Assignment | Notes |
|-------|------|---|---|---|
| Domain | Select | dotgithub, wordpress-block-theme, wordpress-block-plugin | Manual | No inference rules |
| Delivery Track | Select | (varies) | Manual | No automation |
| Team | Select | (varies) | Manual | Could infer from CODEOWNERS or area label |
| Effort | Number | (story points) | Manual | No estimation automation |
| Start Date | Date | (any date) | Manual | No workflow date assignment |
| Target Date | Date | (any date) | Manual | No deadline inference |
| Risk | Select | (varies) | Manual | Could infer from issue type (security=high) |
| Customer Impact | Select | none, low, medium, high | Manual | No inference from issue type |
| Technical Impact | Select | none, low, medium, high | Manual | No inference from issue type |
| Spec Link | Text | (URL) | Manual | Could extract from issue body links |

**Gap:** No AI agent instructions for populating these fields from issue content

---

## Part 5: Label Alias Problems

### Asymmetric Alias Coverage

**Type labels WITH aliases:**

- `type:bug` ← `bug` (preserved)
- `type:automation` ← `automation`
- `type:test` ← `test`
- `type:a11y` ← `a11y`
- `type:security` ← `security`
- `type:maintenance` ← `maintenance`
- `type:documentation` ← `documentation`
- `type:audit` ← `audit`

**Type labels WITHOUT aliases:**

- `type:feature` (bare `feature` label gets REMOVED as non-canonical)
- `type:task` (bare `task` gets removed)
- `type:chore` (bare `chore` gets removed)
- `type:improve` (bare `improve` gets removed)
- `type:enhancement` (bare `enhancement` gets removed)
- `type:refactor` (bare `refactor` gets removed)
- `type:ci`, `type:build`, `type:epic`, `type:story`, and others

**Result:** Confusing behavior where some common labels are preserved and others are deleted

---

## Part 6: Summary Table: All Issues by Category

### Configuration Issues (5 Critical/Major)

| # | Issue | Severity | File | Impact | Action |
|---|-------|----------|------|--------|--------|
| 1 | Non-existent `comp:help-tabs` in governance | CRITICAL | label-governance-policy.yml | Stale reference; unclear intention | Remove or recreate label |
| 2 | Issue-based labeling rules missing | CRITICAL | labeler.yml | 25 templates with no auto-labels | Implement Wave 5.1.2 rules |
| 3 | 109 labels unprotected | MAJOR | label-governance-policy.yml | Risk of deletion if cleanup enabled | Audit and protect actively-used labels |
| 4 | Type label alias inconsistency | MAJOR | labels.yml | `feature` label removed; `bug` preserved | Add missing aliases |
| 5 | Component labeling not automated | MAJOR | labeler.yml | 20 component labels never applied | Add file pattern rules |

### Workflow Issues (5 Critical/Major)

| # | Issue | Severity | Workflow | Impact | Action |
|---|-------|----------|----------|--------|--------|
| 1 | Issue type from template not applied | CRITICAL | issues.yml | Wrong type assigned; template ignored | Implement template-aware detection |
| 2 | Silent issue reopening loop | CRITICAL | template-enforcement.yml | PR/issue sync breaks; user confusion | Add clear guidance; allow force-close |
| 3 | DoD enforcement missing for issues | CRITICAL | checklist-finalisation.yml | Issues close without DoD completion | Add pre-close validation |
| 4 | PR merge not blocked by incomplete issue | CRITICAL | (missing workflow) | Linked issues stay incomplete | Implement PR merge blocker |
| 5 | Custom field assignment undocumented | MAJOR | (all workflows) | Manual field population; no inference | Add AI agent instructions |

---

## Part 7: Impact Assessment

### Current State of Issues Created by AI Agents

When an LLM creates an issue via GitHub API:

```
1. Issue Created with Selected Template
   ✅ Title set correctly
   ✅ Body contains template sections (if API provides full body)
   ❌ Issue type NOT SET (must be applied manually or guessed from keywords)
   ❌ Labels NOT SET (except by keyword heuristics)
   ❌ Assignee NOT SET (should default to code owner)
   ❌ Project NOT SET (should default to .github project #33)
   ❌ Custom fields NOT SET (all 7 fields empty)

2. Issues.yml Workflow Runs
   ⚠️ Attempts Type Detection from Body Keywords
   ⚠️ If Fails, Assigns type:task (often wrong)
   ⚠️ Adds status:needs-triage + priority:normal
   ⚠️ May Assign Wrong Area Based on Body Keywords

3. Result: Issue Has WRONG Metadata
   → Type may not match template
   → Area may not match actual scope
   → No assignee or project
   → Status not ready for processing
   → Requires Manual Cleanup
```

### User Impact: "Claude Can't Create Issues Correctly"

**Why LLMs Struggle:**

1. No way to specify issue type in GitHub API create call (not a field parameter)
2. No way to signal which template should be used (must be inferred from issue body)
3. No automation to set assignee/project/custom fields
4. Keyword detection unreliable (false positives/negatives)

**Current Workaround:**

- AI agents manually add labels after issue creation
- Increases API calls and latency
- Still error-prone (keyword-based detection imperfect)

---

## Part 8: Recommendations & Solution Path

### Phase 1: Immediate Fixes (Critical Issues)

#### 1.1 Fix Non-existent Label (P0)

```yaml
# In label-governance-policy.yml
# Remove: comp:help-tabs
# OR Add to labels.yml if it should exist
```

#### 1.2 Implement Issue-Based Labeling Rules (P0)

```yaml
# In labeler.yml, add issue-body pattern rules:
- issues:
    - body-contains:
        - regex: 'bug|regression|defect|error|crash'
        - label: type:bug
    - body-contains:
        - regex: 'feature|enhancement|new capability'
        - label: type:feature
    # ... etc for all 25 templates
```

#### 1.3 Add Missing Type Label Aliases (P0)

```yaml
# In labels.yml
- name: type:feature
  aliases:
    - feature
    - feat
    - enhancement
    - feature-request
```

#### 1.4 Fix Template-Enforcement Reopening Logic (P0)

```javascript
// In template-enforcement.yml
// Instead of silent reopen with generic message:
// 1. Check if issue ACTUALLY meets DoR/DoD
// 2. If missing, post detailed comment explaining WHAT'S missing
// 3. Provide actionable next steps (link to template, example)
// 4. Add label: status:needs-template-fix
// 5. DO NOT REOPEN (let user decide to fix and resubmit)
```

#### 1.5 Implement Issue DoD Validation Before Close (P0)

```javascript
// New Workflow: validate-issue-dod-before-close.yml
// Trigger: issues.closed
// 1. Check if issue has DoD section
// 2. Parse DoD checklist items
// 3. Count unchecked items [ ]
// 4. If unchecked items exist AND issue not marked with 'meta:force-close':
//    - COMMENT with list of incomplete items
//    - REOPEN issue
//    - ADD label: status:incomplete-dod
```

### Phase 2: Enhanced Automation (Major Issues)

#### 2.1 Add PR Merge Blocker (Linked Issue DoD Check)

```yaml
# New Workflow: validate-linked-issue-dod-on-pr.yml
# Trigger: pull_request open/sync/ready_for_review
# 1. Parse PR body for linked issues (closes #123, fixes #456)
# 2. For each linked issue:
#    - Fetch issue and parse DoD checklist
#    - Count unchecked items
#    - If unchecked items exist:
#      - Set commit status: FAILURE
#      - Add PR comment: "Linked issue #123 has X incomplete DoD items"
#      - Block merge (via branch protection rule)
```

#### 2.2 Template-Driven Type Assignment

```javascript
// In issues.yml, enhance logic:
// 1. If template filename in issue body (e.g., "Created from: bug.md"):
//    - Extract template name
//    - Assign corresponding type label
// 2. If no template signature found:
//    - Fall back to keyword detection
// 3. Never override user-selected type with keyword heuristics
```

#### 2.3 Custom Field Assignment Automation

```javascript
// New Workflow: populate-issue-custom-fields.yml
// 1. Extract issue type from labels
// 2. Infer custom fields:
//    - Risk: high if type:security, type:bug; medium if type:feature; low if type:task
//    - Customer Impact: high if type:security; medium if type:bug; low if type:task
//    - Effort: estimate from title length, type, keywords (rough heuristic)
//    - Team: infer from area label or code owners
// 3. Set fields via GitHub GraphQL API
```

#### 2.4 Protect All Actively-Used Labels

```yaml
# In label-governance-policy.yml
never_delete_labels:
  - All 158 labels defined in labels.yml
  # OR audit to find true orphans and list only used labels
```

#### 2.5 Add Missing Component Labeling Rules

```yaml
# In labeler.yml
- issues:
    - body-contains:
        - keyword: 'block-editor|editor|gutenberg|blocks'
        - label: component:block-editor
    - body-contains:
        - keyword: 'theme.json|theme|styles'
        - label: component:theme-json
    # ... etc for all 20 components
```

### Phase 3: AI Agent Guidance (Documentation)

#### 3.1 Create Issue Creation Guidelines

```markdown
# Issue Creation Guide for AI Agents

## Required Fields for Auto-Population:
- **Issue Type:** Set via template selection (maps to type:* label)
- **Assignee:** Defaults to code owner from CODEOWNERS (or fallback)
- **Labels:** Auto-applied based on template + body keywords
- **Project:** Defaults to .github (ID #33)
- **Custom Fields:** Auto-inferred from type, area, and keywords

## Template Selection:
Use one of 25 templates:
- bug.md → type:bug
- feature.md → type:feature
- ... etc

## Body Content:
Include these sections (auto-detected):
- Definition of Ready (DoR) - when issue is ready to work
- Definition of Done (DoD) - when issue is considered complete
```

#### 3.2 Update AGENTS.md with Issue Creation Rules

```markdown
## Issue Creation Best Practices for LLMs

1. Always include DoR and DoD sections in issue body
2. Use template names that match .github/ISSUE_TEMPLATE/
3. Include keywords that match automation rules (type, area, component)
4. Set issue-type preference EARLY in body for keyword detection
5. Link related issues via "Related: #123" syntax
6. Include Acceptance Criteria in standard format:
   Given: ...
   When: ...
   Then: ...
```

---

## Part 9: Implementation Roadmap

### Priority 1: Critical Path (Unblocks AI agent usage)

| Task | Effort | Owner | Timeline |
|------|--------|-------|----------|
| Fix non-existent label | 0.5h | Engineering | Week 1 |
| Add missing type aliases | 1h | Engineering | Week 1 |
| Implement issue-body labeling rules | 3h | Engineering | Week 1-2 |
| Fix template-enforcement reopening logic | 4h | Engineering | Week 2 |
| Add issue DoD validation | 3h | Engineering | Week 2 |
| **Subtotal** | **11.5h** | | **2 weeks** |

### Priority 2: Enhanced Automation (Improves UX)

| Task | Effort | Owner | Timeline |
|------|--------|-------|----------|
| Implement PR merge blocker (DoD check) | 4h | Engineering | Week 3 |
| Template-driven type assignment | 2h | Engineering | Week 3 |
| Custom field assignment automation | 5h | Engineering | Week 3-4 |
| Label protection audit | 2h | Engineering | Week 4 |
| Component labeling rules | 2h | Engineering | Week 4 |
| **Subtotal** | **15h** | | **2 weeks** |

### Priority 3: Documentation & Validation

| Task | Effort | Owner | Timeline |
|------|--------|-------|----------|
| Create issue creation guidelines | 2h | Documentation | Week 4 |
| Update AGENTS.md | 2h | Documentation | Week 4 |
| Test all workflows end-to-end | 4h | Engineering | Week 4-5 |
| Create validation test suite | 3h | Engineering | Week 5 |
| **Subtotal** | **11h** | | **1.5 weeks** |

**Total Estimated Effort:** ~37.5 hours | **Timeline:** 5 weeks

---

## Appendices

### A: File Reference Map

**Configuration Files:**

- `.github/labels.yml` (158 labels, canonical reference)
- `.github/labeler.yml` (40+ automation rules)
- `.github/label-governance-policy.yml` (51 protected labels)
- `.github/issue-types.yml` (32 issue types)
- `.github/issue-fields.yml` (7 custom fields, field mappings)

**Workflow Files:**

- `.github/workflows/issues.yml` (type detection on issue open)
- `.github/workflows/labeling.yml` (unified labeling agent)
- `.github/workflows/template-enforcement.yml` (DoR/DoD section validation)
- `.github/workflows/validate-pr-template.yml` (PR DoD checklist validation)
- `.github/workflows/checklist-finalisation.yml` (auto-completes checklist items)
- `.github/workflows/issue-create-from-template.yml` (manual workflow_dispatch)

**Issue Templates:**

- `.github/ISSUE_TEMPLATE/01-bug.md` through `24-*.md` (25 templates total)

**Scripts:**

- `scripts/agents/issues.agent.js` (applies default labels)
- `scripts/agents/run-labeling-agent.cjs` (unified labeling)
- `scripts/validation/validate-labeling-configs.cjs` (label validation)
- `scripts/agents/includes/field-parity.test.js` (field validation)

### B: Configuration YAML Snippets

**Current labeler.yml Type Rules:**

```yaml
type:
  - branch-regex: '^feat/'
    label: type:feature
  - branch-regex: '^fix/'
    label: type:bug
  - branch-regex: '^hotfix/'
    label: type:bug
  # ... 11 more type rules
```

**Proposed Issue-Based Rules (to add):**

```yaml
issues:
  - template-regex: '^02-bug.md'
    label: type:bug
  - template-regex: '^03-feature.md'
    label: type:feature
  - body-contains:
      - regex: 'security vulnerability|CVE'
      - label: type:security
  # ... extend for all 25 templates + 32 types
```

### C: Validation Checklist

**After Implementing All Fixes:**

- [ ] Non-existent label `comp:help-tabs` removed or recreated
- [ ] Issue-body labeling rules added for all 25 templates
- [ ] Missing type aliases added to labels.yml
- [ ] `type:*` labels applied automatically on issue creation
- [ ] `area:*` and `component:*` labels inferred from body keywords
- [ ] `priority:*` labels inferred from issue type (security=high, etc.)
- [ ] `status:needs-triage` removed (replaced with correct status)
- [ ] Template-enforcement repopening fixed with clear guidance
- [ ] Issue DoD validation prevents close with unchecked items
- [ ] PR merge blocked if linked issue has unchecked DoD items
- [ ] Custom fields auto-populated (Domain, Team, Risk, Impact, etc.)
- [ ] All 158 labels protected in governance policy
- [ ] Test issues created by AI agents have all correct metadata
- [ ] No silent issue reopening; clear user guidance on failures

---

## Conclusion

The issue type and labeling system is **well-designed but incompletely automated**. Key metadata (issue type, area, assignee, project, custom fields) is not populated at creation, requiring manual intervention or keyword-based guessing.

The **template-enforcement workflow's silent reopening** creates a major pain point where PRs appear merged but linked issues reopen unexpectedly.

**All issues are fixable** with targeted workflow changes and rule additions. Implementation of the recommended fixes will enable:

1. ✅ Issue types automatically applied from template selection
2. ✅ All metadata (labels, assignee, project, fields) auto-populated
3. ✅ Clear guidance when issues don't meet template requirements
4. ✅ PR merges blocked if linked issues have incomplete DoD
5. ✅ Consistent, reliable issue management for AI agents and humans

---

**Report Prepared By:** Audit Agents (Explore)  
**Date:** 2026-07-23  
**Status:** Ready for Solution Design Phase  
**Next Steps:** Begin Phase 1 critical fixes; design solution architecture
