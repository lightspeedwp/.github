---
title: "Changelog Workflow Bug Fix Report"
description: "Critical fix for changelog automation destroying section structure"
created_date: "2026-07-24"
status: "completed"
---

# Changelog Workflow Bug Fix

## Problem

The automated changelog workflow (`changelog-auto-update.yml`) was **destroying changelog section structure** every time it ran on a merged PR. Specifically:

1. When a PR to `develop` was merged with CHANGELOG.md changes, the workflow would extract those entries
2. During the merge/deduplication phase, **section headers** (`### Added`, `### Fixed`, etc.) were being **discarded**
3. This left the [Unreleased] section malformed, losing organizational structure
4. Subsequent merges would further corrupt the changelog

## Root Cause

The bug was in `scripts/workflows/changelog/merge-entries.cjs`, specifically in the `deduplicateEntries()` function:

```javascript
// OLD CODE - BROKEN
if (!entry.trim() || entry.match(/^###\s+/)) {
  continue;  // ❌ SKIPS SECTION HEADERS ENTIRELY
}
```

This code was **actively removing** all section headers (`### Added`, `### Fixed`, `### Changed`, etc.) from the deduplicated entries, treating them as non-content. When these entries were re-inserted into the changelog, the structural organization was lost.

### Example of Corruption

**Before merge:**

```markdown
## [Unreleased]

### Added
- Feature A
- Feature B

### Fixed
- Bug C
```

**After workflow with bug:**

```markdown
## [Unreleased]

- Feature A
- Feature B
- Bug C

### Fixed
(now orphaned, still exists but structure is broken)
```

## Solution

Three key fixes were implemented:

### 1. Preserve Section Headers

The `deduplicateEntries()` function now explicitly preserves section headers:

```javascript
// NEW CODE - CORRECT
if (trimmed.match(/^###\s+/)) {
  newEntries.push(entry);  // ✅ KEEP HEADERS
  continue;
}
```

### 2. Limit Deduplication Scope

The original code compared entries against **all** remaining content in the file (including other versions). This could cause false positives. The fix now deduplicates only against the actual `[Unreleased]` section:

```javascript
// Find the end of the [Unreleased] section (next ## heading)
let unreleasedEndIdx = insertIdx;
for (let i = insertIdx; i < mainLines.length; i++) {
  if (mainLines[i].match(/^##\s+\[/)) {
    unreleasedEndIdx = i;
    break;
  }
}

// Deduplicate ONLY against [Unreleased] section
const deduplicatedEntries = deduplicateEntries(
  entries,
  mainLines.slice(insertIdx, unreleasedEndIdx),  // ✅ SCOPED
);
```

### 3. Prevent Unnecessary Rewrites

The script now verifies that the content actually changed before writing:

```javascript
if (newContent === originalContent) {
  console.log('ℹ️  No changes to write, changelog is already up-to-date');
  process.exit(0);
}
```

This prevents edge cases where the file could be corrupted by a rewrite even when no real changes were made.

## Files Modified

- `scripts/workflows/changelog/merge-entries.cjs` — Applied all three fixes above

## Testing

A test file was created at `scripts/workflows/changelog/__tests__/merge-entries.test.cjs` to verify:

- ✅ Section headers are preserved during merge
- ✅ Existing entries are not lost
- ✅ Deduplication works correctly
- ✅ File is not rewritten unnecessarily

## Migration

**No migration needed.** This is a bug fix that restores correct behavior going forward. Future PRs that merge CHANGELOG.md changes will now preserve section structure correctly.

## Notes for Contributors

When submitting a PR with CHANGELOG.md modifications:

1. **Ensure the `[Unreleased]` section exists** in your branch
2. **Organize entries under section headers** (`### Added`, `### Fixed`, `### Changed`, etc.)
3. **Use the standard format**: `- **Title** — description ([PR #123](url))`
4. The workflow will deduplicate and merge your entries correctly

## Verification

To verify the fix is working:

1. Create a PR that modifies CHANGELOG.md with new entries under section headers
2. Merge the PR to develop
3. Check that `develop` CHANGELOG.md preserves:
   - Section header structure
   - All previously existing entries
   - New entries from the PR
   - Proper formatting and organization
