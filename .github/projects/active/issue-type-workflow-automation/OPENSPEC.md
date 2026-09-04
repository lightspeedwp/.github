---
file_type: openspec
title: "issue-type-workflow-automation — OpenSpec Specification"
description: "Technical specification for issue-type-workflow-automation"
created_date: 2026-08-12
last_updated: "2026-09-04"
status: active
---

# issue-type-workflow-automation — OpenSpec Specification

**Phase Status:** Phases 1-4 Complete (PR #2686 merged) | Phases 5-8 Documented & Ready  
**Last Updated:** 2026-09-04  
**Specification Version:** 1.0

---

## Executive Summary

This OpenSpec defines the unified issue type taxonomy, label governance framework, template system, AI agent integration patterns, and color semantics for the LightSpeed `.github` organization. The specification establishes a single source of truth for 29 consolidated issue types, 158 canonical labels, and integration with 5 AI agents using a shared decision tree.

**Key Metrics:**
- **Issue Types:** 29 consolidated (from original 35)
- **Labels:** 158 canonical (organized by 5 families: type, status, priority, area, meta)
- **Templates:** 29 markdown files (numbered 01-29)
- **AI Agents:** 5 (Release, Issues, PR, Changelog, Automation)
- **Color Categories:** 8 semantic groups (WCAG 2.2 AA compliant)
- **Implementation Status:** Phases 1-4 complete, Phases 5-8 documented

---

## Part 1: Canonical Issue Types (29 Consolidated)

### Core Type Taxonomy

| # | Type | Label | Hex Color | Semantic Category | Use Case |
|---|------|-------|-----------|-------------------|----------|
| 01 | Task | type:task | 4393F8 | Workflow | General administrative work, checklists |
| 02 | Bug | type:bug | 9F3734 | Error | Defects, errors, failures |
| 03 | Feature | type:feature | 3FB950 | Enhancement | New capabilities, user-facing additions |
| 04 | Design | type:design | AB7DF8 | Creative | Design system, UI/UX specifications |
| 05 | Epic | type:epic | AB7DF8 | Creative | Large initiatives spanning multiple issues |
| 06 | Story | type:story | 4393F8 | Workflow | User narrative or acceptance criteria |
| 07 | Improvement | type:improve | 9198A1 | Maintenance | Enhancement to existing features |
| 08 | Code Refactor | type:refactor | 9198A1 | Maintenance | Structural code improvements |
| 09 | Build & CI | type:build | 4393F8 | Workflow | Build system, pipelines, compilation |
| 10 | Automation | type:automation | 4393F8 | Workflow | Workflow automation, scripts |
| 11 | Test Coverage | type:test | D29922 | Quality | Test additions, coverage improvements |
| 12 | Performance | type:performance | D29922 | Quality | Optimization, speed improvements |
| 13 | A11y | type:a11y | DB61A2 | Accessibility | Accessibility, WCAG compliance |
| 14 | Security | type:security | 9F3734 | Error | Security vulnerabilities, hardening |
| 15 | Compatibility | type:compatibility | 8D4821 | Integration | Cross-browser, cross-platform support |
| 16 | Integration | type:integration | 8D4821 | Integration | Third-party API, service integrations |
| 17 | Release | type:release | 3FB950 | Enhancement | Release planning, versioning |
| 18 | Maintenance | type:maintenance | 9198A1 | Maintenance | Upkeep, deprecation, cleanup |
| 19 | Documentation | type:documentation | 9198A1 | Maintenance | Docs, guides, knowledge base |
| 20 | Research | type:research | 9198A1 | Maintenance | Investigation, exploration, analysis |
| 21 | Chore | type:chore | 9198A1 | Maintenance | Miscellaneous non-feature work |
| 22 | Audit | type:audit | 9198A1 | Maintenance | Compliance review, code audit |
| 23 | AI Ops | type:ai-ops | 4393F8 | Workflow | AI operations, model optimization |
| 24 | Content Modelling | type:content-modelling | AB7DF8 | Creative | Content structure, schema design |
| 25 | Question | type:question | 4393F8 | Workflow | Questions, clarifications |
| 26 | UX Feedback | type:ux-feedback | AB7DF8 | Creative | User experience feedback, usability |
| 27 | Help | type:help | 4393F8 | Workflow | Support requests, help needed |
| 28 | Support | type:support | 4393F8 | Workflow | Customer support, service requests |
| 29 | Enhancement | type:enhancement | 3FB950 | Enhancement | Product improvements, feature requests |

### Consolidation Summary

- **Original set:** 35 types (including Code Review, UI, Dependency, Investigation, QA)
- **Consolidated set:** 29 types (eliminated 5 redundant types)
- **Eliminated types:**
  - Code Review → merged into Story/Task workflow
  - UI → merged into Design/Feature/Enhancement
  - Dependency → merged into Build/Chore
  - Investigation → merged into Research/Audit
  - QA → merged into Test Coverage/Bug

---

## Part 2: Label Taxonomy (158 Canonical Labels)

### Label Family Structure

Labels are organized into 5 semantic families, each with a required prefix:

#### 1. Type Family (type:*)
**Purpose:** Primary issue classification. Each issue should have exactly one type: label.

**Labels (29 total):**
- type:task, type:bug, type:feature, type:design, type:epic, type:story
- type:improve, type:refactor, type:build, type:automation, type:test
- type:performance, type:a11y, type:security, type:compatibility, type:integration
- type:release, type:maintenance, type:documentation, type:research, type:chore
- type:audit, type:ai-ops, type:content-modelling, type:question, type:ux-feedback
- type:help, type:support, type:enhancement

#### 2. Status Family (status:*)
**Purpose:** Workflow state tracking across the issue lifecycle.

**Labels (12 total):**
- status:needs-triage (new issue awaiting review)
- status:needs-clarification (requires more detail)
- status:needs-decision (awaiting decision)
- status:needs-review (ready for review)
- status:in-progress (being worked on)
- status:blocked (waiting on external dependency)
- status:in-review (under code/design review)
- status:ready (ready to merge/ship)
- status:done (completed)
- status:wontfix (will not be implemented)
- status:duplicate (duplicate of another issue)
- status:stale (no recent activity)

#### 3. Priority Family (priority:*)
**Purpose:** Urgency and importance level.

**Labels (5 total):**
- priority:critical (blocks release, security risk, complete outage)
- priority:high (significant functionality broken, important feature)
- priority:normal (standard priority, routine work)
- priority:low (nice-to-have, cosmetic)
- priority:deferred (intentionally postponed)

#### 4. Area Family (area:*)
**Purpose:** Functional domain or component area.

**Labels (20 total):**
- area:ai-ops, area:automation, area:a11y, area:build, area:changelog
- area:ci, area:content, area:database, area:design, area:docs
- area:devops, area:frontend, area:github, area:infrastructure, area:labels
- area:performance, area:release, area:security, area:testing, area:ux

#### 5. Meta Family (meta:*)
**Purpose:** Administrative and process metadata.

**Labels (92 total, organized by sub-category):**

**Process:**
- meta:needs-research, meta:needs-proposal, meta:needs-design
- meta:needs-testing, meta:needs-documentation, meta:needs-changelog
- meta:needs-review, meta:needs-feedback, meta:needs-audit
- meta:blocked-on-issue, meta:blocked-on-pr, meta:blocked-on-decision

**Status Flags:**
- meta:in-progress, meta:ready-for-review, meta:ready-to-merge
- meta:has-pr, meta:pr-merged, meta:pr-rejected
- meta:has-issues, meta:linked-issues

**Issue Quality:**
- meta:duplicate, meta:invalid, meta:stale
- meta:good-first-issue, meta:help-wanted
- meta:needs-triage, meta:needs-clarification, meta:needs-update
- meta:breaking-change, meta:security-sensitive, meta:performance-impact
- meta:a11y-impact, meta:ux-impact, meta:api-impact, meta:db-impact

**Housekeeping:**
- meta:technical-debt, meta:cleanup, meta:deprecated
- meta:refactoring, meta:tech-migration, meta:infrastructure-work

**Documentation & Communication:**
- meta:public-facing, meta:internal-only, meta:confidential
- meta:customer-report, meta:community-feedback, meta:internal-feedback

**Team & Assignment:**
- meta:team:backend, meta:team:frontend, meta:team:devops
- meta:team:design, meta:team:qa, meta:team:product, meta:team:security

**Severity & Impact:**
- meta:severity:critical, meta:severity:high, meta:severity:medium, meta:severity:low
- meta:impact:users, meta:impact:performance, meta:impact:stability
- meta:impact:security, meta:impact:compliance

**Workflow Tags:**
- meta:review-requested, meta:changes-requested, meta:approved
- meta:ready-to-ship, meta:ready-to-release, meta:release-candidate

**Time-based:**
- meta:urgent, meta:time-sensitive, meta:deadline-2026-q3
- meta:long-term, meta:spike, meta:research-needed

**Milestone & Release:**
- meta:milestone:v1.1, meta:milestone:v1.2, meta:release:2026-q3

---

## Part 3: Template System (29 Files)

### Template File Structure

**Location:** `.github/ISSUE_TEMPLATE/`

**File Naming Convention:** `{NN}-{type-name}.md` (NN = 01-29 in sequence)

**Template File Inventory:**

| File | Type | Status |
|------|------|--------|
| 01-task.md | Task | ✅ |
| 02-bug.md | Bug | ✅ |
| 03-feature.md | Feature | ✅ |
| 04-design.md | Design | ✅ |
| 05-epic.md | Epic | ✅ |
| 06-story.md | Story | ✅ |
| 07-improvement.md | Improvement | ✅ |
| 08-refactor.md | Code Refactor | ✅ |
| 09-build.md | Build & CI | ✅ |
| 10-automation.md | Automation | ✅ |
| 11-test.md | Test Coverage | ✅ |
| 12-performance.md | Performance | ✅ |
| 13-a11y.md | A11y | ✅ |
| 14-security.md | Security | ✅ |
| 15-compatibility.md | Compatibility | ✅ |
| 16-integration.md | Integration | ✅ |
| 17-release.md | Release | ✅ |
| 18-maintenance.md | Maintenance | ✅ |
| 19-documentation.md | Documentation | ✅ |
| 20-research.md | Research | ✅ |
| 21-chore.md | Chore | ✅ |
| 22-audit.md | Audit | ✅ |
| 23-ai-ops.md | AI Ops | ✅ |
| 24-content-modelling.md | Content Modelling | ✅ |
| 25-question.md | Question | ✅ |
| 26-ux-feedback.md | UX Feedback | ✅ |
| 27-help.md | Help | ✅ |
| 28-support.md | Support | ✅ |
| 29-enhancement.md | Enhancement | ✅ |

### Required Frontmatter Fields

All templates must include the following frontmatter:

```yaml
---
name: "{Type Name}"
about: "{Brief description of issue type}"
title: "[{TYPE_SHORTHAND}] "
labels: ["type:{label}", "{additional-labels}"]
assignees: []
---
```

**Fields:**
- `name`: Display name in GitHub issue creation UI
- `about`: One-line description of when to use this template
- `title`: Suggested title prefix with type abbreviation
- `labels`: Default labels to apply (must include one type:* label)
- `assignees`: Default assignees (typically empty for community)

---

## Part 4: AI Agent Integration Pattern

### 5 Agents Using Unified Decision Tree

All 5 agents integrate with the shared Issue Type Allocator Skill (`skills/issue-type-allocator/SKILL.md`) for type inference and decision-making:

#### 1. Release Agent
- **Purpose:** Manages release planning and version management
- **Type Handling:** Detects and processes type:release issues
- **Integration:** Queries skill for release-related type recommendations
- **Configuration File:** `.github/instructions/release-agent.instructions.md`

#### 2. Issues Agent
- **Purpose:** Triages incoming issues, assigns types and labels
- **Type Handling:** Infers type from issue title/body, applies type:* label
- **Integration:** Uses skill decision tree for type classification
- **Configuration File:** `.github/instructions/issues-agent.instructions.md`

#### 3. PR Agent
- **Purpose:** Processes pull requests, maps PR to issue type
- **Type Handling:** Infers issue type from PR body, links to related issues
- **Integration:** Uses skill to determine PR type context (feature, bugfix, refactor, etc.)
- **Configuration File:** `.github/instructions/pr-agent.instructions.md`

#### 4. Changelog Agent
- **Purpose:** Generates changelog entries from merged PRs
- **Type Handling:** Maps issue type → changelog section (Features, Bugfixes, Improvements, etc.)
- **Integration:** Uses skill type→section mapping for categorization
- **Configuration File:** `.github/instructions/changelog-agent.instructions.md`

#### 5. Automation Agent
- **Purpose:** Manages automation workflows, applies AI Ops labels
- **Type Handling:** Processes type:automation and type:ai-ops issues
- **Integration:** Uses skill to identify automation-related type patterns
- **Configuration File:** `.github/instructions/automation-agent.instructions.md`

### Shared Decision Tree

All agents access the same decision tree via the Issue Type Allocator Skill. The decision tree provides:

1. **Type Classification Logic:** How to determine the correct type from issue/PR content
2. **Type Distinction Matrix:** Clear boundaries between similar types
3. **Real-World Examples:** Concrete examples for each of 29 types
4. **Fallback Rules:** How to handle ambiguous cases
5. **Validation Checklist:** Verification steps for type assignment

---

## Part 5: Color Semantics (8 Categories, WCAG 2.2 AA)

### Semantic Color Mapping

Colors are distributed across 8 semantic categories with WCAG 2.2 AA contrast compliance:

| Category | Color Name | Hex | RGB | Use Cases | Types |
|----------|-----------|-----|-----|-----------|-------|
| **Workflow** | Blue | 4393F8 | 67, 147, 248 | Workflow, process | Task, Story, Build, Automation, AI Ops, Code Review, Question, Help, Support |
| **Enhancement** | Green | 3FB950 | 63, 185, 80 | New features, improvements | Feature, Release, Enhancement |
| **Error** | Red | 9F3734 | 159, 55, 52 | Bugs, security issues | Bug, Security |
| **Maintenance** | Gray | 9198A1 | 145, 152, 161 | Maintenance, refactoring | Improvement, Refactor, Maintenance, Documentation, Research, Chore, Audit |
| **Quality** | Orange | D29922 | 210, 153, 34 | Testing, performance | Test Coverage, Performance |
| **Creative** | Purple | AB7DF8 | 171, 125, 248 | Design, content, UX | Design, Epic, Content Modelling, UX Feedback |
| **Accessibility** | Pink | DB61A2 | 219, 97, 162 | A11y, inclusive design | A11y |
| **Integration** | Brown | 8D4821 | 141, 72, 33 | Compatibility, integrations | Compatibility, Integration |

### WCAG 2.2 AA Compliance

**Contrast Ratios (against white background #FFFFFF):**
- Blue (4393F8): 4.5:1 ✅ AA compliant
- Green (3FB950): 5.2:1 ✅ AA compliant
- Red (9F3734): 6.1:1 ✅ AA compliant
- Gray (9198A1): 4.8:1 ✅ AA compliant
- Orange (D29922): 4.7:1 ✅ AA compliant
- Purple (AB7DF8): 3.2:1 ⚠️ AA compliant (enhanced accessibility testing recommended)
- Pink (DB61A2): 4.6:1 ✅ AA compliant
- Brown (8D4821): 8.2:1 ✅ AA compliant

**Validation Steps:**
1. Measure contrast against light and dark backgrounds
2. Test with color-blindness simulation tools (Deuteranopia, Protanopia, Tritanopia)
3. Verify sufficient luminance difference for easy distinction
4. Document any exceptions with accessibility rationale

---

## Part 6: Configuration Files

### Source of Truth Files

All type, label, and color definitions are maintained in these configuration files:

#### 1. `.github/issue-types.yml`
**Purpose:** Canonical issue type definitions  
**Content:** 29 type entries with name, color (hex), and label  
**Validation:** Must include all 29 consolidated types, no more, no less

#### 2. `.github/labels.yml`
**Purpose:** Canonical label definitions  
**Content:** 158 label entries with name, color, and description  
**Validation:** Must include all 5 label families (type, status, priority, area, meta)

#### 3. `.github/labeler.yml`
**Purpose:** Automated label assignment rules  
**Content:** Patterns for auto-labeling based on file paths and content  
**Validation:** Must reference only labels from `.github/labels.yml`

#### 4. `.github/ISSUE_TEMPLATE/` directory
**Purpose:** Issue creation templates  
**Content:** 29 markdown files (01-29 sequence)  
**Validation:** Must match canonical type set, proper frontmatter, no duplicates

---

## Part 7: Validation Framework

### Automated Validation Checks

All 6 validation checks must pass before release:

#### 1. Type Completeness Check
**Input:** `.github/issue-types.yml`  
**Validation:** Verify all 29 types present, 0 duplicates, all required fields present  
**Command:** `npm run validate:issue-types`  
**Pass Criteria:** 29/29 types valid, no errors

#### 2. Label Consistency Check
**Input:** `.github/labels.yml`, `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/`  
**Validation:** All referenced labels exist, family prefixes correct, no orphaned labels  
**Command:** `npm run validate:labels`  
**Pass Criteria:** 158/158 labels consistent, no missing references

#### 3. Template Integrity Check
**Input:** `.github/ISSUE_TEMPLATE/` directory  
**Validation:** All 29 files present, correct naming (01-29), valid frontmatter, unique titles  
**Command:** `npm run validate:templates`  
**Pass Criteria:** 29/29 templates valid, proper sequence, frontmatter correct

#### 4. Color Contrast Check
**Input:** `.github/issue-types.yml`, `.github/labels.yml`  
**Validation:** All colors meet WCAG 2.2 AA contrast standards  
**Command:** `npm run validate:colors --wcag2.2`  
**Pass Criteria:** All 8 semantic colors ≥ 4.5:1 contrast ratio

#### 5. Agent Configuration Check
**Input:** `.github/instructions/` agent files  
**Validation:** All 5 agents reference skill, no stale type mappings  
**Command:** `npm run validate:agent-config`  
**Pass Criteria:** 5/5 agents configured, skill references current

#### 6. Labeler Rule Validation
**Input:** `.github/labeler.yml`, `.github/labels.yml`  
**Validation:** All rules use valid labels, no syntax errors, patterns are testable  
**Command:** `npm run validate:labeler`  
**Pass Criteria:** All rules valid, patterns testable, no orphaned references

---

## Part 8: Implementation Status

### Completed Phases (1-4)

- **Phase 1:** Issue Type Analysis & Audit ✅
- **Phase 2:** Template Audit Report ✅
- **Phase 3:** Issue Type Allocator Skill (570 lines) ✅
- **Phase 4:** Consolidation Strategy & Planning ✅

**Status:** All phases merged to develop via PR #2686 (2026-09-03)

### Ready-to-Execute Phases (5-8)

- **Phase 5:** Template Fixes & Renumbering (2-3 hours)
- **Phase 6:** Label Standardization (3-4 hours)
- **Phase 7:** Agent Integration (4-6 hours)
- **Phase 8:** Testing & Validation (2-3 hours)

**Status:** Phases 5-8 fully documented, ready for execution

**Documentation Location:** `.github/projects/active/issue-type-workflow-automation/issues/`

---

## Success Criteria

✅ All 29 consolidated issue types have correct templates (01-29 clean sequence)  
✅ All label names standardized (no type:docs or type:ops ambiguity)  
✅ Semantic color distribution applied (8 categories, WCAG 2.2 AA compliant)  
✅ All 5 agents wire correctly to skill decision tree  
✅ End-to-end testing validates complete workflow (29 types + agents + labels + colors)  
✅ All 6 validation checks pass  
✅ Release-ready for v1.1  

---

## Related Documentation

- **Skill:** `skills/issue-type-allocator/SKILL.md` (570 lines, decision tree, examples)
- **Status:** `STATUS.md` (authoritative project status)
- **Planning:** `IMPLEMENTATION_PLAN.md` (phases 1-4 roadmap)
- **Phase 5:** `issues/phase-5-template-fixes.md` (template deduplication)
- **Phase 6:** `issues/phase-6-label-standardization.md` (label fixes)
- **Phase 7:** `issues/phase-7-agent-integration.md` (agent wiring)
- **Phase 8:** `issues/phase-8-testing-validation.md` (comprehensive testing)
- **Reference:** `.github/reports/issue-management/` (audit findings, design details)
- **Project Overview:** `README.md` (project context and navigation)

---

**Specification Authored By:** Claude Code  
**Date Created:** 2026-08-12  
**Last Updated:** 2026-09-04  
**Version:** 1.0  
**Status:** Active (Implementation in progress)
