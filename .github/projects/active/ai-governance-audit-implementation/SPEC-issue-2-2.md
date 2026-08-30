---
openspec_version: "1.0"
type: "issue"
issue_type: "task"
title: "build/automation: Create issue/PR title normalization script"
labels: ["type:build", "area:automation", "priority:high"]
milestone: "v1.1"
assignee: null
linked_issue: null
---

# Create Issue/PR Title Normalization Script

## Problem

Issues and PRs across the repository have inconsistent titles. Some have type prefixes (e.g., "Bug: Fix auth"), others don't (e.g., "Fix auth"). This makes it harder to:

1. Scan issues/PRs visually and understand type at a glance
2. Filter by type reliably
3. Maintain consistent documentation

**Solution:** Create an automated script that prefixes all issue/PR titles with their type (e.g., "Bug: ", "Feature: ", "Documentation: ").

## Solution

Create `scripts/automation/normalize-issue-pr-titles.js` with:

### Functionality

1. **Input handling:**
   - Single issue: `--issue <number>`
   - Single PR: `--pr <number>`
   - Batch mode (default): Scan all issues/PRs matching filters
   - Options:
     - `--state open|closed|all` (default: `open`)
     - `--since YYYY-MM-DD` (process only since date)
     - `--dry-run` (show changes, don't apply)
     - `--type issue|pr|all` (process only issues, PRs, or both; default: all)

2. **Type detection logic:**
   - **For issues:**
     - Check custom `type` field (if available)
     - Check `type:*` labels (parse label family)
     - Fallback: Type-Feature (generic)
   - **For PRs:**
     - Check linked issue type first (issue type field or label)
     - Check PR's `type:*` labels
     - Check PR description for type indicators
     - Fallback: Type from branch prefix (if valid)
     - Ultimate fallback: Type-Feature

3. **Title formatting:**
   - Format: `{TYPE}: {existing-title}`
   - Type values (from `.github/labels.yml` type family):
     - `bug` → "Bug:"
     - `feature` → "Feature:"
     - `documentation` → "Documentation:"
     - `chore` → "Chore:"
     - `ci` → "Build & CI:"
     - `refactor` → "Refactor:"
     - `security` → "Security:"
     - `test` → "Test:"
     - `task` → "Task:"
   - Handle edge cases:
     - Already prefixed titles: Don't double-prefix
     - Very short titles: Keep as-is
     - Special characters: Preserve them

4. **Idempotency:**
   - Script must be safe to run multiple times
   - Detect already-prefixed titles and skip
   - No data corruption on re-runs

5. **Output:**
   - Summary report: How many items would be/were renamed
   - Detailed log: Old title → New title for each item
   - Errors/warnings: Any items that couldn't be processed
   - JSON report option: `--format json` for machine parsing

### Implementation

- Use GitHub API (via `gh` CLI or octokit) to:
  - List issues/PRs matching filters
  - Get issue type field and labels
  - Get PR's linked issue
  - Update issue/PR title via API
- Make API calls batched to respect rate limits
- Add progress bar for user feedback
- Log all changes to file for audit trail

## Definition of Done

- [ ] Script file `scripts/automation/normalize-issue-pr-titles.js` created
- [ ] All input options implemented and documented
- [ ] Type detection logic covers all cases (issues, PRs, fallbacks)
- [ ] Title formatting handles edge cases (already prefixed, short titles)
- [ ] Script is idempotent (safe to run multiple times)
- [ ] Dry-run mode works correctly (shows changes without applying)
- [ ] Output report generated (summary + detailed log)
- [ ] README in `scripts/automation/` explains usage
- [ ] Script runs without errors on test data
- [ ] PR merged

## Test Scenarios (Issue 2.3)

- Issue with `type:bug` label, title "Fix authentication" → "Bug: Fix authentication"
- PR with linked issue having `type:feature`, title "User preferences" → "Feature: User preferences"
- PR with `type:docs` label, title "Update README" → "Documentation: Update README"
- Already-prefixed title "Bug: Fix auth" → No change (idempotent)
- PR with no type info, title "Random change" → "Feature: Random change" (fallback)

## Related Issues

- Issue 2.3 — Add comprehensive tests (dependency: tests require script)
- Issue 2.4 — Create GitHub Action workflow (will use this script)
- Issue 4.3 — Test on existing issues/PRs (will run this script in dry-run)
- Issue 5.2 — Run actual normalization (will run this script for real)

## Related Documentation

- `.github/labels.yml` — Label definitions and families
- `.github/PULL_REQUEST_TEMPLATE/config.yml` — PR type mappings
- `docs/BRANCHING_STRATEGY.md` — Branch naming (types used there too)

## Audit References

**Source:** Phase 1-2 Governance Audit Report, Audit Request  
**Need:** Consistent type prefixing for all issues/PRs  
**Impact:** Better discoverability, consistency, and automation compatibility
