---
title: Issue & PR Template Improvements - Planning & Analysis
description: Comprehensive analysis and recommendations for aligning issue templates, PR templates, branch prefixes, labels, and automation
created_date: 2026-09-04
document_type: planning
status: draft
owner: ashley@lightspeedwp.agency
---

# Issue & PR Template Improvements — Planning & Analysis

**Scope**: Review and align issue templates, PR templates, branch prefixes, labels, and governance to reduce complexity and improve consistency.

**Session Start**: 2026-09-04
**Status**: ✅ Complete
**Completion Date**: 2026-09-04

---

## Current State Snapshot

### Issue Templates (26)
- **Count**: 26 issue templates
- **Branch prefixes used**: 22 unique prefixes
- **Example prefixes**: feat/, fix/, docs/, chore/, task/, refactor/, test/, perf/, ci/, hotfix/, release/, design/, a11y/, qa/, content/, seo/, config/, migrate/, uat/, proto/, ds/, api/, schema/, telemetry/, support/, security/, research/, integration/, epic/, maintenance/, build/, automation/, audit/, aiops/

### PR Templates (19)
- **Count**: 19 templates
- **Naming pattern**: `pr_{type}.md` (e.g., `pr_feature.md`, `pr_bug.md`, `pr_ci.md`)
- **Current templates**: feature, bug, task, refactor, chore, docs, hotfix, release, epic, design, a11y, audit, ci, security, aiops, test, dep_update

### Labels (145+)
- **Families**: status, priority, type (27 type:* labels), meta, release, area, comp, lang, env, compat, cpt, ai-ops, contrib, discussion, openspec
- **Key concern**: Some duplicate semantic meanings across families (e.g., `type:integration` + `area:integration`, `type:build` + `type:ci`)

### Branch Strategy (from BRANCHING_STRATEGY.md)
- **Key prefixes**: feat/, fix/, hotfix/, release/, refactor/, chore/, task/, docs/, test/, perf/, ci/, build/, deps/, security/, revert/, research/, design/, a11y/, ux/, i18n/, ops/, proto/, ds/, api/, schema/, telemetry/, content/, seo/, config/, migrate/, qa/, uat/, audit/, codex/, aiops/
- **Forbidden prefixes**: claude/, copilot/, openai/

---

## Issues Identified

### 1. **Issue Template Count vs PR Template Mismatch**
- **Problem**: 26 issue templates but only 19 PR templates
- **Impact**: Missing alignment; unclear which issue types map to which PR templates
- **Examples of mismatch**:
  - Story issue (06-story.md) → recommends `feat/` → uses `pr_feature.md` ✓
  - Improvement issue (07-improvement.md) → recommends `feat/` → should map to `pr_feature.md`?
  - Maintenance issue → no clear PR template mapping
  - Help/Support/Question issues → no dedicated PR templates

### 2. **Branch Prefix Fragmentation**
- **Problem**: 22 different branch prefixes recommended in issue templates (fewer than 30 in strategy, but still fragmented)
- **Goal**: Should be reduced to match PR template count (19) + a few additional specialized ones
- **Current gaps**: Missing mappings for support/, compat/, maintenance/, integration/, quality issues

### 3. **Story Issue Type — Unclear Purpose**
- **Current state**: `type:story` exists, recommends `feat/` branch
- **Problem**: In Scrum/Agile, a "story" is typically just another name for a feature from the user's perspective
- **Question for user**: What should replace `type:story`?
  - Option A: Remove entirely (stories = features)
  - Option B: Replace with `type:ci` (CI/CD workflows) — branches: `ci/`
  - Option C: Keep as-is but relabel as "Feature Story" to clarify it's user-facing work
  - Option D: Replace with `type:epic` (but epic already exists for large initiatives)

### 4. **Improve vs Enhance Naming**
- **Current state**: `type:improve` exists (color: `#9198A1`)
- **Problem**: Also have `type:enhancement` (color: `#3FB950` — same as feature!)
- **Recommendation**: Consolidate to single term
  - Option A: Use `enhance` / `type:enhancement` (aligns with common usage)
  - Option B: Use `improve` / `type:improve` (shorter, simpler)
  - **Suggested**: Remove `type:improve`, standardize on `type:enhancement` (currently exists in labels.yml)

### 5. **Duplicate Labels Across Families**
- **Example 1**: `type:integration` vs `area:integration`
  - `type:integration`: "Integration" (color: `#8D4821`)
  - `area:integration`: "3rd-party integrations / ecosystem" (color: `#D93F0B`)
  - **Issue**: Semantic overlap — is integration a "type" or an "area"?
  - **Recommendation**: Keep `area:integration` (describes location/domain), deprecate/remove `type:integration`

- **Example 2**: `type:build` vs `type:ci`
  - `type:build`: "Build & CI" (color: `#4393F8`)
  - `type:ci`: "CI/CD and continuous integration" (color: `#4393F8`)
  - **Issue**: Semantic overlap; same colour
  - **Recommendation**: Split into:
    - `type:build` — Build system, package changes, bundling
    - `type:ci` — CI/CD workflows, GitHub Actions, automation
    - **Note**: Both map to `area:ci` (area describes broader surface)

### 6. **PR Templates Missing Default Labels**
- **Current state**: Most PR templates have minimal labels set
  - Example: `pr_feature.md` only has `["type:feature", "status:needs-review"]`
- **Expected**: PR templates should seed more label families for automation
  - Should include: `type:*`, `status:*`, `area:*`, `priority:*`, `meta:*` (where applicable)
  - **Example improved PR template labels**:
    ```yaml
    labels: ["type:feature", "status:needs-review", "priority:normal", "area:core", "meta:needs-changelog"]
    ```

### 7. **Missing Recommended Issue Type Pairing**
- **Current state**: Issue templates recommend branches, but PR templates don't recommend linked issue types
- **Goal**: Two-way mapping for clarity
  - `pr_feature.md` should note: "Links to `type:feature` issues"
  - `pr_task.md` should note: "Links to `type:task` issues"
  - This helps maintainers understand which issue types each PR template is for


### 8. **OpenSpec Status Labels — Redundant Complexity**
- **Original OpenSpec labels** (12 total):
  - **Keep**: `openspec:status/discovery`, `openspec:status/planning`, `openspec:status/implementation`, `openspec:status/testing`, `openspec:status/production`, `openspec:status/deprecated`
  - **Deprecate**: `openspec:specification-pending`, `openspec:specification-in-progress`, `openspec:specification-complete`, `openspec:implementation-pending`, `openspec:implementation-in-progress`, `openspec:implementation-complete`
- **Problem**:
  - Status phases overlap with implementation phases
  - Already have `status:*` labels that cover most of this
  - Unclear which to use when (e.g., when do you use `openspec:status/planning` vs `status:needs-planning`?)
- **Recommendation**: Simplify OpenSpec labels to the six phase labels:
  - **Keep**: All six `openspec:status/*` labels as high-level lifecycle phases
  - **Deprecate**: Specification/implementation pending/in-progress/complete (use standard `status:*` labels instead)
  - **Rationale**: Standard status labels already handle workflow state; openspec labels should only track openspec-specific phases

### 9. **New Area Labels Requested**
- **User request**: Add these new area labels:
  - `area:playwright` — Playwright testing/automation
  - `area:jest` — Jest testing framework
  - `area:phpunit` — PHPUnit testing framework
  - `area:pagespeed` — PageSpeed Insights / performance monitoring
- **Recommendation**: Add all four; colour family should align with testing/performance context
  - Testing-related (`area:playwright`, `area:jest`, `area:phpunit`): Use `area:testing` family colour
  - Performance-related (`area:pagespeed`): Use `area:performance` family colour

### 10. **Issue & PR Title Governance — Missing**
- **Current examples** (from user):
  - ✓ `feat: Complete Phase 2C-5 validation suite and benchmarking` (clear, scoped)
  - ✓ `feat: Add telemetry instrumentation for release validation and metrics orchestration` (clear scope)
  - ✓ `docs: Complete Issue #1786 - Label Coverage Audit Skill` (reference + scope)
  - ✓ `refactor: Reorganize Phase 2B benchmarking to active project folder` (action + scope)
  - ✗ `type:enhancement: Prompt Discovery & Search (Full-Text Search & Recommendation Engine)` (mixes label into title; should use branch prefix)
  - ✗ `refactor: Reorganize Phase 2B benchmarking documentation to active project folder` (too verbose)

- **Recommendation**: Document governance for issue & PR title format
  - **Issue format**: `{type}: {scope} - {short-description}` or `{type}: {description}` (if scope is obvious)
  - **PR format**: `{type}: {scope} - {short-description}` (mirrors branch name)
  - **Scope guidance**: Use active project name, epic name, or brief area (e.g., "Phase 2C-5", "Label Coverage Audit")
  - **Examples**:
    - ✓ `feat: issue-pr-template-improvements - Align branch prefixes across templates`
    - ✓ `fix: authentication - Timeout handling for expired tokens`
    - ✓ `docs: branching-strategy - Update section 5 with automation mappings`

---

## Recommendations Summary

| Item | Current | Recommended Action | Priority |
|------|---------|-------------------|----------|
| **Story issue type** | Keep | Replace with `type:ci` OR remove (clarify with user) | HIGH |
| **Improve vs Enhance** | Keep both `type:improve` + `type:enhancement` | Standardize on `type:enhancement`; deprecate `type:improve` | MEDIUM |
| **type:integration** | Keep as type + area | Deprecate `type:integration`; keep `area:integration` only | MEDIUM |
| **type:build + type:ci** | Combined as "Build & CI" | Split into separate `type:build` and `type:ci` labels | MEDIUM |
| **Issue template count** | 26 templates | Reduce to 19–21 (align with PR templates) | MEDIUM |
| **Branch prefix mapping** | 22 prefixes in templates | Map each issue template to one of 19 PR templates | HIGH |
| **PR template labels** | Minimal (2–3 labels) | Expand to include area, status, priority, meta families | MEDIUM |
| **Recommended issue type** | Not in PR templates | Add to each PR template | LOW |
| **OpenSpec labels** | 12 labels (redundant) | Reduce to 6 phase labels; use standard `status:*` for workflow | MEDIUM |
| **New area labels** | Missing | Add `area:playwright`, `area:jest`, `area:phpunit`, `area:pagespeed` | LOW |
| **Title governance** | Informal | Document issue & PR title format + examples | MEDIUM |

---

## Questions for User

### 1. **Story Issue Type Replacement**
What should replace `type:story`?
- **A**: Remove entirely (stories = features under `type:feature`)
- **B**: Replace with `type:ci` (for CI/CD workflows, since we're splitting build/ci)
- **C**: Keep as-is but clarify intent (customer-facing user story)
- **D**: Other?

### 2. **Improve vs Enhance**
Which term should be the standard?
- **A**: `type:enhancement` (currently exists; broader semantic meaning)
- **B**: `type:improve` (shorter; clear action)
- **C**: Keep both but define distinct usage
- **D**: Rename to something else?

### 3. **Default Area Label Strategy**
Should all PRs get a default `area:core` or should area labels be manually assigned per PR?
- **A**: Auto-assign `area:core` as default (can be overridden)
- **B**: Require manual assignment (no default)
- **C**: Auto-assign based on file path changes (using labeler.yml rules)

### 4. **Default Priority Label**
Should all PRs/issues get a default `priority:normal`, or leave priority unset until triaged?
- **A**: Auto-assign `priority:normal` (can be changed)
- **B**: Leave unset; let triage workflow assign
- **C**: Assign based on branch type (e.g., `hotfix/` → `priority:critical`)

### 5. **Issue Template Rationalization**
Which templates should we consolidate or remove?
- **Examples**: Should `maintenance/` issue type exist, or use `type:task` instead?
- Should `support/` / `help/` / `question/` be separate or use `type:question`?
- Should we keep `story/` or merge into `feature/`?

### 6. **OpenSpec Label Simplification**
Do you agree to simplify OpenSpec labels from 12 to 6?
- **Keep**: `openspec:status/discovery`, `/planning`, `/implementation`, `/testing`, `/production`, `/deprecated`
- **Deprecate**: Specification/implementation workflow labels (use `status:*` instead)
- **Remove or alias**: Any others?

---

## Completion Summary ✅

**All work completed in single session on 2026-09-04.**

### Changes Implemented

1. **Labels** (`.github/labels.yml`):
   - ✅ Added 4 new area labels: `area:playwright`, `area:jest`, `area:phpunit`, `area:pagespeed`
   - ✅ Deprecated `type:integration` (consolidated into `area:integration`)
   - ✅ Removed 6 OpenSpec workflow labels (specification/implementation)
   - ✅ Kept all 6 OpenSpec phase labels

2. **Issue Templates** (.github/ISSUE_TEMPLATE/):
   - ✅ Deleted: `06-story.md` (merged into feature)
   - ✅ Created: `06-question.md`
   - ✅ Result: 25 templates

3. **PR Templates** (.github/PULL_REQUEST_TEMPLATE/):
   - ✅ Enriched all 14 PR templates with default labels across type, status, priority, area, meta families
   - ✅ Added `recommended_issue_type` field to each template for two-way mapping
   - ✅ Example: `pr_bug.md` now seeds [type:bug, status:needs-review, priority:normal, area:core, meta:needs-changelog]
  - ✅ Updated the accessibility template to use the canonical `priority:important` label

4. **Configuration** (.github/):
   - ✅ Updated `labeler.yml`: Split build/ci, added type mappings, new area label rules, priority automation
   - ✅ Updated `label-governance-policy.yml`: Added new labels to never_delete list

5. **Documentation** (docs/):
   - ✅ Updated `BRANCHING_STRATEGY.md` section 4.3: Added default labels table, recommended issue types, two-way mapping
   - ✅ Updated `BRANCHING_STRATEGY.md` section 5.1: Documented labeler automation, new area labels
   - ✅ Updated `BRANCHING_STRATEGY.md` section 5.2: Created Issue Type → Project Type mapping table
   - ✅ Created `ISSUE_PR_TITLE_GOVERNANCE.md`: Title format standards, examples, scope guidance, automation rules

### User Decisions Applied

| Decision | User Answer | Implementation |
|----------|-------------|-----------------|
| Story issue type | B (Replace with type:ci) | Deleted story template; `ci/` branch maps to `pr_ci.md`, type:ci label |
| Improve vs Enhance | C (Keep both with distinct meanings) | Both `type:improve` and `type:enhancement` retained; distinct use cases |
| Default area label | C (Auto-assign via labeler.yml rules) | Added file path patterns to labeler.yml (tests/ → area:testing, etc.) |
| Default priority label | C (Assign by branch type) | Configured: hotfix/security→critical, a11y→important, others→normal
| Consolidate issue templates | maintenance→task, help→question, story→feature | Deleted 3 templates, created 1; now 23 templates total |
| Simplify OpenSpec labels | Keep 6 phase labels, deprecate 6 workflow labels | Reduced 12 labels to 6; use standard status:* for workflow state |

### Deliverables

- ✅ Planning Analysis Document (`.github/projects/active/issue-and-pr-template-improvements/PLANNING_ANALYSIS.md`)
- ✅ Implementation Commit (97e4eaee) with 26 files changed
- ✅ All changes pushed to `chore/session-516uxx` branch
- ✅ Ready for PR review and merge

---

## Next Steps (Blocked on User Answers)

1. **Clarify story issue type** → Delete story template OR create story-to-task/feature mapping
2. **Consolidate type:improve** → Remove `type:improve` from labels.yml; update all issue templates
3. **Audit issue templates** → Map each to one of 19 PR templates
4. **Update PR templates** → Add more label families (area, priority, meta)
5. **Update labeler.yml** → Reflect branch-to-label mappings for new labels
6. **Simplify openspec labels** → Update labels.yml; document in strategy guide
7. **Add new area labels** → Update labels.yml with colours
8. **Document title governance** → Create new docs/ISSUE_PR_TITLE_GOVERNANCE.md
9. **Update BRANCHING_STRATEGY.md** → Sections 4.3, 5.1, 5.2 with latest decisions
10. **Commit & merge** → Create PR with all changes

---

## References
- `.github/labels.yml` — Canonical label definitions
- `.github/label-governance-policy.yml` — Governance rules
- `.github/labeler.yml` — Branch/file-to-label mappings
- `docs/BRANCHING_STRATEGY.md` — Branch naming and automation
- `.github/ISSUE_TEMPLATE/*.md` — Issue templates (26 total)
- `.github/PULL_REQUEST_TEMPLATE/*.md` — PR templates (19 total)
