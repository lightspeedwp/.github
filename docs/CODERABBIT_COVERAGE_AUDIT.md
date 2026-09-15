# CodeRabbit Configuration Coverage Audit Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Purpose:** Enable maintainers to verify `.coderabbit.yml` review instruction coverage completeness and identify gaps where file types may be under-reviewed.

**Last Updated:** 2026-09-14

---

## Quick Reference

This guide provides step-by-step procedures for auditing CodeRabbit configuration coverage across the organisation. Use this to verify that critical file types have appropriate review instructions and identify gaps.

---

## Audit Checklist

### 1. Coverage Inventory (Baseline)

**Objective:** Map all file types in the repository against defined path patterns.

**Steps:**

1. Extract all unique file types from your repository:

   ```bash
   find . -type f ! -path '*/node_modules/*' ! -path '*/.git/*' -name '*.*' | sed 's/.*\.//' | sort | uniq -c | sort -rn
   ```

2. For each file type found, note:
   - File extension or pattern (e.g., `*.md`, `*.yml`, `*.js`)
   - Primary directory/context (e.g., `.github/workflows`, `src/`, `docs/`)
   - Count of files (rough estimate)
   - Current criticality (critical/high/medium/low)

3. Document in a local audit spreadsheet for traceability.

**Example Output:**

| File Type | Pattern | Directory | Count | Criticality |
|-----------|---------|-----------|-------|-------------|
| `.yml` | `**/*.yml` | `.github/workflows` | 18 | Critical |
| `.md` | `**/*.md` | `docs/`, `.specify/` | 45 | High |
| `.js` | `**/*.js` | `src/`, `agents/` | 120 | High |
| `.json` | `**/*.json` | `.github/`, `scripts/` | 25 | Medium |

---

### 2. Pattern Matching Verification

**Objective:** Confirm all file types are matched by at least one path pattern in `.coderabbit.yml`.

**Steps:**

1. Open `.coderabbit.yml` and extract all `path_instructions` patterns:

   ```bash
   grep -E '^\s+-\s+"' .coderabbit.yml | sed 's/.*"\(.*\)".*/\1/' | sort
   ```

2. For each file type from your inventory:
   - Check if a pattern exists in `.coderabbit.yml`
   - Verify the pattern has `instructions:` field with content
   - Note the priority level (90-100 exact, 70-89 specific, 50-69 type, 1-49 general)

3. Identify **unmatched file types** (coverage gaps):
   - These fall back to catch-all pattern `**/*` (priority 1-49)
   - Catch-all provides universal guidance; consider if specific guidance is needed

**Pattern Priority Reference:**

```
90-100: Exact paths (agents/agent.md, .github/workflows/*.yml)
70-89:  Specific directories (.github/**/, agents/**/*, **/.github/**/*)
50-69:  Type-in-DIR patterns (**/*.js, **/*.md, **/scripts/**/*)
1-49:   General patterns (**/*.{extension}, **/*)
```

**Coverage Scoring:**

- **90-100 Priority:** Critical file with specific, precise guidance → 100% weight
- **70-89 Priority:** Important directory/file type with specific guidance → 80% weight
- **50-69 Priority:** Language/type-specific with targeted guidance → 60% weight
- **1-49 Priority:** General or catch-all guidance → 20% weight

**Calculation:** Coverage % = (Sum of (Count × Weight) / Total Files) × 100

**Target:** 95%+ coverage (SC-001)

---

### 3. Instruction Block Validation

**Objective:** Ensure each path pattern has sufficient, actionable guidance.

**Steps:**

1. For each high-criticality file type (Critical/High):
   - Locate its path pattern in `.coderabbit.yml`
   - Extract the `instructions` field
   - Verify it contains:
     - ✅ Description (1-2 sentences explaining the file type's role)
     - ✅ Review focus areas (3+ specific, testable areas per SC-002)
     - ✅ Specific checks (actionable items CodeRabbit should verify)
     - ✅ References (links to related standards/docs)

2. Check for **instruction quality**:
   - Language is technology-agnostic (no framework/language specifics)
   - Tone is clear and directive
   - Checks are testable/measurable

3. Flag **instruction gaps** (missing critical content):
   - Vague descriptions ("make sure it's good")
   - Fewer than 3 review focus areas
   - Non-testable or unmeasurable checks

**Example Quality Checklist:**

| Element | Present | Notes |
|---------|---------|-------|
| Description | ✅ | Clear, concise |
| Focus Area 1 | ✅ | Testable |
| Focus Area 2 | ✅ | Testable |
| Focus Area 3 | ✅ | Testable |
| Specific Checks | ✅ | 5+ checks provided |
| References | ✅ | Links to standards |
| Tech-Agnostic | ✅ | No framework specifics |

---

### 4. Branch-Type Context Coverage

**Objective:** Verify branch-type-specific review context is documented and applied.

**Steps:**

1. Consult `docs/BRANCHING_STRATEGY.md` section 5.3 for branch types.

2. For each of the top 15 branch types documented:
   - `feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `task/`, `docs/`, `test/`, `perf/`, `ci/`, `security/`, `design/`, `a11y/`, `ops/`
   - Verify review focus areas and critical checks are defined
   - Check if they're referenced in `.coderabbit.yml` or path instructions

3. Verify branch context **doesn't duplicate** path pattern guidance:
   - Path pattern priority takes precedence (FR-014)
   - Branch context provides supplementary emphasis (FR-006)
   - No conflicting guidance between path and branch contexts

**Expected Result:** 15+ branch types with clear review context (SC-011)

---

### 5. Technology-Agnostic Guidance Validation

**Objective:** Ensure instruction blocks use universal principles, not framework/language specifics.

**Process:**

1. Sample 20-30 instruction blocks from `.coderabbit.yml`.

2. For each, scan for:
   - ✅ **Allowed:** "error handling", "security", "performance", "accessibility", "correctness", "testing"
   - ❌ **Forbidden:** Language-specific (async/await, promises, PHP hooks), framework-specific (React, Django, WordPress), library-specific (lodash, numpy)

3. Count violations:
   - 0 violations: ✅ PASS
   - 1-3 violations: ⚠️ MINOR (document and fix)
   - 4+ violations: ❌ FAIL (requires rework)

4. Document any violations for remediation.

**Example Violations:**

| Violation | Type | Fix |
|-----------|------|-----|
| "Use WordPress hooks" | Framework-specific | Change to "Ensure proper integration points" |
| "Async/await pattern" | Language-specific | Change to "Asynchronous operations" |
| "Use lodash utilities" | Library-specific | Change to "Utility function composition" |

---

### 6. Edge Case & Fallback Verification

**Objective:** Confirm catch-all pattern and edge cases are properly handled.

**Steps:**

1. Verify catch-all pattern exists in `.coderabbit.yml`:
   - Pattern: `**/*`
   - Priority: 1-49 (general)
   - Instructions: Present with universal guidance

2. Test fallback behavior:
   - Create a test file with unusual extension (e.g., `.xyz`)
   - Confirm it matches catch-all pattern
   - Verify CodeRabbit applies fallback guidance

3. Document edge cases:
   - Files with no extension (e.g., `Makefile`, `LICENSE`)
   - Nested `.github/` directories in sub-repositories
   - Binary files (should be excluded by path_filters)

**Expected Result:** All files receive at least fallback guidance (SC-001)

---

### 7. Priority Conflict Resolution Audit

**Objective:** Verify path pattern priority rules are applied deterministically.

**Steps:**

1. Identify files matching multiple patterns:
   - Example: `.github/workflows/ci.yml` matches both:
     - `.github/workflows/*.yml` (priority 90, specific)
     - `**/*.yml` (priority 50, type-in-dir)
     - `**/*` (priority 1, catch-all)

2. Confirm highest-priority pattern is applied:
   - `.github/workflows/*.yml` (priority 90) wins → most specific guidance
   - `.github/workflows/*.yml` takes precedence over `**/*.yml`

3. Document any ambiguous cases:
   - Multiple patterns at same priority level
   - Patterns with overlapping scope

4. Verify pattern documentation is clear:
   - Comments explain priority selection
   - No manual overrides or special cases

**Expected Result:** Priority rules documented and applied consistently (SC-012, FR-014)

---

### 8. Coverage Gap Analysis

**Objective:** Summarize findings and identify action items.

**Process:**

1. Compile results from sections 1-7:
   - File type coverage percentage (Section 2)
   - Instruction quality gaps (Section 3)
   - Branch type completeness (Section 4)
   - Tech-agnosticism violations (Section 5)
   - Edge case handling (Section 6)
   - Priority conflicts (Section 7)

2. Create gap summary:

| Category | Status | Gaps | Priority |
|----------|--------|------|----------|
| File Type Coverage | 94% | 3 file types | High |
| Instruction Quality | 87% | 8 blocks need detail | Medium |
| Branch Types | 15/15 | None | Complete |
| Tech-Agnosticism | 98% | 2 violations | Low |
| Fallback Handling | 100% | None | Complete |
| Priority Conflicts | 100% | None | Complete |

1. Prioritize remediation:
   - **Critical:** Coverage <95% or instruction quality <85%
   - **High:** Tech-agnosticism violations or priority conflicts
   - **Medium:** Branch type gaps or minor instruction gaps
   - **Low:** Documentation or formatting improvements

---

### 9. Maintenance Schedule

**Recommended Cadence:**

- **Monthly:** Quick coverage check (Section 1-2, ~15 min)
- **Quarterly:** Full audit (Sections 1-8, ~1-2 hours)
- **After Major Changes:** Complete re-audit following `.coderabbit.yml` updates

**Trigger Points (Always Audit):**

- Adding 10+ new files to any directory
- New branch type or project structure
- CodeRabbit review quality feedback (e.g., "not reviewing this file type")
- Organizational technology stack changes

---

### 10. Action Item Template

**For documenting gaps and remediation:**

```markdown
## Gap: [File Type/Branch Type/Pattern]

**Status:** [Open/In Progress/Resolved]

**Description:** 
- What's missing or wrong
- Impact on review quality
- Why it matters

**Remediation:**
- Specific action to take
- Files to modify
- Validation steps

**Owner:** [Name]
**Due Date:** [Date]
**Priority:** [Critical/High/Medium/Low]

**Notes:**
- Related issues/PRs
- Dependencies
- Testing approach
```

---

## Quick Audit Summary Template

Use this template to record audit results:

```
# CodeRabbit Configuration Audit — [Date]

**Auditor:** [Name]
**Repository:** lightspeedwp/.github
**Config Version:** [Commit/Tag]

## Coverage Summary

- **File Type Coverage:** [X]% ([Y] file types mapped / [Z] total types)
- **Instruction Quality:** [A]% ([B] blocks at target quality)
- **Branch Type Completeness:** [C]/15 types
- **Tech-Agnosticism Score:** [D]%
- **Fallback Coverage:** [E]%
- **Priority Conflicts:** [F]

## Critical Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| [Gap 1] | [Impact] | [Priority] |
| [Gap 2] | [Impact] | [Priority] |

## Remediation Plan

1. [Action 1] — Due: [Date]
2. [Action 2] — Due: [Date]
3. [Action 3] — Due: [Date]

## Next Audit Date

[Date + 3 months]

**Sign-off:** [Auditor Name]
```

---

## References

- `.coderabbit.yml` — Configuration file (source of truth)
- `docs/BRANCHING_STRATEGY.md` § 5.3 — Branch-type review context
- `plan.md` — Implementation plan and outcomes
- `spec.md` — Feature specification and success criteria
- `CLAUDE.md` — Repository conventions and standards
- `AGENTS.md` — Organisational AI rules and guidance

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
