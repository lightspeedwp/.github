# Fix 1.1: Remove Non-existent Label Reference from Governance

## Problem

The label `comp:help-tabs` is listed in `.github/label-governance-policy.yml` as a never-delete label, but it **does not exist** in `.github/labels.yml`.

**File:** `.github/label-governance-policy.yml` (line 61)  
**Issue:** Stale reference causing governance validation warnings

## Solution

Remove `comp:help-tabs` from the `never_delete_labels` list.

---

## Acceptance Criteria

1. ✅ `comp:help-tabs` removed from `.github/label-governance-policy.yml`
2. ✅ Label validation script passes (`npm run validate:labeling-config`)
3. ✅ No regressions in labeling workflows
4. ✅ Changes committed and ready for merge

---

## Implementation Steps

### Step 1: Open the file

```bash
nano .github/label-governance-policy.yml
```

### Step 2: Find and remove the line

Look for line 61 containing:

```yaml
- comp:help-tabs
```

Delete this line.

### Step 3: Validate

```bash
npm run validate:labeling-config
```

Expected output: No errors related to comp:help-tabs

### Step 4: Commit

```bash
git add .github/label-governance-policy.yml
git commit -m "fix: remove non-existent comp:help-tabs from label governance"
```

---

## Testing

### Manual Test

```bash
npm run validate:labeling-config
# Should pass without errors
```

### Verification

- [ ] File opens without syntax errors
- [ ] Line removed successfully
- [ ] Validation script passes
- [ ] Git commit created

---

## Definition of Ready (DoR)

- [x] Problem identified and verified
- [x] Solution is trivial (1-line removal)
- [x] No dependencies blocking this work
- [x] Impact isolated (governance config only)

---

## Definition of Done (DoD)

- [ ] File edited (line 61 removed)
- [ ] Validation script passes
- [ ] Commit created with descriptive message
- [ ] Code reviewed (tech lead)
- [ ] Merged to develop

---

## Estimated Time

- **Total:** 5 minutes
- Implementation: 2 min
- Validation: 2 min
- Commit: 1 min

---

## Notes

- This is the quickest fix in Phase 1
- Unblocks label governance decisions later
- No workflow changes needed
- No risk of breaking existing functionality

---

**Type:** Task  
**Priority:** High  
**Effort:** 0.5 hours  
**Assigned To:** (TBD)  
**Status:** ⏳ Ready to Start  
**Phase:** 1 (Critical Fixes)  
**Target Date:** July 24, 2026
