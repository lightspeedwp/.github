---
file_type: project
title: "Changelog Automation Hardening — Comprehensive Audit & Improvement Initiative"
description: "Multi-phase plan to fix changelog automation bugs, rebuild lost history, define rules, and establish lasting solution"
created_date: "2026-07-24"
status: "active"
owner: "Changelog & Release Engineering"
epic: "#1271"
---

# Changelog Automation Hardening

## Executive Summary

The automated changelog workflow has critical bugs that are destroying section structure and losing historical information. This initiative provides a comprehensive 4-phase plan to:

1. **Fix the automation** (completed: #1275)
2. **Rebuild lost history** (entries from past 2 months)
3. **Define rules & guidelines** (what goes in, what doesn't)
4. **Establish guardrails** (validation, automation, contributor guidance)

---

## Current State Analysis

### Problems Identified

| Problem | Impact | Status |
|---------|--------|--------|
| Section headers discarded during merge | Changelog structure corrupted | ✅ Fixed (#1275) |
| Deduplication scope too broad | False positives, incorrect merges | ✅ Fixed (#1275) |
| Lost history from past 2 months | ~40 PRs missing from [Unreleased] | 🔄 In Progress |
| No entry validation rules | Verbose, inconsistent, non-relevant entries | 🔴 Not Started |
| No contributor guidelines | Contributors don't know what to include | 🔴 Not Started |
| No automation guardrails | Potential for future corruption | 🔴 Not Started |

### Scope: What Belongs in CHANGELOG.md

**INCLUDE:**

- ✅ New features (`### Added`)
- ✅ Bug fixes (`### Fixed`)
- ✅ Breaking changes (`### Changed`)
- ✅ Deprecations (`### Deprecated`)
- ✅ Security fixes (`### Security`)
- ✅ Performance improvements (`### Performance`)
- ✅ Removed functionality (`### Removed`)

**EXCLUDE:**

- ❌ Project planning documents
- ❌ Audit reports
- ❌ Internal refactoring (unless user-facing impact)
- ❌ CI/CD improvements (unless they fix broken features)
- ❌ Documentation-only changes
- ❌ Generated files
- ❌ Skill/agent scaffolding without substantive content

---

## Phase 1: Automation Fix & Validation (ACTIVE)

### Completed ✅

**Issue:** #1275 — [fix: Preserve changelog section headers during automated merge](https://github.com/lightspeedwp/.github/issues/1275)

**Changes:**

1. Modified `scripts/workflows/changelog/merge-entries.cjs` to preserve section headers
2. Limited deduplication scope to [Unreleased] section only
3. Added content verification before write
4. Created test suite (`merge-entries.test.cjs`)
5. Documented fix in `.github/reports/changelog-workflow-fix.md`

**Files Modified:**

- `scripts/workflows/changelog/merge-entries.cjs` (fixed)
- `scripts/workflows/changelog/merge-entries.test.cjs` (new)
- `.github/reports/changelog-workflow-fix.md` (new)

**Status:** ✅ Merged to branch `fix/changelog-section-headers-preserve`

### Remaining Work

- [ ] Test fix on next 3-5 PR merges with CHANGELOG modifications
- [ ] Verify no section header loss
- [ ] Add integration test to CI pipeline

---

## Phase 2: Rebuild Lost History (🔴 BLOCKED — INCOMPLETE)

### Objective

⚠️ **CRITICAL STATUS UPDATE:** Phase 2 is INCOMPLETE (GitHub Issue #1271)

Only 40 of 76 PRs were captured in previous attempt.
36 PRs (47% of scope) are missing from PHASE_2_REBUILD_HISTORY.md.
Requires full recovery of all 76 PR entries before continuing.
**Do NOT proceed with Phase 2 until all 76 PRs are recovered.**

Reconstruct [Unreleased] section entries from merged PRs (#1082–#1250) covering the past 2 months.

### Source Data

**76 Merged PRs** (May 24 — July 24, 2026)

Categorized by change type:

| Category | Count | Coverage |
|----------|-------|----------|
| Features | 14 | Agents, skills, infrastructure |
| Fixes | 16 | CI, validation, automation, lifecycle |
| Docs | 12 | Guides, audits, standards |
| Chores | 10 | Dependencies, housekeeping, infra |
| Breaking Changes | 7 | Dependency upgrades, workflow changes |
| Research/Audit | 3 | Audits, analysis, governance |

### Methodology

For each PR (#1082–#1250):

1. **Retrieve metadata**
   - PR number, title, merged date
   - Linked issues (from PR body)
   - Author

2. **Classify change type**
   - Match to changelog section (Added, Fixed, Changed, etc.)
   - If not changelog-worthy, skip

3. **Extract entry text**
   - Use PR title + description excerpt (max 150 chars)
   - Ensure clear, concise description
   - Format: `- **Title** — description ([PR #N](url), [#I](issue-url))`

4. **Validate & organize**
   - Group by section header
   - Verify links are valid
   - Check for duplicates

### Deliverable

Updated `CHANGELOG.md` [Unreleased] section with:

- ✅ All user-facing changes from past 2 months
- ✅ Proper section organization
- ✅ Links to all relevant PRs & issues
- ✅ Concise, non-verbose descriptions

**Related Issue:** #1272 (Phase 2: Description Condensing)

---

## Phase 3: Rules & Guidelines Definition (NOT STARTED)

### Objective

Create authoritative rules for what belongs in the changelog, how to format entries, and what to avoid.

### Deliverables

#### 1. CHANGELOG_GUIDELINES.md

**Location:** `docs/CHANGELOG_GUIDELINES.md`

**Contents:**

- What qualifies as a changelog entry
- When to include/exclude changes
- Format and style requirements
- Per-section guidance
- Examples of good/bad entries

**Example Structure:**

```markdown
# Changelog Guidelines

## What Gets Included

### Added (New Features)
- User-facing new features
- New commands, APIs, or capabilities
- Example: ✅ "New agent for site auditing"
- Non-example: ❌ "Added test file for new agent"

### Fixed (Bug Fixes)
- User-impacting bug fixes
- Broken workflows, incorrect behavior
- Example: ✅ "Fixed changelog header corruption in merge workflow"
- Non-example: ❌ "Fixed typo in test file"

... (etc for all sections)

## Entry Format

All entries must follow:
- Markdown list item: `- **Title** — description`
- Include PR/issue links: `([PR #1234](url), [#5678](issue-url))`
- Concise: 1-2 sentence max
- No internal jargon without explanation
```

#### 2. CHANGELOG_VALIDATION_RULES.cjs

**Location:** `scripts/validation/changelog-rules.cjs`

**Purpose:** Enforce rules programmatically

**Rules to Implement:**

- Entry format validation (regex matching)
- Link validation (PR/issue URLs must exist)
- Section header correctness (### format)
- No duplicate entries
- Date format in frontmatter (ISO 8601)
- Credit section present
- Max verbosity check (entries under 150 chars)

**Integration:** Add to `npm run validate:*` scripts

#### 3. CONTRIBUTOR_CHANGELOG_CHECKLIST.md

**Location:** `.github/CHANGELOG_CONTRIBUTOR_CHECKLIST.md`

**Purpose:** Checklist for PR authors adding to CHANGELOG.md

**Contents:**

```markdown
# Changelog Entry Checklist

When your PR includes changes worth documenting:

- [ ] Entry is user-facing (not internal refactor, docs-only, test-only)
- [ ] Entry fits one of the approved sections (Added, Fixed, Changed, etc.)
- [ ] Entry format: `- **Title** — description ([PR #123](url), [#456](issue-url))`
- [ ] Description is concise (1-2 sentences, <150 chars)
- [ ] Entry is under the correct section header (### Added, ### Fixed, etc.)
- [ ] All referenced PR/issue numbers are correct
- [ ] No duplicate entries already in [Unreleased]
- [ ] Entry doesn't include internal jargon without explanation
- [ ] Linked PRs/issues exist and are accurate
```

#### 4. Update PR Template

**Location:** `.github/PULL_REQUEST_TEMPLATE/`

**Change:** Add optional guidance section:

```markdown
## Changelog Entry (if applicable)

If this PR includes user-facing changes:
- [ ] I've added an entry to CHANGELOG.md [Unreleased] section
- [ ] Entry format: `- **Title** — description ([PR #123](url))`
- [ ] Entry is concise and accurate
```

**Related Issue:** #1273 (Phase 3: Validation & Merge)

---

## Phase 4: Automation & Guardrails (NOT STARTED)

### Objective

Add automated validation, safeguards, and contributor tooling to prevent future issues.

### Deliverables

#### 1. Changelog Validation Workflow

**Location:** `.github/workflows/changelog-validation.yml`

**Triggers:**

- Every PR that modifies `CHANGELOG.md`
- On merge to develop

**Checks:**

- ✅ Valid entry format (regex)
- ✅ Links valid (PR/issue URLs exist)
- ✅ Section headers correct
- ✅ No duplicates in [Unreleased]
- ✅ Frontmatter dates valid
- ✅ Credit section present
- ✅ Entries not too verbose

**Outputs:**

- Fail PR if validation errors
- Comment on PR with specific issues
- Suggest fixes

#### 2. Automated PR-to-Changelog Linking

**Purpose:** Ensure every changelog entry has a corresponding PR/issue

**Implementation:** On PR merge, auto-add to CHANGELOG if:

- PR has a specific label (e.g., `changelog:included`)
- PR title matches changelog-worthy patterns
- User explicitly added CHANGELOG.md entry

**Script:** `scripts/workflows/changelog/auto-link-pr.cjs` (new)

#### 3. Changelog Review Checklist for Maintainers

**Location:** `CHANGELOG_REVIEW_CHECKLIST.md`

**When:** Before merging a PR that touches CHANGELOG.md

**Checks:**

- [ ] All entries are user-facing
- [ ] All entries are concise
- [ ] All PR/issue links are valid
- [ ] Section organization makes sense
- [ ] No duplicates
- [ ] Proper formatting
- [ ] Linked PRs/issues actually exist

#### 4. Guardrails in merge-entries.cjs

**New Safeguards:**

- Prevent write if validation fails
- Backup CHANGELOG.md before modifications
- Verify restore-point on error
- Add rollback instruction on failure

---

## Related Issues & PRs

### Issues (Part of Epic #1271)

| Issue | Phase | Status | Description |
|-------|-------|--------|-------------|
| #1216 | 1 | ✅ CLOSED | Audit changelog consolidation needs |
| #1275 | 1 | 🔄 OPEN | Fix: Preserve section headers during merge |
| #1272 | 2 | 🔴 OPEN | Phase 2: Description Condensing |
| #1273 | 3 | 🔴 OPEN | Phase 3: Validation & Merge |
| (new) | 2 | 🔴 NEW | Rebuild lost history from 40+ PRs |
| (new) | 3 | 🔴 NEW | Define rules & guidelines |
| (new) | 4 | 🔴 NEW | Implement automation & guardrails |

### Supporting Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Bug Fix Report | `.github/reports/changelog-workflow-fix.md` | Details of #1275 fix |
| This Plan | `.github/projects/active/changelog-automation-hardening/PROJECT_PLAN.md` | Strategic overview |
| Implementation Guides | `.github/projects/active/changelog-automation-hardening/PHASE_*.md` | Per-phase instructions |

---

## Timeline & Milestones

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| Phase 1: Fix automation | ✅ 2026-07-24 | Claude | Complete |
| Phase 2: Rebuild history | 2026-07-26 | Claude + Team | Starting |
| Phase 3: Rules & validation | 2026-07-31 | Team | Queued |
| Phase 4: Automation setup | 2026-08-07 | Team | Queued |
| **Epic Completion** | **2026-08-14** | **Team** | **On Track** |

---

## Success Criteria

### Epic (when all phases complete)

- ✅ Changelog automation bug fixed & validated
- ✅ Lost history reconstructed (40+ PRs from past 2 months)
- ✅ Clear rules defined (what goes in, what doesn't)
- ✅ Contributor guidelines published
- ✅ Validation automated (CI checks every PR)
- ✅ All links verified (PRs & issues referenced)
- ✅ Credit section present in CHANGELOG.md
- ✅ Team trained on new process
- ✅ 0 changelog entries without corresponding PR/issue

### Quality Gates

- **0 broken links** in CHANGELOG.md
- **0 verbose entries** (all under 150 chars)
- **0 non-changelog entries** (no docs/project/report entries)
- **100% PR coverage** (every entry linked to PR/issue)
- **0 duplicates** in [Unreleased] section
- **0 automation failures** on next 10 PR merges

---

## References

- **Keep a Changelog Standard:** <https://keepachangelog.com/en/1.1.0/>
- **Semantic Versioning:** <https://semver.org/spec/v2.0.0.html>
- **GitHub Release Notes Best Practices:** <https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases>
- **CLAUDE.md Branching:** `./CLAUDE.md` (project instructions)

---

## Notes

- This initiative is critical for release management reliability
- Changelog corruption impacts downstream dependent projects
- Clear rules prevent contributor confusion and CI failures
- Automation ensures long-term sustainability of changelog process
