# Fix 1.2: Add Missing Type Label Aliases

## Problem

8 type labels lack aliases, causing inconsistent behavior:

- `type:bug` has alias `bug` ✅ (bare `bug` labels are preserved)
- `type:feature` has NO alias ❌ (bare `feature` labels are removed as non-canonical)
- `type:task`, `type:chore`, `type:refactor`, `type:ci`, `type:build`, `type:epic` all missing aliases

**Result:** Confusing asymmetry — some bare labels preserved, others deleted.

## Solution

Add aliases for all 8 type labels so bare labels are migrated to canonical form.

---

## Acceptance Criteria

1. ✅ `type:feature` has aliases: feature, feat, enhancement, feature-request
2. ✅ `type:task` has aliases: task, todo
3. ✅ `type:chore` has aliases: chore, housekeeping
4. ✅ `type:refactor` has aliases: refactor, cleanup, refactoring
5. ✅ `type:ci` has aliases: ci, ci/cd
6. ✅ `type:build` has aliases: build, build-system
7. ✅ `type:epic` has aliases: epic
8. ✅ `type:improve` has aliases: improve, improvement
9. ✅ Label validation passes
10. ✅ Alias migration logic tested

---

## Implementation Steps

### Step 1: Open the file

```bash
nano .github/labels.yml
```

### Step 2: Find each type label and add aliases

Find each label below and add the `aliases:` array:

#### type:feature (around line 450)

```yaml
- name: type:feature
  color: 1A7F37
  description: New capability or user-visible enhancement
+ aliases:
+   - feature
+   - feat
+   - enhancement
+   - feature-request
```

#### type:task (around line 480)

```yaml
- name: type:task
  color: 6E7781
  description: Scoped work item
+ aliases:
+   - task
+   - todo
```

#### type:chore (around line 510)

```yaml
- name: type:chore
  color: D29922
  description: Maintenance and housekeeping
+ aliases:
+   - chore
+   - housekeeping
```

#### type:refactor (around line 540)

```yaml
- name: type:refactor
  color: A371F7
  description: Code restructure without behavior change
+ aliases:
+   - refactor
+   - cleanup
+   - refactoring
```

#### type:ci (around line 570)

```yaml
- name: type:ci
  color: 0969DA
  description: CI/CD workflow changes
+ aliases:
+   - ci
+   - ci/cd
```

#### type:build (around line 600)

```yaml
- name: type:build
  color: 0969DA
  description: Build system changes
+ aliases:
+   - build
+   - build-system
```

#### type:epic (around line 630)

```yaml
- name: type:epic
  color: A371F7
  description: Large initiative grouping multiple stories
+ aliases:
+   - epic
```

#### type:improve (around line 660)

```yaml
- name: type:improve
  color: 3FB950
  description: Enhancement to existing functionality
+ aliases:
+   - improve
+   - improvement
```

### Step 3: Validate YAML syntax

```bash
npm run validate:labeling-config
```

Expected: No syntax errors

### Step 4: Test alias migration

Create a test issue with bare `feature` label:

```bash
# Manually create issue with bare "feature" label in .github repo
# Expected: Label migrated to "type:feature"
```

### Step 5: Commit

```bash
git add .github/labels.yml
git commit -m "fix: add missing aliases for type labels (feature, task, chore, refactor, ci, build, epic, improve)"
```

---

## Testing

### Unit Test

```bash
npm run validate:labeling-config
# Should pass
```

### Integration Test

1. Create test issue with bare `feature` label
2. Verify label migrated to `type:feature`
3. Repeat for `task`, `chore`, `refactor`, `ci`, `build`, `epic`, `improve`

### Validation Checklist

- [ ] All 8 labels have aliases array
- [ ] Aliases are comma-separated strings
- [ ] YAML syntax valid
- [ ] Validation script passes
- [ ] Test issues created and labels migrated correctly

---

## Definition of Ready (DoR)

- [x] Problem identified (8 labels lacking aliases)
- [x] Solution designed (add aliases for each)
- [x] No blockers (isolated config change)
- [x] Impact understood (affects label migration only)

---

## Definition of Done (DoD)

- [ ] All 8 type labels have aliases added
- [ ] YAML syntax valid
- [ ] Validation script passes
- [ ] Test issues created; labels migrated
- [ ] Commit created with descriptive message
- [ ] Code reviewed (tech lead)
- [ ] Merged to develop

---

## Estimated Time

- **Total:** 30 minutes
- Find/edit labels: 15 min
- Validation: 5 min
- Testing: 5 min
- Commit: 5 min

---

## Files Modified

- `.github/labels.yml` (add 8 `aliases:` arrays)

---

## Notes

- Aliases are case-sensitive (use lowercase)
- Order matters for matching (list most common first)
- Existing alias for `type:bug` (`bug`) serves as reference
- No workflow changes required; labeling agent handles migration

---

**Type:** Task  
**Priority:** High  
**Effort:** 1 hour  
**Assigned To:** (TBD)  
**Status:** ⏳ Ready to Start  
**Phase:** 1 (Critical Fixes)  
**Target Date:** July 24-25, 2026
