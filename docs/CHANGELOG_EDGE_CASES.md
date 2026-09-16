# Changelog Validation: Edge Cases & Special Handling

This document describes how the changelog validation system handles edge cases and special scenarios.

## PR/Issue References

### Private Pull Requests

When a PR reference points to a private repository or private PR:

**Behavior**: Validation treats as valid if PR exists but is inaccessible
- Status: ⚠️ WARNING (not FAIL)
- Message: "PR #1234 exists but is not accessible"
- Guidance: Ensure PR is public or provide alternative documentation

**Example**:
```yaml
pr_references: [9999]  # Private PR on another org
```

**Result**: Validation passes with warning - not user-facing anyway

### Deleted Pull Requests

When a PR reference points to a deleted PR:

**Behavior**: Validation fails - cannot verify change exists
- Status: ✗ FAIL
- Message: "PR #5555 not found - PR may have been deleted"
- Guidance: Update pr_references to point to active PR or remove if not applicable

**Example**:
```yaml
pr_references: [5555]  # This PR was deleted
```

**Result**: Entry FAILS validation

### Archived Repositories

When a PR reference points to a repository that's been archived:

**Behavior**: Validation allows - archived repos are intentional
- Status: ✓ PASS
- Message: "PR #2000 (archived repo)" 
- Note: No action needed, archive intentional

## Reverted Features

When a feature was added but later reverted:

**Option 1: Create new entry for revert**
```yaml
title: "Reverted feature X due to stability issues"
description: |
  Feature X has been temporarily reverted while we address
  reliability issues. Will return in next release.
category: fix
pr_references: [3000, 3100]  # Original PR and revert PR
```

**Option 2: Update original entry**
If entry hasn't been released yet, update original:
```yaml
title: "Removed unstable feature X"
description: |
  Feature X was removed before release due to stability concerns.
  Will be re-introduced when ready.
category: fix
```

## Breaking Changes

Breaking changes require special handling:

**Required**: Clear user migration path

**Good**:
```yaml
title: "Breaking: Webhook API v1 deprecated"
description: |
  Webhook API v1 is deprecated. Migrate to v2 which provides
  improved reliability and simplified authentication. See migration guide.
category: breaking-change
```

**Bad**:
```yaml
title: "Webhook API v1 removed"
description: "API v1 no longer works"  # No migration path!
```

## Date Handling

### Past Dates

If you accidentally use a past date:
- Validation accepts it (no future-only requirement)
- Recommendation: Use release date, not commit date
- Best practice: Date should match version release date

### Future Dates

Pre-release entries can have future dates:
```yaml
date: 2026-10-01  # Next release
```
- Validation passes
- Use for pre-release planning

## Category Handling

### Invalid Categories

Categories must be one of the defined set:
- `feature`: New functionality
- `fix`: Bug fix
- `improvement`: Enhancement to existing feature
- `breaking-change`: API/behavior change
- `security`: Security fix
- `performance`: Performance improvement

Invalid categories cause FAIL:
```yaml
category: bugfix  # WRONG - should be "fix"
category: Feature  # WRONG - should be lowercase "feature"
category: enhancement  # WRONG - should be "improvement"
```

## Multiple PR References

Entries can reference multiple PRs:

**Good**:
```yaml
pr_references: [1234, 5678, 9999]
description: |
  This fix involves changes across three related PRs.
  All PRs are required for complete functionality.
```

**Validation**: All referenced PRs must be valid

**Maximum**: Recommended limit is 5 PRs per entry

## Special Characters

### In Titles

Allowed: Letters, numbers, spaces, hyphens, parentheses, apostrophes
Avoid: Emoji, excessive punctuation, unicode symbols

```yaml
title: "Fixed user's preferences panel (v2.1)"  # OK
title: "Fixed webhook-related issue"  # OK
title: "🎉 Added awesome new feature!!"  # NOT OK - emoji, excessive punctuation
```

### In Descriptions

Same rules as titles, plus colons and dashes for formatting

```yaml
description: |
  Users can now:
  - Save preferences locally
  - Sync across devices
  - Export settings as JSON
```

## Encoding & Languages

All entries must be UTF-8 encoded.

### Non-English Entries

Not recommended - changelog should be English for broad audience
If you must use another language, validate all rules still apply:
- Clear user benefit
- No implementation details
- Consistent tense

## Very Long Descriptions

Descriptions >500 characters trigger a warning:

```yaml
description: |
  This entry is very long and describes many
  different changes across multiple systems...
```

**Solution**: Split into multiple entries, one per logical change

## Empty Fields

- Missing required fields: FAIL
- Empty strings in required fields: FAIL
- Missing optional fields: PASS (skipped)

```yaml
title: ""  # FAIL - empty required field
description: |
  
  # FAIL - only whitespace
category: ""  # FAIL - empty required field
pr_references: []  # OK - optional, empty array allowed
```

---

## Support

For questions about edge cases, see [CHANGELOG_QUALITY_AUDIT.md](./CHANGELOG_QUALITY_AUDIT.md) or run validation with `--json` flag for detailed diagnostics.
