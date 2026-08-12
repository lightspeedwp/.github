---
file_type: documentation
name: Phase 1 — JS Linting Fixes
description: Execution plan for fixing 3 unused variable warnings in JS linting
status: active
---

# Phase 1: Quick Wins — JS Linting Fixes

**Duration:** ~10 minutes  
**Status:** In Progress  
**Created:** 2026-08-10T18:26 CEST

---

## Overview

Fix 3 unused variable warnings in JS linting by renaming variables with `_` prefix to signal intentional unused parameters.

---

## Issues to Fix

### 1. handle-needs-priority.js:23 — `currentPriority`

**File:** `scripts/agents/includes/handle-needs-priority.js`  
**Line:** 23  
**Issue:** `'currentPriority' is assigned a value but never used`  
**Fix:** Rename to `_currentPriority`

**Context:**

```javascript
// Before:
const currentPriority = issue.labels
  .filter(l => l.startsWith('priority:'))
  .map(l => l.replace('priority:', ''))[0];

// After:
const _currentPriority = issue.labels
  .filter(l => l.startsWith('priority:'))
  .map(l => l.replace('priority:', ''))[0];
```

**Reason:** Variable is assigned but not used in the rest of the function. The `_` prefix signals intentional non-use.

---

### 2. handle-needs-triage.js:119 — `relationships`

**File:** `scripts/agents/includes/handle-needs-triage.js`  
**Line:** 119  
**Issue:** `'relationships' is assigned a value but never used`  
**Fix:** Rename to `_relationships`

**Context:**

```javascript
// Before:
const relationships = {
  parent: this.issue.body?.match(/parent:?\s*#(\d+)/i)?.[1],
  related: this.issue.body?.match(/related:?\s*#(\d+)/i)?.[1],
};

// After:
const _relationships = {
  parent: this.issue.body?.match(/parent:?\s*#(\d+)/i)?.[1],
  related: this.issue.body?.match(/related:?\s*#(\d+)/i)?.[1],
};
```

**Reason:** Relationships object is extracted but not used downstream.

---

### 3. handlers-orchestrator.js:189 — `config`

**File:** `scripts/automation/handlers-orchestrator.js`  
**Line:** 189  
**Issue:** `'config' is defined but never used` (unused parameter)  
**Fix:** Rename parameter to `_config`

**Context:**

```javascript
// Before:
async function handleIssue(issue, config) {
  // config is never referenced in function
}

// After:
async function handleIssue(issue, _config) {
  // Signals intentional non-use
}
```

**Reason:** Function parameter exists in signature but is not used in the function body.

---

## Execution Steps

1. ✅ Open each file and rename the variable
2. ✅ Run `npm run lint:js` to verify all warnings are gone
3. ✅ Commit changes
4. ✅ Document completion

---

## Verification

**Before Phase 1:**

```
✖ 3 problems (0 errors, 3 warnings)
```

**After Phase 1:**

```
✖ 0 problems
```

---

## Commits

| File | Change | Commit |
| --- | --- | --- |
| handle-needs-priority.js | Rename `currentPriority` → `_currentPriority` | TBD |
| handle-needs-triage.js | Rename `relationships` → `_relationships` | TBD |
| handlers-orchestrator.js | Rename `config` → `_config` | TBD |

---

## Status

- ⏳ **Not Started:** Files identified
- 🔄 **In Progress:** Fixes being applied
- ⏹️ **Blocked:** None
- ✅ **Complete:** When linting passes with 0 problems

---

**Updated:** 2026-08-10
