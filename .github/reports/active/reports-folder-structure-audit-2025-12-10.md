# Reports Folder Structure Audit

**Date:** 2025-12-10
**Type:** Analysis Report
**Status:** Complete

## Executive Summary

Audited the `.githu./.github/reports/` folder structure and found **significant inconsistencies** between the actual folder structure and documentation across multiple instruction files and agent specifications.

## Current Actual Structure

```
.githu./.github/reports/
├── analysis/
├── audits/
├── implementation/
├── migration/
└── validation/
```

## Contradictions Found

### 1. file-output-organization.instructions.md

**Location:** [.github/instructions/file-output-organization.instructions.md](.github/instructions/file-output-organization.instructions.md:49-58)

**Suggested Structure (lines 49-58):**

- `audits/` (plural) ✅ **Matches actual: `audits/`**
- `optimisation/` ❌ **Missing from actual structure**
- `labeling/` ❌ **Missing from actual structure**
- `metrics/` ❌ **Missing from actual structure**
- `validation/` ✅ **Matches**

### 2. reporting.agent.md

**Location:** [.github/agents/reporting.agent.md](.github/agents/reporting.agent.md:144-150)

**Suggested Categories (lines 144-150):**

- `agents/` ❌ **Missing from actual structure**
- `linting/` ❌ **Missing from actual structure**
- `labeling/` ❌ **Missing from actual structure**
- `frontmatter/` ❌ **Missing from actual structure**
- `coverage/` ❌ **Missing from actual structure**
- `meta/` ❌ **Missing from actual structure**
- `issue-metrics/` ❌ **Missing from actual structure**

### 3. Previous README.md

**Previous Structure (before update):**

- `audits/` (plural) ✅ **Matches actual: `audits/`**
- `optimisation/` ❌ **Missing from actual**
- `labeling/` ❌ **Missing from actual**
- `metrics/` ❌ **Missing from actual**
- `validation/` ✅ **Matched**

### 4. Actual Folders Not Documented Anywhere

These folders exist but were **not mentioned** in any documentation:

- `analysis/` ⚠️ **Undocumented**
- `implementation/` ⚠️ **Undocumented**
- `migration/` ⚠️ **Undocumented**

## Consolidation Strategy

### Recommended Unified Structure

Combined all use cases from different sources into a comprehensive structure:

```
.githu./.github/reports/
├── analysis/        # Code analysis, technical audits, investigation reports
├── audits/          # Formal compliance audits, system-wide checks (plural)
├── implementation/  # Implementation tracking, completion summaries
├── migration/       # Migration reports, data transfers, transitions
├── validation/      # Schema/config validation, compliance reports
├── agents/          # Agent execution reports, performance logs
├── coverage/        # Test coverage reports, quality metrics
├── frontmatter/     # Frontmatter-specific validation and compliance
├── issue-metrics/   # GitHub issue analytics, metrics, trends
├── labeling/        # Label automation reports, sync logs
├── linting/         # ESLint baselines, code quality reports
├── meta/            # Documentation metadata (badges, references, footers)
├── metrics/         # General metrics, weekly summaries, trends
└── optimisation/    # Performance optimisation, token reduction
```

### Key Decisions Made

1. **Kept existing folders:** `analysis/`, `audits/`, `implementation/`, `migration/`, `validation/`
2. **Added missing folders** from `reporting.agent.md`: `agents/`, `coverage/`, `frontmatter/`, `issue-metrics/`, `labeling/`, `linting/`, `meta/`, `metrics/`, `optimisation/`
3. **Normalised to plural `audits/`** to align documentation and actual structure
4. **Provided clear purpose** for each folder to prevent future confusion

## Files That Need Updates

### Priority 1: Critical Instruction Files

1. **[.github/instructions/file-output-organization.instructions.md](.github/instructions/file-output-organization.instructions.md)** ✅ COMPLETED
   - Updated subdirectory structure to match unified structure
   - Normalised `audit/` to `audits/` (plural)
   - Added all missing folders

### Priority 2: Agent Specifications

1. **[.github/agents/reporting.agent.md](.github/agents/reporting.agent.md)** ✅ COMPLETED
   - Updated category table with all 14 folders
   - Included all folders with UK English spelling

### Priority 3: Supporting Documentation

1. **[.github/instructions/community-standards.instructions.md](.github/instructions/community-standards.instructions.md)**
   - Lines 141, 254: Update references to reports folder structure
   - Ensure consistency with unified structure

## Benefits of Unified Structure

1. **Single Source of Truth:** All documentation points to same structure
2. **Comprehensive Coverage:** Handles all current and future report types
3. **Clear Organization:** Each folder has distinct, documented purpose
4. **Prevents Drift:** Reduces confusion about where to store reports
5. **Scalable:** New report types can fit into existing categories

## Next Steps

1. ✅ **COMPLETED:** Updated [.githu./.github/reports/README.md](.githu./.github/reports/README.md) - Documented complete unified structure with UK English
2. ✅ **COMPLETED:** Updated [.github/instructions/file-output-organization.instructions.md](.github/instructions/file-output-organization.instructions.md) - Fixed all subdirectory references
3. ✅ **COMPLETED:** Updated [.github/agents/reporting.agent.md](.github/agents/reporting.agent.md) - Added all 14 categories
4. ✅ **COMPLETED:** Created all missing folders (agents/, coverage/, frontmatter/, issue-metrics/, labeling/, linting/, meta/, metrics/, optimisation/)
5. ✅ **COMPLETED:** Moved files from reports root to correct subdirectories (WORKFLOW_AUDIT_REPORT.md → audits/, weekly-summary-2025-12-08.md → metrics/, file-organization-migration-2025-12-09.md → migration/)
6. ⏳ **PENDING:** Update any remaining references in community-standards.instructions.md

## Implementation Notes

- All markdown formatting now complies with linting rules (MD022, MD032)
- Each subdirectory has clear purpose and examples
- Naming conventions documented with examples
- Guidelines section preserved with DO/DON'T recommendations

---

**Created by:** Claude Code
**Audit Type:** Structure & Documentation Consistency
**Files Analyzed:** 10+ instruction files, agent specs, and documentation
