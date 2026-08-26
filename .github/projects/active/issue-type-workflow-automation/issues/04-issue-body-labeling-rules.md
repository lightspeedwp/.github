---
file_type: documentation
title: ""Fix 1.3: Implement Issue-Body Labeling Rules""
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# Fix 1.3: Implement Issue-Body Labeling Rules (40+ Patterns)

## Problem

No automation for issue template → type label mapping. 25 issue templates exist but have zero automated labeling. AI agents must manually apply labels.

## Solution

Add `issues:` section to `.github/labeler.yml` with 40+ body-pattern rules for:

- Type labels (32): bug, feature, task, epic, story, etc.
- Area labels (20+): block-editor, theme, ci, etc.
- Component labels (20): block-*, template-parts, etc.
- Priority inference: security→critical, bug→high, etc.
- Status & compliance labels

## Acceptance Criteria

1. ✅ Issue body detection rules for all 32 issue types
2. ✅ Area label detection (20+ keywords)
3. ✅ Component detection (20 labels)
4. ✅ Priority inference (security=critical, bug=high, etc.)
5. ✅ 10+ test issues created; correct labels applied
6. ✅ No false positives (ambiguous keyword detection tested)
7. ✅ Validation script passes
8. ✅ Labeling agent tests passing

## Implementation Steps

### Step 1: Open `.github/labeler.yml`

Find the end of the `pull_requests:` section and add `issues:` section

### Step 2: Add type detection rules

```yaml
issues:
  # Type labels (32 total)
  - body-contains:
      - regex: 'bug|defect|regression|error|crash'
      - weight: 10
    label: type:bug
  
  - body-contains:
      - regex: 'feature|enhancement|new capability'
      - weight: 10
    label: type:feature
  
  # ... repeat for epic, story, task, design, a11y, security, etc.
```

### Step 3: Add area detection

```yaml
  - body-contains:
      - regex: 'block-editor|gutenberg|blocks'
      - weight: 10
    label: area:block-editor
  
  - body-contains:
      - regex: 'theme\.json|theme|styles'
      - weight: 10
    label: area:theme
  # ... continue for all 20+ areas
```

### Step 4: Add priority inference

```yaml
  - labels-contain:
      - type:security
    add-label: priority:critical
  
  - labels-contain:
      - type:bug
    add-label: priority:high
```

### Step 5: Test with sample issues

Create 10-15 test issues in `.github` repo with various keywords. Verify labels applied correctly.

### Step 6: Commit

```bash
git add .github/labeler.yml
git commit -m "feat: add issue-body labeling rules for 32 types, 20+ areas, components, priority"
```

## Testing

- [ ] Validate YAML syntax
- [ ] Create 15 test issues with varied keywords
- [ ] Verify type labels applied (bug, feature, epic, task, design, etc.)
- [ ] Verify area labels applied (block-editor, theme, ci, etc.)
- [ ] Verify priority inference (security→critical, bug→high)
- [ ] Check for false positives (ambiguous words)
- [ ] All 15 tests pass with expected labels

## Definition of Done (DoD)

- [ ] All 40+ rules added to labeler.yml
- [ ] YAML valid
- [ ] 15+ test issues pass
- [ ] No false positives detected
- [ ] Labeling agent tests pass
- [ ] Code reviewed
- [ ] Merged to develop

## Estimated Time

- **Total:** 3-4 hours
- Rules design: 1h
- Implementation: 1.5h
- Testing: 1-1.5h

---

**Type:** Feature  
**Priority:** High  
**Effort:** 3.5 hours  
**Assigned To:** (TBD)  
**Status:** ⏳ Ready to Start  
**Phase:** 1  
**Target Date:** July 27-29, 2026
